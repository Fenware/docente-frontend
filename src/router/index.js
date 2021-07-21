import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Subjects from "../views/Subjects.vue";
import Configuration from "../views/Configuration.vue";
import Groups from "../views/Groups.vue";

const routes = [
  { path: "/", redirect: "/inicio" },
  {
    path: "/registro",
    name: "Register",
    component: Register
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/inicio",
    name: "Home",
    component: Home,
    meta: { requireAuth: true },
  },
  {
    path: "/tomar-materias",
    name: "Subjects",
    component: Subjects,
    meta: { requireAuth: true },
  },
  {
    path: "/tomar-grupos",
    name: "Groups",
    component: Groups,
    meta: { requireAuth: true },
  },
  {
    path: "/configuracion",
    name: "Configuration",
    component: Configuration,
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
  if (routeProtected) {
    if(store.state.token === null){
      next({ name: "Login" });
      console.log('Ruta protegida, token null');
    }else{
      next();
    }
    // ruta protegida es true
    // token es nulo true, por ende redirigimos al inicio
  } else if ((to.fullPath === "/login" || to.fullPath === "/registro") && store.state.token !== null) {
    // En caso contrario sigue...
    next({ name: redirectedFrom != undefined ? redirectedFrom : "Home" });
  } else {
    next();
  }
});

export default router;
