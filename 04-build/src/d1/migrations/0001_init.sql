-- SalonOS D1 schema (free tier). Not applied. Do not create the database from this preview.
-- Every salon row carries site_id. v1 uses one site. Money is integer pence.
-- Ledgers are append-only: the adapter inserts and never updates or deletes those rows.

CREATE TABLE site (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  settings_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE staff (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  staff_type TEXT NOT NULL,
  active INTEGER NOT NULL,
  profile_json TEXT NOT NULL
);

CREATE TABLE user_login (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  username TEXT NOT NULL,
  role TEXT NOT NULL,
  staff_id TEXT,
  pin_hash TEXT NOT NULL,
  second_factor_hash TEXT,
  active INTEGER NOT NULL,
  UNIQUE (site_id, username)
);

CREATE TABLE client (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  profile_json TEXT NOT NULL,
  erased INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE service (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  source TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_min INTEGER,
  price_pence INTEGER,
  price_type TEXT NOT NULL,
  active INTEGER NOT NULL,
  accepted INTEGER NOT NULL,
  body_json TEXT NOT NULL
);

CREATE TABLE product (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  name TEXT NOT NULL,
  sku TEXT,
  ean TEXT,
  channel TEXT NOT NULL DEFAULT 'shop',
  rrp_pence INTEGER,
  cost_pence INTEGER,
  active INTEGER NOT NULL,
  body_json TEXT NOT NULL
);

CREATE UNIQUE INDEX product_ean ON product (site_id, ean) WHERE ean IS NOT NULL AND ean != '';
CREATE UNIQUE INDEX product_sku ON product (site_id, sku) WHERE sku IS NOT NULL AND sku != '';

CREATE TABLE booking (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  staff_id TEXT NOT NULL,
  status TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  total_pence INTEGER NOT NULL,
  body_json TEXT NOT NULL
);

CREATE TABLE shop_order (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  status TEXT NOT NULL,
  total_pence INTEGER NOT NULL,
  body_json TEXT NOT NULL
);

CREATE TABLE ledger (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  at TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  booking_id TEXT,
  order_id TEXT,
  kind TEXT NOT NULL,
  method TEXT NOT NULL,
  amount_pence INTEGER NOT NULL,
  memo TEXT NOT NULL,
  UNIQUE (site_id, idempotency_key)
);

CREATE TABLE stock_ledger (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  location TEXT NOT NULL,
  qty REAL NOT NULL,
  unit TEXT NOT NULL,
  reason TEXT NOT NULL,
  ref TEXT NOT NULL,
  at TEXT NOT NULL
);

CREATE TABLE points_ledger (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  at TEXT NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  memo TEXT NOT NULL
);

CREATE TABLE tips_ledger (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  at TEXT NOT NULL,
  staff_id TEXT,
  amount_pence INTEGER NOT NULL,
  qualifying INTEGER NOT NULL,
  body_json TEXT NOT NULL
);

CREATE TABLE commission_ledger (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  at TEXT NOT NULL,
  staff_id TEXT NOT NULL,
  amount_pence INTEGER NOT NULL,
  salon_pence INTEGER NOT NULL,
  renter_pence INTEGER NOT NULL,
  body_json TEXT NOT NULL
);

CREATE TABLE voucher (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  code TEXT NOT NULL,
  amount_pence INTEGER NOT NULL,
  issued_at TEXT NOT NULL,
  UNIQUE (site_id, code)
);

CREATE TABLE patch_test (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  at TEXT NOT NULL,
  result TEXT NOT NULL,
  body_json TEXT NOT NULL
);

CREATE TABLE formula (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  booking_id TEXT,
  body_json TEXT NOT NULL
);

CREATE TABLE consent (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  at TEXT NOT NULL,
  kind TEXT NOT NULL,
  version TEXT NOT NULL,
  body_json TEXT NOT NULL
);

CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  at TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  detail TEXT NOT NULL
);

CREATE TABLE message_log (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  at TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  body TEXT NOT NULL
);

CREATE TABLE finance_outbox (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  status TEXT NOT NULL,
  payload TEXT NOT NULL,
  attempts INTEGER NOT NULL,
  UNIQUE (site_id, idempotency_key)
);

CREATE TABLE cashup (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  day_key TEXT NOT NULL,
  closed_at TEXT,
  body_json TEXT NOT NULL
);

CREATE TABLE offer (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  name TEXT NOT NULL,
  active INTEGER NOT NULL,
  body_json TEXT NOT NULL
);

-- Reserved for a later marketplace. Empty. No preview route writes these.
CREATE TABLE marketplace_listing (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL
);

CREATE TABLE marketplace_contract (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL
);

CREATE TABLE marketplace_payout_run (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL
);

CREATE INDEX booking_staff_start ON booking (site_id, staff_id, start_ms);
CREATE INDEX ledger_booking ON ledger (site_id, booking_id);
CREATE INDEX stock_product ON stock_ledger (site_id, product_id, location);
CREATE INDEX client_mobile ON client (site_id, mobile);
CREATE INDEX service_name ON service (site_id, name);
