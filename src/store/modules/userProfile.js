import axios from "axios";
// Modulo donde manejo las alertas
// eslint-disable-next-line no-unused-vars
import { showAlert } from "@/utils/alerts";
export default {
  state: {
    user: {},
  },
  mutations: {
    setUserData(state, user) {
      state.user = user;
    },
    changeUser(state, edited_user) {
      state.user = { ...edited_user };
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
        nickname: payload.nickname
      }
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
  },
};
