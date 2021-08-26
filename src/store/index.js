import { createStore } from "vuex";
import axios from "axios";
import ab from "@/utils/websockets";

// Modulos
import auth from "./modules/auth";

export default createStore({
  modules:{
    auth
  },
  state: {
    API_URL: process.env.VUE_APP_ROOT_API,
    groups: [],
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
    subjects: [],
    subjects_selected: [],
    subjects_taken: [],
    orientations: [],
    orientations_subjects: [],
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
    setOrientations(state, payload) {
      state.orientations = payload;
    },
    setSubjects(state, subjects) {
      state.subjects = [];
      state.subjects = subjects;
    },
    clearOrientationSubjects(state) {
      state.orientations_subjects = [];
    },
    setOrientationSubject(state, payload) {
      state.orientations_subjects.push(payload);
    },
    clearGroups(state) {
      state.groups = [];
    },
    addGroup(state, group) {
      state.groups.push(group);
    },
    removeGroup(state, id) {
      state.groups.forEach((group, index) => {
        if (parseInt(group.id_group) == id) {
          state.groups.splice(index, 1);
        }
      });
    },
    onlySelectGroupSubject(state, id) {
      state.subjects_selected.push(id);
    },
    onlyDeleteGroupSubject(state, id) {
      state.subjects_selected.forEach((subject_id, index) => {
        if (subject_id == id) {
          state.subjects_selected.splice(index, 1);
        }
      });
    },
    setPreselectedGroupSubjects(state, payload) {
      state.subjects_selected = payload;
    },
    setSubjectsTaken(state, subjects) {
      state.subjects_taken = subjects;
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
    async getOrientationSubjects({ state, commit }, id) {
      let data = `id=${id}`;
      await axios({
        method: "get",
        url: state.API_URL + `/orientacion-materia?${data}`,
        headers: state.headers,
      })
        .then((res) => {
          let orientation_subjects_res = [];

          res.data.forEach((subject_data) => {
            orientation_subjects_res.push(subject_data);
          });

          orientation_subjects_res.forEach((orientation_subject) => {
            state.subjects.forEach((subject_data) => {
              if (orientation_subject.id_subject == parseInt(subject_data.id)) {
                let subject = {
                  id_orientation: parseInt(orientation_subject.id_orientation),
                  id_subject: parseInt(orientation_subject.id_subject),
                  name: subject_data.name,
                };
                commit("setOrientationSubject", subject);
              }
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async syncOrientations({ commit, dispatch, state }) {
      await axios({
        method: "get",
        url: state.API_URL + "/orientacion",
        headers: state.headers,
      })
        .then((res) => {
          commit("setOrientations", res.data);
          dispatch("syncOrientationSubjects");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    syncOrientationSubjects({ dispatch, commit, state }) {
      commit("clearOrientationSubjects");
      state.orientations.forEach((orientation) => {
        dispatch("getOrientationSubjects", orientation.id);
      });
    },
    async setTeacherSubjectsTaken({ dispatch, state, commit }) {
      await axios({
        method: "get",
        url: state.API_URL + "/user-materia",
        headers: state.headers,
      })
        .then((res) => {
          console.log(res);
          if (Array.isArray(res.data)) {
            commit("clearGroups");
            commit("setSubjectsTaken", res.data);
            dispatch("syncTeacherGroups");
          } else {
            console.log("Error: setTeacherSubjectsTaken -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async syncTeacherGroups({ state, dispatch }) {
      await axios({
        method: "get",
        url: state.API_URL + "/user-grupo",
        headers: state.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            res.data.forEach((group) => {
              dispatch("setFullGroupData", group);
            });
          } else {
            console.log("Error: getGroups -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async setFullGroupData({ state, commit }, group) {
      let data = `id=${group.id_group}`;
      await axios({
        method: "get",
        url: state.API_URL + `/group?${data}`,
        headers: state.headers,
      })
        .then((res) => {
          console.log(res);
          let lol = true;
          if (lol) {
            group.subjects = [];
            let group_full_data = res.data;
            let orientation_data = state.orientations.find(
              (orientation) =>
                parseInt(orientation.id) ==
                parseInt(group_full_data.id_orientation)
            );
            state.orientations_subjects.forEach((orientation_subject) => {
              if (
                parseInt(orientation_subject.id_orientation) ==
                parseInt(group_full_data.id_orientation)
              ) {
                group.subjects.push(orientation_subject);
              }
            });

            state.subjects_taken.forEach((subject_taken) => {
              group.subjects.forEach((subject) => {
                if (
                  parseInt(subject_taken.id_group) ==
                    parseInt(group.id_group) &&
                  subject.id_subject == parseInt(subject_taken.id_subject)
                ) {
                  subject.selected = true;
                }
              });
            });

            group.orientation_name = orientation_data.name;
            group.name = group_full_data.name;
            group.code = group_full_data.code;
            group.id_orientation = group_full_data.id_orientation;
            commit("addGroup", group);
          } else {
            console.log("Error: setFullGroupData -> ");
            console.log(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
