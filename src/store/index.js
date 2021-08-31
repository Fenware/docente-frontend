import { createStore } from "vuex";
import ab from "@/utils/websockets";

// Modulos
import auth from "./modules/auth";
import groups from "./modules/groups";
import consultations from "./modules/consultations";

export default createStore({
  modules: {
    auth,
    groups,
    consultations
  },
  state: {
    API_URL: process.env.VUE_APP_ROOT_API,
    user: {
      id: null,
      ci: null,
      nickname: "",
      name: "",
      middle_name: "",
      surname: "",
      second_surname: "",
      email: "",
      avatar: "01-man.svg",
      type: "teacher",
    },
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
    setUserData(state, user) {
      state.user["id"] = user.id;
      state.user["ci"] = user.ci;
      state.user["name"] = user.name;
      state.user["nickname"] = user.nickname;
      state.user["name"] = user.name;
      state.user["middle_name"] = user.middle_name;
      state.user["surname"] = user.surname;
      state.user["second_surname"] = user.second_surname;
      state.user["email"] = user.email;
      state.user["avatar"] = user.avatar != null ? user.avatar : "01-man.svg";
    },
    clearUserData(state) {
      state.user["id"] = null;
      state.user["ci"] = null;
      state.user["name"] = "";
      state.user["nickname"] = "";
      state.user["name"] = "";
      state.user["middle_name"] = "";
      state.user["surname"] = "";
      state.user["second_surname"] = "";
      state.user["email"] = "";
    },
  },
  actions: {
    searcher({ commit }, payload) {
      commit("setText", payload.toLowerCase());
    },
    wsConnection() {
      var conn = new ab.Session(
        "ws://localhost:8085",
        function() {
          conn.subscribe("kittensCategory", function(topic, data) {
            // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
            console.log(
              'New article published to category "' +
                topic +
                '" : ' +
                data.title
            );
          });
        },
        function() {
          console.warn("WebSocket connection closed");
        },
        { skipSubprotocolCheck: true }
      );
    },
  },
  getters: {
    subjectsFiltered(state) {
      let subjectsFiltered = [];
      state.subjects.forEach((subject) => {
        let name = subject.name.toLowerCase();
        if (name.indexOf(state.text_filter) >= 0) {
          subjectsFiltered.push(subject);
        }
      });
      return subjectsFiltered;
    },
  },
});
