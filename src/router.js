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
    // A Shop category hash filters the listing instead of jumping to a section,
    // so land on the top of the listing (sidebar + products) rather than deep
    // inside the page.
    if (to.name === 'products') {
      // Offset by the live header height: it is ~88px on desktop and ~134px
      // on phones, where the navigation wraps onto a second row.
      const header = document.querySelector('.topbar');
      const headerHeight = header ? header.getBoundingClientRect().height : 88;

      return {
        el: '.shop-layout',
        top: headerHeight + 16,
        behavior: 'smooth',
      };
    }

    return {
      el: to.hash,
      behavior: 'smooth',
    };
  }

  return { top: 0 };
}
