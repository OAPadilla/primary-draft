import { createApp } from 'vue';
// import { createI18n } from 'vue-i18n'
import { createMetaManager } from 'vue-meta';
import { createPinia } from 'pinia';
import i18n from "./i18n";

import App from './App.vue';
import router from "./router";

import "./styles/main.scss";

const meta = createMetaManager();
const pinia = createPinia()
const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(meta);
app.use(pinia);

app.mount('#app');
