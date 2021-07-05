import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Subjects from "../views/Subjects.vue";
import Orientations from "../views/Orientations.vue";

const routes = [
  { path: "/", redirect: "/inicio" },
  {
    path: "/inicio",
    name: "Home",
    component: Home,
    meta: { requireAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requireAuth: false },
  },
  {
    path: "/materias",
    name: "Subjects",
    component: Subjects,
    meta: { requireAuth: true },
  },
  {
    path: "/orientaciones",
    name: "Orientations",
    component: Orientations,
    meta: { requireAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const routeProtected = to.matched.some((record) => record.meta.requireAuth);
  let redirectedFrom = to.redirectedFrom;
  /* console.log(redirectedFrom);
  console.log(to); */
  if (routeProtected && store.state.token === null) {
    // ruta protegida es true
    // token es nulo true, por ende redirigimos al inicio
    next({ name: "Login" });
  } else if (to.fullPath === "/login" && store.state.token !== null) {
    // En caso contrario sigue...
    next({ name: redirectedFrom != undefined ? redirectedFrom : "Home" });
  } else {
    next();
  }
});

export default router;
