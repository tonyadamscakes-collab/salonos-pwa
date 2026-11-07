/** Integer pence. Never use floating pounds for ledger maths. */

export type Pence = number;

export function assertPence(value: number, label = "amount"): Pence {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be integer pence`);
  }
  return value;
}

/** Half-up rounding for positive money. */
export function roundHalfUp(value: number): number {
  if (!Number.isFinite(value)) throw new Error("Amount is not a finite number");
  return Math.sign(value) * Math.round(Math.abs(value));
}

export function formatGBP(pence: Pence): string {
  assertPence(pence);
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export function formatDateUK(iso: string | Date | number): string {
  const date = typeof iso === "string" || typeof iso === "number" ? new Date(iso) : iso;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")}/${get("month")}/${get("year")}`;
}

export function formatTimeUK(iso: string | Date | number): string {
  const date = typeof iso === "string" || typeof iso === "number" ? new Date(iso) : iso;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("hour")}:${get("minute")}`;
}

export function formatDateTimeUK(iso: string | Date | number): string {
  return `${formatDateUK(iso)} ${formatTimeUK(iso)}`;
}

/** Tier multipliers from the locked brief. Editable copies live on the salon. */
export const DEFAULT_TIER_MULTIPLIERS = {
  junior: 0.85,
  stylist: 1,
  senior: 1.2,
  director: 1.4,
} as const;

export type TierName = keyof typeof DEFAULT_TIER_MULTIPLIERS;

export function applyTierMultiplier(basePence: Pence, multiplier: number): Pence {
  assertPence(basePence, "base");
  if (!Number.isFinite(multiplier) || multiplier < 0) throw new Error("Bad multiplier");
  return roundHalfUp(basePence * multiplier);
}

export interface VatSplit {
  netPence: Pence;
  vatPence: Pence;
  grossPence: Pence;
}

/**
 * Prices are VAT-inclusive. rateBps is basis points (2000 = 20%).
 * When the salon is not VAT-registered, callers must not show a VAT line.
 */
export function splitVatInclusive(grossPence: Pence, rateBps: number): VatSplit {
  assertPence(grossPence, "gross");
  if (!Number.isInteger(rateBps) || rateBps < 0) throw new Error("VAT rate must be integer basis points");
  if (rateBps === 0) return { netPence: grossPence, vatPence: 0, grossPence };
  const netPence = roundHalfUp((grossPence * 10000) / (10000 + rateBps));
  return { netPence, vatPence: grossPence - netPence, grossPence };
}

export interface DepositRule {
  /** salon-default uses the salon percentage and minimum. */
  mode: "salon-default" | "greater-of" | "fixed" | "none";
  /** Whole percent, e.g. 20. */
  percent?: number;
  minimumPence?: Pence;
  fixedPence?: Pence;
}

export interface SalonDepositDefault {
  percent: number;
  minimumPence: Pence;
}

/**
 * Deposit is the greater of X% and £Y, never more than the price.
 * A service may set a lower amount, a fixed amount, or zero.
 * Discount is applied by the caller before this function (PRM-04).
 */
export function depositPence(
  pricePence: Pence,
  serviceRule: DepositRule | null,
  salon: SalonDepositDefault,
): Pence {
  assertPence(pricePence, "price");
  assertPence(salon.minimumPence, "minimum");
  if (pricePence < 0) throw new Error("Price cannot be negative");
  const rule: DepositRule =
    !serviceRule || serviceRule.mode === "salon-default"
      ? { mode: "greater-of", percent: salon.percent, minimumPence: salon.minimumPence }
      : serviceRule;
  if (rule.mode === "none") return 0;
  if (rule.mode === "fixed") {
    const fixed = rule.fixedPence ?? 0;
    assertPence(fixed, "fixed deposit");
    return Math.min(pricePence, Math.max(0, fixed));
  }
  const percent = rule.percent ?? 0;
  if (!Number.isFinite(percent) || percent < 0) throw new Error("Deposit percent is invalid");
  const percentPence = roundHalfUp((pricePence * percent) / 100);
  const minimum = rule.minimumPence ?? 0;
  assertPence(minimum, "deposit minimum");
  return Math.min(pricePence, Math.max(percentPence, minimum));
}

export interface NoShowInput {
  /** Fee the salon has set for this case. Editable. */
  requestedPence: Pence;
  depositTakenPence: Pence;
  /** Separate tick, stored with wording version. Not the deposit consent. */
  cardOnFileAgreed: boolean;
  /** Owner override may pass the written policy fee, not the deposit cap, unless card-on-file was agreed. */
  ownerOverride: boolean;
  policyLimitPence: Pence;
}

export interface NoShowResult {
  chargePence: Pence;
  capped: boolean;
  reason: string;
}

/**
 * A no-show or late-cancel charge cannot exceed the deposit already taken
 * unless the client separately agreed a card-on-file charge.
 * A zero deposit with no card-on-file agreement cannot be charged.
 */
export function noShowCharge(input: NoShowInput): NoShowResult {
  assertPence(input.requestedPence, "requested");
  assertPence(input.depositTakenPence, "deposit");
  assertPence(input.policyLimitPence, "policy");
  if (input.requestedPence < 0) throw new Error("Fee cannot be negative");
  if (!input.cardOnFileAgreed && input.depositTakenPence === 0) {
    return {
      chargePence: 0,
      capped: input.requestedPence > 0,
      reason: "No deposit was taken and the client did not agree a card-on-file charge, so no fee can be charged.",
    };
  }
  let cap = input.cardOnFileAgreed ? input.requestedPence : input.depositTakenPence;
  if (!input.ownerOverride) {
    cap = Math.min(cap, input.policyLimitPence);
  } else if (!input.cardOnFileAgreed) {
    cap = Math.min(cap, input.depositTakenPence);
  }
  const chargePence = Math.min(input.requestedPence, cap);
  const capped = chargePence < input.requestedPence;
  const reason = capped
    ? input.cardOnFileAgreed
      ? "Capped at the policy limit. An owner override is required to go above it."
      : "Capped at the deposit already taken. A higher fee needs a separate card-on-file agreement."
    : "Within the deposit and the policy.";
  return { chargePence, capped, reason };
}

export interface CommissionInput {
  /** Price actually earned after discount, VAT-inclusive, in pence. Excludes tips. */
  grossAfterDiscountPence: Pence;
  /** Commission rate in basis points. 4000 = 40%. */
  rateBps: number;
  vatRegistered: boolean;
  /** Required when vatRegistered. Placeholder until the salon sets it. */
  vatRateBps: number | null;
}

export interface CommissionResult {
  basePence: Pence;
  commissionPence: Pence;
}

/**
 * Default base is the net-of-VAT price actually earned after discount
 * when the salon is VAT-registered, otherwise the discounted gross.
 */
export function commissionOn(input: CommissionInput): CommissionResult {
  assertPence(input.grossAfterDiscountPence, "gross");
  if (!Number.isInteger(input.rateBps) || input.rateBps < 0) throw new Error("Commission rate is invalid");
  let base = input.grossAfterDiscountPence;
  if (input.vatRegistered) {
    if (input.vatRateBps == null) throw new Error("VAT rate is not set");
    base = splitVatInclusive(input.grossAfterDiscountPence, input.vatRateBps).netPence;
  }
  return {
    basePence: base,
    commissionPence: roundHalfUp((base * input.rateBps) / 10000),
  };
}

export interface RenterSplitInput {
  grossPence: Pence;
  rule: "percent" | "fixed-rent" | "record-only";
  /** Salon share in basis points when rule is percent. */
  salonShareBps?: number;
}

export function renterSplit(input: RenterSplitInput): { salonPence: Pence; renterPence: Pence } {
  assertPence(input.grossPence, "gross");
  if (input.rule === "record-only") return { salonPence: 0, renterPence: 0 };
  if (input.rule === "fixed-rent") {
    return { salonPence: 0, renterPence: input.grossPence };
  }
  const bps = input.salonShareBps ?? 0;
  if (!Number.isInteger(bps) || bps < 0 || bps > 10000) throw new Error("Salon share is invalid");
  const salonPence = roundHalfUp((input.grossPence * bps) / 10000);
  return { salonPence, renterPence: input.grossPence - salonPence };
}

/** 1 point per £1, fractions round down. Tips are excluded by the caller. */
export function pointsForPayment(paidPenceExcludingTips: Pence): number {
  assertPence(paidPenceExcludingTips, "paid");
  if (paidPenceExcludingTips <= 0) return 0;
  return Math.floor(paidPenceExcludingTips / 100);
}

export function pointsExpire(
  lastActivityIso: string,
  nowIso: string,
): boolean {
  const last = new Date(lastActivityIso).getTime();
  const now = new Date(nowIso).getTime();
  const yearMs = 365.25 * 24 * 60 * 60 * 1000;
  return now - last >= yearMs;
}

export interface TipRecord {
  id: string;
  amountPence: Pence;
  method: "card" | "external-card" | "cash" | "direct-cash";
  staffId: string | null;
}

export interface TipAllocation {
  tipId: string;
  staffId: string;
  amountPence: Pence;
  /** Direct cash given to staff is not an employer tip. */
  qualifying: boolean;
  rule: string;
}

/**
 * Full pass-through. There is no deduction argument: card fees are not taken off tips.
 * Direct-cash tips are labelled and excluded from the payable total.
 * A pool is split equally; leftover pennies go to the earliest staff id.
 */
export function allocateTips(
  tips: TipRecord[],
  poolStaffIds: string[],
  ruleName: string,
): TipAllocation[] {
  const allocations: TipAllocation[] = [];
  for (const tip of tips) {
    assertPence(tip.amountPence, "tip");
    if (tip.amountPence < 0) throw new Error("Tip cannot be negative");
    if (tip.method === "direct-cash") {
      if (!tip.staffId) throw new Error("A direct cash tip needs the staff member who received it");
      allocations.push({
        tipId: tip.id,
        staffId: tip.staffId,
        amountPence: tip.amountPence,
        qualifying: false,
        rule: "Direct cash given to staff. Not part of tips payable.",
      });
      continue;
    }
    if (tip.staffId) {
      allocations.push({
        tipId: tip.id,
        staffId: tip.staffId,
        amountPence: tip.amountPence,
        qualifying: true,
        rule: ruleName,
      });
      continue;
    }
    if (poolStaffIds.length === 0) throw new Error("Pool tip has no staff to share it");
    const ordered = [...poolStaffIds].sort();
    const each = Math.floor(tip.amountPence / ordered.length);
    let leftover = tip.amountPence - each * ordered.length;
    for (const staffId of ordered) {
      const extra = leftover > 0 ? 1 : 0;
      leftover -= extra;
      allocations.push({
        tipId: tip.id,
        staffId,
        amountPence: each + extra,
        qualifying: true,
        rule: ruleName,
      });
    }
  }
  return allocations;
}

export function qualifyingTipsTotal(allocations: TipAllocation[]): Pence {
  return allocations.filter((a) => a.qualifying).reduce((sum, a) => sum + a.amountPence, 0);
}

export interface CashUpInput {
  floatPence: Pence;
  cashTendersPence: Pence;
  cashRefundsPence: Pence;
  cashPaidOutPence: Pence;
  cashPaidInPence: Pence;
}

/** Expected cash = float + cash tenders − cash refunds − cash paid out + cash paid in. */
export function expectedCash(input: CashUpInput): Pence {
  for (const [key, value] of Object.entries(input)) assertPence(value, key);
  return (
    input.floatPence +
    input.cashTendersPence -
    input.cashRefundsPence -
    input.cashPaidOutPence +
    input.cashPaidInPence
  );
}

/** Variance = actual − expected. */
export function cashVariance(actualPence: Pence, expectedPence: Pence): Pence {
  assertPence(actualPence, "actual");
  assertPence(expectedPence, "expected");
  return actualPence - expectedPence;
}

export function redeemVoucher(balancePence: Pence, requestedPence: Pence): { redeemedPence: Pence; remainingPence: Pence } {
  assertPence(balancePence, "balance");
  assertPence(requestedPence, "requested");
  if (requestedPence < 0) throw new Error("Cannot redeem a negative amount");
  if (requestedPence > balancePence) throw new Error("Voucher cannot go below zero");
  return { redeemedPence: requestedPence, remainingPence: balancePence - requestedPence };
}

export interface TenderPart {
  method: "cash" | "card" | "external-card" | "voucher" | "loyalty";
  amountPence: Pence;
}

/** Any mix must equal the bill. Over- and under-payment are refused. */
export function assertTendersMatch(billPence: Pence, tenders: TenderPart[]): void {
  assertPence(billPence, "bill");
  const sum = tenders.reduce((total, tender) => {
    assertPence(tender.amountPence, tender.method);
    if (tender.amountPence < 0) throw new Error("Tender cannot be negative");
    return total + tender.amountPence;
  }, 0);
  if (sum !== billPence) {
    throw new Error(`Tenders ${formatGBP(sum)} do not match the bill ${formatGBP(billPence)}`);
  }
}
