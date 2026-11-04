import { json, methodNotAllowed, requireAdmin } from '../../_lib/http.js';
import { listPending } from '../../_lib/store.js';

/**
 * GET /api/admin/requests — every restock request still waiting.
 * Auth: `x-admin-token: <ADMIN_TOKEN>` header (or `?token=`).
 */
export async function onRequestGet({ request, env }) {
  const denied = requireAdmin(request, env);
  if (denied) {
    return denied;
  }
  if (!env.DB) {
    return json({ ok: false, error: 'D1 binding DB is missing.' }, 503);
  }

  const rows = await listPending(env.DB);
  return json({
    ok: true,
    count: rows.length,
    requests: rows.map((row) => ({
      id: row.id,
      email: row.email,
      productId: row.product_id,
      productTitle: row.product_title,
      variantId: row.variant_id,
      variantTitle: row.variant_title,
      createdAt: row.created_at,
    })),
  });
}

export async function onRequest({ request }) {
  return methodNotAllowed('GET');
}
