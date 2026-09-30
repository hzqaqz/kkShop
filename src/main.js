import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import { routes, scrollBehavior } from './router';
import './styles.css';

// `export const createApp` is required by vite-ssg (replaces `createApp(App).mount('#app')`).
export const createApp = ViteSSG(App, { routes, scrollBehavior });
