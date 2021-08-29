/* eslint-disable no-unused-vars */
import axios from "axios";
/* import router from "@/router/index"; */

// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

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
    /* onlySelectGroupSubject(state, id) {
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
    }, */
    setSubjectsTaken(state, subjects) {
      state.subjects_taken = subjects;
    },
  },
  actions: {
    async getTeacherGroups({ rootState, commit }) {
      await axios({
        method: "get",
        url: rootState.API_URL + "/user-grupo",
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("clearGroups");
            res.data.forEach((group) => {
              group.full_name =
                (group.orientation_year == "1" || group.orientation_year == "3"
                  ? group.orientation_year + "ero"
                  : group.orientation_year + "do") + ` ${group.name}`;
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
        url: rootState.API_URL + "/user-grupo",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            showAlert({ type: "success", message: "Has tomado el grupo correctamente!" });
            dispatch("getTeacherGroups");
          } else if (res.data == 0) {
            showAlert({ type: "error", message: "Ya has tomado este grupo!" });
            console.log("Error: takeGroup -> " + res.data);
          } else {
            showAlert({ type: "error", message: res.data });
            // Para cuando felipe lo arregle
            /* showAlert({ type: "error", message: res.data.result.error_msg }); */
            console.log("Error: takeGroup -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async unsuscribeGroup({ rootState, commit }, group) {
      let data = {
        grupo: parseInt(group.id),
      };
      console.log(data);
      await axios({
        method: "delete",
        url: rootState.API_URL + "/user-grupo",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data == 1) {
            commit("removeGroup", group.id);
            showAlert({ type: "info", message: `Te has dado de baja del grupo ${group.full_name} correctamente`});
          } else {
            console.log("Error: deleteGroup -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /* async getOrientations({ commit, dispatch, rootState }) {
      await axios({
        method: "get",
        url: rootState.API_URL + "/orientacion",
        headers: rootState.headers,
      })
        .then((res) => {
          commit("setOrientations", res.data);
          dispatch("syncOrientationSubjects");
        })
        .catch((error) => {
          console.log(error);
        });
    }, */
    /* async setFullGroupData({ state, rootState, commit }, group) {
    let data = `id=${group.id_group}`;
    await axios({
      method: "get",
      url: rootState.API_URL + `/group?${data}`,
      headers: rootState.headers,
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
                parseInt(subject_taken.id_group) == parseInt(group.id_group) &&
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
  }, */
    /* syncOrientationSubjects({ dispatch, commit, state }) {
    commit("clearOrientationSubjects");
    state.orientations.forEach((orientation) => {
      dispatch("getOrientationSubjects", orientation.id);
    });
  }, */
    async getTeacherSubjectsTakenByGroup({ rootState, commit }, group_id) {
      let data = `group=${parseInt(group_id)}`
      await axios({
        method: "get",
        url: rootState.API_URL + `/user-materia?${data}`,
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("setSubjectsTaken", res.data);
          } else {
            console.log("Error: setTeacherSubjectsTaken -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async takeSubject({rootState, commit}, payload) {
      let data = {
        grupo: parseInt(payload.group_id),
        materia: parseInt(payload.subject_id),
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/user-materia",
        data: data,
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
    async unsuscribeGroupSubject({rootState, commit}, payload) {
      let data = {
        grupo: parseInt(payload.group_id),
        materia: parseInt(payload.subject_id),
      };
      await axios({
        method: "delete",
        url: rootState.API_URL + "/user-materia",
        data: data,
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
