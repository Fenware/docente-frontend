import { createStore } from "vuex";
import router from "@/router/index";
import axios from "axios";

export default createStore({
  state: {
    API_URL: process.env.VUE_APP_ROOT_API,
    subjects: [],
    orientations: [],
    orientations_subjects: [],
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
    setSubjects(state, subjects) {
      state.subjects = subjects;
    },
    addSubject(state, subject) {
      console.log(subject);
      state.subjects.push(subject);
    },
    changeSubjectName(state, subject) {
      state.subjects.forEach((item) => {
        if (item.id == subject.id) {
          item.name = subject.name;
        }
      });
    },
    deleteSubject(state, subject) {
      state.subjects.forEach((item) => {
        if (item.id == subject.id) {
          item.state = 0;
        }
      });
    },
    setText(state, payload) {
      state.text_filter = payload;
    },
    setOrientations(state, payload) {
      console.log(payload);
      state.orientations = payload;
    },
    addOrientation(state, orientation) {
      state.orientations.push(orientation);
    },
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
          let token = res.data.result.token;
          commit("setToken", token);
          localStorage.setItem("token", token);
          router.push("/inicio");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async syncSubjects({ commit, state }) {
      await axios({
        method: "get",
        url: state.API_URL + "/materia",
        headers: state.headers,
      })
        .then((res) => {
          commit("setSubjects", res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createSubject({ commit, state }, subject) {
      await axios({
        method: "post",
        url: state.API_URL + "/materia",
        data: subject,
        headers: state.headers,
      })
        .then((res) => {
          subject.id = parseInt(res.data);
          console.log(subject);
          commit("addSubject", subject);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async removeSubject({ commit, state }, subject) {
      await axios({
        method: "delete",
        url: state.API_URL + "/materia",
        data: subject,
        headers: state.headers,
      }) // eslint-disable-next-line
        .then((res) => {
          commit("deleteSubject", subject);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async editSubject({ commit, state }, subject) {
      await axios({
        method: "put",
        url: state.API_URL + "/materia",
        data: subject,
        headers: state.headers,
      })
        .then((res) => {
          console.log(res);
          commit("changeSubjectName", subject);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    logout({ commit }) {
      commit("setToken", null);
      localStorage.removeItem("token");
      router.push("login");
    },
    async checkSession({ state }) {
      await axios({
        method: "post",
        url: state.API_URL + "/token",
        data: {},
        headers: state.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data != "OK") {
            router.push("login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async syncOrientations({ commit, state }) {
      await axios({
        method: "get",
        url: state.API_URL + "/orientacion",
        headers: state.headers,
      })
        .then((res) => {
          commit("setOrientations", res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // eslint-disable-next-line
    async getOrientationSubjects({ state }, id) {
      var data_orientation = { "id": 1 };
      /* await axios
        .get(state.API_URL + "/orientacion-materia", {
          params: data_orientation,
        },state.headers)
        .then((res) => {
          console.log(res);
        }); */
      
      await axios({
        method: "get",
        url: state.API_URL + "/orientacion-materia",
        params: data_orientation,
        data: data_orientation,
        headers: state.headers,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createOrientation({ state }) {
      var prueba = {
        name: "Desarrollo y Soporte",
        year: 1,
        subjects: [1, 2, 3],
      };
      await axios({
        method: "post",
        url: state.API_URL + "/orientacion",
        data: prueba,
        headers: state.headers,
      })
        .then((res) => {
          console.log(res);
          /* commit("setSubjects", res.data); */
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
