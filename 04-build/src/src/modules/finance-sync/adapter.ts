import { buildDailyCashUp } from "./payload";
import type { FinanceSyncConfig } from "./config";
import type { CashUpSource, DailyCashUpPayload } from "./types";

export interface PostCashUpResult {
  created: boolean;
  payload: DailyCashUpPayload;
}

export interface FinanceSyncAdapter {
  postCashUp(payload: DailyCashUpPayload): Promise<PostCashUpResult>;
}

export type PushResult =
  | { sent: false; reason: "OPTIONAL / NOT CONNECTED" }
  | { sent: true; created: boolean; payload: DailyCashUpPayload };

/**
 * In-memory stand-in. Records a payload once per idempotency key.
 * A second push of the same key returns the stored payload and does not append another row.
 */
export class MockFinanceAdapter implements FinanceSyncAdapter {
  readonly postings: DailyCashUpPayload[] = [];
  private readonly seen = new Map<string, DailyCashUpPayload>();

  async postCashUp(payload: DailyCashUpPayload): Promise<PostCashUpResult> {
    const existing = this.seen.get(payload.idempotencyKey);
    if (existing) return { created: false, payload: existing };
    const copy = structuredClone(payload);
    this.seen.set(copy.idempotencyKey, copy);
    this.postings.push(copy);
    return { created: true, payload: copy };
  }
}

export const HTTP_FINANCE_BLOCKED = "NOT ENABLED: awaiting Tony approval";

/**
 * Stopped on purpose. This class does not open a network connection.
 * A later change that sends data needs Tony's approval after a successful test run.
 */
export class HttpFinanceAdapter implements FinanceSyncAdapter {
  async postCashUp(payload: DailyCashUpPayload): Promise<PostCashUpResult> {
    void payload;
    throw new Error(HTTP_FINANCE_BLOCKED);
  }
}

/** Default config does not call the adapter. */
export async function pushDailyCashUp(
  config: FinanceSyncConfig,
  adapter: FinanceSyncAdapter,
  source: CashUpSource,
): Promise<PushResult> {
  if (!config.enabled) return { sent: false, reason: "OPTIONAL / NOT CONNECTED" };
  const payload = buildDailyCashUp(source);
  const result = await adapter.postCashUp(payload);
  return { sent: true, created: result.created, payload: result.payload };
}
