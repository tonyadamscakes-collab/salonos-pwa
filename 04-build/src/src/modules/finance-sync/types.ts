import type { FinancePosting } from "../../domain/finance";
import type { CashupRecord, CommissionRecord, LedgerRecord, TipLedgerRecord } from "../../data/model";

/** Versioned daily cash-up document. Sequence 1 is the day's first push. A later correction uses the next sequence and a new key. */
export const CASH_UP_SCHEMA = "salonos.cash-up.v1";
export const CASH_UP_SCHEMA_VERSION = 1;

export type CashUpLineKind =
  | "tender"
  | "deposit"
  | "tip"
  | "refund"
  | "commission"
  | "paid-in"
  | "paid-out"
  | "over-short";

export interface CashUpLine {
  kind: CashUpLineKind;
  account: string;
  method: string;
  amountPence: number;
  sourceId: string;
  idempotencyKey: string;
  memo: string;
}

export interface CashUpTotals {
  tendersPence: number;
  depositsPence: number;
  tipsPence: number;
  refundsPence: number;
  commissionPence: number;
  paidInPence: number;
  paidOutPence: number;
  expectedCashPence: number;
  actualCashPence: number | null;
  variancePence: number | null;
}

export interface OutboxSnapshot {
  idempotencyKey: string;
  source: FinancePosting["source"];
  sourceId: string;
  status: FinancePosting["status"];
  lines: FinancePosting["lines"];
}

export interface DailyCashUpPayload {
  schema: typeof CASH_UP_SCHEMA;
  schemaVersion: typeof CASH_UP_SCHEMA_VERSION;
  idempotencyKey: string;
  siteId: string;
  businessDate: string;
  sequence: number;
  currency: "GBP";
  timezone: "Europe/London";
  generatedAt: string;
  lines: CashUpLine[];
  totals: CashUpTotals;
  outbox: OutboxSnapshot[];
}

export interface CashUpSource {
  siteId: string;
  businessDate: string;
  sequence: number;
  generatedAt: string;
  ledger: LedgerRecord[];
  outbox: FinancePosting[];
  tips: TipLedgerRecord[];
  commission: CommissionRecord[];
  cashup: CashupRecord | null;
}

/** One key per salon, business date and sequence. Re-running that triple repeats the key. */
export function cashUpIdempotencyKey(siteId: string, businessDate: string, sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 1) throw new Error("Cash-up sequence starts at 1");
  return `finance-sync:${siteId}:${businessDate}:${sequence}`;
}
