/* eslint-disable no-unused-vars */
import axios from "axios";

// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

export default {
  state: {
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
  },
  mutations: {
    setUserData(state, user) {
      state.user.id = user.id;
      state.user.ci = user.ci;
      state.user.name = user.name;
      state.user.nickname = user.nickname;
      state.user.name = user.name;
      state.user.middle_name = user.middle_name;
      state.user.surname = user.surname;
      state.user.second_surname = user.second_surname;
      state.user.email = user.email;
      state.user.avatar = user.avatar != null ? user.avatar : "01-man.svg";
    },
    clearUserData(state) {
      state.user.id = null;
      state.user.ci = null;
      state.user.name = "";
      state.user.nickname = "";
      state.user.name = "";
      state.user.middle_name = "";
      state.user.surname = "";
      state.user.second_surname = "";
      state.user.email = "";
      state.user.avatar = "01-man.svg";

    },
  },
  actions: {
    async getUserData({ rootState, commit }) {
      await axios({
        method: "get",
        url: rootState.API_URL + "/user",
        headers: rootState.headers,
      })
        .then((res) => {
          commit("setUserData", res.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
