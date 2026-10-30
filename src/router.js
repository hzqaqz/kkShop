import BlogDetailPage from './views/BlogDetailPage.vue';
import BlogListPage from './views/BlogListPage.vue';
import BusinessPage from './views/BusinessPage.vue';
import HomePage from './views/HomePage.vue';
import LegalPage from './views/LegalPage.vue';
import ProductDetailPage from './views/ProductDetailPage.vue';
import ProductListPage from './views/ProductListPage.vue';
import SupportPage from './views/SupportPage.vue';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/products',
    name: 'products',
    component: ProductListPage,
  },
  {
    path: '/products/:productId',
    name: 'product-detail',
    component: ProductDetailPage,
  },
  {
    path: '/business',
    name: 'business',
    component: BusinessPage,
  },
  {
    path: '/blogs',
    name: 'blogs',
    component: BlogListPage,
  },
  {
    path: '/blogs/:slug',
    name: 'blog-detail',
    component: BlogDetailPage,
  },
  {
    path: '/support',
    name: 'support',
    component: SupportPage,
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: LegalPage,
    props: { slug: 'privacy' },
  },
  {
    path: '/refunds',
    name: 'refunds',
    component: LegalPage,
    props: { slug: 'refunds' },
  },
  {
    path: '/terms',
    name: 'terms',
    component: LegalPage,
    props: { slug: 'terms' },
  },
  {
    // `/about` was folded into `/business`. Cloudflare Pages answers it with a
    // 301 from `public/_redirects`; this keeps in-app links and SPA fallbacks
    // (`vite preview`, other hosts) working as well.
    path: '/about',
    redirect: { name: 'business' },
  },
];

export function scrollBehavior(to) {
  if (to.hash) {
    return {
      el: to.hash,
      behavior: 'smooth',
    };
  }

  return { top: 0 };
}
