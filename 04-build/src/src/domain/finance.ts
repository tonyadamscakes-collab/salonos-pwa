import type { Pence } from "./money";

export type Account =
  | "service"
  | "retail"
  | "discount"
  | "vat"
  | "tip"
  | "tips-payable"
  | "voucher-liability"
  | "deposit-held"
  | "deposit-applied"
  | "deposit-forfeited"
  | "refund"
  | "processor-fee"
  | "over-short"
  | "delivery"
  | "loyalty"
  | "cancellation-fee"
  | "owed-to-renter"
  | "external-card";

export interface PostingLine {
  account: Account;
  amountPence: Pence;
  memo: string;
  ref?: string;
}

export interface FinancePosting {
  id: string;
  siteId: string;
  idempotencyKey: string;
  source: "booking" | "order" | "quick-sale" | "voucher" | "cash-up" | "refund" | "adjustment";
  sourceId: string;
  channel: "shop" | "online";
  status: "pending" | "sent" | "failed" | "retrying";
  attempts: number;
  error: string;
  createdAt: string;
  lines: PostingLine[];
}

/** The v1 adapter writes this payload to the sync log. No accounting credentials. */
export function stubPayload(posting: FinancePosting): string {
  return JSON.stringify({
    adapter: "stub",
    package: "[ACCOUNTING PACKAGE – Tony to choose later]",
    idempotencyKey: posting.idempotencyKey,
    source: posting.source,
    sourceId: posting.sourceId,
    channel: posting.channel,
    lines: posting.lines,
  });
}

export function applyIdempotent<T>(seen: Set<string>, key: string, create: () => T): { created: boolean; value: T | null } {
  if (seen.has(key)) return { created: false, value: null };
  seen.add(key);
  return { created: true, value: create() };
}

export function depositPosting(input: {
  id: string;
  siteId: string;
  bookingId: string;
  amountPence: Pence;
  at: string;
  channel: "shop" | "online";
}): FinancePosting {
  return {
    id: input.id,
    siteId: input.siteId,
    idempotencyKey: `deposit:${input.bookingId}:${input.amountPence}`,
    source: "booking",
    sourceId: input.bookingId,
    channel: input.channel,
    status: "sent",
    attempts: 1,
    error: "",
    createdAt: input.at,
    lines: [{ account: "deposit-held", amountPence: input.amountPence, memo: "Deposit held", ref: input.bookingId }],
  };
}

export function salePosting(input: {
  id: string;
  siteId: string;
  sourceId: string;
  source: "booking" | "order" | "quick-sale";
  channel: "shop" | "online";
  at: string;
  servicePence: Pence;
  retailPence: Pence;
  discountPence: Pence;
  vatPence: Pence;
  tipPence: Pence;
  deliveryPence: Pence;
  depositAppliedPence: Pence;
  promoId: string | null;
}): FinancePosting {
  const lines: PostingLine[] = [];
  if (input.servicePence) lines.push({ account: "service", amountPence: input.servicePence, memo: "Service" });
  if (input.retailPence) lines.push({ account: "retail", amountPence: input.retailPence, memo: "Retail" });
  if (input.discountPence) {
    lines.push({ account: "discount", amountPence: -input.discountPence, memo: "Discount", ref: input.promoId ?? undefined });
  }
  if (input.vatPence) lines.push({ account: "vat", amountPence: input.vatPence, memo: "VAT included in the prices above" });
  if (input.tipPence) lines.push({ account: "tips-payable", amountPence: input.tipPence, memo: "Tip. Not revenue." });
  if (input.deliveryPence) lines.push({ account: "delivery", amountPence: input.deliveryPence, memo: "Delivery" });
  if (input.depositAppliedPence) {
    lines.push({ account: "deposit-applied", amountPence: -input.depositAppliedPence, memo: "Deposit applied" });
  }
  return {
    id: input.id,
    siteId: input.siteId,
    idempotencyKey: `sale:${input.source}:${input.sourceId}`,
    source: input.source,
    sourceId: input.sourceId,
    channel: input.channel,
    status: "sent",
    attempts: 1,
    error: "",
    createdAt: input.at,
    lines,
  };
}
