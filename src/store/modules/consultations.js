/* eslint-disable no-unused-vars */
import axios from "axios";
// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

export default {
  state: {
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
    setConsultationStateAnswered(state) {
      state.consultation.state = 2;
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
  },
};
