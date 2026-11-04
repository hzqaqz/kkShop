/**
 * Small helpers shared by the Pages Functions in `functions/api/**`.
 *
 * Everything here is Web-standard (Request/Response) so the same handlers run
 * on Cloudflare Pages and in the local dev shim (`scripts/devApiPlugin.js`).
 */

export const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export function fail(message, status = 400, extra = {}) {
  return json({ ok: false, error: message, ...extra }, status);
}

export function methodNotAllowed(allow = 'POST') {
  return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
    status: 405,
    headers: { ...JSON_HEADERS, allow },
  });
}

/** Reads a JSON body, tolerating an empty one. */
export async function readJson(request) {
  try {
    const text = await request.text();
    if (!text) {
      return {};
    }
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Trimmed, length-limited string. */
export function str(value, max = 200) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().slice(0, max);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value) {
  return typeof value === 'string' && value.length <= 180 && EMAIL.test(value.trim());
}

/** Admin endpoints accept the token as a header (fetch) or a query param. */
export function isAdmin(request, env) {
  const expected = env.ADMIN_TOKEN;
  if (!expected) {
    return false;
  }
  const header = request.headers.get('x-admin-token') ?? '';
  const url = new URL(request.url);
  const token = header || url.searchParams.get('token') || '';
  return token === expected;
}

export function requireAdmin(request, env) {
  if (!env.ADMIN_TOKEN) {
    return fail('ADMIN_TOKEN is not configured for this deployment.', 503);
  }
  if (!isAdmin(request, env)) {
    return fail('Unauthorised.', 401);
  }
  return null;
}
