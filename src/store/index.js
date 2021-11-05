import { createStore } from "vuex";

// Modulos
import auth from "./modules/auth";
import groups from "./modules/groups";
import consultations from "./modules/consultations";
import chatRooms from "./modules/chatRooms";
import user from "./modules/user";
import schedule from "./modules/schedule";

import env_vars from "@/static/env_vars.json";

export default createStore({
  modules: {
    auth,
    groups,
    consultations,
    chatRooms,
    user,
    schedule
  },
  state: {
    API_URL: env_vars.VUE_APP_ROOT_API || "http://localhost:8080",
    token: null,
    headers: {
      Authorization: "",
      "Content-Type": "application/json",
    },
    text_filter: "",
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
    setHeaderToken(state, payload) {
      state.headers.Authorization = payload;
    },
    setText(state, payload) {
      state.text_filter = payload;
    },
  },
  actions: {
    searcher({ commit }, payload) {
      commit("setText", payload.toLowerCase());
    },
  },
});
