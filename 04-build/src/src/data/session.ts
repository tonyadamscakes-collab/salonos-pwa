import { managerSwitches, seesAllDiary, type Actor } from "../domain/access";
import { assertCan } from "../domain/access";
import {
  assessPatchTest,
  canMoveBooking,
  canMoveOrder,
  completionAllowed,
  postcodeAllowed,
  promoApplies,
  quoteBooking,
  syncBookings,
  waiverReady,
  type ChoiceLine,
  type Promo,
} from "../domain/booking";
import { depositPosting, salePosting, stubPayload, type FinancePosting } from "../domain/finance";
import {
  assertTendersMatch,
  commissionOn,
  expectedCash,
  cashVariance,
  noShowCharge,
  pointsForPayment,
  renterSplit,
  type Pence,
  type TenderPart,
} from "../domain/money";
import { clashReason, slotsOnShift, timeline, type Segment } from "../domain/slots";
import { available, canTake, formulaDeductions, onHand, reserved } from "../domain/stock";
import { addLondonDays, londonDayKey, londonParts, londonWallToUtc, parseDayKey, weekdayOfDayKey } from "../domain/time";
import { aesDecrypt, aesEncrypt, derivePinKey, openSealed, randomId, seal, sha256, safeEqual } from "./crypto";
import { kvGet, kvSet, deviceId, channel } from "./db";
import type {
  BookingRecord,
  ClientRecord,
  LedgerRecord,
  OccupancyPublic,
  OrderRecord,
  PrivateState,
  PublicState,
  ServiceRecord,
  Settings,
} from "./model";
import { SITE_ID } from "./model";
import { buildSeed, projectSettings, SAMPLE_DEVICE_PIN } from "./seed";

export interface GuestIntent {
  kind: "booking";
  bookingId: string;
  client: { name: string; mobile: string; email: string; dob: string | null };
  serviceId: string;
  staffId: string;
  startMs: number;
  addonIds: string[];
  rangePence: number | null;
  brandedIds: string[];
  nailTierId: string | null;
  retail: { productId: string; qty: number; collect: boolean; chosenPence: number | null }[];
  promoCode: string | null;
  paymentChoice: "deposit" | "full" | "in-salon";
  cardOnFileAgreed: boolean;
  termsAccepted: boolean;
  homeAccepted: boolean;
  address: string;
  postcode: string;
  location: "salon" | "home" | "event";
  manufacturerChecked: boolean;
  manufacturerNote: string;
  simulatedPayment: boolean;
}

export interface ShopIntent {
  kind: "order";
  client: GuestIntent["client"];
  lines: { productId: string; name: string; qty: number; pence: number }[];
  fulfilment: "delivery" | "collect";
  address: string;
  termsAccepted: boolean;
}

type Listener = () => void;

export class SalonSession {
  publicData: PublicState | null = null;
  privateData: PrivateState | null = null;
  actor: Actor | null = null;
  userName = "";
  deviceKey: CryptoKey | null = null;
  offline = false;
  pending: GuestIntent[] = [];
  error = "";
  private listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }

  async init(): Promise<void> {
    let pub = await kvGet<PublicState>("public");
    if (!pub) {
      const seed = await buildSeed(deviceId());
      const key = await this.keyFrom(SAMPLE_DEVICE_PIN, seed.salt);
      const sealed = await aesEncrypt(key, seed.privateState);
      await kvSet("private", sealed);
      pub = seed.publicState;
      await kvSet("public", pub);
    }
    this.publicData = pub;
    this.emit();
    const bus = channel();
    bus.onmessage = () => {
      void this.reloadPublic();
    };
  }

  private async keyFrom(pin: string, salt: Uint8Array): Promise<CryptoKey> {
    return derivePinKey(pin, salt);
  }

  private saltBytes(): Uint8Array {
    if (!this.publicData) throw new Error("Not ready");
    const binary = atob(this.publicData.salt);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
    return out;
  }

  async unlock(pin: string): Promise<boolean> {
    const sealed = await kvGet<{ iv: string; ciphertext: string }>("private");
    if (!sealed || !this.publicData) return false;
    try {
      const key = await this.keyFrom(pin, this.saltBytes());
      this.privateData = await aesDecrypt<PrivateState>(key, sealed.iv, sealed.ciphertext);
      this.deviceKey = key;
      await this.mergeInbox();
      this.emit();
      return true;
    } catch {
      this.privateData = null;
      this.deviceKey = null;
      return false;
    }
  }

  lock(): void {
    this.privateData = null;
    this.deviceKey = null;
    this.actor = null;
    this.userName = "";
    this.emit();
  }

  async login(username: string, pin: string, secondFactor: string): Promise<string | null> {
    if (!this.privateData) return "Unlock the device first.";
    const user = this.privateData.users.find((row) => row.username === username && row.active);
    if (!user) return "Unknown staff login. Shared logins are not used.";
    const pinOk = safeEqual(user.pinHash, await sha256(`pin:${pin}`));
    if (!pinOk) return "PIN not recognised.";
    if (user.role === "owner" || user.role === "manager") {
      if (!user.secondFactorHash) return "Owner and manager need a second factor.";
      const factorOk = safeEqual(user.secondFactorHash, await sha256(`2fa:${secondFactor}`));
      if (!factorOk) return "Second factor not recognised.";
    }
    this.actor = {
      id: user.id,
      role: user.role,
      staffId: user.staffId,
      managerCan: managerSwitches(),
      juniorCanSeeSpend: user.juniorCanSeeSpend,
      operatorGrantUntil: this.privateData.settings.operatorGrantUntil,
    };
    this.userName = user.name;
    this.audit("login", user.id, user.role);
    await this.persist();
    return null;
  }

  logout(): void {
    this.actor = null;
    this.userName = "";
    this.emit();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private audit(action: string, target: string, detail: string): void {
    if (!this.privateData || !this.actor) return;
    this.privateData.audit.push({
      id: randomId(),
      siteId: SITE_ID,
      at: this.now(),
      actorId: this.actor.id,
      action,
      target,
      detail,
    });
  }

  private async persist(): Promise<void> {
    if (!this.privateData || !this.deviceKey || !this.publicData) return;
    this.project();
    const sealed = await aesEncrypt(this.deviceKey, this.privateData);
    await kvSet("private", sealed);
    await kvSet("public", this.publicData);
    channel().postMessage({ type: "changed" });
    this.emit();
  }

  private project(): void {
    if (!this.privateData || !this.publicData) return;
    const data = this.privateData;
    this.publicData = {
      ...this.publicData,
      settings: projectSettings(data.settings),
      services: data.services,
      products: data.products,
      staff: data.staff.map((person) => ({
        id: person.id,
        name: person.name,
        bio: person.bio,
        tier: person.tier,
        colour: person.colour,
        active: person.active,
        serviceIds: person.serviceIds,
        categories: person.categories,
        hours: person.hours,
      })),
      offers: data.offers,
      nailTiers: data.nailTiers,
      branded: data.branded,
      occupancy: this.occupancyFrom(data),
    };
  }

  private occupancyFrom(data: PrivateState): OccupancyPublic[] {
    const rows: OccupancyPublic[] = [];
    for (const booking of data.bookings) {
      if (booking.status === "cancelled" || booking.status === "no-show") continue;
      const parts = timeline(booking.startMs, booking.segments);
      for (const part of parts) {
        if (part.kind !== "active") continue;
        rows.push({ id: `${booking.id}-${part.startMs}`, staffId: booking.staffId, startMs: part.startMs, endMs: part.endMs, kind: "active" });
      }
    }
    for (const block of data.blocks) {
      rows.push({ id: block.id, staffId: block.staffId, startMs: block.startMs, endMs: block.endMs, kind: "block" });
    }
    const liveIds = new Set(data.bookings.map((booking) => booking.id));
    const holds = (this.publicData?.occupancy ?? []).filter((row) => row.kind === "hold" && !liveIds.has(row.id));
    const now = Date.now();
    const holdMs = (data.settings.holdMinutes ?? 10) * 60_000;
    for (const hold of holds) {
      if (now - hold.startMs < holdMs + 8 * 60 * 60_000) rows.push(hold);
    }
    return rows;
  }

  private async reloadPublic(): Promise<void> {
    this.publicData = await kvGet<PublicState>("public");
    if (this.deviceKey && this.privateData) await this.mergeInbox();
    this.emit();
  }

  async mergeInbox(): Promise<void> {
    if (!this.publicData || !this.privateData) return;
    const inbox = [...this.publicData.inbox];
    if (inbox.length === 0) return;
    for (const packet of inbox) {
      try {
        const intent = await openSealed<GuestIntent | ShopIntent>(this.privateData.privateKeyJwk, packet);
        if (intent.kind === "order") this.applyOrder(intent);
        else this.applyIntent(intent);
      } catch (error) {
        this.privateData.attention.push({
          id: randomId(),
          siteId: SITE_ID,
          at: this.now(),
          kind: "inbox",
          detail: error instanceof Error ? error.message : "Could not open a queued booking",
          phone: "",
          resolved: false,
        });
      }
    }
    this.publicData.inbox = [];
    await this.persist();
  }

  private applyIntent(intent: GuestIntent): void {
    if (!this.privateData) return;
    const built = this.buildBooking(intent, "online");
    if ("error" in built) {
      this.privateData.attention.push({
        id: randomId(),
        siteId: SITE_ID,
        at: this.now(),
        kind: "booking",
        detail: built.error,
        phone: intent.client.mobile,
        resolved: false,
      });
      return;
    }
    const existingClient = this.privateData.clients.find(
      (client) => client.email.toLowerCase() === intent.client.email.toLowerCase() || client.mobile === intent.client.mobile,
    );
    const client = existingClient ?? {
      id: randomId(),
      siteId: SITE_ID,
      name: intent.client.name,
      mobile: intent.client.mobile,
      email: intent.client.email,
      notes: "",
      dob: intent.client.dob,
      preferredByCategory: { [built.service.category]: intent.staffId },
      marketing: { email: false, sms: false, push: false },
      marketingMeta: [],
      photoConsent: false,
      healthConsent: false,
      member: false,
      topics: { promotions: false, treatments: false, products: false, deals: false },
      sample: true,
      erased: false,
    };
    if (!existingClient) this.privateData.clients.push(client);
    built.booking.clientId = client.id;
    const clash = this.staffClash(intent.staffId, built.booking.startMs, built.booking.segments, built.booking.id);
    if (clash) {
      this.privateData.attention.push({
        id: randomId(),
        siteId: SITE_ID,
        at: this.now(),
        kind: "double-book",
        detail: clash,
        phone: client.mobile,
        resolved: false,
      });
      return;
    }
    this.privateData.bookings.push(built.booking);
    this.privateData.consents.push({
      id: randomId(),
      siteId: SITE_ID,
      clientId: client.id,
      at: this.now(),
      version: "LEG-01",
      kind: "terms",
      staffId: null,
      signature: "",
      parentName: "",
      text: "Accepted booking terms before confirm.",
    });
    if (intent.cardOnFileAgreed) {
      this.privateData.consents.push({
        id: randomId(),
        siteId: SITE_ID,
        clientId: client.id,
        at: this.now(),
        version: "LEG-01-card",
        kind: "card-on-file",
        staffId: null,
        signature: "",
        parentName: "",
        text: "Separate card-on-file agreement. TEST MODE. No card number stored.",
      });
    }
    if (intent.homeAccepted) {
      this.privateData.consents.push({
        id: randomId(),
        siteId: SITE_ID,
        clientId: client.id,
        at: this.now(),
        version: "LEG-22",
        kind: "home",
        staffId: null,
        signature: "",
        parentName: "",
        text: "Home or event agreement accepted. The salon is the contracting party.",
      });
    }
    const pay =
      intent.simulatedPayment && intent.paymentChoice !== "in-salon"
        ? intent.paymentChoice === "full"
          ? built.booking.totalPence
          : built.booking.depositDuePence
        : 0;
    if (pay > 0) this.recordPayment(built.booking, client.id, pay, "simulated", "TEST MODE simulated payment. No real card charged.");
    else built.booking.depositStatus = built.booking.depositDuePence === 0 ? "not-required" : "unpaid";
    this.holdMessage(client.email, "Booking confirmation", this.confirmationBody(built.booking, client.name));
  }

  confirmationBody(booking: BookingRecord, name: string): string {
    const lines = booking.lines.map((line) => `${line.name} ${line.pence ? `£${(line.pence / 100).toFixed(2)}` : "[PRICE]"}`).join("\n");
    return [
      `Hello ${name}`,
      "DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use",
      `When: booking ${booking.id}`,
      lines,
      `Total £${(booking.totalPence / 100).toFixed(2)}`,
      `Deposit due £${(booking.depositDuePence / 100).toFixed(2)} (${booking.depositStatus})`,
      `Balance due £${(this.balanceDue(booking) / 100).toFixed(2)}`,
      "TEST MODE – no real payments. This message was not sent.",
      "[OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL]",
    ].join("\n");
  }

  private applyOrder(intent: ShopIntent): void {
    if (!this.privateData) return;
    if (!intent.termsAccepted) return;
    const client = this.privateData.clients.find((row) => row.email.toLowerCase() === intent.client.email.toLowerCase()) ?? {
      id: randomId(),
      siteId: SITE_ID,
      name: intent.client.name,
      mobile: intent.client.mobile,
      email: intent.client.email,
      notes: "",
      dob: intent.client.dob,
      preferredByCategory: {},
      marketing: { email: false, sms: false, push: false },
      marketingMeta: [],
      photoConsent: false,
      healthConsent: false,
      member: false,
      topics: { promotions: false, treatments: false, products: false, deals: false },
      sample: true as const,
      erased: false,
    };
    if (!this.privateData.clients.includes(client)) this.privateData.clients.push(client);
    const goods = intent.lines.reduce((sum, line) => sum + line.pence * line.qty, 0);
    const delivery = intent.fulfilment === "delivery" ? this.privateData.settings.shippingRatePence : 0;
    const order: OrderRecord = {
      id: randomId(),
      siteId: SITE_ID,
      clientId: client.id,
      bookingId: null,
      status: "paid",
      fulfilment: intent.fulfilment,
      lines: intent.lines,
      deliveryPence: delivery,
      address: intent.address,
      courier: "",
      tracking: "",
      placedAt: this.now(),
      deliveredAt: null,
      promoId: null,
      discountPence: 0,
      totalPence: goods + (delivery ?? 0),
      returnNote: "",
      faultNote: "",
    };
    if (intent.fulfilment === "delivery" && delivery == null) {
      this.privateData.attention.push({
        id: randomId(),
        siteId: SITE_ID,
        at: this.now(),
        kind: "shipping",
        detail: "Delivery was asked for but [SHIPPING RATE – Tony to set] is empty. The order is held.",
        phone: client.mobile,
        resolved: false,
      });
      order.status = "placed";
      order.totalPence = goods;
      order.deliveryPence = null;
    }
    for (const line of intent.lines) {
      const stock = this.stockOf(line.productId, "retail");
      if (!canTake(stock.onHand, stock.reserved, 0, line.qty).ok) {
        this.privateData.attention.push({
          id: randomId(),
          siteId: SITE_ID,
          at: this.now(),
          kind: "stock",
          detail: `${line.name} is no longer in stock.`,
          phone: client.mobile,
          resolved: false,
        });
        return;
      }
    }
    for (const line of intent.lines) {
      this.privateData.stock.push({
        id: randomId(),
        siteId: SITE_ID,
        productId: line.productId,
        location: "retail",
        qty: -line.qty,
        unit: "each",
        reason: "online-sale",
        ref: order.id,
        at: this.now(),
        note: "",
      });
    }
    this.privateData.orders.push(order);
    this.privateData.ledger.push({
      ...this.ledger(null, client.id, "tender", "simulated", order.totalPence, "TEST MODE online shop. No real card charged."),
      orderId: order.id,
    });
    this.privateData.finance.push(
      salePosting({
        id: randomId(),
        siteId: SITE_ID,
        sourceId: order.id,
        source: "order",
        channel: "online",
        at: this.now(),
        servicePence: 0,
        retailPence: goods,
        discountPence: 0,
        vatPence: 0,
        tipPence: 0,
        deliveryPence: order.deliveryPence ?? 0,
        depositAppliedPence: 0,
        promoId: null,
      }),
    );
    this.holdMessage(client.email, "Order confirmation", `Order ${order.id}. TEST MODE. Not sent.\n[OPERATOR LEGAL NAME] [OPERATOR ADDRESS]`);
  }

  async submitShop(intent: ShopIntent): Promise<{ ok: boolean; message: string }> {
    if (!this.publicData) return { ok: false, message: "Still loading." };
    if (!intent.termsAccepted) return { ok: false, message: "Accept the shop terms before paying." };
    if (intent.fulfilment === "delivery" && this.publicData.settings.shippingRatePence == null) {
      return { ok: false, message: "Delivery rate is [SHIPPING RATE – Tony to set]. Choose click and collect, which is free, or ask the salon to set a rate." };
    }
    for (const line of intent.lines) {
      const product = this.publicData.products.find((row) => row.id === line.productId);
      if (!product || product.channel === "shop") return { ok: false, message: "That product is in-shop only." };
      if (product.notForPost && intent.fulfilment === "delivery") return { ok: false, message: "That product is click and collect or shop only." };
    }
    const packet = await seal(this.publicData.publicKeyJwk, intent);
    this.publicData.inbox.push({ id: randomId(), at: this.now(), ...packet });
    await kvSet("public", this.publicData);
    if (this.deviceKey && this.privateData) await this.mergeInbox();
    this.emit();
    return { ok: true, message: "TEST MODE – shop payment simulated. No real card was charged." };
  }

  private holdMessage(to: string, subject: string, body: string): void {
    if (!this.privateData) return;
    this.privateData.messages.push({
      id: randomId(),
      siteId: SITE_ID,
      at: this.now(),
      channel: "email",
      to,
      subject,
      body,
      kind: "service",
      status: "held-preview",
      costNote: "Not sent. [EMAIL PROVIDER]",
    });
  }

  balanceDue(booking: BookingRecord): number {
    if (!this.privateData) return booking.totalPence;
    const paid = this.privateData.ledger
      .filter((row) => row.bookingId === booking.id && (row.kind === "deposit" || row.kind === "tender" || row.kind === "voucher-redeem"))
      .reduce((sum, row) => sum + row.amountPence, 0);
    const refunded = this.privateData.ledger
      .filter((row) => row.bookingId === booking.id && row.kind === "refund")
      .reduce((sum, row) => sum + row.amountPence, 0);
    return Math.max(0, booking.totalPence - paid + refunded);
  }

  private recordPayment(booking: BookingRecord, clientId: string, amount: number, method: LedgerRecord["method"], memo: string): void {
    if (!this.privateData) return;
    const key = `${method}:${booking.id}:${amount}:${this.privateData.ledger.length}`;
    if (this.privateData.seenIdempotency.includes(key)) return;
    this.privateData.seenIdempotency.push(key);
    const depositPart = Math.min(amount, Math.max(0, booking.depositDuePence - this.paidDeposit(booking)));
    if (depositPart > 0 && this.paidDeposit(booking) < booking.depositDuePence) {
      this.privateData.ledger.push(this.ledger(booking.id, clientId, "deposit", method, depositPart, memo));
      booking.depositStatus = "paid";
    }
    const rest = amount - depositPart;
    if (rest > 0) this.privateData.ledger.push(this.ledger(booking.id, clientId, "tender", method, rest, memo));
    if (this.balanceDue(booking) === 0) this.earnPoints(booking, clientId);
    const posting = depositPart > 0 && rest === 0
      ? depositPosting({ id: randomId(), siteId: SITE_ID, bookingId: booking.id, amountPence: depositPart, at: this.now(), channel: booking.source === "online" ? "online" : "shop" })
      : salePosting({
          id: randomId(),
          siteId: SITE_ID,
          sourceId: booking.id,
          source: "booking",
          channel: booking.source === "online" ? "online" : "shop",
          at: this.now(),
          servicePence: booking.lines.filter((line) => line.kind !== "retail").reduce((sum, line) => sum + line.pence, 0),
          retailPence: booking.lines.filter((line) => line.kind === "retail").reduce((sum, line) => sum + line.pence, 0),
          discountPence: booking.discountPence,
          vatPence: 0,
          tipPence: 0,
          deliveryPence: 0,
          depositAppliedPence: depositPart,
          promoId: booking.promoId,
        });
    posting.status = "sent";
    this.privateData.finance.push(posting);
    void stubPayload(posting);
  }

  private paidDeposit(booking: BookingRecord): number {
    if (!this.privateData) return 0;
    return this.privateData.ledger
      .filter((row) => row.bookingId === booking.id && row.kind === "deposit")
      .reduce((sum, row) => sum + row.amountPence, 0);
  }

  private earnPoints(booking: BookingRecord, clientId: string): void {
    if (!this.privateData) return;
    if (this.privateData.points.some((row) => row.ref === booking.id && row.reason === "earn")) return;
    const tips = this.privateData.tips.filter((row) => row.bookingId === booking.id).reduce((sum, row) => sum + row.amountPence, 0);
    const paid = booking.totalPence;
    const points = pointsForPayment(Math.max(0, paid - tips));
    if (points === 0) return;
    this.privateData.points.push({
      id: randomId(),
      siteId: SITE_ID,
      clientId,
      at: this.now(),
      points,
      reason: "earn",
      memo: "Earned after the bill was paid in full",
      ref: booking.id,
    });
  }

  private ledger(
    bookingId: string | null,
    clientId: string | null,
    kind: LedgerRecord["kind"],
    method: LedgerRecord["method"],
    amount: number,
    memo: string,
  ): LedgerRecord {
    return {
      id: randomId(),
      siteId: SITE_ID,
      at: this.now(),
      idempotencyKey: randomId(),
      bookingId,
      orderId: null,
      clientId,
      kind,
      method,
      amountPence: amount,
      memo,
      ref: "",
      terminalName: "",
      staffId: this.actor?.staffId ?? null,
      reason: "",
    };
  }

  buildBooking(intent: GuestIntent, source: BookingRecord["source"]): { booking: BookingRecord; service: ServiceRecord } | { error: string } {
    if (!this.publicData && !this.privateData) return { error: "Not ready" };
    const services = this.privateData?.services ?? this.publicData?.services ?? [];
    const service = services.find((row) => row.id === intent.serviceId);
    if (!service) return { error: "Treatment not found" };
    if (!intent.termsAccepted) return { error: "Accept the terms before confirming." };
    const staff = (this.privateData?.staff ?? []).find((row) => row.id === intent.staffId) ??
      this.publicData?.staff.find((row) => row.id === intent.staffId);
    if (!staff) return { error: "Choose an artist." };
    const tier = "tier" in staff ? staff.tier : "stylist";
    const lines = this.choiceLines(intent, service);
    const rough = quoteBooking({
      service: this.asPrice(service),
      tier,
      multipliers: { junior: 0.85, stylist: 1, senior: 1.2, director: 1.4 },
      lines,
      discountPence: 0,
      salonDeposit: this.depositDefault(),
    });
    if (rough.blockedReason || rough.subtotalPence == null) {
      return { error: rough.blockedReason ?? "Price not set" };
    }
    const promo = this.pickPromo(service.id, intent.promoCode, rough.subtotalPence);
    const priced = quoteBooking({
      service: this.asPrice(service),
      tier,
      multipliers: { junior: 0.85, stylist: 1, senior: 1.2, director: 1.4 },
      lines,
      discountPence: promo.discount,
      salonDeposit: this.depositDefault(),
    });
    if (priced.blockedReason || priced.totalPence == null || priced.depositPence == null) {
      return { error: priced.blockedReason ?? "Price not set" };
    }
    const discount = priced.discountPence;
    const total = priced.totalPence;
    const deposit = priced.depositPence;
    if (intent.location !== "salon") {
      const zone = postcodeAllowed(intent.postcode, this.publicData?.settings.travelOutward ?? []);
      if (!zone.allowed) return { error: zone.reason };
      if (!intent.homeAccepted) return { error: "The home or event agreement (LEG-22) must be accepted. The salon is the contracting party." };
    }
    const segments = priced.segments;
    const booking: BookingRecord = {
      id: intent.bookingId || randomId(),
      siteId: SITE_ID,
      clientId: "",
      staffId: intent.staffId,
      status: "booked",
      source,
      location: intent.location,
      address: intent.address,
      postcode: intent.postcode,
      startMs: intent.startMs,
      segments,
      lines: [
        ...priced.lines.map((line) => ({
          kind: line.kind as BookingRecord["lines"][number]["kind"],
          id: line.id,
          name: line.name,
          pence: line.pence ?? 0,
          minutes: line.minutes,
          productId: null,
          collect: false,
        })),
      ],
      promoId: promo.id,
      discountPence: discount,
      totalPence: total,
      depositDuePence: deposit,
      depositStatus: deposit === 0 ? "not-required" : "unpaid",
      paymentChoice: intent.paymentChoice,
      cardOnFileAgreed: intent.cardOnFileAgreed,
      termsAcceptedAt: this.now(),
      agreementId: intent.homeAccepted ? "LEG-22" : null,
      manufacturerChecked: intent.manufacturerChecked,
      manufacturerNote: intent.manufacturerNote,
      colourNote: "",
      completionReason: "",
      createdAt: this.now(),
      deviceId: deviceId(),
    };
    return { booking, service };
  }

  private choiceLines(intent: GuestIntent, service: ServiceRecord): ChoiceLine[] {
    const services = this.privateData?.services ?? this.publicData?.services ?? [];
    const products = this.privateData?.products ?? this.publicData?.products ?? [];
    const lines: ChoiceLine[] = [];
    for (const id of intent.addonIds) {
      const addon = services.find((row) => row.id === id);
      if (!addon) continue;
      lines.push({
        kind: "addon",
        id,
        name: addon.name,
        extraMinutes: addon.durationMin ?? 0,
        pricePence: addon.basePence,
        pricePlaceholder: addon.basePence == null ? "[PRICE]" : null,
        rangeMinPence: addon.rangeMinPence,
        rangeMaxPence: addon.rangeMaxPence,
        chosenRangePence: addon.priceType === "range" ? intent.rangePence : null,
        collect: false,
      });
    }
    const branded = this.privateData?.branded ?? this.publicData?.branded ?? [];
    for (const id of intent.brandedIds) {
      const option = branded.find((row) => row.id === id);
      if (!option) continue;
      lines.push({
        kind: "branded",
        id,
        name: option.name,
        extraMinutes: option.extraMinutes,
        pricePence: option.priceDifferencePence,
        pricePlaceholder: "[PRICE DIFFERENCE – Tony to set]",
        collect: false,
        productId: option.productId,
      });
    }
    const tiers = this.privateData?.nailTiers ?? this.publicData?.nailTiers ?? [];
    if (intent.nailTierId) {
      const tier = tiers.find((row) => row.id === intent.nailTierId);
      if (tier) {
        lines.push({
          kind: "nail-tier",
          id: tier.id,
          name: tier.name,
          extraMinutes: tier.extraMinutes ?? 0,
          pricePence: tier.pricePence,
          pricePlaceholder: "[PRICE – Tony to set]",
          collect: false,
        });
      }
    }
    for (const item of intent.retail) {
      const product = products.find((row) => row.id === item.productId);
      if (!product) continue;
      lines.push({
        kind: "retail",
        id: product.id,
        name: product.name,
        extraMinutes: 0,
        pricePence: product.rrpPence ?? item.chosenPence,
        pricePlaceholder: "[PRICE]",
        rangeMinPence: product.rangeMinPence,
        rangeMaxPence: product.rangeMaxPence,
        chosenRangePence: item.chosenPence,
        collect: item.collect,
        channel: product.channel,
        productId: product.id,
      });
    }
    void service;
    return lines;
  }

  private pickPromo(serviceId: string, code: string | null, subtotal: number): { id: string | null; discount: number } {
    const offers = this.privateData?.offers ?? this.publicData?.offers ?? [];
    const ctx = {
      serviceId,
      subtotalPence: subtotal,
      isNewClient: true,
      isMember: false,
      nowIso: this.now(),
      code,
      qualifyingItemCount: 1,
    };
    const match = offers.find((offer) => promoApplies(offer as Promo, ctx) && (offer.code || offer.automatic));
    if (!match || match.amount == null) return { id: match?.id ?? null, discount: 0 };
    if (match.type === "percent" || match.type === "off-peak" || match.type === "retail-percent") {
      return { id: match.id, discount: Math.round((subtotal * match.amount) / 100) };
    }
    return { id: match.id, discount: Math.min(subtotal, match.amount) };
  }

  private asPrice(service: ServiceRecord) {
    return {
      id: service.id,
      name: service.name,
      priceType: service.priceType,
      basePence: service.basePence,
      rangeMinPence: service.rangeMinPence,
      rangeMaxPence: service.rangeMaxPence,
      durationMin: service.durationMin ?? 0,
      processingMin: service.processingMin,
      finishMin: service.finishMin,
      patchTest: service.patchTest,
      chemical: service.chemical,
      depositRule: service.depositRule,
      quoteOnly: service.priceType === "quote",
      location: service.location === "both" ? "salon" : service.location,
      onlineBookable: service.onlineBookable,
    } as const;
  }

  private depositDefault() {
    const settings = this.privateData?.settings ?? this.publicData?.settings;
    return { percent: settings?.depositPercent ?? 20, minimumPence: settings?.depositMinimumPence ?? 1500 };
  }

  staffClash(staffId: string, startMs: number, segments: Segment[], ignoreBookingId: string | null): string | null {
    const occupancy = (this.publicData?.occupancy ?? []).filter((row) => row.staffId === staffId && row.id !== ignoreBookingId && !row.id.startsWith(`${ignoreBookingId}-`));
    return clashReason(timeline(startMs, segments), {
      active: occupancy.filter((row) => row.kind !== "block").map((row) => ({ startMs: row.startMs, endMs: row.endMs })),
      blocks: occupancy.filter((row) => row.kind === "block").map((row) => ({ startMs: row.startMs, endMs: row.endMs })),
    });
  }

  slots(service: ServiceRecord, staffId: string | null, fromDay: string, days = 7) {
    const people = (this.publicData?.staff ?? []).filter((person) => person.active);
    const qualified = people.filter((person) => this.qualified(person.id, service));
    const chosen = staffId ? qualified.filter((person) => person.id === staffId) : qualified;
    const segments: Segment[] =
      service.processingMin > 0
        ? [
            { kind: "active", minutes: (service.durationMin ?? 0) - service.processingMin - service.finishMin },
            { kind: "processing", minutes: service.processingMin },
            { kind: "active", minutes: service.finishMin },
          ]
        : [{ kind: "active", minutes: service.durationMin ?? 0 }];
    const offers: { startMs: number; endMs: number; staffId: string; staffName: string }[] = [];
    let cursor = parseDayKey(fromDay);
    for (let i = 0; i < days; i += 1) {
      const dayKey = `${cursor.year}-${String(cursor.month).padStart(2, "0")}-${String(cursor.day).padStart(2, "0")}`;
      const weekday = weekdayOfDayKey(dayKey);
      for (const person of chosen) {
        const shift = person.hours.find((row) => row.weekday === weekday);
        if (!shift) continue;
        const blocks = (this.publicData?.occupancy ?? [])
          .filter((row) => row.staffId === person.id && row.kind === "block")
          .map((row) => ({ startMs: row.startMs, endMs: row.endMs }));
        if (shift.breakStart != null && shift.breakEnd != null) {
          const { year, month, day } = cursor;
          blocks.push({
            startMs: londonWallToUtc(year, month, day, Math.floor(shift.breakStart / 60), shift.breakStart % 60).getTime(),
            endMs: londonWallToUtc(year, month, day, Math.floor(shift.breakEnd / 60), shift.breakEnd % 60).getTime(),
          });
        }
        const active = (this.publicData?.occupancy ?? [])
          .filter((row) => row.staffId === person.id && row.kind !== "block")
          .map((row) => ({ startMs: row.startMs, endMs: row.endMs }));
        for (const slot of slotsOnShift({
          dayKey,
          shift: { startMin: shift.startMin, endMin: shift.endMin },
          segments,
          occupancy: { active, blocks },
          staffId: person.id,
          nowMs: Date.now(),
        })) {
          offers.push({ ...slot, staffName: person.name });
        }
      }
      cursor = addLondonDays(cursor.year, cursor.month, cursor.day, 1);
    }
    return { offers, segments, qualified };
  }

  qualified(staffId: string, service: ServiceRecord): boolean {
    if (service.qualifiedStaffIds.length > 0) return service.qualifiedStaffIds.includes(staffId);
    const person = this.publicData?.staff.find((row) => row.id === staffId);
    if (!person) return false;
    return person.categories.includes(service.category);
  }

  async submitGuest(intent: GuestIntent): Promise<{ ok: boolean; message: string; bookingId?: string }> {
    if (!this.publicData) return { ok: false, message: "Still loading." };
    if (!intent.termsAccepted) return { ok: false, message: "Tick the terms before confirming." };
    const preview = this.buildBooking(intent, "online");
    if ("error" in preview) return { ok: false, message: preview.error };
    const clash = this.staffClash(intent.staffId, preview.booking.startMs, preview.booking.segments, preview.booking.id);
    if (clash) return { ok: false, message: clash };
    const service = (this.publicData.services).find((row) => row.id === intent.serviceId);
    if (service?.patchTest) {
      const known = this.privateData?.patches.filter((row) => row.clientId && row.productClass === "colour") ?? [];
      const gate = assessPatchTest({
        required: true,
        tests: known.map((row) => ({ atIso: row.at, result: row.result, productClass: row.productClass })),
        productClass: "colour",
        appointmentIso: new Date(intent.startMs).toISOString(),
        validityDays: this.privateData?.settings.patchValidityDays ?? null,
        clearedReaction: false,
      });
      if (!gate.ok && known.length === 0) {
        return { ok: false, message: "A patch test at least 48 hours before is required. Book a patch-test visit first, or ask the salon if you already have one on file." };
      }
    }
    if (this.offline) {
      this.pending.push(intent);
      this.emit();
      return { ok: true, message: "OFFLINE. The booking is waiting to sync." };
    }
    const packet = await seal(this.publicData.publicKeyJwk, intent);
    this.publicData.inbox.push({ id: randomId(), at: this.now(), ...packet });
    this.publicData.occupancy.push({
      id: preview.booking.id,
      staffId: intent.staffId,
      startMs: preview.booking.startMs,
      endMs: preview.booking.startMs + preview.booking.segments.reduce((sum, segment) => sum + segment.minutes, 0) * 60_000,
      kind: "hold",
    });
    await kvSet("public", this.publicData);
    channel().postMessage({ type: "changed" });
    const local = JSON.parse(localStorage.getItem("salonos-receipts") || "[]") as { id: string; summary: string }[];
    local.push({ id: preview.booking.id, summary: this.confirmationBody(preview.booking, intent.client.name) });
    localStorage.setItem("salonos-receipts", JSON.stringify(local));
    if (this.deviceKey && this.privateData) await this.mergeInbox();
    this.emit();
    return { ok: true, message: "TEST MODE – simulated payment recorded. No real card was charged.", bookingId: preview.booking.id };
  }

  async flushOffline(): Promise<void> {
    if (!this.publicData) return;
    const queued = syncBookings(
      this.pending.map((intent, index) => ({
        id: `off-${index}-${intent.startMs}`,
        deviceId: deviceId(),
        localTime: this.now(),
        type: "booking" as const,
        staffId: intent.staffId,
        startMs: intent.startMs,
        endMs: intent.startMs + 60_000,
        clientPhone: intent.client.mobile,
      })),
      new Set(),
    );
    for (const id of queued.applied) {
      const index = Number(id.split("-")[1]);
      const intent = this.pending[index];
      if (!intent) continue;
      const packet = await seal(this.publicData.publicKeyJwk, intent);
      this.publicData.inbox.push({ id: randomId(), at: this.now(), ...packet });
    }
    if (this.privateData) {
      for (const item of queued.attention) {
        this.privateData.attention.push({
          id: randomId(),
          siteId: SITE_ID,
          at: this.now(),
          kind: "offline-clash",
          detail: item.reason,
          phone: item.phone,
          resolved: false,
        });
      }
    }
    this.pending = [];
    this.offline = false;
    await kvSet("public", this.publicData);
    if (this.deviceKey) await this.mergeInbox();
    this.emit();
  }

  require(action: Parameters<typeof assertCan>[1]): void {
    if (!this.actor) throw new Error("Sign in required.");
    assertCan(this.actor, action, this.now());
  }

  diary(dayKey: string): BookingRecord[] {
    if (!this.privateData || !this.actor) return [];
    return this.privateData.bookings.filter((booking) => {
      if (londonDayKey(new Date(booking.startMs)) !== dayKey) return false;
      if (seesAllDiary(this.actor!)) return true;
      return booking.staffId === this.actor!.staffId;
    });
  }

  searchClients(query: string): ClientRecord[] {
    if (!this.privateData) return [];
    this.require("client.contact");
    const q = query.trim().toLowerCase();
    return this.privateData.clients
      .filter((client) => !client.erased && (`${client.name} ${client.mobile} ${client.email}`.toLowerCase().includes(q)))
      .slice(0, 30);
  }

  pointsOf(clientId: string): number {
    if (!this.privateData) return 0;
    return this.privateData.points.filter((row) => row.clientId === clientId).reduce((sum, row) => sum + row.points, 0);
  }

  async quickBook(input: { clientId: string; serviceId: string; staffId: string; startMs: number }): Promise<string | null> {
    this.require("diary.all");
    if (!this.privateData) return "Locked";
    const client = this.privateData.clients.find((row) => row.id === input.clientId);
    const service = this.privateData.services.find((row) => row.id === input.serviceId);
    if (!client || !service) return "Missing client or treatment";
    const person = this.privateData.staff.find((row) => row.id === input.staffId);
    if (!person || !this.qualified(person.id, service)) return "That person is not qualified for this treatment.";
    const intent: GuestIntent = {
      bookingId: randomId(),
      client: { name: client.name, mobile: client.mobile, email: client.email, dob: client.dob },
      serviceId: service.id,
      staffId: person.id,
      startMs: input.startMs,
      addonIds: [],
      rangePence: null,
      brandedIds: [],
      nailTierId: null,
      retail: [],
      promoCode: null,
      kind: "booking",
      paymentChoice: "in-salon",
      cardOnFileAgreed: false,
      termsAccepted: true,
      homeAccepted: false,
      address: "",
      postcode: "",
      location: "salon",
      manufacturerChecked: false,
      manufacturerNote: "",
      simulatedPayment: false,
    };
    const built = this.buildBooking(intent, "phone");
    if ("error" in built) return built.error;
    const clash = this.staffClash(person.id, built.booking.startMs, built.booking.segments, null);
    if (clash) return clash;
    built.booking.clientId = client.id;
    this.privateData.bookings.push(built.booking);
    this.audit("booking", built.booking.id, "Phone or desk booking");
    await this.persist();
    return null;
  }

  async moveBooking(bookingId: string, staffId: string, startMs: number): Promise<string | null> {
    this.require("diary.all");
    if (!this.privateData) return "Locked";
    const booking = this.privateData.bookings.find((row) => row.id === bookingId);
    const service = booking && this.privateData.services.find((row) => row.id === booking.lines[0]?.id);
    if (!booking || !service) return "Booking not found";
    if (!this.qualified(staffId, service)) return "That column is not qualified for this treatment.";
    const clash = this.staffClash(staffId, startMs, booking.segments, booking.id);
    if (clash) return clash;
    booking.staffId = staffId;
    booking.startMs = startMs;
    this.audit("move-booking", booking.id, staffId);
    await this.persist();
    return null;
  }

  async setStatus(bookingId: string, status: BookingRecord["status"], reason = ""): Promise<string | null> {
    if (!this.privateData || !this.actor) return "Locked";
    const booking = this.privateData.bookings.find((row) => row.id === bookingId);
    if (!booking) return "Booking not found";
    if (!canMoveBooking(booking.status, status)) return "That status change is not allowed.";
    if (status === "completed" && !completionAllowed(this.balanceDue(booking), reason)) {
      return "Completed needs the bill paid, or a reason.";
    }
    booking.status = status;
    if (reason) booking.completionReason = reason;
    this.audit("status", booking.id, status);
    await this.persist();
    return null;
  }

  async takePayment(bookingId: string, tenders: TenderPart[], tipPence: number, external?: { terminal: string; ref: string }): Promise<string | null> {
    this.require("till");
    if (!this.privateData) return "Locked";
    const booking = this.privateData.bookings.find((row) => row.id === bookingId);
    if (!booking) return "Booking not found";
    const due = this.balanceDue(booking);
    try {
      assertTendersMatch(due, tenders);
    } catch (error) {
      return error instanceof Error ? error.message : "Tender mismatch";
    }
    for (const tender of tenders) {
      if (tender.method === "external-card" && !external?.ref) return "External card needs a reference. No card number is stored.";
      const row = this.ledger(booking.id, booking.clientId, tender.method === "voucher" ? "voucher-redeem" : "tender", tender.method === "card" ? "simulated" : tender.method, tender.amountPence, "Till");
      if (tender.method === "external-card" && external) {
        row.method = "external-card";
        row.terminalName = external.terminal;
        row.ref = external.ref;
      }
      this.privateData.ledger.push(row);
      if (tender.method === "cash") this.audit("drawer", booking.id, "Cash tender. Drawer kick queued for the network printer.");
    }
    if (tipPence > 0) {
      this.privateData.tips.push({
        id: randomId(),
        siteId: SITE_ID,
        at: this.now(),
        bookingId: booking.id,
        staffId: booking.staffId,
        amountPence: tipPence,
        method: "card",
        qualifying: true,
        paidAt: null,
        rule: this.privateData.settings.tipsPolicy,
      });
      this.privateData.ledger.push(this.ledger(booking.id, booking.clientId, "tip", "simulated", tipPence, "Tip. Not revenue. Full pass-through."));
    }
    if (this.balanceDue(booking) === 0) {
      booking.status = booking.status === "booked" ? "arrived" : booking.status;
      this.earnPoints(booking, booking.clientId);
      this.commissionFor(booking);
    }
    const posting: FinancePosting = salePosting({
      id: randomId(),
      siteId: SITE_ID,
      sourceId: booking.id,
      source: "booking",
      channel: "shop",
      at: this.now(),
      servicePence: booking.lines.filter((line) => line.kind !== "retail").reduce((sum, line) => sum + line.pence, 0),
      retailPence: booking.lines.filter((line) => line.kind === "retail").reduce((sum, line) => sum + line.pence, 0),
      discountPence: booking.discountPence,
      vatPence: 0,
      tipPence,
      deliveryPence: 0,
      depositAppliedPence: this.paidDeposit(booking),
      promoId: booking.promoId,
    });
    this.privateData.finance.push(posting);
    this.audit("payment", booking.id, tenders.map((tender) => tender.method).join("+"));
    await this.persist();
    return null;
  }

  private commissionFor(booking: BookingRecord): void {
    if (!this.privateData) return;
    const person = this.privateData.staff.find((row) => row.id === booking.staffId);
    if (!person) return;
    const serviceGross = booking.lines.filter((line) => line.kind !== "retail").reduce((sum, line) => sum + line.pence, 0) - booking.discountPence;
    if (person.staffType === "renter") {
      const split = renterSplit({
        grossPence: Math.max(0, serviceGross),
        rule: person.settlement === "record-only" ? "record-only" : "percent",
        salonShareBps: person.salonShareBps ?? 0,
      });
      this.privateData.commission.push({
        id: randomId(),
        siteId: SITE_ID,
        at: this.now(),
        staffId: person.id,
        bookingId: booking.id,
        kind: "service",
        basePence: Math.max(0, serviceGross),
        amountPence: split.renterPence,
        salonPence: split.salonPence,
        renterPence: split.renterPence,
        reversed: false,
      });
      return;
    }
    if (person.commissionServiceBps == null) return;
    const result = commissionOn({
      grossAfterDiscountPence: Math.max(0, serviceGross),
      rateBps: person.commissionServiceBps,
      vatRegistered: this.privateData.settings.vatRegistered,
      vatRateBps: this.privateData.settings.vatRateBps,
    });
    this.privateData.commission.push({
      id: randomId(),
      siteId: SITE_ID,
      at: this.now(),
      staffId: person.id,
      bookingId: booking.id,
      kind: "service",
      basePence: result.basePence,
      amountPence: result.commissionPence,
      salonPence: 0,
      renterPence: 0,
      reversed: false,
    });
  }

  async saveFormula(bookingId: string, grams: number, waste: number): Promise<string | null> {
    this.require("formula");
    if (!this.privateData) return "Locked";
    const booking = this.privateData.bookings.find((row) => row.id === bookingId);
    if (!booking) return "Booking not found";
    const lines = formulaDeductions([{ productId: "bb-shade", grams, wasteGrams: waste }]);
    this.privateData.formulas.push({
      id: randomId(),
      siteId: SITE_ID,
      clientId: booking.clientId,
      bookingId,
      at: this.now(),
      lines: lines.map((line) => ({ ...line, name: "SAMPLE back-bar shade A" })),
      developer: "SAMPLE developer",
      developerGrams: grams,
      notes: "",
      timing: "",
      deducted: false,
    });
    this.audit("formula", booking.clientId, "Formula saved");
    await this.persist();
    return null;
  }

  async completeAndDeduct(bookingId: string): Promise<string | null> {
    if (!this.privateData) return "Locked";
    const status = await this.setStatus(bookingId, "completed");
    if (status) return status;
    const formulas = this.privateData.formulas.filter((row) => row.bookingId === bookingId && !row.deducted);
    for (const formula of formulas) {
      for (const line of formula.lines) {
        this.privateData.stock.push({
          id: randomId(),
          siteId: SITE_ID,
          productId: line.productId,
          location: "backbar",
          qty: -line.grams,
          unit: "gram",
          reason: "formula",
          ref: bookingId,
          at: this.now(),
          note: "",
        });
        if (line.wasteGrams) {
          this.privateData.stock.push({
            id: randomId(),
            siteId: SITE_ID,
            productId: line.productId,
            location: "backbar",
            qty: -line.wasteGrams,
            unit: "gram",
            reason: "waste",
            ref: bookingId,
            at: this.now(),
            note: "Waste",
          });
        }
      }
      formula.deducted = true;
    }
    await this.persist();
    return null;
  }

  stockOf(productId: string, location: "retail" | "backbar"): { onHand: number; reserved: number; available: number } {
    const rows = (this.privateData?.stock ?? []).filter((row) => row.productId === productId && row.location === location);
    const hand = onHand(rows, productId, location);
    const hold = reserved(rows, productId, location);
    const product = this.privateData?.products.find((row) => row.id === productId);
    return { onHand: hand, reserved: hold, available: available(hand, hold, product?.safetyBuffer ?? 0) };
  }

  async goodsIn(productId: string, qty: number, costPence: number | null, note: string, supplier: string): Promise<string | null> {
    this.require("stock");
    if (!this.privateData) return "Locked";
    const product = this.privateData.products.find((row) => row.id === productId);
    if (!product) return "Product not found";
    if (costPence != null) product.costPence = costPence;
    if (supplier) product.supplier = supplier;
    this.privateData.stock.push({
      id: randomId(),
      siteId: SITE_ID,
      productId,
      location: product.useType === "backbar" ? "backbar" : "retail",
      qty,
      unit: product.useType === "backbar" ? "gram" : "each",
      reason: "goods-in",
      ref: note || "delivery",
      at: this.now(),
      note,
    });
    this.audit("goods-in", productId, `${qty} ${supplier}`);
    await this.persist();
    return null;
  }

  async stockTake(productId: string, counted: number, reason: string): Promise<string | null> {
    this.require("stock");
    if (!this.privateData) return "Locked";
    const product = this.privateData.products.find((row) => row.id === productId);
    if (!product || !reason.trim()) return "A reason is required.";
    const location = product.useType === "backbar" ? "backbar" : "retail";
    const system = this.stockOf(productId, location).onHand;
    const variance = counted - system;
    if (variance !== 0) {
      this.privateData.stock.push({
        id: randomId(),
        siteId: SITE_ID,
        productId,
        location,
        qty: variance,
        unit: location === "backbar" ? "gram" : "each",
        reason: "stock-take",
        ref: reason,
        at: this.now(),
        note: reason,
      });
    }
    this.audit("stock-take", productId, `${variance}`);
    await this.persist();
    return null;
  }

  async updateSettings(patch: Partial<Settings>): Promise<string | null> {
    this.require("settings");
    if (!this.privateData) return "Locked";
    this.privateData.settings = { ...this.privateData.settings, ...patch, siteId: SITE_ID };
    this.audit("settings", SITE_ID, Object.keys(patch).join(","));
    await this.persist();
    return null;
  }

  async acceptSeed(ids: string[]): Promise<void> {
    this.require("catalogue.write");
    if (!this.privateData) return;
    for (const service of this.privateData.services) {
      if (ids.includes(service.id) && service.source === "seed") {
        service.accepted = true;
        service.active = true;
        service.onlineBookable = service.basePence != null && service.priceType !== "quote";
      }
    }
    this.audit("catalogue", ids.join(","), "Accepted seed rows");
    await this.persist();
  }

  async deleteSeed(ids: string[]): Promise<string | null> {
    this.require("catalogue.write");
    if (!this.privateData) return "Locked";
    const own = ids.filter((id) => this.privateData!.services.find((row) => row.id === id)?.source !== "seed");
    if (own.length) return "That delete includes a service the salon created. Seed delete does not remove those.";
    this.privateData.services = this.privateData.services.filter((row) => !ids.includes(row.id));
    this.audit("catalogue-delete", `${ids.length}`, "Seed rows deleted");
    await this.persist();
    return null;
  }

  lowStock(): { id: string; name: string; onHand: number; reorder: number }[] {
    if (!this.privateData) return [];
    return this.privateData.products
      .filter((product) => product.active)
      .map((product) => ({
        id: product.id,
        name: product.name,
        onHand: this.stockOf(product.id, product.useType === "backbar" ? "backbar" : "retail").onHand,
        reorder: product.reorderLevel,
      }))
      .filter((row) => row.onHand <= row.reorder);
  }

  expectedCashToday(dayKey: string): Pence {
    if (!this.privateData) return 0;
    const rows = this.privateData.ledger.filter((row) => londonDayKey(new Date(row.at)) === dayKey);
    const cash = (kind: LedgerRecord["kind"]) => rows.filter((row) => row.kind === kind && row.method === "cash").reduce((sum, row) => sum + row.amountPence, 0);
    const paidOut = rows.filter((row) => row.kind === "paid-out").reduce((sum, row) => sum + row.amountPence, 0);
    const paidIn = rows.filter((row) => row.kind === "paid-in").reduce((sum, row) => sum + row.amountPence, 0);
    return expectedCash({
      floatPence: 0,
      cashTendersPence: cash("tender") + cash("deposit"),
      cashRefundsPence: rows.filter((row) => row.kind === "refund" && row.method === "cash").reduce((sum, row) => sum + row.amountPence, 0),
      cashPaidOutPence: paidOut,
      cashPaidInPence: paidIn,
    });
  }

  async advanceOrder(orderId: string, status: string, extra?: { courier?: string; tracking?: string }): Promise<string | null> {
    this.require("orders");
    if (!this.privateData) return "Locked";
    const order = this.privateData.orders.find((row) => row.id === orderId);
    if (!order) return "Order not found";
    if (!canMoveOrder(order.status, status)) return "That status change is not allowed.";
    order.status = status;
    if (extra?.courier) order.courier = extra.courier;
    if (extra?.tracking) order.tracking = extra.tracking;
    if (status === "delivered") order.deliveredAt = this.now();
    this.holdMessage(this.privateData.clients.find((c) => c.id === order.clientId)?.email ?? "", `Order ${status}`, `Not sent. Tracking ${order.tracking || "[not set]"}.`);
    this.audit("order", order.id, status);
    await this.persist();
    return null;
  }

  async closeDay(dayKey: string, actualCash: number, reason: string): Promise<string | null> {
    this.require("cashup.close");
    if (!this.privateData) return "Locked";
    const existing = this.privateData.cashups.find((row) => row.dayKey === dayKey && row.closedAt && !row.reopened);
    if (existing) return "That day is already closed.";
    const expected = this.expectedCashToday(dayKey);
    const variance = cashVariance(actualCash, expected);
    this.privateData.cashups.push({
      id: randomId(),
      siteId: SITE_ID,
      dayKey,
      closedAt: this.now(),
      floatPence: 0,
      actualCashPence: actualCash,
      expectedCashPence: expected,
      variancePence: variance,
      varianceReason: reason,
      externalTotals: [],
      reopened: false,
    });
    this.privateData.finance.push({
      id: randomId(),
      siteId: SITE_ID,
      idempotencyKey: `cashup:${dayKey}`,
      source: "cash-up",
      sourceId: dayKey,
      channel: "shop",
      status: "sent",
      attempts: 1,
      error: "",
      createdAt: this.now(),
      lines: [{ account: "over-short", amountPence: variance, memo: "Cash-up variance" }],
    });
    this.audit("cash-up", dayKey, `variance ${variance}`);
    await this.persist();
    return null;
  }

  exportCsv(): Record<string, string> {
    this.require("export");
    if (!this.privateData) return {};
    const clients = ["name,mobile,email", ...this.privateData.clients.map((c) => `${c.name},${c.mobile},${c.email}`)].join("\n");
    const bookings = ["id,client,staff,status,total", ...this.privateData.bookings.map((b) => `${b.id},${b.clientId},${b.staffId},${b.status},${b.totalPence}`)].join("\n");
    this.audit("export", SITE_ID, "CSV export");
    return { clients, bookings };
  }

  async saveWaiver(clientId: string, reason: string, boxes: { told: boolean; declined: boolean; insurance: boolean; ack: boolean }): Promise<string | null> {
    this.require("client.health");
    if (!this.actor || (this.actor.role !== "owner" && this.actor.role !== "manager")) return "A manager must record a declined test.";
    const ready = waiverReady({
      managerId: this.actor.id,
      reason,
      toldRisk: boxes.told,
      choseToDecline: boxes.declined,
      insuranceMayNotCover: boxes.insurance,
      clientAcknowledged: boxes.ack,
    });
    if (!ready.ok) return ready.reason;
    if (!this.privateData) return "Locked";
    this.privateData.consents.push({
      id: randomId(),
      siteId: SITE_ID,
      clientId,
      at: this.now(),
      version: "LEG-09",
      kind: "patch",
      staffId: this.actor.staffId,
      signature: "manager-record",
      parentName: "",
      text: "Client was told the risk, chose to decline, and was told insurance may not cover the service. The salon must check its own policy.",
    });
    this.audit("declined-patch", clientId, reason);
    await this.persist();
    return null;
  }

  async noShow(bookingId: string): Promise<string | null> {
    this.require("diary.all");
    if (!this.privateData) return "Locked";
    const booking = this.privateData.bookings.find((row) => row.id === bookingId);
    if (!booking) return "Not found";
    const fee = this.privateData.settings.noShowFeePence ?? booking.depositDuePence;
    const decision = noShowCharge({
      requestedPence: fee,
      depositTakenPence: this.paidDeposit(booking),
      cardOnFileAgreed: booking.cardOnFileAgreed,
      ownerOverride: this.actor?.role === "owner",
      policyLimitPence: fee,
    });
    booking.status = "no-show";
    if (decision.chargePence > 0) {
      this.privateData.ledger.push(this.ledger(booking.id, booking.clientId, "no-show", "simulated", decision.chargePence, decision.reason));
    }
    this.audit("no-show", booking.id, decision.reason);
    await this.persist();
    return decision.reason;
  }

  async sellVoucher(amountPence: number, purchaser: string): Promise<string> {
    this.require("voucher");
    if (!this.privateData) throw new Error("Locked");
    if (!Number.isInteger(amountPence) || amountPence <= 0) throw new Error("Enter a voucher amount in pence.");
    const code = `SV-${randomId().slice(0, 8).toUpperCase()}`;
    this.privateData.vouchers.push({
      id: randomId(),
      siteId: SITE_ID,
      code,
      amountPence,
      purchaser,
      recipient: "",
      issuedAt: this.now(),
      sample: true,
    });
    this.privateData.ledger.push(this.ledger(null, null, "voucher-sale", "cash", amountPence, `Voucher ${code}. In-shop only. VAT ${this.privateData.settings.voucherVatTreatment}`));
    this.privateData.finance.push({
      id: randomId(),
      siteId: SITE_ID,
      idempotencyKey: `voucher:${code}`,
      source: "voucher",
      sourceId: code,
      channel: "shop",
      status: "sent",
      attempts: 1,
      error: "",
      createdAt: this.now(),
      lines: [{ account: "voucher-liability", amountPence, memo: "Voucher liability. Not tax advice." }],
    });
    this.audit("voucher", code, "Sold in shop");
    await this.persist();
    return code;
  }

  shopProducts() {
    return (this.publicData?.products ?? []).filter((product) => product.active && (product.channel === "online" || product.channel === "both") && product.useType !== "backbar");
  }

  canBuy(productId: string, qty: number): boolean {
    const stock = this.privateData ? this.stockOf(productId, "retail").available : 99;
    return canTake(stock, 0, 0, qty).ok || !this.privateData;
  }

  receipts(): { id: string; summary: string }[] {
    try {
      return JSON.parse(localStorage.getItem("salonos-receipts") || "[]") as { id: string; summary: string }[];
    } catch {
      return [];
    }
  }

  setOffline(next: boolean): void {
    this.offline = next;
    if (!next) void this.flushOffline();
    else this.emit();
  }

  addWalkIn(name: string, serviceId: string): void {
    this.require("diary.all");
    if (!this.privateData) return;
    this.privateData.walkins.push({
      id: randomId(),
      siteId: SITE_ID,
      clientName: name,
      serviceId,
      at: this.now(),
      status: "waiting",
    });
    void this.persist();
  }

  todayKey(): string {
    return londonDayKey(new Date());
  }

  londonNowLabel(): string {
    const parts = londonParts(new Date());
    return `${String(parts.day).padStart(2, "0")}/${String(parts.month).padStart(2, "0")}/${parts.year}`;
  }
}

export const salon = new SalonSession();
