import { fail, json, methodNotAllowed, readJson, requireAdmin, str } from '../../_lib/http.js';
import { sendBackInStockEmail } from '../../_lib/mailer.js';
import { listPending, listPendingForVariant, markNotified } from '../../_lib/store.js';

/**
 * POST /api/admin/notify
 *
 * Sends the "back in stock" email to everyone waiting for one variant, then
 * marks those rows as notified so nobody is written to twice.
 * Body: { variantId } — or { variantIds: [...] } to do several at once.
 */
export async function onRequestPost({ request, env }) {
  const denied = requireAdmin(request, env);
  if (denied) {
    return denied;
  }
  if (!env.DB) {
    return fail('D1 binding DB is missing.', 503);
  }

  const body = await readJson(request);
  if (!body) {
    return fail('Send a JSON body.');
  }

  const ids = Array.isArray(body.variantIds)
    ? body.variantIds.map((id) => str(id, 200)).filter(Boolean)
    : [str(body.variantId, 200)].filter(Boolean);

  if (!ids.length) {
    return fail('Pick at least one variant to notify.');
  }

  const now = new Date().toISOString();
  const summary = [];

  for (const variantId of ids) {
    const rows = await listPendingForVariant(env.DB, variantId);
    let sent = 0;
    const failures = [];

    for (const row of rows) {
      try {
        await sendBackInStockEmail(env, {
          to: row.email,
          productTitle: row.product_title || 'Your item',
          variantTitle: row.variant_title,
        });
        sent += 1;
      } catch (error) {
        failures.push({ email: row.email, error: error.message });
      }
    }

    // Only clear the requests we actually managed to email.
    if (sent > 0 && failures.length === 0) {
      await markNotified(env.DB, variantId, now);
    }

    summary.push({
      variantId,
      waiting: rows.length,
      sent,
      failed: failures.length,
      errors: failures.slice(0, 3),
    });
  }

  const stillPending = await listPending(env.DB);

  return json({
    ok: true,
    results: summary,
    remaining: stillPending.length,
  });
}

export async function onRequest({ request }) {
  return methodNotAllowed('POST');
}
