import { expectedCash } from "../../domain/money";
import { londonDayKey } from "../../domain/time";
import type { CashUpSource, DailyCashUpPayload } from "./types";

export interface ReconciliationReport {
  businessDate: string;
  idempotencyKey: string;
  tillExpectedCashPence: number;
  payloadExpectedCashPence: number;
  matched: boolean;
  refundsAreNegative: boolean;
  outboxKeys: string[];
  notes: string[];
}

/** Compare the payload with the same cash formula the till uses. Does not write. */
export function reconcileCashUp(source: CashUpSource, payload: DailyCashUpPayload): ReconciliationReport {
  const dayLedger = source.ledger.filter((row) => londonDayKey(new Date(row.at)) === source.businessDate);
  const sum = (kind: "tender" | "deposit" | "refund" | "paid-in" | "paid-out", cashOnly: boolean) =>
    dayLedger
      .filter((row) => row.kind === kind && (!cashOnly || row.method === "cash"))
      .reduce((total, row) => total + row.amountPence, 0);
  const tillExpectedCashPence = expectedCash({
    floatPence: source.cashup?.floatPence ?? 0,
    cashTendersPence: sum("tender", true) + sum("deposit", true),
    cashRefundsPence: sum("refund", true),
    cashPaidOutPence: sum("paid-out", false),
    cashPaidInPence: sum("paid-in", false),
  });
  const notes: string[] = [];
  if (payload.totals.expectedCashPence !== tillExpectedCashPence) {
    notes.push("Payload expected cash does not match the till formula.");
  }
  if (source.cashup?.expectedCashPence != null && source.cashup.expectedCashPence !== payload.totals.expectedCashPence) {
    notes.push("Payload expected cash does not match the closed cash-up record.");
  }
  if (source.cashup?.variancePence != null && source.cashup.variancePence !== payload.totals.variancePence) {
    notes.push("Payload variance does not match the closed cash-up record.");
  }
  const refunds = payload.lines.filter((line) => line.kind === "refund");
  const refundsAreNegative = refunds.every((line) => line.amountPence <= 0);
  if (!refundsAreNegative) notes.push("A refund line is not negative.");
  const dayOutboxKeys = source.outbox
    .filter((row) => londonDayKey(new Date(row.createdAt)) === source.businessDate || row.sourceId === source.businessDate)
    .map((row) => row.idempotencyKey);
  const payloadKeys = new Set(payload.outbox.map((row) => row.idempotencyKey));
  for (const key of dayOutboxKeys) {
    if (!payloadKeys.has(key)) notes.push(`Outbox key ${key} is missing from the payload.`);
  }
  return {
    businessDate: source.businessDate,
    idempotencyKey: payload.idempotencyKey,
    tillExpectedCashPence,
    payloadExpectedCashPence: payload.totals.expectedCashPence,
    matched: notes.length === 0,
    refundsAreNegative,
    outboxKeys: payload.outbox.map((row) => row.idempotencyKey),
    notes,
  };
}
