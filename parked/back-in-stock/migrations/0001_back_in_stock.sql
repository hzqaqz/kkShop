-- Back-in-stock requests collected from the storefront.
-- One row per (email, variant): a shopper asking twice stays one row.

CREATE TABLE IF NOT EXISTS back_in_stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_title TEXT,
  variant_id TEXT NOT NULL,
  variant_title TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  notified_at TEXT,
  UNIQUE (email, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_back_in_stock_variant_pending
  ON back_in_stock (variant_id, notified_at);
