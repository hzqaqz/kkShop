import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { blogArticles } from './src/data/blogArticles.js';

const PRODUCT_IDS = [
  'mw100',
  'mw200',
  'md001',
  'commercial-dehumidifier',
  'ceiling-mounted-dehumidifier',
];

export default defineConfig({
  plugins: [vue()],
  ssgOptions: {
    includedRoutes(paths) {
      // Drop the raw dynamic templates (`/products/:productId`, `/blogs/:slug`)
      // and replace them with the concrete paths.
      const staticPaths = paths.filter((path) => !path.includes(':'));
      const productPaths = PRODUCT_IDS.map((id) => `/products/${id}`);
      const blogPaths = blogArticles.map((article) => `/blogs/${article.slug}`);
      return [...staticPaths, ...productPaths, ...blogPaths];
    },
  },
});
