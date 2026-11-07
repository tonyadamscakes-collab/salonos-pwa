import { describe, expect, it } from "vitest";
import adapterSource from "../src/modules/finance-sync/adapter.ts?raw";
import configSource from "../src/modules/finance-sync/config.ts?raw";
import indexSource from "../src/modules/finance-sync/index.ts?raw";
import panelSource from "../src/modules/finance-sync/panel.tsx?raw";
import payloadSource from "../src/modules/finance-sync/payload.ts?raw";
import reconcileSource from "../src/modules/finance-sync/reconcile.ts?raw";
import retrySource from "../src/modules/finance-sync/retry.ts?raw";
import typesSource from "../src/modules/finance-sync/types.ts?raw";
import { expectedCash } from "../src/domain/money";
import { buildSeed } from "../src/data/seed";
import type { CommissionRecord, LedgerRecord, TipLedgerRecord } from "../src/data/model";
import {
  HttpFinanceAdapter,
  HTTP_FINANCE_BLOCKED,
  MockFinanceAdapter,
  buildDailyCashUp,
  cashUpIdempotencyKey,
  defaultFinanceSyncConfig,
  loadFinanceSyncConfig,
  planRetry,
  pushDailyCashUp,
  reconcileCashUp,
  saveFinanceSyncConfig,
  sourceForPreview,
  type CashUpSource,
} from "../src/modules/finance-sync";

const SITE = "site-sample-1";
const DAY = "2026-10-28T12:00:00.000Z";

function ledger(partial: Pick<LedgerRecord, "id" | "kind" | "method" | "amountPence"> & { at?: string; idempotencyKey?: string }): LedgerRecord {
  return {
    id: partial.id,
    siteId: SITE,
    at: partial.at ?? DAY,
    idempotencyKey: partial.idempotencyKey ?? partial.id,
    bookingId: null,
    orderId: null,
    clientId: null,
    kind: partial.kind,
    method: partial.method,
    amountPence: partial.amountPence,
    memo: partial.kind,
    ref: "",
    terminalName: "",
    staffId: "jordan",
    reason: "",
  };
}

function source(rows: LedgerRecord[], extra: Partial<CashUpSource> = {}): CashUpSource {
  return {
    siteId: extra.siteId ?? SITE,
    businessDate: extra.businessDate ?? "2026-10-28",
    sequence: extra.sequence ?? 1,
    generatedAt: extra.generatedAt ?? "2026-10-28T21:00:00.000Z",
    ledger: extra.ledger ?? rows,
    outbox: extra.outbox ?? [],
    tips: extra.tips ?? [],
    commission: extra.commission ?? [],
    cashup: extra.cashup ?? null,
  };
}

const dayRows = [
  ledger({ id: "tender-cash", kind: "tender", method: "cash", amountPence: 12000 }),
  ledger({ id: "tender-card", kind: "tender", method: "card", amountPence: 8000 }),
  ledger({ id: "deposit-sim", kind: "deposit", method: "simulated", amountPence: 1500 }),
  ledger({ id: "refund-cash", kind: "refund", method: "cash", amountPence: 1500 }),
  ledger({ id: "paid-out", kind: "paid-out", method: "cash", amountPence: 2000 }),
  ledger({ id: "paid-in", kind: "paid-in", method: "cash", amountPence: 500 }),
];

describe("finance sync scaffold", () => {
  it("reconciles payload totals to the till cash-up", () => {
    const till = expectedCash({
      floatPence: 5000,
      cashTendersPence: 12000,
      cashRefundsPence: 1500,
      cashPaidOutPence: 2000,
      cashPaidInPence: 500,
    });
    expect(till).toBe(14000);
    const built = source(dayRows, {
      cashup: {
        id: "cashup-1",
        siteId: SITE,
        dayKey: "2026-10-28",
        closedAt: "2026-10-28T21:00:00.000Z",
        floatPence: 5000,
        actualCashPence: 13900,
        expectedCashPence: till,
        variancePence: -100,
        varianceReason: "SAMPLE short",
        externalTotals: [],
        reopened: false,
      },
      outbox: [
        {
          id: "fin-1",
          siteId: SITE,
          idempotencyKey: "sale:booking:booking-sample",
          source: "booking",
          sourceId: "booking-sample",
          channel: "shop",
          status: "sent",
          attempts: 1,
          error: "",
          createdAt: DAY,
          lines: [{ account: "service", amountPence: 8000, memo: "Service" }],
        },
      ],
    });
    const payload = buildDailyCashUp(built);
    const report = reconcileCashUp(built, payload);
    expect(report.matched).toBe(true);
    expect(payload.totals.expectedCashPence).toBe(till);
    expect(payload.totals.variancePence).toBe(-100);
    expect(payload.totals.tendersPence).toBe(20000);
    expect(payload.totals.depositsPence).toBe(1500);
    expect(payload.totals.refundsPence).toBe(-1500);
    expect(report.outboxKeys).toContain("sale:booking:booking-sample");
  });

  it("reuses the idempotency key and does not duplicate a day in the mock", async () => {
    const built = source(dayRows);
    const again = buildDailyCashUp(built);
    expect(again.idempotencyKey).toBe(cashUpIdempotencyKey(SITE, "2026-10-28", 1));
    expect(buildDailyCashUp(built).idempotencyKey).toBe(again.idempotencyKey);
    const mock = new MockFinanceAdapter();
    const config = { ...defaultFinanceSyncConfig(SITE), enabled: true };
    const first = await pushDailyCashUp(config, mock, built);
    const second = await pushDailyCashUp(config, mock, built);
    expect(first.sent && first.created).toBe(true);
    expect(second.sent && second.created).toBe(false);
    expect(mock.postings).toHaveLength(1);
    expect(mock.postings[0]?.idempotencyKey).toBe(again.idempotencyKey);
  });

  it("appends a refund as a negative posting and leaves the earlier payload unchanged", async () => {
    const originalRows = dayRows.filter((row) => row.id !== "refund-cash");
    const original = source(originalRows);
    const firstPayload = buildDailyCashUp(original);
    expect(firstPayload.lines.some((line) => line.kind === "refund")).toBe(false);
    const refund = ledger({ id: "refund-later", kind: "refund", method: "card", amountPence: 800 });
    const corrected = source([...originalRows, refund], { sequence: 2 });
    const secondPayload = buildDailyCashUp(corrected);
    expect(firstPayload.lines.some((line) => line.kind === "refund")).toBe(false);
    expect(secondPayload.lines.find((line) => line.sourceId === "refund-later")?.amountPence).toBe(-800);
    expect(secondPayload.idempotencyKey).not.toBe(firstPayload.idempotencyKey);
    const mock = new MockFinanceAdapter();
    const config = { ...defaultFinanceSyncConfig(SITE), enabled: true };
    await pushDailyCashUp(config, mock, original);
    await pushDailyCashUp(config, mock, corrected);
    expect(mock.postings).toHaveLength(2);
    expect(mock.postings[0]?.lines.some((line) => line.kind === "refund")).toBe(false);
    expect(mock.postings[1]?.totals.refundsPence).toBe(-800);
  });

  it("stays off unless the salon turns it on, and the HTTP adapter does not send", async () => {
    const config = defaultFinanceSyncConfig(SITE);
    expect(config.enabled).toBe(false);
    const mock = new MockFinanceAdapter();
    const blocked = await pushDailyCashUp(config, mock, source(dayRows));
    expect(blocked).toEqual({ sent: false, reason: "OPTIONAL / NOT CONNECTED" });
    expect(mock.postings).toHaveLength(0);
    const store = new Map<string, string>();
    const memory = {
      get: (key: string) => store.get(key) ?? null,
      set: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    expect(loadFinanceSyncConfig(SITE, memory).enabled).toBe(false);
    saveFinanceSyncConfig({ ...config, enabled: true, baseUrl: "https://example.invalid", postingTime: "21:30" }, memory);
    const loaded = loadFinanceSyncConfig(SITE, memory);
    expect(loaded.enabled).toBe(true);
    expect(loaded.baseUrl).toBe("[FINANCE API BASE URL – Tony to set]");
    expect(loaded.postingTime).toBe("21:30");
    await expect(new HttpFinanceAdapter().postCashUp(buildDailyCashUp(source(dayRows)))).rejects.toThrow(HTTP_FINANCE_BLOCKED);
    const sources = [adapterSource, configSource, indexSource, panelSource, payloadSource, reconcileSource, retrySource, typesSource].join("\n");
    expect(sources).not.toMatch(/\bfetch\s*\(/);
    expect(sources).not.toMatch(/XMLHttpRequest/);
    expect(planRetry(1)).toEqual({ status: "retrying", delayMs: 1000, attempts: 1 });
    expect(planRetry(8).status).toBe("failed");
  });

  it("previews the SAMPLE deposit from the seed without posting it", async () => {
    const { privateState } = await buildSeed("device-finance-sync");
    const preview = sourceForPreview(privateState, new Date("2026-11-01T12:00:00.000Z"));
    expect(preview.businessDate).toBe("2026-10-28");
    const payload = buildDailyCashUp(preview);
    expect(payload.lines.some((line) => line.kind === "deposit" && line.amountPence === 1500)).toBe(true);
    expect(defaultFinanceSyncConfig(privateState.settings.siteId).enabled).toBe(false);
    const mock = new MockFinanceAdapter();
    const result = await pushDailyCashUp(defaultFinanceSyncConfig(privateState.settings.siteId), mock, preview);
    expect(result.sent).toBe(false);
    expect(mock.postings).toHaveLength(0);
  });

  it("keeps a reversed commission as an extra negative line", () => {
    const commission: CommissionRecord = {
      id: "com-1",
      siteId: SITE,
      at: DAY,
      staffId: "jordan",
      bookingId: null,
      kind: "service",
      basePence: 10000,
      amountPence: 3500,
      salonPence: 6500,
      renterPence: 0,
      reversed: true,
    };
    const tip: TipLedgerRecord = {
      id: "tip-1",
      siteId: SITE,
      at: DAY,
      bookingId: null,
      staffId: "jordan",
      amountPence: 500,
      method: "card",
      qualifying: true,
      paidAt: null,
      rule: "Named staff member",
    };
    const payload = buildDailyCashUp(source([], { commission: [commission], tips: [tip] }));
    expect(payload.totals.tipsPence).toBe(500);
    expect(payload.totals.commissionPence).toBe(0);
    expect(payload.lines.filter((line) => line.kind === "commission").map((line) => line.amountPence)).toEqual([3500, -3500]);
  });
});
