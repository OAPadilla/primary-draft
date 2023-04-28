import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue")
    },
    {
      path: "/republican-primary-map",
      name: "gop",
      component: () => import("../views/HomeView.vue"),
      props: route => ({ ...route.params, party: 'republican'})
    },
    {
      path: "/democratic-primary-map",
      name: "dem",
      component: () => import("../views/ComingSoonView.vue"),
      props: route => ({ ...route.params, party: 'democratic'})
    }
  ],
});

export default router;
