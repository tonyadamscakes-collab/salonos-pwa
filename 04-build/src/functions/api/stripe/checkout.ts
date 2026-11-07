interface Env {
  STRIPE_SECRET_KEY?: string;
}

interface CheckoutBody {
  amountPence?: number;
  reference?: string;
}

const hits = new Map<string, { count: number; reset: number }>();

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const limited = rateLimit(context.request);
  if (limited) return json({ error: "Too many requests" }, 429);
  const key = context.env.STRIPE_SECRET_KEY;
  if (!key) {
    return json({
      mode: "stub",
      banner: "TEST MODE – no real payments",
      message: "No STRIPE_SECRET_KEY. The preview uses the simulated payment in the app.",
    });
  }
  if (!key.startsWith("sk_test_")) {
    return json({ error: "Refusing a non-test Stripe key. Live payments are not allowed." }, 400);
  }
  const body = (await context.request.json().catch(() => ({}))) as CheckoutBody;
  const amount = body.amountPence;
  if (!amount || !Number.isInteger(amount) || amount < 30) {
    return json({ error: "Amount must be integer pence." }, 400);
  }
  const origin = new URL(context.request.url).origin;
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/my?paid=1`);
  params.set("cancel_url", `${origin}/book?cancelled=1`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "gbp");
  params.set("line_items[0][price_data][unit_amount]", String(amount));
  params.set("line_items[0][price_data][product_data][name]", body.reference || "SalonOS test deposit");
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const payload = (await response.json()) as { url?: string; error?: { message?: string } };
  if (!response.ok) return json({ error: payload.error?.message ?? "Stripe test session failed" }, 502);
  return json({ mode: "test", url: payload.url ?? null, banner: "TEST MODE – no real payments" });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-robots-tag": "noindex",
      "cache-control": "no-store",
    },
  });
}

function rateLimit(request: Request): boolean {
  const ip = request.headers.get("cf-connecting-ip") ?? "local";
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || current.reset < now) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 30;
}
