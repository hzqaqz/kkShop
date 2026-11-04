import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Dev-only stand-in for Cloudflare Pages Functions.
 *
 * It mounts the real handlers from `functions/api/**` behind the Vite dev
 * server so `/api/*` behaves the same locally, using:
 *   - an in-memory D1 look-alike (just the queries this app runs),
 *   - a Resend look-alike that records emails instead of sending them.
 *
 * Nothing here ships to production: Cloudflare Pages deploys `functions/`
 * itself, with a real D1 binding and real secrets.
 */

const ADMIN_TOKEN = process.env.DEV_ADMIN_TOKEN || 'dev-admin-token';

function createMemoryDb() {
  const rows = [];
  let nextId = 1;

  const api = {
    rows,
    prepare(sql) {
      const statement = sql.replace(/\s+/g, ' ').trim().toLowerCase();
      const bound = [];
      const handle = {
        bind(...values) {
          bound.push(...values);
          return handle;
        },
        async run() {
          if (statement.startsWith('insert into back_in_stock')) {
            const [email, productId, productTitle, variantId, variantTitle] = bound;
            const exists = rows.some((row) => row.email === email && row.variant_id === variantId);
            if (!exists) {
              rows.push({
                id: nextId++,
                email,
                product_id: productId,
                product_title: productTitle,
                variant_id: variantId,
                variant_title: variantTitle,
                created_at: new Date().toISOString(),
                notified_at: null,
              });
            }
          }
          if (statement.startsWith('update back_in_stock')) {
            const [when, variantId] = bound;
            for (const row of rows) {
              if (row.variant_id === variantId && !row.notified_at) {
                row.notified_at = when;
              }
            }
          }
          return { success: true };
        },
        async all() {
          if (statement.includes('from back_in_stock')) {
            const pending = rows.filter((row) => !row.notified_at);
            const byVariant = statement.includes('variant_id = ?');
            const scoped = byVariant ? pending.filter((row) => row.variant_id === bound[0]) : pending;
            const sorted = [...scoped].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
            return { results: sorted };
          }
          return { results: [] };
        },
        async first() {
          const { results } = await handle.all();
          return results[0] ?? null;
        },
      };
      return handle;
    },
  };

  return api;
}

const sentEmails = [];

async function fakeResend(url, init) {
  const body = JSON.parse(init.body);
  sentEmails.push({ to: body.to, subject: body.subject, at: new Date().toISOString() });
  console.log(`[dev mail] → ${body.to.join(', ')} · ${body.subject}`);
  return new Response(JSON.stringify({ id: `dev-${sentEmails.length}` }), { status: 200 });
}

export function createDevApi() {
  const env = {
    DB: createMemoryDb(),
    ADMIN_TOKEN,
    RESEND_API_KEY: 'dev-key',
    MAIL_FROM: 'Meower <dev@meowerair.test>',
    SITE_URL: 'http://localhost:5173',
  };

  // Route the mailer to the fake sender.
  globalThis.__DEV_RESEND__ = true;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url.startsWith('https://api.resend.com/')) {
      return fakeResend(url, init ?? {});
    }
    return originalFetch(input, init);
  };

  const routes = [
    { pattern: /^\/api\/back-in-stock$/, loader: () => import('../functions/api/back-in-stock.js'), method: 'onRequestPost' },
    { pattern: /^\/api\/admin\/requests$/, loader: () => import('../functions/api/admin/requests.js'), method: 'onRequestGet' },
    { pattern: /^\/api\/admin\/notify$/, loader: () => import('../functions/api/admin/notify.js'), method: 'onRequestPost' },
  ];

  return {
    env,
    sentEmails,
    routes,
    adminToken: ADMIN_TOKEN,
  };
}

export function devApiPlugin() {
  return {
    name: 'kkshop-dev-api',
    apply: 'serve',
    configureServer(server) {
      const api = createDevApi();

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          next();
          return;
        }

        const url = new URL(req.url, 'http://localhost');
        const route = api.routes.find((entry) => entry.pattern.test(url.pathname));
        if (!route) {
          res.statusCode = 404;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Not found (dev shim)' }));
          return;
        }

        // Body for POSTs.
        let raw = '';
        if (req.method === 'POST') {
          raw = await new Promise((resolveBody) => {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => resolveBody(data));
          });
        }

        const request = new Request(url.toString(), {
          method: req.method,
          headers: Object.fromEntries(
            Object.entries(req.headers).filter(([, value]) => typeof value === 'string'),
          ),
          body: req.method === 'POST' ? raw : undefined,
        });

        const mod = await route.loader();
        const handler = mod[route.method] ?? mod.onRequest;
        try {
          const response = await handler({ request, env: api.env, params: {} });
          res.statusCode = response.status;
          for (const [key, value] of response.headers) {
            res.setHeader(key, value);
          }
          res.end(await response.text());
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: String(error) }));
        }
      });

      server.config.logger.info(
        `\n  ➜  Restock API (dev shim): POST /api/back-in-stock · GET /api/admin/requests · POST /api/admin/notify\n     admin token: ${api.adminToken}\n`,
      );
    },
  };
}
