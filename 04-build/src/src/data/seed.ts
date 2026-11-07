import { appendixServices, seedTreatmentsFromCsv } from "./catalogue";
import { createWrapPair, randomId, randomSalt, sha256 } from "./crypto";
import type { PrivateState, ProductRecord, PublicState, ServiceRecord, Settings, StaffRecord } from "./model";
import { SITE_ID } from "./model";
import { londonWallToUtc } from "../domain/time";
import csvText from "./treatment-catalogue-seed.csv?raw";

export const SAMPLE_DEVICE_PIN = "2580";

export const SAMPLE_LOGINS: { username: string; pin: string; second: string | null; label: string }[] = [
  { username: "owner", pin: "258013", second: "482913", label: "SAMPLE Owner" },
  { username: "manager", pin: "258014", second: "482914", label: "SAMPLE Manager" },
  { username: "reception", pin: "1111", second: null, label: "SAMPLE Reception" },
  { username: "jordan", pin: "2222", second: null, label: "SAMPLE – Jordan Hale" },
  { username: "casey", pin: "3333", second: null, label: "SAMPLE – Casey Brook" },
  { username: "morgan", pin: "4444", second: null, label: "SAMPLE – Morgan Ellis" },
  { username: "sam", pin: "5555", second: null, label: "SAMPLE – Sam Patel" },
  { username: "alex", pin: "6666", second: null, label: "SAMPLE – Alex Nguyen" },
  { username: "drew", pin: "7777", second: null, label: "SAMPLE – Drew Okonkwo" },
  { username: "riley", pin: "8888", second: null, label: "SAMPLE – Riley Chen" },
];

const week = [1, 2, 3, 4, 5, 6].map((weekday) => ({
  weekday,
  startMin: 9 * 60,
  endMin: 18 * 60,
  breakStart: 13 * 60,
  breakEnd: 13 * 60 + 30,
}));

function staff(): StaffRecord[] {
  const base = (partial: Omit<StaffRecord, "siteId" | "hours" | "active"> & { hours?: StaffRecord["hours"] }): StaffRecord => ({
    siteId: SITE_ID,
    active: true,
    hours: week,
    ...partial,
  });
  return [
    base({
      id: "jordan",
      name: "SAMPLE – Jordan Hale",
      bio: "SAMPLE senior stylist. Fictional. Regular artist for the sample colour client.",
      tier: "senior",
      staffType: "employed",
      colour: "#6e2c3a",
      commissionServiceBps: 4000,
      commissionRetailBps: 1000,
      settlement: "percent",
      salonShareBps: null,
      serviceIds: [],
      categories: ["Hair – Cutting & Styling", "Hair – Colour & Chemical", "Hair – Treatments"],
    }),
    base({
      id: "casey",
      name: "SAMPLE – Casey Brook",
      bio: "SAMPLE stylist. Fictional.",
      tier: "stylist",
      staffType: "employed",
      colour: "#1f4d3a",
      commissionServiceBps: 3000,
      commissionRetailBps: 1000,
      settlement: "percent",
      salonShareBps: null,
      serviceIds: [],
      categories: ["Hair – Cutting & Styling", "Hair – Colour & Chemical", "Hair – Treatments"],
    }),
    base({
      id: "morgan",
      name: "SAMPLE – Morgan Ellis",
      bio: "SAMPLE junior. Spend history is hidden until the owner allows it.",
      tier: "junior",
      staffType: "employed",
      colour: "#8a5a00",
      commissionServiceBps: 0,
      commissionRetailBps: 0,
      settlement: "percent",
      salonShareBps: null,
      serviceIds: [],
      categories: ["Hair – Cutting & Styling"],
    }),
    base({
      id: "riley",
      name: "SAMPLE – Riley Chen",
      bio: "SAMPLE director. Fictional.",
      tier: "director",
      staffType: "employed",
      colour: "#243056",
      commissionServiceBps: 2000,
      commissionRetailBps: 500,
      settlement: "percent",
      salonShareBps: null,
      serviceIds: [],
      categories: ["Hair – Cutting & Styling", "Hair – Colour & Chemical", "Hair – Treatments", "Packages"],
    }),
    base({
      id: "sam",
      name: "SAMPLE – Sam Patel",
      bio: "SAMPLE rent-a-chair stylist. Employment status is the salon's responsibility. SalonOS does not decide it.",
      tier: "stylist",
      staffType: "renter",
      colour: "#5c3d2e",
      commissionServiceBps: null,
      commissionRetailBps: null,
      settlement: "percent",
      salonShareBps: 3000,
      serviceIds: [],
      categories: ["Hair – Cutting & Styling"],
    }),
    base({
      id: "alex",
      name: "SAMPLE – Alex Nguyen",
      bio: "SAMPLE therapist for brows, lashes, waxing and facials. Fictional.",
      tier: "stylist",
      staffType: "employed",
      colour: "#3f5c4b",
      commissionServiceBps: 3500,
      commissionRetailBps: 1000,
      settlement: "percent",
      salonShareBps: null,
      serviceIds: [],
      categories: ["Beauty – Brows & Lashes", "Beauty – Waxing", "Beauty – Facials", "Packages"],
    }),
    base({
      id: "drew",
      name: "SAMPLE – Drew Okonkwo",
      bio: "SAMPLE nail technician. Fictional.",
      tier: "stylist",
      staffType: "employed",
      colour: "#6b4c7a",
      commissionServiceBps: 3500,
      commissionRetailBps: 1000,
      settlement: "percent",
      salonShareBps: null,
      serviceIds: [],
      categories: ["Beauty – Nails"],
    }),
  ];
}

function products(): ProductRecord[] {
  const row = (
    id: string,
    brand: string,
    name: string,
    size: string,
    rrp: number | null,
    range: [number, number] | null,
    channel: ProductRecord["channel"],
    use: ProductRecord["useType"],
    reorder: number,
    notForPost = false,
  ): ProductRecord => ({
    id,
    siteId: SITE_ID,
    source: "brief",
    brand,
    range: "",
    name,
    sku: "",
    ean: "",
    supplierCode: "",
    size,
    unit: use === "backbar" ? "g" : "each",
    packSize: "",
    costPence: null,
    rrpPence: rrp,
    rangeMinPence: range ? range[0] : null,
    rangeMaxPence: range ? range[1] : null,
    vatFlag: "unset",
    useType: use,
    channel,
    supplier: "",
    reorderLevel: reorder,
    safetyBuffer: 0,
    notForPost,
    sealedHygiene: true,
    personalised: false,
    active: true,
    description: "",
    parentId: null,
  });
  return [
    row("r1", "Olaplex", "Olaplex No.3 100ml", "100ml", 3000, null, "both", "retail", 3),
    row("r2", "Olaplex", "Olaplex No.4 Shampoo 250ml", "250ml", 2800, null, "both", "retail", 3),
    row("r3", "Olaplex", "Olaplex No.5 Conditioner 250ml", "250ml", 2800, null, "shop", "retail", 3),
    row("r4", "Olaplex", "Olaplex No.7 Bonding Oil 30ml", "30ml", 2800, null, "shop", "retail", 2),
    row("r5", "K18", "K18 Leave-In Mask 50ml", "50ml", 7000, null, "both", "retail", 2),
    row("r6", "K18", "K18 Oil 30ml", "30ml", 5500, null, "shop", "retail", 2),
    row("r7", "Kérastase", "Kérastase Elixir Ultime 100ml", "100ml", 4200, null, "shop", "retail", 2),
    row("r8", "Redken", "Redken Acidic Bonding Concentrate 300ml", "300ml", 3200, null, "shop", "retail", 2),
    row("r9", "Moroccanoil", "Moroccanoil Treatment 100ml", "100ml", 3900, null, "shop", "retail", 2),
    row("r10", "Color Wow", "Color Wow Dream Coat 200ml", "200ml", 2500, null, "shop", "retail", 2),
    row("r11", "ghd", "ghd Heat Protect 120ml", "120ml", 2000, null, "both", "retail", 2),
    row("r12", "", "Professional shampoo 250ml", "250ml", null, [1400, 1800], "shop", "retail", 4),
    row("r13", "", "Professional conditioner 250ml", "250ml", null, [1400, 1800], "shop", "retail", 4),
    row("r14", "", "Hair mask 200ml", "200ml", null, [2200, 2800], "shop", "retail", 3),
    row("r15", "", "Styling cream/serum", "", null, [1600, 2400], "shop", "retail", 3),
    row("bb-shade", "SAMPLE", "SAMPLE back-bar shade A", "60g", null, null, "shop", "backbar", 1),
    row("bb-dev", "SAMPLE", "SAMPLE developer", "1kg", null, null, "shop", "backbar", 1),
  ];
}

function settings(): Settings {
  return {
    siteId: SITE_ID,
    salonName: "[SALON NAME]",
    depositPercent: 20,
    depositMinimumPence: 1500,
    noShowFeePence: null,
    cancellationNoticeHours: null,
    holdMinutes: 10,
    patchValidityDays: null,
    patchRetentionNote: "[PATCH TEST RETENTION – salon sets]",
    vatRegistered: false,
    vatRateBps: null,
    voucherVatTreatment: "[VOUCHER VAT TREATMENT – adviser to confirm]",
    tipsPolicy: "[TIP POLICY – salon writes]",
    softOptIn: false,
    smsEnabled: false,
    payInSalonRequiresCard: true,
    travelOutward: ["SW1"],
    travelFeePence: null,
    travelMinutes: 30,
    shippingRatePence: null,
    freeShippingThresholdPence: null,
    collectHoldDays: null,
    loyaltyTiersOn: false,
    pointsExpireMonths: 12,
    membershipBenefits: "[MEMBERSHIP BENEFITS – Tony to define]",
    membershipPricePence: null,
    providerEmail: "[EMAIL PROVIDER]",
    providerSms: "[SMS PROVIDER]",
    providerWhatsapp: "[WHATSAPP PROVIDER]",
    accountingPackage: "[ACCOUNTING PACKAGE – Tony to choose later]",
    offlineWriteDeviceId: "desk-sample",
    printerHost: "",
    declinedTestPolicy: "[DECLINED-TEST POLICY]",
    marginThresholdBps: 3000,
    testRecipient: "sample-owner@example.com",
    operatorGrantUntil: null,
    operatorGrantActor: null,
  };
}

export function loadSeedServices(csv = csvText): ServiceRecord[] {
  const brief = appendixServices();
  const seed = seedTreatmentsFromCsv(csv).filter((row) => row.name && !brief.some((item) => item.name === row.name));
  return [...brief, ...seed];
}

export async function buildSeed(deviceId: string): Promise<{ publicState: PublicState; privateState: PrivateState; salt: Uint8Array }> {
  const services = loadSeedServices();
  const people = staff();
  const goods = products();
  const users = [];
  for (const login of SAMPLE_LOGINS) {
    const role =
      login.username === "owner"
        ? "owner"
        : login.username === "manager"
          ? "manager"
          : login.username === "reception"
            ? "reception"
            : login.username === "morgan"
              ? "junior"
              : login.username === "sam"
                ? "renter"
                : "stylist";
    users.push({
      id: `user-${login.username}`,
      siteId: SITE_ID,
      username: login.username,
      name: login.label,
      role: role as PrivateState["users"][number]["role"],
      staffId: ["owner", "manager", "reception"].includes(login.username) ? null : login.username,
      pinHash: await sha256(`pin:${login.pin}`),
      secondFactorHash: login.second ? await sha256(`2fa:${login.second}`) : null,
      active: true,
      juniorCanSeeSpend: false,
    });
  }
  const avery = "client-avery";
  const tomorrow = nextOpenDay();
  const cutStart = londonWallToUtc(tomorrow.year, tomorrow.month, tomorrow.day, 10, 0).getTime();
  const bookingId = "booking-sample-avery";
  const privateState: PrivateState = {
    settings: { ...settings(), offlineWriteDeviceId: deviceId },
    users,
    staff: people,
    clients: [
      {
        id: avery,
        siteId: SITE_ID,
        name: "SAMPLE – Avery Quinn",
        mobile: "07000 900001",
        email: "sample.avery@example.com",
        notes: "SAMPLE client. Prefers Jordan for hair.",
        dob: "1990-04-12",
        preferredByCategory: { "Hair – Cutting & Styling": "jordan", "Hair – Colour & Chemical": "jordan" },
        marketing: { email: true, sms: false, push: false },
        marketingMeta: [{ channel: "email", at: "2026-10-01T10:00:00.000Z", version: "LEG-08", source: "in-shop SAMPLE" }],
        photoConsent: false,
        healthConsent: true,
        member: true,
        topics: { promotions: true, treatments: true, products: false, deals: true },
        sample: true,
        erased: false,
      },
      {
        id: "client-blake",
        siteId: SITE_ID,
        name: "SAMPLE – Blake Rowan",
        mobile: "07000 900002",
        email: "sample.blake@example.com",
        notes: "SAMPLE client with a recorded colour reaction.",
        dob: "1988-08-02",
        preferredByCategory: {},
        marketing: { email: false, sms: false, push: false },
        marketingMeta: [],
        photoConsent: false,
        healthConsent: true,
        member: false,
        topics: { promotions: false, treatments: false, products: false, deals: false },
        sample: true,
        erased: false,
      },
      {
        id: "client-quinn",
        siteId: SITE_ID,
        name: "SAMPLE – Quinn Adeyemi",
        mobile: "07000 900003",
        email: "sample.quinn@example.com",
        notes: "SAMPLE under-16 client. A parent or guardian is required for chemical services.",
        dob: "2012-03-01",
        preferredByCategory: {},
        marketing: { email: false, sms: false, push: false },
        marketingMeta: [],
        photoConsent: false,
        healthConsent: true,
        member: false,
        topics: { promotions: false, treatments: false, products: false, deals: false },
        sample: true,
        erased: false,
      },
      {
        id: "client-rowan",
        siteId: SITE_ID,
        name: "SAMPLE – Rowan Ellis",
        mobile: "07000 900004",
        email: "sample.rowan@example.com",
        notes: "SAMPLE new client. No completed visit.",
        dob: "2001-01-20",
        preferredByCategory: {},
        marketing: { email: false, sms: false, push: false },
        marketingMeta: [],
        photoConsent: false,
        healthConsent: false,
        member: false,
        topics: { promotions: false, treatments: false, products: false, deals: false },
        sample: true,
        erased: false,
      },
    ],
    services,
    products: goods,
    bookings: [
      {
        id: bookingId,
        siteId: SITE_ID,
        clientId: avery,
        staffId: "jordan",
        status: "booked",
        source: "phone",
        location: "salon",
        address: "",
        postcode: "",
        startMs: cutStart,
        segments: [{ kind: "active", minutes: 45 }],
        lines: [{ kind: "service", id: "a1", name: "Ladies Cut & Blow Dry Short", pence: 5040, minutes: 45, productId: null, collect: false }],
        promoId: null,
        discountPence: 0,
        totalPence: 5040,
        depositDuePence: 1500,
        depositStatus: "paid",
        paymentChoice: "deposit",
        cardOnFileAgreed: false,
        termsAcceptedAt: "2026-10-28T09:00:00.000Z",
        agreementId: null,
        manufacturerChecked: false,
        manufacturerNote: "",
        colourNote: "",
        completionReason: "",
        createdAt: "2026-10-28T09:00:00.000Z",
        deviceId,
      },
    ],
    orders: [],
    ledger: [
      {
        id: "led-sample-deposit",
        siteId: SITE_ID,
        at: "2026-10-28T09:00:00.000Z",
        idempotencyKey: "deposit:booking-sample-avery:1500",
        bookingId,
        orderId: null,
        clientId: avery,
        kind: "deposit",
        method: "simulated",
        amountPence: 1500,
        memo: "SAMPLE deposit held",
        ref: "TEST",
        terminalName: "",
        staffId: "jordan",
        reason: "",
      },
    ],
    stock: [
      ...["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15"].map((id, index) => ({
        id: `stk-${id}`,
        siteId: SITE_ID,
        productId: id,
        location: "retail" as const,
        qty: id === "r4" ? 1 : 6 + (index % 3),
        unit: "each" as const,
        reason: "goods-in" as const,
        ref: "SAMPLE opening stock",
        at: "2026-10-20T09:00:00.000Z",
        note: "SAMPLE quantity, not a real delivery",
      })),
      {
        id: "stk-shade",
        siteId: SITE_ID,
        productId: "bb-shade",
        location: "backbar",
        qty: 180,
        unit: "gram",
        reason: "goods-in",
        ref: "SAMPLE",
        at: "2026-10-20T09:00:00.000Z",
        note: "SAMPLE grams",
      },
      {
        id: "stk-dev",
        siteId: SITE_ID,
        productId: "bb-dev",
        location: "backbar",
        qty: 800,
        unit: "gram",
        reason: "goods-in",
        ref: "SAMPLE",
        at: "2026-10-20T09:00:00.000Z",
        note: "SAMPLE grams",
      },
    ],
    points: [
      {
        id: "pts-avery",
        siteId: SITE_ID,
        clientId: avery,
        at: "2026-09-01T15:00:00.000Z",
        points: 72,
        reason: "earn",
        memo: "SAMPLE earlier visit, paid in full",
        ref: "sample-past",
      },
    ],
    tips: [],
    commission: [],
    vouchers: [],
    patches: [
      {
        id: "patch-avery",
        siteId: SITE_ID,
        clientId: avery,
        at: "2026-10-01T11:00:00.000Z",
        product: "SAMPLE colour patch",
        productClass: "colour",
        result: "clear",
        by: "jordan",
        superseded: false,
      },
      {
        id: "patch-blake",
        siteId: SITE_ID,
        clientId: "client-blake",
        at: "2026-09-01T11:00:00.000Z",
        product: "SAMPLE colour patch",
        productClass: "colour",
        result: "reaction",
        by: "jordan",
        superseded: false,
      },
    ],
    formulas: [
      {
        id: "formula-avery",
        siteId: SITE_ID,
        clientId: avery,
        bookingId: null,
        at: "2026-09-01T15:00:00.000Z",
        lines: [{ productId: "bb-shade", name: "SAMPLE back-bar shade A", grams: 40, wasteGrams: 2 }],
        developer: "SAMPLE developer",
        developerGrams: 40,
        notes: "SAMPLE previous formula",
        timing: "30 min",
        deducted: true,
      },
    ],
    consents: [],
    audit: [
      {
        id: randomId(),
        siteId: SITE_ID,
        at: new Date().toISOString(),
        actorId: "seed",
        action: "seed",
        target: SITE_ID,
        detail: "SAMPLE data loaded. Fictional clients and staff. No real customer data.",
      },
    ],
    messages: [],
    finance: [],
    cashups: [],
    offers: [
      {
        id: "sample10",
        siteId: SITE_ID,
        name: "SAMPLE10",
        type: "percent",
        amount: 10,
        code: "SAMPLE10",
        automatic: false,
        newClientsOnly: false,
        membersOnly: false,
        minSpendPence: null,
        serviceIds: [],
        startsOn: null,
        endsOn: null,
        active: true,
        referencePriceNote: "SAMPLE offer so the journey can apply one code. The salon can edit or delete it.",
      },
      {
        id: "gel-offer",
        siteId: SITE_ID,
        name: "Gel manicure offer",
        type: "percent",
        amount: null,
        code: null,
        automatic: true,
        newClientsOnly: false,
        membersOnly: false,
        minSpendPence: null,
        serviceIds: ["a28"],
        startsOn: null,
        endsOn: null,
        active: true,
        referencePriceNote: "Amount is [PRICE] until the salon sets it. No discount is invented.",
      },
    ],
    enquiries: [],
    attention: [],
    blocks: [],
    walkins: [],
    rewards: [
      {
        id: "reward-sample",
        name: "SAMPLE reward",
        points: 100,
        benefitPence: null,
      },
    ],
    nailTiers: [
      { id: "nail-1", serviceId: "a28", name: "Level 1", pricePence: null, extraMinutes: null },
      { id: "nail-2", serviceId: "a28", name: "Level 2", pricePence: null, extraMinutes: null },
      { id: "nail-3", serviceId: "a28", name: "Level 3", pricePence: null, extraMinutes: null },
      { id: "nail-full", serviceId: "a28", name: "Full design", pricePence: null, extraMinutes: null },
    ],
    branded: [
      {
        id: "brand-olaplex",
        serviceIds: ["a10", "a11", "a12", "a13", "a18"],
        name: "Olaplex add-on",
        productId: "r1",
        priceDifferencePence: null,
        extraMinutes: 0,
      },
      {
        id: "brand-k18",
        serviceIds: ["a10", "a11", "a19"],
        name: "K18 add-on",
        productId: "r5",
        priceDifferencePence: null,
        extraMinutes: 0,
      },
    ],
    grants: [],
    imports: [],
    costChanges: [],
    seenIdempotency: ["deposit:booking-sample-avery:1500"],
    privateKeyJwk: {},
  };
  const pair = await createWrapPair();
  privateState.privateKeyJwk = pair.privateJwk;
  const salt = randomSalt();
  const publicState: PublicState = {
    version: 1,
    salt: btoa(String.fromCharCode(...salt)),
    wrappedPrivateKey: { iv: "", ciphertext: "" },
    publicKeyJwk: pair.publicJwk,
    settings: projectSettings(privateState.settings),
    services,
    products: goods,
    staff: people.map((person) => ({
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
    offers: privateState.offers,
    nailTiers: privateState.nailTiers,
    branded: privateState.branded,
    occupancy: [
      { id: bookingId, staffId: "jordan", startMs: cutStart, endMs: cutStart + 45 * 60_000, kind: "active" },
    ],
    inbox: [],
    devicePinSet: true,
  };
  return { publicState, privateState, salt };
}

export function projectSettings(settingsRow: Settings): PublicState["settings"] {
  return {
    salonName: settingsRow.salonName,
    depositPercent: settingsRow.depositPercent,
    depositMinimumPence: settingsRow.depositMinimumPence,
    holdMinutes: settingsRow.holdMinutes,
    payInSalonRequiresCard: settingsRow.payInSalonRequiresCard,
    travelOutward: settingsRow.travelOutward,
    travelFeePence: settingsRow.travelFeePence,
    travelMinutes: settingsRow.travelMinutes,
    shippingRatePence: settingsRow.shippingRatePence,
    freeShippingThresholdPence: settingsRow.freeShippingThresholdPence,
    vatRegistered: settingsRow.vatRegistered,
    cancellationNoticeHours: settingsRow.cancellationNoticeHours,
    noShowFeePence: settingsRow.noShowFeePence,
    softOptIn: settingsRow.softOptIn,
    smsEnabled: settingsRow.smsEnabled,
    membershipBenefits: settingsRow.membershipBenefits,
    membershipPricePence: settingsRow.membershipPricePence,
    testRecipient: settingsRow.testRecipient,
  };
}

function nextOpenDay(): { year: number; month: number; day: number } {
  const now = new Date();
  for (let add = 1; add < 8; add += 1) {
    const date = new Date(now.getTime() + add * 86_400_000);
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
    if (get("weekday") !== "Sun") {
      return { year: Number(get("year")), month: Number(get("month")), day: Number(get("day")) };
    }
  }
  return { year: 2026, month: 11, day: 2 };
}

export { randomId };
