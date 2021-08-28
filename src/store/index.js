import { createStore } from "vuex";
import axios from "axios";
import ab from "@/utils/websockets";

// Modulos
import auth from "./modules/auth";
import groups from "./modules/groups";

export default createStore({
  modules: {
    auth,
    groups,
  },
  state: {
    API_URL: process.env.VUE_APP_ROOT_API,
    consultation: {
      creation_date: "Esperando datos",
      group_name: "Esperando datos",
      id: "Esperando datos",
      state: "1",
      subject_name: "Esperando datos",
      teacher_name: "Esperando datos",
      theme: "Esperando datos",
      body: "Esperando datos",
      messages: [],
    },
    new_message: "",
    new_message_mode: false,
    consultations: [],
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
    setConsultations(state, consultations) {
      state.consultations = consultations;
    },
    addConsultation(state, consultation) {
      state.consultations.push(consultation);
    },
    setConsultation(state, consultation) {
      state.consultation = consultation;
    },
    removeConsultation(state, id_consultation) {
      state.consultations.forEach((consultation, index) => {
        if (parseInt(consultation.id) == id_consultation) {
          state.consultations.splice(index, 1);
        }
      });
    },
    setNewMessage(state, message) {
      state.new_message = message;
    },
    toogleNewMessageMode(state) {
      state.new_message_mode = !state.new_message_mode;
    },
    setConsultationBody(state, body) {
      state.consultation.body = body;
    },
    setConsultationMessages(state, messages) {
      state.consultation.messages = messages;
    },
    setConsultationStateAnswered(state) {
      state.consultation.state = 2;
    },
  },
  actions: {
    searcher({ commit }, payload) {
      commit("setText", payload.toLowerCase());
    },
    async syncConsultations({ state, commit }) {
      await axios({
        method: "get",
        url: state.API_URL + "/consulta",
        headers: state.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("setConsultations", res.data);
          } else {
            console.log("Error: syncConsultations ->" + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async sendConsultationMessage(
      { state, dispatch, commit },
      id_consultation
    ) {
      let data = {
        consulta: id_consultation,
        msg: state.new_message,
      };
      await axios({
        method: "post",
        url: state.API_URL + "/consulta-mensaje",
        data: data,
        headers: state.headers,
      })
        .then((res) => {
          commit("toogleNewMessageMode");
          if (res.data == 1) {
            dispatch(
              "getConsultationMessages",
              parseInt(state.consultation.id)
            );
          } else {
            alert(res.data.result.error_msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getConsultationMessages({ state, commit }, id) {
      let data = `consulta=${id}`;
      await axios({
        method: "get",
        url: state.API_URL + `/consulta-mensaje?${data}`,
        headers: state.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            commit("setConsultationBody", res.data[0].content);
            res.data.splice(0, 1);
            commit("setConsultationMessages", res.data);
          } else {
            console.log("Error: getConsultationMessages ->" + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
