import BlogDetailPage from './views/BlogDetailPage.vue';
import BlogListPage from './views/BlogListPage.vue';
import AboutPage from './views/AboutPage.vue';
import HomePage from './views/HomePage.vue';
import ProductDetailPage from './views/ProductDetailPage.vue';
import ProductListPage from './views/ProductListPage.vue';

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
    path: '/about',
    name: 'about',
    component: AboutPage,
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
