/* eslint-disable no-unused-vars */
import axios from "axios";
// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

export default {
  state: {
    consultation: {
      active: false,
      creation_date: "Esperando datos",
      group_name: "Esperando datos",
      id: "Esperando datos",
      state: 1,
      subject_name: "Esperando datos",
      teacher_name: "Esperando datos",
      theme: "Esperando datos asunto",
      body: "Esperando datos descripción",
      messages: [],
    },
    new_message: "",
    new_message_mode: false,
    consultations: [],
  },
  mutations: {
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
    setConsultationStateAnswered(state, id) {
      state.consultations.forEach((consultation) => {
        if (parseInt(consultation.id) == parseInt(id)){
          consultation.state = 2;
        }
      });
    },
    pushMessage(state, message) {
      state.consultation.messages.push(message);
    },
  },
  actions: {
    async getConsultations({ rootState, commit }) {
      await axios({
        method: "get",
        url: rootState.API_URL + "/consulta",
        headers: rootState.headers,
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
    async getConsultation({ rootState, commit, dispatch }, id) {
      let data = `consulta=${id}`;
      await axios({
        method: "get",
        url: rootState.API_URL + `/consulta?${data}`,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (!("result" in res.data)) {
            res.data.messages = [];
            res.data.state = parseInt(res.data.state);
            commit("setConsultation", res.data);
            dispatch("getConsultationMessages", id);
          } else {
            console.log("Error: getConsultation ->" + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async sendConsultationMessage({ rootState, state, commit }, id) {
      let data = {
        consulta: parseInt(id),
        msg: state.new_message,
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/consulta-mensaje",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          commit("toogleNewMessageMode");
          if (!("result" in res.data)) {
            commit("pushMessage", res.data);
          } else {
            alert(res.data.result.error_msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getConsultationMessages({ rootState, commit }, id) {
      let data = `consulta=${id}`;
      await axios({
        method: "get",
        url: rootState.API_URL + `/consulta-mensaje?${data}`,
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            let body = res.data[0].content;
            commit("setConsultationBody", body);
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
  },
};
