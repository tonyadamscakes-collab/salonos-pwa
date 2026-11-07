interface Env {
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
}

/** Idempotency is enforced in the app ledger. Without D1 this endpoint only acknowledges test events. */
const seen = new Set<string>();

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const secret = context.env.STRIPE_WEBHOOK_SECRET;
  const key = context.env.STRIPE_SECRET_KEY;
  if (key && !key.startsWith("sk_test_")) {
    return json({ error: "Refusing a non-test Stripe key." }, 400);
  }
  if (!secret) {
    return json({
      mode: "stub",
      message: "No webhook secret. The preview applies each simulated payment once in the browser ledger.",
    });
  }
  const payload = await context.request.text();
  const signature = context.request.headers.get("stripe-signature") ?? "";
  const ok = await verify(payload, signature, secret);
  if (!ok) return json({ error: "Bad signature" }, 400);
  const event = JSON.parse(payload) as { id?: string };
  if (!event.id) return json({ error: "Missing event id" }, 400);
  if (seen.has(event.id)) return json({ received: true, duplicate: true });
  seen.add(event.id);
  return json({ received: true, duplicate: false, note: "Attach D1 before this can post the salon ledger." });
};

async function verify(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(header.split(",").map((part) => part.split("=") as [string, string]));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const hex = [...new Uint8Array(mac)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (hex.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i += 1) diff |= hex.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "no-store" },
  });
}
