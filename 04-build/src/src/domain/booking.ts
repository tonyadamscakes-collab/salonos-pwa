import { depositPence, type DepositRule, type Pence, type SalonDepositDefault, type TierName, applyTierMultiplier } from "./money";
import { concatSegments, type Segment, segmentsOf } from "./slots";

export type PriceType = "fixed" | "tier" | "quote" | "range" | "monthly";

export interface ServicePrice {
  id: string;
  name: string;
  priceType: PriceType;
  basePence: Pence | null;
  rangeMinPence?: Pence | null;
  rangeMaxPence?: Pence | null;
  durationMin: number;
  processingMin: number;
  finishMin: number;
  patchTest: boolean;
  chemical: boolean;
  depositRule: DepositRule | null;
  quoteOnly: boolean;
  location: "salon" | "home" | "event" | "both";
  onlineBookable: boolean;
}

export interface ChoiceLine {
  kind: "service" | "variant" | "addon" | "branded" | "nail-tier" | "retail";
  id: string;
  name: string;
  /** Ignored for money. The server prices from the catalogue. */
  clientSuppliedPence?: number | null;
  extraMinutes: number;
  pricePence: Pence | null;
  pricePlaceholder: string | null;
  rangeMinPence?: Pence | null;
  rangeMaxPence?: Pence | null;
  chosenRangePence?: Pence | null;
  productId?: string | null;
  channel?: "shop" | "online" | "both" | null;
  collect: boolean;
}

export interface QuoteInput {
  service: ServicePrice;
  tier: TierName;
  multipliers: Record<TierName, number>;
  lines: ChoiceLine[];
  discountPence: Pence;
  salonDeposit: SalonDepositDefault;
}

export interface QuoteLine {
  kind: ChoiceLine["kind"] | "service";
  id: string;
  name: string;
  pence: Pence | null;
  placeholder: string | null;
  minutes: number;
}

export interface Quote {
  lines: QuoteLine[];
  durationMin: number;
  segments: Segment[];
  subtotalPence: Pence | null;
  discountPence: Pence;
  totalPence: Pence | null;
  depositPence: Pence | null;
  blockedReason: string | null;
}

/** Browser totals are display only. This is the figure that is charged. */
export function quoteBooking(input: QuoteInput): Quote {
  const lines: QuoteLine[] = [];
  let blocked: string | null = null;
  if (input.service.quoteOnly || input.service.priceType === "quote") {
    return {
      lines: [{ kind: "service", id: input.service.id, name: input.service.name, pence: null, placeholder: "Prices on request", minutes: input.service.durationMin }],
      durationMin: input.service.durationMin,
      segments: serviceSegments(input.service),
      subtotalPence: null,
      discountPence: 0,
      totalPence: null,
      depositPence: null,
      blockedReason: "Request a quote. This treatment cannot be booked online.",
    };
  }
  const servicePence = priceService(input.service, input.tier, input.multipliers);
  if (servicePence == null) blocked = "This treatment has no price yet. It shows as Prices on request.";
  lines.push({
    kind: "service",
    id: input.service.id,
    name: input.service.name,
    pence: servicePence,
    placeholder: servicePence == null ? "[PRICE]" : null,
    minutes: input.service.durationMin,
  });
  let extraMinutes = 0;
  for (const line of input.lines) {
    extraMinutes += line.extraMinutes;
    const priced = priceLine(line);
    if (priced.blocked) blocked = priced.blocked;
    lines.push({
      kind: line.kind,
      id: line.id,
      name: line.name,
      pence: priced.pence,
      placeholder: priced.placeholder,
      minutes: line.extraMinutes,
    });
  }
  const known = lines.every((line) => line.pence != null);
  const subtotal = known ? lines.reduce((sum, line) => sum + (line.pence ?? 0), 0) : null;
  const discount = Math.min(input.discountPence, subtotal ?? 0);
  const total = subtotal == null ? null : Math.max(0, subtotal - discount);
  const deposit =
    total == null ? null : depositPence(total, input.service.depositRule, input.salonDeposit);
  const segments = serviceSegments(input.service);
  if (extraMinutes > 0) {
    const last = segments[segments.length - 1];
    if (last && last.kind === "active") last.minutes += extraMinutes;
    else segments.push({ kind: "active", minutes: extraMinutes });
  }
  const durationMin = segments.reduce((sum, segment) => sum + segment.minutes, 0);
  return {
    lines,
    durationMin,
    segments,
    subtotalPence: subtotal,
    discountPence: discount,
    totalPence: total,
    depositPence: deposit,
    blockedReason: blocked,
  };
}

function serviceSegments(service: ServicePrice): Segment[] {
  if (service.processingMin > 0) {
    return segmentsOf(service.durationMin, service.processingMin, service.finishMin);
  }
  return [{ kind: "active", minutes: service.durationMin }];
}

export function priceService(service: ServicePrice, tier: TierName, multipliers: Record<TierName, number>): Pence | null {
  if (service.priceType === "quote" || service.priceType === "monthly") return service.basePence;
  if (service.basePence == null) return null;
  if (service.priceType === "fixed" || service.priceType === "range") return service.basePence;
  return applyTierMultiplier(service.basePence, multipliers[tier]);
}

function priceLine(line: ChoiceLine): { pence: Pence | null; placeholder: string | null; blocked: string | null } {
  if (line.kind === "retail" && line.channel === "shop") {
    return { pence: null, placeholder: null, blocked: "That product is in-shop only and cannot be added online." };
  }
  if (line.rangeMinPence != null && line.rangeMaxPence != null) {
    const chosen = line.chosenRangePence;
    if (chosen == null) return { pence: null, placeholder: "[PRICE]", blocked: "Choose a price inside the range." };
    if (chosen < line.rangeMinPence || chosen > line.rangeMaxPence) {
      return { pence: null, placeholder: "[PRICE]", blocked: "That price is outside the range." };
    }
    return { pence: chosen, placeholder: null, blocked: null };
  }
  if (line.pricePence == null) {
    return {
      pence: null,
      placeholder: line.pricePlaceholder ?? "[PRICE]",
      blocked: `${line.name} has no price yet (${line.pricePlaceholder ?? "[PRICE]"}). Remove it or ask the salon to set a price.`,
    };
  }
  return { pence: line.pricePence, placeholder: null, blocked: null };
}

export function combineDurations(services: Segment[][], extraMinutes: number): Segment[] {
  const combined = concatSegments(services);
  if (extraMinutes > 0) combined.push({ kind: "active", minutes: extraMinutes });
  return combined;
}

export interface Promo {
  id: string;
  type: "percent" | "fixed" | "bogo" | "bundle" | "addon" | "retail-percent" | "off-peak";
  /** Percent off, or fixed pence, or null when the salon has not set a value. */
  amount: number | null;
  code: string | null;
  automatic: boolean;
  newClientsOnly: boolean;
  membersOnly: boolean;
  minSpendPence: Pence | null;
  serviceIds: string[];
  startsOn: string | null;
  endsOn: string | null;
  active: boolean;
}

export interface PromoContext {
  serviceId: string;
  subtotalPence: Pence;
  isNewClient: boolean;
  isMember: boolean;
  nowIso: string;
  code: string | null;
  qualifyingItemCount: number;
}

export interface PromoApplication {
  promoId: string | null;
  discountPence: Pence;
  refused: string | null;
}

export function applyOnePromo(promos: Promo[], ctx: PromoContext, chosenId: string | null): PromoApplication {
  const applicable = promos.filter((promo) => promoApplies(promo, ctx));
  if (!chosenId) {
    return { promoId: null, discountPence: 0, refused: null };
  }
  const chosen = applicable.find((promo) => promo.id === chosenId);
  if (!chosen) return { promoId: null, discountPence: 0, refused: "That offer does not apply to this booking." };
  if (chosen.amount == null) {
    return { promoId: chosen.id, discountPence: 0, refused: "This offer has no amount yet. It stays as [PRICE] until the salon sets it." };
  }
  let discount = 0;
  if (chosen.type === "percent" || chosen.type === "retail-percent" || chosen.type === "off-peak") {
    discount = Math.round((ctx.subtotalPence * chosen.amount) / 100);
  } else if (chosen.type === "fixed" || chosen.type === "addon" || chosen.type === "bundle") {
    discount = chosen.amount;
  } else if (chosen.type === "bogo") {
    if (ctx.qualifyingItemCount < 2) {
      return { promoId: null, discountPence: 0, refused: "Buy one get one needs two qualifying items." };
    }
    discount = chosen.amount;
  }
  discount = Math.max(0, Math.min(ctx.subtotalPence, discount));
  return { promoId: chosen.id, discountPence: discount, refused: null };
}

export function promoApplies(promo: Promo, ctx: PromoContext): boolean {
  if (!promo.active) return false;
  if (promo.startsOn && ctx.nowIso < promo.startsOn) return false;
  if (promo.endsOn && ctx.nowIso > promo.endsOn) return false;
  if (promo.newClientsOnly && !ctx.isNewClient) return false;
  if (promo.membersOnly && !ctx.isMember) return false;
  if (promo.minSpendPence != null && ctx.subtotalPence < promo.minSpendPence) return false;
  if (promo.serviceIds.length > 0 && !promo.serviceIds.includes(ctx.serviceId)) return false;
  if (promo.code && !promo.automatic) {
    if (!ctx.code || ctx.code.trim().toLowerCase() !== promo.code.trim().toLowerCase()) return false;
  }
  return true;
}

export function refuseSecondPromo(alreadyApplied: string | null, nextId: string | null): string | null {
  if (alreadyApplied && nextId && alreadyApplied !== nextId) return "Only one offer can be used on a booking.";
  return null;
}

export interface PatchTestRecord {
  atIso: string;
  result: "clear" | "reaction";
  productClass: string;
}

export function assessPatchTest(input: {
  required: boolean;
  tests: PatchTestRecord[];
  productClass: string;
  appointmentIso: string;
  validityDays: number | null;
  clearedReaction: boolean;
}): { ok: boolean; reason: string | null } {
  if (!input.required) return { ok: true, reason: null };
  const relevant = input.tests.filter((test) => test.productClass === input.productClass);
  const latest = relevant.slice().sort((a, b) => b.atIso.localeCompare(a.atIso))[0];
  if (!latest) return { ok: false, reason: "A patch test is required at least 48 hours before this appointment." };
  if (latest.result === "reaction" && !input.clearedReaction) {
    return { ok: false, reason: "A reaction is recorded for this product. An owner must clear it with a reason before booking." };
  }
  const hours = (new Date(input.appointmentIso).getTime() - new Date(latest.atIso).getTime()) / 3_600_000;
  if (hours < 48) return { ok: false, reason: "The patch test must be at least 48 hours before the appointment." };
  if (input.validityDays != null) {
    const ageDays = hours / 24;
    if (ageDays > input.validityDays) return { ok: false, reason: "The patch test has expired. Book a new test." };
  }
  return { ok: true, reason: null };
}

export interface WaiverInput {
  managerId: string;
  reason: string;
  toldRisk: boolean;
  choseToDecline: boolean;
  insuranceMayNotCover: boolean;
  clientAcknowledged: boolean;
}

export function waiverReady(input: WaiverInput): { ok: boolean; reason: string | null } {
  if (!input.managerId) return { ok: false, reason: "A manager must record this." };
  if (!input.reason.trim()) return { ok: false, reason: "A reason is required." };
  if (!input.toldRisk || !input.choseToDecline || !input.insuranceMayNotCover) {
    return { ok: false, reason: "All three confirmations are required, including the insurance warning." };
  }
  if (!input.clientAcknowledged) return { ok: false, reason: "The client must acknowledge the warning." };
  return { ok: true, reason: null };
}

export function ageYears(dobIso: string, onIso: string): number {
  const dob = new Date(dobIso);
  const on = new Date(onIso);
  let age = on.getUTCFullYear() - dob.getUTCFullYear();
  const beforeBirthday =
    on.getUTCMonth() < dob.getUTCMonth() ||
    (on.getUTCMonth() === dob.getUTCMonth() && on.getUTCDate() < dob.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function manufacturerCheckRequired(age: number, chemical: boolean): boolean {
  return chemical && age < 16;
}

export interface PostcodeZoneResult {
  allowed: boolean;
  reason: string;
}

/** v1 uses outward-code rules. No routing API. An empty zone refuses travel. */
export function postcodeAllowed(postcode: string, allowedOutward: string[]): PostcodeZoneResult {
  const outward = postcode.trim().toUpperCase().replace(/\s+/g, "").slice(0, -3);
  if (!postcode.trim()) return { allowed: false, reason: "Enter a postcode." };
  if (allowedOutward.length === 0) {
    return { allowed: false, reason: "The salon has not set a travel zone yet. No travel fee is charged until it does. [TRAVEL FEE – Tony to set]" };
  }
  const normalised = postcode.trim().toUpperCase();
  const ok = allowedOutward.some((code) => {
    const c = code.trim().toUpperCase();
    return normalised.startsWith(c) || outward === c;
  });
  if (!ok) return { allowed: false, reason: "That postcode is outside the salon's travel zone." };
  return { allowed: true, reason: "Inside the travel zone. Travel fee: [TRAVEL FEE – Tony to set] unless the salon has entered one." };
}

export const ORDER_NEXT: Record<string, string[]> = {
  placed: ["paid", "cancelled"],
  paid: ["picking", "cancelled", "return-requested"],
  picking: ["packed", "cancelled"],
  packed: ["dispatched", "ready", "cancelled"],
  dispatched: ["delivered", "return-requested"],
  delivered: ["return-requested"],
  ready: ["collected", "cancelled"],
  collected: ["return-requested"],
  "return-requested": ["returned", "refunded"],
  returned: ["refunded"],
  cancelled: [],
  refunded: [],
};

export function canMoveOrder(from: string, to: string): boolean {
  return (ORDER_NEXT[from] ?? []).includes(to);
}

export const BOOKING_NEXT: Record<string, string[]> = {
  "pending-payment": ["booked", "cancelled"],
  booked: ["arrived", "cancelled", "no-show"],
  arrived: ["in-service", "cancelled", "no-show"],
  "in-service": ["completed", "cancelled"],
  completed: [],
  "no-show": [],
  cancelled: [],
};

export function canMoveBooking(from: string, to: string): boolean {
  return (BOOKING_NEXT[from] ?? []).includes(to);
}

/** Completed needs a payment or an explicit reason. */
export function completionAllowed(balanceDuePence: Pence, reason: string): boolean {
  return balanceDuePence <= 0 || reason.trim().length > 0;
}

export interface SyncCommand {
  id: string;
  deviceId: string;
  localTime: string;
  type: "booking";
  staffId: string;
  startMs: number;
  endMs: number;
  clientPhone: string;
}

export interface SyncResult {
  applied: string[];
  attention: { id: string; reason: string; phone: string }[];
}

/** Server decides. The same command id is applied once. A second booking on the same active slot waits for a manager. */
export function syncBookings(commands: SyncCommand[], alreadyApplied: Set<string>): SyncResult {
  const applied: string[] = [];
  const attention: SyncResult["attention"] = [];
  const taken: { staffId: string; startMs: number; endMs: number }[] = [];
  const seen = new Set(alreadyApplied);
  for (const command of commands) {
    if (seen.has(command.id)) continue;
    seen.add(command.id);
    const clash = taken.some(
      (row) => row.staffId === command.staffId && command.startMs < row.endMs && row.startMs < command.endMs,
    );
    if (clash) {
      attention.push({
        id: command.id,
        reason: "Another booking already has this time. Nothing was saved twice.",
        phone: command.clientPhone,
      });
      continue;
    }
    taken.push({ staffId: command.staffId, startMs: command.startMs, endMs: command.endMs });
    applied.push(command.id);
  }
  return { applied, attention };
}

export interface ImportRow {
  row: number;
  sku: string;
  ean: string;
  name: string;
  costPence: Pence | null;
  rrpPence: Pence | null;
}

export interface ExistingProduct {
  sku: string;
  ean: string;
  name: string;
  supplierCode: string;
  costPence: Pence | null;
  rrpPence: Pence | null;
}

export interface ImportPlan {
  create: number[];
  update: number[];
  skip: number[];
  errors: { row: number; column: string; message: string }[];
  costChanges: { sku: string; from: Pence | null; to: Pence | null }[];
}

/** Dry run writes nothing. Duplicate EANs are flagged. RRP is never auto-changed. */
export function planProductImport(rows: ImportRow[], existing: ExistingProduct[], duplicateChoice: "update" | "skip"): ImportPlan {
  const plan: ImportPlan = { create: [], update: [], skip: [], errors: [], costChanges: [] };
  const seenEan = new Set<string>();
  for (const row of rows) {
    if (!row.name.trim()) {
      plan.errors.push({ row: row.row, column: "name", message: "Name is required" });
      continue;
    }
    if (row.ean && seenEan.has(row.ean)) {
      plan.errors.push({ row: row.row, column: "ean", message: "Duplicate EAN in this file" });
      continue;
    }
    if (row.ean) seenEan.add(row.ean);
    const match = existing.find(
      (product) =>
        (row.ean && product.ean === row.ean) ||
        (row.sku && (product.sku === row.sku || product.supplierCode === row.sku)) ||
        product.name.toLowerCase() === row.name.toLowerCase(),
    );
    if (!match) {
      plan.create.push(row.row);
      continue;
    }
    if (row.ean && match.ean === row.ean && duplicateChoice === "skip") {
      plan.skip.push(row.row);
      continue;
    }
    plan.update.push(row.row);
    if (row.costPence != null && row.costPence !== match.costPence) {
      plan.costChanges.push({ sku: match.sku || row.sku, from: match.costPence, to: row.costPence });
    }
    if (row.rrpPence != null && match.rrpPence != null && row.rrpPence !== match.rrpPence) {
      plan.errors.push({
        row: row.row,
        column: "rrp",
        message: "RRP is never changed by a supplier price list. The current selling price is left as it is.",
      });
    }
  }
  return plan;
}

export function marginBelow(costPence: Pence | null, rrpPence: Pence | null, thresholdBps: number): boolean {
  if (costPence == null || rrpPence == null || rrpPence <= 0) return false;
  const margin = ((rrpPence - costPence) * 10000) / rrpPence;
  return margin < thresholdBps;
}

export function cancelWindowOpen(appointmentIso: string, nowIso: string, noticeHours: number): boolean {
  const hours = (new Date(appointmentIso).getTime() - new Date(nowIso).getTime()) / 3_600_000;
  return hours >= noticeHours;
}

/** 14 days after the goods come into the consumer's possession. */
export function cancellationDeadline(deliveredIso: string): string {
  const date = new Date(deliveredIso);
  date.setUTCDate(date.getUTCDate() + 14);
  return date.toISOString();
}

export function withinCancellation(deliveredIso: string, nowIso: string): boolean {
  return nowIso <= cancellationDeadline(deliveredIso);
}
