import { createApp } from 'vue';
import { createMetaManager } from 'vue-meta'
import { createPinia } from 'pinia'

import App from './App.vue';
import router from "./router";

import "./styles/main.scss";

const meta = createMetaManager();
const pinia = createPinia()
const app = createApp(App);

app.use(router);
app.use(meta);
app.use(pinia);

app.mount('#app');
