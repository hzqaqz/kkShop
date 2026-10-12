/**
 * Remove build artefacts that vite-ssg writes into dist but that must never be
 * published.
 *
 * dist/.vite/ssr-manifest.json lists every internal module and asset path in the
 * project (111 entries). It is not a secret, but it hands attackers a free map of
 * the codebase — and it was publicly downloadable at
 * https://meowerair.com/.vite/ssr-manifest.json until this ran.
 *
 * Runs as part of `npm run build`, so it also applies to Cloudflare's build.
 * A plain file is used instead of `node -e` because command-line input has
 * version-dependent module-type behaviour, and this build runs on Cloudflare's
 * Node, not on the machine it was written on.
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'dist/.vite');

if (fs.existsSync(target)) {
  fs.rmSync(target, { recursive: true, force: true });
  console.log('[build] 已清理 dist/.vite（内部模块清单，不应发布）');
} else {
  console.log('[build] dist/.vite 不存在，无需清理');
}
