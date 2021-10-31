import axios from "axios";
// Modulo donde manejo las alertas
// eslint-disable-next-line no-unused-vars
import { showAlert } from "@/utils/alerts";
export default {
  state: {
    user: {},
    nicknameIsTaken: true,
    emailIsTaken: true,
    ciIsTaken: true,
    ciIsValid: true,
    registration_state: false,
  },
  mutations: {
    setUserData(state, user) {
      state.user = user;
    },
    changeUser(state, edited_user) {
      state.user = { ...edited_user };
    },
    setNickname(state, isTaken) {
      state.nicknameIsTaken = isTaken;
    },
    setEmail(state, isTaken) {
      state.emailIsTaken = isTaken;
    },
    setCi(state, isTaken) {
      state.ciIsTaken = isTaken;
    },
    setCiIsValid(state, isValid) {
      state.ciIsValid = isValid;
    },
    setRegistrationState(state, registration_state) {
      state.registration_state = registration_state;
    },
  },
  actions: {
    async getUserData({ rootState, commit }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/user/getUserById",
        headers: rootState.headers,
      })
        .then((res) => {
          if (!res.data.middle_name) {
            res.data.middle_name = "";
          }
          if (!res.data.second_surname) {
            res.data.second_surname = "";
          }
          commit("setUserData", res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // eslint-disable-next-line no-unused-vars
    async deleteUser({ rootState, dispatch }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/user/delete",
        data: {},
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            dispatch("logout");
            showAlert({
              type: "info",
              message: `Te has dado de baja correctamente`,
            });
          } else {
            console.log(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async editUser({ rootState, commit }, payload) {
      /* payload.id = parseInt(payload.id); */
      let data = {
        avatar: payload.avatar,
        nickname: payload.nickname,
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/user/modify",
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            commit("changeUser", payload);
            showAlert({
              type: "success",
              message: `El usuario ${payload.name} fue modificado correctamente`,
            });
          } else {
            showAlert({
              type: "error",
              message: `Hubo un error, intente nuevamente`,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async validateUserNickname({ rootState, commit }, nickname) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/user/isNicknameTaken",
        data: { nickname },
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data) {
            commit("setNickname", true);
          } else {
            commit("setNickname", false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async validateUserEmail({ rootState, commit }, email) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/user/isEmailTaken",
        data: { email },
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data) {
            commit("setEmail", true);
          } else {
            commit("setEmail", false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async validateUserCiIsTaken({ rootState, commit }, ci) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/user/isCiTaken",
        data: { ci },
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data) {
            commit("setCi", true);
          } else {
            commit("setCi", false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async validateCi({ rootState, commit }, ci) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/user/ciIsValid",
        data: { ci },
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data) {
            commit("setCiIsValid", true);
          } else {
            commit("setCiIsValid", false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createUser({ rootState, commit }, payload) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/user/create",
        data: payload,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data === 1) {
            commit("setRegistrationState", true);
          } else {
            commit("setRegistrationState", false);
            showAlert({
              type: "error",
              message: res.data.result.error_msg,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
