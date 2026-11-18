import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import { routes, scrollBehavior } from './router';
import { initAnalytics } from './composables/useAnalytics';
import './styles.css';

// `export const createApp` is required by vite-ssg (replaces `createApp(App).mount('#app')`).
// 第三个参数是挂载后执行的钩子：埋点只在这里初始化一次。没配 provider 时
// initAnalytics 直接返回，本地开发和 CI 构建不会发出任何统计请求。
export const createApp = ViteSSG(App, { routes, scrollBehavior }, ({ router }) => {
  initAnalytics(router);
});
