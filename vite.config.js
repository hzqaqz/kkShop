import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { blogArticles } from './src/data/blogArticles.js';

const PRODUCT_IDS = [
  'mw200',
  'christmas-pet-bed',
  'triangle-cat-bed',
  'pom-pom-cat-toy',
  'car-pet-seat',
  'pet-stroller',
  'cat-scratcher-frame',
  'sisal-cat-scratcher',
  'commercial-air-purifier',
  'md001',
  'md002',
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
