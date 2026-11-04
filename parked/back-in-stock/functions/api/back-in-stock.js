import { fail, isEmail, json, methodNotAllowed, readJson, str } from '../_lib/http.js';
import { addSubscriber } from '../_lib/store.js';

/**
 * POST /api/back-in-stock
 *
 * A shopper asks to be emailed when a sold-out variant is restocked.
 * Body: { email, productId, productTitle, variantId, variantTitle }
 */
export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body) {
    return fail('Send a JSON body.');
  }

  // Simple bot trap: the form ships a hidden field that real people leave empty.
  if (str(body.company, 80)) {
    return json({ ok: true });
  }

  const email = str(body.email, 180).toLowerCase();
  const variantId = str(body.variantId, 200);
  const productId = str(body.productId, 120);

  if (!isEmail(email)) {
    return fail('Please enter a valid email address.');
  }
  if (!variantId || !productId) {
    return fail('Missing product information.');
  }
  if (!env.DB) {
    return fail('The restock list is not configured for this deployment.', 503);
  }

  try {
    await addSubscriber(env.DB, {
      email,
      productId,
      productTitle: str(body.productTitle, 200),
      variantId,
      variantTitle: str(body.variantTitle, 200),
    });
  } catch (error) {
    return fail(`Could not save your request: ${error.message}`, 500);
  }

  return json({ ok: true });
}

export async function onRequest({ request }) {
  return methodNotAllowed('POST');
}
