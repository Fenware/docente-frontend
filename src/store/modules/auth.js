import axios from "axios";
import router from "@/router/index";

// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

export default {
  actions: {
    syncToken({ commit }) {
      if (localStorage.getItem("token")) {
        commit("setToken", localStorage.getItem("token"));
        commit("setHeaderToken", "Bearer " + localStorage.getItem("token"));
      }
    },
    logout({ commit }) {
      // La variable token la seteo a null
      commit("setToken", null);
      commit("setHeaderToken", "");
      // Quito el valor del localStorage
      localStorage.removeItem("token");
      // Redirecciono al login
      router.push("login");
    },
    // Funcion para verificar si la sesion esta bien
    async checkSession({ rootState, dispatch }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/token",
        data: {},
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          // Si res.data no es "OK" significa que la sesion expiró o el token esta mal o no hay token
          if (res.data != "OK") {
            // LLamo a la funcion logout
            dispatch("logout");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async login({ rootState, commit, dispatch }, user) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/auth",
        data: user,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          // Si el token es un string significa que es correcto
          if (typeof res.data.result.token == "string") {
            let token = res.data.result.token;
            // Le meto el token a la variable del state
            commit("setToken", token);
            // Añado el item token al localStorage para guardarlo en el navegador
            localStorage.setItem("token", token);
            // Sincronizo el token y los headers
            dispatch("syncToken");
            // Redirigo al inicio
            router.push("/inicio");
          } else {
            showAlert({type: "error", message: res.data.result.error_msg});
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
