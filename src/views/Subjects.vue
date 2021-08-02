<template>
  <div class="text-white">
    <h2 class="text-center text-3xl mt-1">
      Tomar Materias
    </h2>
    <div
      class="flex overflow-auto flex-wrap mx-auto md:max-w-2xl lg:max-w-3xl mt-20 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-xl"
    >
      <div
        v-for="group in groups"
        :key="group.id_group"
        class=" max-h-full m-3 pt-2 w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-2xl"
      >
        <p class="ml-3 mb-2 font-bold">
          {{ group.name }} - {{ group.orientation_name }}
        </p>
        <div
          class="flex overflow-auto flex-wrap mx-auto md:max-w-2xl lg:max-w-3xl mt-2"
        >
          <div v-for="subject in group.subjects" :key="subject.id_subject">
            <p
              :id="subject.id_subject + '_group_' + group.id_group"
              @click="
                toogleSubject(
                  subject.selected,
                  group.id_group,
                  subject.id_subject
                )
              "
              :class="
                subject.selected
                  ? 'block select-none my-2 mx-2 px-5 py-1 bg-blue-700 hover:bg-red-500 bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-2xl rounded-full cursor-pointer transform-gpu transition-all duration-200'
                  : 'block select-none my-2 px-5 py-1 mx-2 bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-filter backdrop-blur-xl shadow-2xl rounded-full cursor-pointer transform-gpu transition-all duration-200'
              "
            >
              {{ subject.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "SubjectContainer",
  data: function() {
    return {
      preselectedSubjects: [],
      preprocessed_subjects: [],
    };
  },
  created() {
    this.syncOrientations();
    this.syncSubjects();
    this.setTeacherSubjectsTaken();
  },
  computed: {
    ...mapState([
      "API_URL",
      "headers",
      "subjects",
      "groups",
    ]),
    ...mapGetters(["subjectsFiltered"]),
  },
  methods: {
    ...mapActions([
      "syncOrientations",
      "syncSubjects",
      "setTeacherSubjectsTaken",
    ]),
    toogleSubject(is_selected, id_group, id_subject) {
      if (is_selected) {
        this.unsuscribeGroupSubject(id_group, id_subject);
      } else {
        this.takeSubject(id_group, id_subject);
      }
    },
    async takeSubject(id_group, id_subject) {
      let data = {
        grupo: parseInt(id_group),
        materia: parseInt(id_subject),
      };
      await axios({
        method: "post",
        url: this.API_URL + "/user-materia",
        data: data,
        headers: this.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data == 1) {
            this.toogleSelectSubject(id_group, id_subject);
          } else {
            console.log("Error: takeGroup -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async unsuscribeGroupSubject(id_group, id_subject) {
      let data = {
        grupo: parseInt(id_group),
        materia: parseInt(id_subject),
      };
      await axios({
        method: "delete",
        url: this.API_URL + "/user-materia",
        data: data,
        headers: this.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data == 1) {
            this.toogleSelectSubject(id_group, id_subject);
          } else {
            console.log("Error: unsuscribeGroupSubject -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    toogleSelectSubject(id_group, id_subject) {
      let group = this.groups.find(
        (group) => parseInt(group.id_group) == parseInt(id_group)
      );

      group.subjects.forEach((subject) => {
        if (subject.id_subject == parseInt(id_subject)) {
          subject.selected = !subject.selected;
        }
      });
    },
  },
};
</script>

<style></style>
