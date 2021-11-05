/* eslint-disable no-unused-vars */
import axios from "axios";

// Modulo donde manejo las alertas
import { showAlert } from "@/utils/alerts";

export default {
  state: {
    schedule: [],
  },
  mutations: {
    setSchedule(state, schedule) {
      state.schedule = schedule;
    },
    pushSchedule(state, schedule) {
      state.schedule.push(schedule);
    },
    removeSchedule(state, day) {
      state.schedule.foreach((schedule, index) => {
        if (parseInt(schedule.day) == day) {
          state.schedule.splice(1, index);
        }
      });
    },
  },
  actions: {
    async getSchedule({ rootState, commit }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/schedule/getTeacherSchedule",
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("setSchedule", res.data);
          } else {
            console.log("Error ->");
            console.log(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async addSchedule({ rootState, commit }, schedule) {
      let data = {
        day: schedule.day,
        start_hour: schedule.start_hour,
        end_hour: schedule.end_hour,
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/schedule/addDayToSchedule",
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data == 1) {
            commit("pushSchedule", schedule);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async removeSchedule({ rootState, commit }, day) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/schedule/removeDayForSchedule",
        day,
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            commit("removeSchedule", day);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
