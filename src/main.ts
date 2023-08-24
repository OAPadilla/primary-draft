import { createApp } from 'vue';
import { createI18n } from "vue-i18n";
import { createMetaManager } from 'vue-meta';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from "./router";
import en from "./locales/en-US.json";

import "./styles/main.scss";

const i18n = createI18n({
    locale: import.meta.env.VITE_DEFAULT_LOCALE,
    fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
    legacy: false,
    messages: { en }
});
const meta = createMetaManager();
const pinia = createPinia()
const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(meta);
app.use(pinia);

app.mount('#app');
