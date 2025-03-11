import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import axios from "axios";

// Set axios defaults
axios.defaults.withCredentials = true;

// Create router
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("./views/Login.vue"),
  },
  {
    path: "/admin/dashboard",
    component: () => import("./views/AdminDashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/not-authorized",
    component: () => import("./views/NotAuthorized.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/current-user",
        {
          withCredentials: true,
        }
      );
      if (response.data && response.data.isAuthenticated) {
        next();
      } else {
        next("/login");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      next("/login");
    }
  } else {
    next();
  }
});

const app = createApp(App);
app.use(router);
app.mount("#app");
