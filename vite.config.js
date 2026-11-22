import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { blogArticles } from './src/data/blogArticles.js';
// Pre-rendered product pages come from `productOrder` — the same list that drives
// the site — so adding a product to `src/data/products.js` is enough and the two
// lists cannot drift apart again.
import { productOrder } from './src/data/products.js';

const REQUIRED_SHOPIFY_VARS = ['VITE_SHOPIFY_STORE_DOMAIN', 'VITE_SHOPIFY_STOREFRONT_TOKEN'];

export default defineConfig(({ mode }) => {
  // `VITE_*` values are inlined at build time, so a deploy that misses them
  // ships a site whose cart silently does nothing. Say it out loud instead.
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const missing = REQUIRED_SHOPIFY_VARS.filter((key) => !env[key]);
  if (missing.length) {
    console.warn(
      `\n[shopify] ⚠️  ${missing.join(', ')} 为空：本次产物里不会有 Add to cart / 购物车按钮。\n` +
        '[shopify]    请检查 .env.production（已提交）或 CI 上的同名环境变量。\n',
    );
  }

  return {
    plugins: [vue()],
    ssgOptions: {
      includedRoutes(paths) {
        // Drop the raw dynamic templates (`/products/:productId`, `/blogs/:slug`)
        // and replace them with the concrete paths.
        const staticPaths = paths.filter((path) => !path.includes(':'));
        const productPaths = productOrder.map((id) => `/products/${id}`);
        const blogPaths = blogArticles.map((article) => `/blogs/${article.slug}`);
        return [...staticPaths, ...productPaths, ...blogPaths];
      },
    },
  };
});
