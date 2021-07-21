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
        class=" max-h-28 m-3 pt-2 w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-2xl"
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
                  subject.id_subject + '_group_' + group.id_group,
                  group.id_group,
                  subject.id_subject
                )
              "
              :class="
                subject.selected
                  ? 'scale-110 block select-none my-2 mx-2 px-5 py-1 bg-blue-700 hover:bg-red-500 bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-2xl rounded-full cursor-pointer transform-gpu transition-all duration-200'
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
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

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
      "orientations_subjects",
      "groups",
    ]),
    ...mapGetters(["subjectsFiltered"]),
  },
  methods: {
    ...mapActions([
      "createSubject",
      "removeSubject",
      "editSubject",
      "syncTeacherGroups",
      "syncOrientations",
      "syncSubjects",
      "setTeacherSubjectsTaken",
    ]),
    ...mapMutations([
      "onlySelectGroupSubject",
      "onlyDeleteGroupSubject",
      "setPreselectedGroupSubjects",
      "addOriginalOrientationSubjects",
      "clearGroups",
      "preProcessSubjects",
    ]),
    toogleSubject(id_button, id_group, id_subject) {
      let subject_card = document.getElementById(id_button);
      subject_card.classList.toggle("scale-110");
      subject_card.classList.toggle("bg-blue-700");
      subject_card.classList.toggle("bg-opacity-50");
      subject_card.classList.toggle("hover:bg-red-500");

      if (subject_card.classList.contains("scale-110")) {
        this.takeSubject(id_group, id_subject);
      } else {
        this.unsuscribeGroupSubject(id_group, id_subject);
      }
    },
    /* sortPreselectedSubjects() {
      this.subjects.forEach((subject) => {
        this.orientations_subjects.forEach((orientationSubject) => {
          console.log(subject);
          if (
            parseInt(subject.id) == orientationSubject.id_subject &&
            parseInt(this.orientation.id) == orientationSubject.id_orientation
          ) {
            subject.selected = true;
            this.preselectedSubjects.push(parseInt(subject.id));
            this.addOriginalOrientationSubjects(parseInt(subject.id));
          }
        });
      });
      this.setPreselectedGroupSubjects(this.preselectedSubjects);
    }, */
    subjectIsSelected(id) {
      let matched = false;
      this.preselectedSubjects.forEach((subject) => {
        if (subject == id) {
          matched = true;
        }
      });
      return matched;
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
          /* if (res.data == 1) {
            this.clearGroups();
            this.syncTeacherGroups();
          } else {
            console.log("Error: takeGroup -> " + res.data);
          } */
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
          /* if (res.data == 1) {
            this.clearGroups();
            this.syncTeacherGroups();
          } else {
            console.log("Error: takeGroup -> " + res.data);
          } */
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style></style>
