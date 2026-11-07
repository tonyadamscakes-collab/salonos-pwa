/** Attempts after this become failed. The same idempotency key is kept for every retry. */
export const MAX_ATTEMPTS = 8;
const CAP_MS = 5 * 60 * 1000;

/** Delay after a failed attempt: 1s, 2s, 4s… capped at five minutes. */
export function nextRetryDelayMs(attempt: number): number {
  if (!Number.isInteger(attempt) || attempt < 1) throw new Error("Attempt starts at 1");
  return Math.min(CAP_MS, 1000 * 2 ** (attempt - 1));
}

export function planRetry(attempt: number): { status: "retrying" | "failed"; delayMs: number; attempts: number } {
  if (attempt >= MAX_ATTEMPTS) return { status: "failed", delayMs: 0, attempts: attempt };
  return { status: "retrying", delayMs: nextRetryDelayMs(attempt), attempts: attempt };
}
