import type { FinancePosting } from "../../domain/finance";
import { expectedCash } from "../../domain/money";
import { londonDayKey } from "../../domain/time";
import type { CommissionRecord, LedgerRecord, PrivateState, TipLedgerRecord } from "../../data/model";
import { CASH_UP_SCHEMA, CASH_UP_SCHEMA_VERSION, cashUpIdempotencyKey, type CashUpLine, type CashUpSource, type DailyCashUpPayload, type OutboxSnapshot } from "./types";

function onDay(iso: string, businessDate: string): boolean {
  return londonDayKey(new Date(iso)) === businessDate;
}

function sum(rows: LedgerRecord[], pred: (row: LedgerRecord) => boolean): number {
  return rows.filter(pred).reduce((total, row) => total + row.amountPence, 0);
}

function ledgerLine(row: LedgerRecord, kind: CashUpLine["kind"], amountPence: number, account: string): CashUpLine {
  return {
    kind,
    account,
    method: row.method,
    amountPence,
    sourceId: row.id,
    idempotencyKey: row.idempotencyKey,
    memo: row.memo,
  };
}

function tipLines(tips: TipLedgerRecord[], ledgerTips: LedgerRecord[]): CashUpLine[] {
  if (tips.length > 0) {
    return tips.map((row) => ({
      kind: "tip" as const,
      account: "tips-payable",
      method: row.method,
      amountPence: row.amountPence,
      sourceId: row.id,
      idempotencyKey: `tip:${row.id}`,
      memo: row.qualifying ? "Tip. Not revenue." : "Direct cash tip. Not salon revenue.",
    }));
  }
  return ledgerTips.map((row) => ledgerLine(row, "tip", row.amountPence, "tips-payable"));
}

function commissionLines(rows: CommissionRecord[]): CashUpLine[] {
  const lines: CashUpLine[] = [];
  for (const row of rows) {
    lines.push({
      kind: "commission",
      account: row.renterPence > 0 ? "owed-to-renter" : "commission",
      method: row.kind,
      amountPence: row.amountPence,
      sourceId: row.id,
      idempotencyKey: `commission:${row.id}`,
      memo: `${row.kind} commission`,
    });
    if (row.reversed) {
      lines.push({
        kind: "commission",
        account: row.renterPence > 0 ? "owed-to-renter" : "commission",
        method: row.kind,
        amountPence: -Math.abs(row.amountPence),
        sourceId: `${row.id}:reversal`,
        idempotencyKey: `commission:${row.id}:reversal`,
        memo: "Commission reversal",
      });
    }
  }
  return lines;
}

function outboxSnapshots(rows: FinancePosting[]): OutboxSnapshot[] {
  return rows.map((row) => ({
    idempotencyKey: row.idempotencyKey,
    source: row.source,
    sourceId: row.sourceId,
    status: row.status,
    lines: row.lines.map((line) => ({ ...line })),
  }));
}

/** Build a new payload. Does not mutate the ledger, the outbox, or a previous payload. */
export function buildDailyCashUp(source: CashUpSource): DailyCashUpPayload {
  const dayLedger = source.ledger.filter((row) => onDay(row.at, source.businessDate));
  const dayTips = source.tips.filter((row) => onDay(row.at, source.businessDate));
  const dayCommission = source.commission.filter((row) => onDay(row.at, source.businessDate));
  const dayOutbox = source.outbox.filter((row) => onDay(row.createdAt, source.businessDate) || row.sourceId === source.businessDate);
  const floatPence = source.cashup?.floatPence ?? 0;
  const expectedCashPence = expectedCash({
    floatPence,
    cashTendersPence: sum(dayLedger, (row) => (row.kind === "tender" || row.kind === "deposit") && row.method === "cash"),
    cashRefundsPence: sum(dayLedger, (row) => row.kind === "refund" && row.method === "cash"),
    cashPaidOutPence: sum(dayLedger, (row) => row.kind === "paid-out"),
    cashPaidInPence: sum(dayLedger, (row) => row.kind === "paid-in"),
  });
  const actualCashPence = source.cashup?.actualCashPence ?? null;
  const variancePence = source.cashup?.variancePence ?? null;
  const lines: CashUpLine[] = [];
  for (const row of dayLedger) {
    if (row.kind === "tender") lines.push(ledgerLine(row, "tender", row.amountPence, "tender"));
    else if (row.kind === "deposit") lines.push(ledgerLine(row, "deposit", row.amountPence, "deposit-held"));
    else if (row.kind === "refund") lines.push(ledgerLine(row, "refund", -Math.abs(row.amountPence), "refund"));
    else if (row.kind === "paid-in") lines.push(ledgerLine(row, "paid-in", row.amountPence, "paid-in"));
    else if (row.kind === "paid-out") lines.push(ledgerLine(row, "paid-out", -Math.abs(row.amountPence), "paid-out"));
  }
  lines.push(...tipLines(dayTips, dayLedger.filter((row) => row.kind === "tip")));
  lines.push(...commissionLines(dayCommission));
  if (variancePence != null) {
    lines.push({
      kind: "over-short",
      account: "over-short",
      method: "cash",
      amountPence: variancePence,
      sourceId: source.cashup?.id ?? source.businessDate,
      idempotencyKey: `cashup:${source.businessDate}`,
      memo: source.cashup?.varianceReason || "Cash-up variance",
    });
  }
  const totals = {
    tendersPence: lines.filter((line) => line.kind === "tender").reduce((total, line) => total + line.amountPence, 0),
    depositsPence: lines.filter((line) => line.kind === "deposit").reduce((total, line) => total + line.amountPence, 0),
    tipsPence: lines.filter((line) => line.kind === "tip").reduce((total, line) => total + line.amountPence, 0),
    refundsPence: lines.filter((line) => line.kind === "refund").reduce((total, line) => total + line.amountPence, 0),
    commissionPence: lines.filter((line) => line.kind === "commission").reduce((total, line) => total + line.amountPence, 0),
    paidInPence: lines.filter((line) => line.kind === "paid-in").reduce((total, line) => total + line.amountPence, 0),
    paidOutPence: lines.filter((line) => line.kind === "paid-out").reduce((total, line) => total + line.amountPence, 0),
    expectedCashPence,
    actualCashPence,
    variancePence,
  };
  return {
    schema: CASH_UP_SCHEMA,
    schemaVersion: CASH_UP_SCHEMA_VERSION,
    idempotencyKey: cashUpIdempotencyKey(source.siteId, source.businessDate, source.sequence),
    siteId: source.siteId,
    businessDate: source.businessDate,
    sequence: source.sequence,
    currency: "GBP",
    timezone: "Europe/London",
    generatedAt: source.generatedAt,
    lines,
    totals,
    outbox: outboxSnapshots(dayOutbox),
  };
}

/** Latest SAMPLE (or live-on-device) business date that already has money rows. Read only. */
export function sourceForPreview(
  data: Pick<PrivateState, "settings" | "ledger" | "finance" | "tips" | "commission" | "cashups">,
  now = new Date(),
): CashUpSource {
  const dates = [
    ...data.ledger.map((row) => londonDayKey(new Date(row.at))),
    ...data.finance.map((row) => londonDayKey(new Date(row.createdAt))),
    ...data.tips.map((row) => londonDayKey(new Date(row.at))),
    ...data.commission.map((row) => londonDayKey(new Date(row.at))),
    ...data.cashups.map((row) => row.dayKey),
  ].sort();
  const businessDate = dates[dates.length - 1] ?? londonDayKey(now);
  const cashup = data.cashups.find((row) => row.dayKey === businessDate && row.closedAt && !row.reopened) ?? null;
  return {
    siteId: data.settings.siteId,
    businessDate,
    sequence: 1,
    generatedAt: now.toISOString(),
    ledger: data.ledger,
    outbox: data.finance,
    tips: data.tips,
    commission: data.commission,
    cashup,
  };
}
