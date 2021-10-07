import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import UserConfiguration from "../views/UserConfiguration.vue";
import Groups from "../views/Groups.vue";
import Group from "../views/Group.vue";
import Schedule from "../views/Schedule.vue";

import ChatRooms from "../views/ChatRooms.vue";
import Consultations from "../views/Consultations.vue";

const routes = [
  { path: "/", redirect: "/inicio" },
  {
    path: "/registro",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/inicio",
    name: "Home",
    component: Home,
    meta: { requireAuth: true },
  },
  {
    path: "/grupos",
    name: "Groups",
    component: Groups,
    meta: { requireAuth: true },
  },
  {
    path: "/grupos/:code",
    name: "Group",
    component: Group,
    meta: { requireAuth: true },
  },
  {
    path: "/consultas",
    name: "Consultations",
    component: Consultations,
    meta: { requireAuth: true },
  },
  {
    path: "/salas-de-chat",
    name: "ChatRooms",
    component: ChatRooms,
    meta: { requireAuth: true },
  },
  {
    path: "/horarios",
    name: "Schedule",
    component: Schedule,
    meta: { requireAuth: true },
  },
  {
    path: "/configuracion",
    name: "UserConfiguration",
    component: UserConfiguration,
    meta: { requireAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    //Acá hay que poner una vista 404
    next("/inicio");
  } else {
    const routeProtected = to.matched.some((record) => record.meta.requireAuth);
    /* let redirectedFrom = to.redirectedFrom; */
    /* console.log(redirectedFrom);
  console.log(to); */
    // Verificando la session en cada ruta
    store.dispatch("syncToken");
    if (routeProtected) {
      store.dispatch("checkSession").then(() => {
        if (store.state.token !== null) {
          //store.dispatch("getConsultations");
          next();
        }
      });
    } else if (to.fullPath == "/login" || to.fullPath == "/registro") {
      if (store.state.token !== null) {
        next({ name: "Home" });
      } else {
        next();
      }
    }
  }
});

export default router;
