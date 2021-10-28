import { createStore } from "vuex";

// Modulos
import auth from "./modules/auth";
import groups from "./modules/groups";
import consultations from "./modules/consultations";
import chatRooms from "./modules/chatRooms";
import userProfile from "./modules/userProfile";
import schedule from "./modules/schedule";

export default createStore({
  modules: {
    auth,
    groups,
    consultations,
    chatRooms,
    userProfile,
    schedule
  },
  state: {
    API_URL: process.env.VUE_APP_ROOT_API,
    token: null,
    headers: {
      Authorization: "",
      "Content-Type": "application/json",
    },
    text_filter: "",
    lang: "es"
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
    setLang(state,lang){
      state.lang = lang;
    }
  },
  actions: {
    searcher({ commit }, payload) {
      commit("setText", payload.toLowerCase());
    },
  },
});
