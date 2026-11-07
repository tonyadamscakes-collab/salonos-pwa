interface Env {
  STRIPE_SECRET_KEY?: string;
  DB?: unknown;
}

export const onRequestGet = (context: { env: Env }): Response => {
  return Response.json(
    {
      ok: true,
      preview: true,
      payments: "test-or-stub",
      persistence: context.env.DB ? "d1-binding-present" : "browser-indexeddb",
      stripe: stripeMode(context.env.STRIPE_SECRET_KEY),
    },
    { headers: securityHeaders() },
  );
};

function stripeMode(key: string | undefined): string {
  if (!key) return "stub";
  if (key.startsWith("sk_test_")) return "test";
  return "refused";
}

export function securityHeaders(): HeadersInit {
  return {
    "content-type": "application/json; charset=utf-8",
    "x-robots-tag": "noindex",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "cache-control": "no-store",
  };
}
