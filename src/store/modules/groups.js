/* eslint-disable no-unused-vars */
import axios from "axios";
import router from "@/router/index";

// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

export default {
  state: {
    groups: [],
    orientations: [],
    subjects: [],
    subjects_selected: [],
    subjects_taken: [],
    orientations_subjects: [],
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
        if (parseInt(group.id_group) == id) {
          state.groups.splice(index, 1);
        }
      });
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
          console.log(res);
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
    async unsuscribeGroup() {
      let data = {
        grupo: parseInt(this.group.id_group),
      };
      await axios({
        method: "delete",
        url: this.API_URL + "/user-grupo",
        data: data,
        headers: this.headers,
      })
        .then((res) => {
          if (!isNaN(parseInt(res.data))) {
            this.removeGroup(data.grupo);
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
    async getSubjects({ commit, rootState }) {
      await axios({
        method: "get",
        url: rootState.API_URL + "/materia",
        headers: rootState.headers,
      })
        .then((res) => {
          commit("setSubjects", res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getOrientationSubjects({ state, rootState, commit }, id) {
      let data = `id=${id}`;
      await axios({
        method: "get",
        url: rootState.API_URL + `/orientacion-materia?${data}`,
        headers: rootState.headers,
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
    /* syncOrientationSubjects({ dispatch, commit, state }) {
    commit("clearOrientationSubjects");
    state.orientations.forEach((orientation) => {
      dispatch("getOrientationSubjects", orientation.id);
    });
  }, */
    async setTeacherSubjectsTaken({ dispatch, rootState, commit }) {
      await axios({
        method: "get",
        url: rootState.API_URL + "/user-materia",
        headers: rootState.headers,
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
  },
};
