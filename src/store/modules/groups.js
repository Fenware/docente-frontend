/* eslint-disable no-unused-vars */
import axios from "axios";
/* import router from "@/router/index"; */

// Modulo donde manejo las alertas
import { showAlert } from "@/utils/alerts";

export default {
  state: {
    groups: [],
    subjects_taken: [],
  },
  mutations: {
    clearGroups(state) {
      state.groups = [];
    },
    pushGroup(state, group) {
      state.groups.push(group);
    },
    removeGroup(state, id) {
      state.groups.forEach((group, index) => {
        if (parseInt(group.id) == parseInt(id)) {
          state.groups.splice(index, 1);
        }
      });
    },
    setSubjectsTaken(state, subjects) {
      state.subjects_taken = subjects;
    },
  },
  actions: {
    async getTeacherGroups({ rootState, commit }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/user-group/getGroups",
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("clearGroups");
            res.data.forEach((group) => {
              console.log(group.orientation_year);
              switch (group.orientation_year) {
                case "1":
                  group.full_name = "1" + (rootState.lang == 'es' ? 'ero' : 'st') + ` ${group.name}`;
                  break;
                case "2":
                  group.full_name = "2" + (rootState.lang == 'es' ? 'do' : 'nd') + ` ${group.name}`;
                  break;
                case "3":
                  group.full_name = "3" + (rootState.lang == 'es' ? 'ero' : 'rd') + ` ${group.name}`;
                  break;
              }
              
              commit("pushGroup", group);
            });
          } else {
            console.log("Error: getTeacherGroups -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async takeGroup({ rootState, dispatch }, group_code) {
      let data = {
        code: group_code,
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/user-group/takeGroup",
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            showAlert({
              type: "success",
              message: "Has tomado el grupo correctamente",
            });
            dispatch("getTeacherGroups");
          } else if (res.data == 0)
            showAlert({ type: "error", message: "Ya has tomado este grupo" });
          else showAlert({ type: "error", message: res.data.result.error_msg });
          /* showAlert({ type: "error", message: res.data }); */
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async unsuscribeGroup({ rootState, commit }, group) {
      let data = {
        grupo: parseInt(group.id),
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/user-group/leaveGroup",
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            commit("removeGroup", group.id);
            showAlert({
              type: "info",
              message: `Te has dado de baja del grupo ${group.full_name}`,
            });
          } else console.log("Error: deleteGroup -> " + res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getTeacherSubjectsTakenByGroup({ rootState, commit }, group_id) {
      let data = { group: parseInt(group_id) };
      await axios({
        method: "post",
        url: rootState.API_URL + `/user-group/getUserSubjects`,
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("setSubjectsTaken", res.data);
          } else {
            console.log("Error: getTeacherSubjectsTakenByGroup -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async takeSubject({ rootState }, payload) {
      let data = {
        grupo: parseInt(payload.group_id),
        materia: parseInt(payload.subject_id),
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/user-group/takeSubject",
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data == 1) {
            /* this.toogleSelectSubject(id_group, id_subject); */
          } else {
            console.log("Error: takeGroup -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async unsuscribeGroupSubject({ rootState, commit }, payload) {
      let data = {
        grupo: parseInt(payload.group_id),
        materia: parseInt(payload.subject_id),
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/user-group/leaveSubject",
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data == 1) {
            /* this.toogleSelectSubject(id_group, id_subject); */
          } else {
            console.log("Error: unsuscribeGroupSubject -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
