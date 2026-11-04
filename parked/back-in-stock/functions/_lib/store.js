/**
 * D1 access for the back-in-stock list.
 *
 * The SQL is kept deliberately plain so the local dev shim can understand it
 * without a real database — see `scripts/devApiPlugin.js`.
 */

/** Adds a subscriber; a repeat email for the same variant is silently ignored. */
export async function addSubscriber(db, entry) {
  await db
    .prepare(
      'INSERT INTO back_in_stock (email, product_id, product_title, variant_id, variant_title) VALUES (?, ?, ?, ?, ?) ON CONFLICT (email, variant_id) DO NOTHING',
    )
    .bind(entry.email, entry.productId, entry.productTitle, entry.variantId, entry.variantTitle)
    .run();
}

/** Every request still waiting for a restock, newest first. */
export async function listPending(db) {
  const { results } = await db
    .prepare(
      'SELECT id, email, product_id, product_title, variant_id, variant_title, created_at FROM back_in_stock WHERE notified_at IS NULL ORDER BY created_at DESC',
    )
    .all();
  return results ?? [];
}

export async function listPendingForVariant(db, variantId) {
  const { results } = await db
    .prepare(
      'SELECT id, email, product_id, product_title, variant_id, variant_title, created_at FROM back_in_stock WHERE notified_at IS NULL AND variant_id = ? ORDER BY created_at ASC',
    )
    .bind(variantId)
    .all();
  return results ?? [];
}

export async function markNotified(db, variantId, when) {
  await db
    .prepare('UPDATE back_in_stock SET notified_at = ? WHERE notified_at IS NULL AND variant_id = ?')
    .bind(when, variantId)
    .run();
}
