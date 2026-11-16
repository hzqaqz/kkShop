import BlogDetailPage from './views/BlogDetailPage.vue';
import BlogListPage from './views/BlogListPage.vue';
import BusinessPage from './views/BusinessPage.vue';
import CartRedirectPage from './views/CartRedirectPage.vue';
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
    path: '/shipping',
    name: 'shipping',
    component: LegalPage,
    props: { slug: 'shipping' },
  },
  {
    /**
     * 稳定的同域购物车入口：读取 localStorage 里的 Shopify 购物车并跳转到
     * 真实结账地址。Google Merchant Center 的 Checkout URL 依赖它
     * （见 views/CartRedirectPage.vue 的注释）。
     *
     * `/cart` 必须是**静态路由**才会被 vite-ssg 预渲染成 200 的 cart.html；
     * 带参数的 `/cart/:id` 只用于兼容 GMC 里 `{id}` 的模板写法，走客户端兜底。
     */
    path: '/cart',
    name: 'cart',
    component: CartRedirectPage,
  },
  {
    path: '/cart/:id',
    component: CartRedirectPage,
  },
  {
    path: '/checkout',
    component: CartRedirectPage,
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
