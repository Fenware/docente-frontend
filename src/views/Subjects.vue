<template>
  <div class="text-white w-full h-full">
    <h2 class="text-center text-3xl mt-1">Materias</h2>

    <div class="flex justify-between mt-10">
      <input
        type="text"
        placeholder="Buscar materia"
        v-model="text_filter"
        v-on:keyup="searcher(text_filter)"
        class="w-96 mx-2 py-2 px-2 | bg-white transition duration-300 focus:bg-opacity-20 hover:bg-opacity-20 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-2xl  outline-none placeholder-white"
      />
      <div
        class="ml-4 | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-2xl"
      >
        <input
          type="text"
          v-model="subject_data.name"
          placeholder="Agregar materia"
          v-on:keyup.enter="addSubject()"
          class="w-48 py-2 px-2 | bg-white transition duration-300 focus:bg-opacity-20 hover:bg-opacity-20 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-2xl  outline-none placeholder-white"
        />
        <button @click="addSubject()">
          <i
            class="fas fa-plus text-white text-md py-3 px-3 | filter drop-shadow-xl transition-transform duration-300 transform hover:scale-110"
          ></i>
        </button>
      </div>
    </div>
    <SubjectsContainer />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SubjectsContainer from "@/components/SubjectsContainer";

export default {
  name: "Subjects",
  data: function() {
    return {
      subject_data: {
        id: null,
        name: "",
        state: 1,
      },
      text_filter: ''
    };
  },
  components: {
    SubjectsContainer,
  },
  methods: {
    ...mapActions(["syncSubjects", "checkSession", "createSubject", "searcher"]),
    addSubject() {
      let newSubject = {
        name: this.subject_data.name,
        state: 1,
      };
      this.createSubject(newSubject);
      this.subject_data.id = null;
      this.subject_data.name = "";
    },
  },
  created() {
    this.checkSession();
    this.syncSubjects();
  },
};
</script>

<style></style>
