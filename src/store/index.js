import { createStore } from "vuex";
import router from "@/router/index";
import axios from "axios";

export default createStore({
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
    setUserData(state, user){
      state.user['id']= user.id;
      state.user['ci']= user.ci;
      state.user['name'] = user.name;
      state.user['nickname'] = user.nickname;
      state.user['name'] = user.name;
      state.user['middle_name'] = user.middle_name;
      state.user['surname'] = user.surname;
      state.user['second_surname'] = user.second_surname;
      state.user['email'] = user.email;
      state.user['avatar'] = user.avatar != null ? user.avatar : '01-man.svg';
    },
    clearUserData(state){
      state.user['id']= null;
      state.user['ci']= null
      state.user['name'] = "";
      state.user['nickname'] = "";
      state.user['name'] = "";
      state.user['middle_name'] = "";
      state.user['surname'] = "";
      state.user['second_surname'] = "";
      state.user['email'] = "";
    }
  },
  actions: {
    searcher({ commit }, payload) {
      commit("setText", payload.toLowerCase());
    },
    syncToken({ commit }) {
      if (localStorage.getItem("token")) {
        commit("setToken", localStorage.getItem("token"));
        commit("setHeaderToken", "Bearer " + localStorage.getItem("token"));
      } else {
        commit("setToken", null);
        router.push("login");
      }
    },
    async login({ commit, state }, payload) {
      await axios({
        method: "post",
        url: state.API_URL + "/auth",
        data: payload,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if ("token" in res.data.result) {
            let token = res.data.result.token;
            commit("setToken", token);
            localStorage.setItem("token", token);
            router.push("/inicio"); 
          }else{
            console.log("Error: login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    logout({ commit }) {
      commit("setToken", null);
      commit("clearUserData");
      localStorage.removeItem("token");
      router.push("login");
    },
    async checkSession({ commit, state }) {
      await axios({
        method: "post",
        url: state.API_URL + "/token",
        data: {},
        headers: state.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data != "OK") {
            commit("setToken", null);
            localStorage.removeItem("token");
            router.push("login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
