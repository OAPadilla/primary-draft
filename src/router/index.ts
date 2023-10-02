import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
      props: { partyId: 1 }
    },
    {
      path: "/about",
      name: "About",
      component: () => import("../views/AboutView.vue")
    },
    {
      path: "/democratic-primary-map",
      name: "Dem",
      component: () => import("../views/HomeView.vue"),
      props: { partyId: 0 }
    },
    {
      path: "/republican-primary-map",
      name: "Rep",
      component: () => import("../views/HomeView.vue"),
      props: { partyId: 1 }
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFoundView.vue")
    }
  ],
});

export default router;
