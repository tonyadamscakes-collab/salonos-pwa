import type { DepositRule, Pence, TierName } from "../domain/money";
import type { Role } from "../domain/access";
import type { Segment } from "../domain/slots";
import type { FinancePosting } from "../domain/finance";
import type { Sealed } from "./crypto";

export const SITE_ID = "site-sample-1";

export interface ServiceRecord {
  id: string;
  siteId: string;
  source: "brief" | "seed" | "salon";
  category: string;
  name: string;
  durationMin: number | null;
  durationText: string;
  durationOptions: number[];
  processingMin: number;
  finishMin: number;
  priceType: "fixed" | "tier" | "quote" | "range" | "monthly";
  basePence: Pence | null;
  rangeMinPence: Pence | null;
  rangeMaxPence: Pence | null;
  patchTest: boolean;
  chemical: boolean;
  under16: boolean;
  depositRule: DepositRule | null;
  qualifiedStaffIds: string[];
  linkedProductIds: string[];
  photoNote: string;
  onlineBookable: boolean;
  active: boolean;
  accepted: boolean;
  location: "salon" | "home" | "event" | "both";
  sourceUrl: string;
  sourceName: string;
  confidence: string;
  contraindications: string;
  minTier: TierName | null;
}

export interface ProductRecord {
  id: string;
  siteId: string;
  source: "brief" | "salon";
  brand: string;
  range: string;
  name: string;
  sku: string;
  ean: string;
  supplierCode: string;
  size: string;
  unit: string;
  packSize: string;
  costPence: Pence | null;
  rrpPence: Pence | null;
  rangeMinPence: Pence | null;
  rangeMaxPence: Pence | null;
  vatFlag: "standard" | "zero" | "exempt" | "unset";
  useType: "retail" | "backbar" | "both";
  channel: "shop" | "online" | "both";
  supplier: string;
  reorderLevel: number;
  safetyBuffer: number;
  notForPost: boolean;
  sealedHygiene: boolean;
  personalised: boolean;
  active: boolean;
  description: string;
  parentId: string | null;
}

export interface StaffRecord {
  id: string;
  siteId: string;
  name: string;
  bio: string;
  tier: TierName;
  staffType: "employed" | "renter";
  colour: string;
  active: boolean;
  commissionServiceBps: number | null;
  commissionRetailBps: number | null;
  settlement: "percent" | "fixed-rent" | "record-only";
  salonShareBps: number | null;
  serviceIds: string[];
  categories: string[];
  hours: { weekday: number; startMin: number; endMin: number; breakStart: number | null; breakEnd: number | null }[];
}

export interface UserRecord {
  id: string;
  siteId: string;
  username: string;
  name: string;
  role: Role;
  staffId: string | null;
  pinHash: string;
  secondFactorHash: string | null;
  active: boolean;
  juniorCanSeeSpend: boolean;
}

export interface ClientRecord {
  id: string;
  siteId: string;
  name: string;
  mobile: string;
  email: string;
  notes: string;
  dob: string | null;
  preferredByCategory: Record<string, string>;
  marketing: { email: boolean; sms: boolean; push: boolean };
  marketingMeta: { channel: string; at: string; version: string; source: string }[];
  photoConsent: boolean;
  healthConsent: boolean;
  member: boolean;
  topics: { promotions: boolean; treatments: boolean; products: boolean; deals: boolean };
  sample: true;
  erased: boolean;
}

export interface BookingLine {
  kind: "service" | "variant" | "addon" | "branded" | "nail-tier" | "retail";
  id: string;
  name: string;
  pence: number;
  minutes: number;
  productId: string | null;
  collect: boolean;
}

export interface BookingRecord {
  id: string;
  siteId: string;
  clientId: string;
  staffId: string;
  status: "pending-payment" | "booked" | "arrived" | "in-service" | "completed" | "no-show" | "cancelled";
  source: "online" | "phone" | "walk-in";
  location: "salon" | "home" | "event";
  address: string;
  postcode: string;
  startMs: number;
  segments: Segment[];
  lines: BookingLine[];
  promoId: string | null;
  discountPence: number;
  totalPence: number;
  depositDuePence: number;
  depositStatus: "not-required" | "unpaid" | "paid" | "failed" | "refunded";
  paymentChoice: "deposit" | "full" | "in-salon";
  cardOnFileAgreed: boolean;
  termsAcceptedAt: string | null;
  agreementId: string | null;
  manufacturerChecked: boolean;
  manufacturerNote: string;
  colourNote: string;
  completionReason: string;
  createdAt: string;
  deviceId: string;
}

export interface LedgerRecord {
  id: string;
  siteId: string;
  at: string;
  idempotencyKey: string;
  bookingId: string | null;
  orderId: string | null;
  clientId: string | null;
  kind:
    | "deposit"
    | "tender"
    | "refund"
    | "tip"
    | "voucher-sale"
    | "voucher-redeem"
    | "paid-in"
    | "paid-out"
    | "no-show"
    | "void";
  method: "cash" | "card" | "external-card" | "voucher" | "loyalty" | "simulated" | "none";
  amountPence: number;
  memo: string;
  ref: string;
  terminalName: string;
  staffId: string | null;
  reason: string;
}

export interface StockRecord {
  id: string;
  siteId: string;
  productId: string;
  location: "retail" | "backbar";
  qty: number;
  unit: "each" | "gram";
  reason: "sale" | "refund" | "goods-in" | "stock-take" | "formula" | "waste" | "transfer-out" | "transfer-in" | "reserve" | "release" | "online-sale" | "return-put-back" | "write-off";
  ref: string;
  at: string;
  note: string;
}

export interface PointsRecord {
  id: string;
  siteId: string;
  clientId: string;
  at: string;
  points: number;
  reason: "earn" | "redeem" | "expire" | "adjust" | "reverse";
  memo: string;
  ref: string;
}

export interface TipLedgerRecord {
  id: string;
  siteId: string;
  at: string;
  bookingId: string | null;
  staffId: string | null;
  amountPence: number;
  method: "card" | "external-card" | "cash" | "direct-cash";
  qualifying: boolean;
  paidAt: string | null;
  rule: string;
}

export interface CommissionRecord {
  id: string;
  siteId: string;
  at: string;
  staffId: string;
  bookingId: string | null;
  kind: "service" | "retail";
  basePence: number;
  amountPence: number;
  salonPence: number;
  renterPence: number;
  reversed: boolean;
}

export interface VoucherRecord {
  id: string;
  siteId: string;
  code: string;
  amountPence: number;
  purchaser: string;
  recipient: string;
  issuedAt: string;
  sample: true;
}

export interface PatchRecord {
  id: string;
  siteId: string;
  clientId: string;
  at: string;
  product: string;
  productClass: string;
  result: "clear" | "reaction";
  by: string;
  superseded: boolean;
}

export interface FormulaRecord {
  id: string;
  siteId: string;
  clientId: string;
  bookingId: string | null;
  at: string;
  lines: { productId: string; name: string; grams: number; wasteGrams: number }[];
  developer: string;
  developerGrams: number;
  notes: string;
  timing: string;
  deducted: boolean;
}

export interface ConsentRecord {
  id: string;
  siteId: string;
  clientId: string;
  at: string;
  version: string;
  kind: "patch" | "photo" | "health" | "marketing" | "terms" | "home" | "card-on-file";
  staffId: string | null;
  signature: string;
  parentName: string;
  text: string;
}

export interface AuditRecord {
  id: string;
  siteId: string;
  at: string;
  actorId: string;
  action: string;
  target: string;
  detail: string;
}

export interface MessageRecord {
  id: string;
  siteId: string;
  at: string;
  channel: "email" | "sms" | "whatsapp" | "push" | "screen";
  to: string;
  subject: string;
  body: string;
  kind: "service" | "marketing";
  status: "held-preview";
  costNote: string;
}

export interface CashupRecord {
  id: string;
  siteId: string;
  dayKey: string;
  closedAt: string | null;
  floatPence: number;
  actualCashPence: number | null;
  expectedCashPence: number | null;
  variancePence: number | null;
  varianceReason: string;
  externalTotals: { terminal: string; countedPence: number }[];
  reopened: boolean;
}

export interface OfferRecord {
  id: string;
  siteId: string;
  name: string;
  type: "percent" | "fixed" | "bogo" | "bundle" | "addon" | "retail-percent" | "off-peak";
  amount: number | null;
  code: string | null;
  automatic: boolean;
  newClientsOnly: boolean;
  membersOnly: boolean;
  minSpendPence: number | null;
  serviceIds: string[];
  startsOn: string | null;
  endsOn: string | null;
  active: boolean;
  referencePriceNote: string;
}

export interface OrderRecord {
  id: string;
  siteId: string;
  clientId: string;
  bookingId: string | null;
  status: string;
  fulfilment: "delivery" | "collect";
  lines: { productId: string; name: string; qty: number; pence: number }[];
  deliveryPence: number | null;
  address: string;
  courier: string;
  tracking: string;
  placedAt: string;
  deliveredAt: string | null;
  promoId: string | null;
  discountPence: number;
  totalPence: number;
  returnNote: string;
  faultNote: string;
}

export interface EnquiryRecord {
  id: string;
  siteId: string;
  kind: "quote" | "wedding" | "home";
  name: string;
  mobile: string;
  email: string;
  detail: string;
  at: string;
  quotePence: number | null;
  status: "open" | "quoted" | "accepted";
  bookingId: string | null;
}

export interface AttentionRecord {
  id: string;
  siteId: string;
  at: string;
  kind: string;
  detail: string;
  phone: string;
  resolved: boolean;
}

export interface BlockRecord {
  id: string;
  siteId: string;
  staffId: string;
  startMs: number;
  endMs: number;
  reason: "break" | "training" | "cleaning" | "travel" | "holiday" | "event";
}

export interface WalkInRecord {
  id: string;
  siteId: string;
  clientName: string;
  serviceId: string;
  at: string;
  status: "waiting" | "seated";
}

export interface Settings {
  siteId: string;
  salonName: string;
  depositPercent: number;
  depositMinimumPence: number;
  noShowFeePence: number | null;
  cancellationNoticeHours: number | null;
  holdMinutes: number | null;
  patchValidityDays: number | null;
  patchRetentionNote: string;
  vatRegistered: boolean;
  vatRateBps: number | null;
  voucherVatTreatment: string;
  tipsPolicy: string;
  softOptIn: boolean;
  smsEnabled: boolean;
  payInSalonRequiresCard: boolean;
  travelOutward: string[];
  travelFeePence: number | null;
  travelMinutes: number;
  shippingRatePence: number | null;
  freeShippingThresholdPence: number | null;
  collectHoldDays: number | null;
  loyaltyTiersOn: boolean;
  pointsExpireMonths: number;
  membershipBenefits: string;
  membershipPricePence: number | null;
  providerEmail: string;
  providerSms: string;
  providerWhatsapp: string;
  accountingPackage: string;
  offlineWriteDeviceId: string;
  printerHost: string;
  declinedTestPolicy: string;
  marginThresholdBps: number;
  testRecipient: string;
  operatorGrantUntil: string | null;
  operatorGrantActor: string | null;
}

export interface RewardRecord {
  id: string;
  name: string;
  points: number;
  benefitPence: number | null;
}

export interface NailTierRecord {
  id: string;
  serviceId: string;
  name: string;
  pricePence: number | null;
  extraMinutes: number | null;
}

export interface BrandedOption {
  id: string;
  serviceIds: string[];
  name: string;
  productId: string | null;
  priceDifferencePence: number | null;
  extraMinutes: number;
}

export interface GrantRecord {
  id: string;
  start: string;
  end: string;
  by: string;
}

export interface ImportLog {
  id: string;
  at: string;
  actorId: string;
  fileName: string;
  created: number;
  updated: number;
  rejected: number;
  snapshot: string;
}

export interface CostChange {
  id: string;
  at: string;
  sku: string;
  from: number | null;
  to: number | null;
}

export interface PrivateState {
  settings: Settings;
  users: UserRecord[];
  staff: StaffRecord[];
  clients: ClientRecord[];
  services: ServiceRecord[];
  products: ProductRecord[];
  bookings: BookingRecord[];
  orders: OrderRecord[];
  ledger: LedgerRecord[];
  stock: StockRecord[];
  points: PointsRecord[];
  tips: TipLedgerRecord[];
  commission: CommissionRecord[];
  vouchers: VoucherRecord[];
  patches: PatchRecord[];
  formulas: FormulaRecord[];
  consents: ConsentRecord[];
  audit: AuditRecord[];
  messages: MessageRecord[];
  finance: FinancePosting[];
  cashups: CashupRecord[];
  offers: OfferRecord[];
  enquiries: EnquiryRecord[];
  attention: AttentionRecord[];
  blocks: BlockRecord[];
  walkins: WalkInRecord[];
  rewards: RewardRecord[];
  nailTiers: NailTierRecord[];
  branded: BrandedOption[];
  grants: GrantRecord[];
  imports: ImportLog[];
  costChanges: CostChange[];
  seenIdempotency: string[];
  privateKeyJwk: JsonWebKey;
}

export interface OccupancyPublic {
  id: string;
  staffId: string;
  startMs: number;
  endMs: number;
  kind: "active" | "block" | "hold";
}

export interface PublicState {
  version: 1;
  salt: string;
  wrappedPrivateKey: { iv: string; ciphertext: string };
  publicKeyJwk: JsonWebKey;
  settings: Pick<
    Settings,
    | "salonName"
    | "depositPercent"
    | "depositMinimumPence"
    | "holdMinutes"
    | "payInSalonRequiresCard"
    | "travelOutward"
    | "travelFeePence"
    | "travelMinutes"
    | "shippingRatePence"
    | "freeShippingThresholdPence"
    | "vatRegistered"
    | "cancellationNoticeHours"
    | "noShowFeePence"
    | "softOptIn"
    | "smsEnabled"
    | "membershipBenefits"
    | "membershipPricePence"
    | "testRecipient"
  >;
  services: ServiceRecord[];
  products: ProductRecord[];
  staff: Pick<StaffRecord, "id" | "name" | "bio" | "tier" | "colour" | "active" | "serviceIds" | "categories" | "hours">[];
  offers: OfferRecord[];
  nailTiers: NailTierRecord[];
  branded: BrandedOption[];
  occupancy: OccupancyPublic[];
  inbox: ({ id: string; at: string } & Sealed)[];
  devicePinSet: true;
}

export interface GuestBooking {
  type: "booking";
  booking: BookingRecord;
  client: ClientRecord;
  consentText: string;
  retailCollect: { productId: string; name: string; pence: number }[];
  deliveryLines: { productId: string; name: string; qty: number; pence: number }[];
  deliveryAddress: string;
}

export interface GuestOrder {
  type: "order";
  order: OrderRecord;
  client: ClientRecord;
}

export interface GuestCommand {
  type: "cancel" | "reschedule" | "return" | "join-club";
  clientId: string;
  bookingId?: string;
  orderId?: string;
  atMs?: number;
  detail: string;
  client?: ClientRecord;
}

export const TERMS_VERSION = "LEG-01 draft 2026-10-31";
export const HOME_TERMS_VERSION = "LEG-22 draft 2026-10-31";
export const SHOP_TERMS_VERSION = "LEG-02 draft 2026-10-31";
