import { createApp } from 'vue';
import { createHead } from '@unhead/vue'
import { createI18n } from "vue-i18n";
import { createPinia } from 'pinia';

import App from './App.vue';
import router from "./router";
import en from "./locales/en-US.json";

import "./styles/main.scss";

const head = createHead();
const i18n = createI18n({
    locale: import.meta.env.VITE_DEFAULT_LOCALE,
    fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
    legacy: false,
    messages: { en }
});
const pinia = createPinia()
const app = createApp(App);

app.use(head);
app.use(i18n);
app.use(router);
app.use(pinia);

app.mount('#app');
