<template>
  <div
    class="flex overflow-auto flex-wrap md:max-w-2xl lg:max-w-3xl mt-20 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-xl"
  >
    <div v-for="subject in subjectsFiltered" :key="subject.id">
      <div
        :id="subject.id + 'no_edit_mode'"
        class=" block m-3 px-3 py-1 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-full"
        v-if="subject.state == 1"
      >
        <span class=" bg-transparent outline-none" type="text"
          >{{ subject.name }}
        </span>
        <i
          :id="subject.id + 'btn_edit'"
          @click="editSubjectInput(subject.id)"
          class="
        fas fa-pencil-alt text-yellow-300 hover:text-yellow-500 mx-1 text-md drop-shadow-lg "
        ></i>
        <i
          :id="subject.id + 'btn_delete'"
          @click="removeSubject(subject)"
          class="fas fa-trash-alt text-red-400 hover:text-red-500 mx-1 text-md drop-shadow-lg "
        ></i>
      </div>

      <div
        :id="subject.id + 'edit_mode'"
        class="hidden m-3 px-3 py-1 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-2xl"
        v-if="subject.state == 1"
      >
        <input
          :id="subject.id"
          :value="subject.name"
          v-on:keyup.enter="saveNewSubjectName(subject.id)"
          class="text-center bg-white bg-opacity-10 hover:bg-opacity-20 transition duration-300 backdrop-filter backdrop-blur-xl shadow-2xl rounded-lg outline-none"
          type="text"
        />
        <div class="text-center pt-3 pb-1">
          <span
            @click="saveNewSubjectName(subject.id)"
            class="cursor-pointer mr-1  pl-1 pr-2 py-1 bg-green-700 rounded-full duration-300 transition hover:bg-green-600 "
          >
            <i
              :id="subject.id + 'btn_edit'"
              class="fas fa-save text-green-300 mx-1 text-md drop-shadow-lg"
            ></i>
            Guardar
          </span>
          <span
            @click="cancelEdit(subject.id)"
            class="cursor-pointer pl-1 pr-2 py-1 bg-red-700 rounded-full duration-300 transition hover:bg-red-600  "
          >
            <i
              :id="subject.id + 'btn_delete'"
              class="fas fa-times text-red-400 mx-1 text-md drop-shadow-lg "
            ></i>
            Cancelar
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "SubjectContainer",
  computed: {
    ...mapState(["subjects"]),
    ...mapGetters(["subjectsFiltered"]),
  },
  methods: {
    ...mapActions(["createSubject", "removeSubject", "editSubject"]),
    saveNewSubjectName(id) {
      let subjectInput = document.getElementById(id);
      let boxEditMode = document.getElementById(id + "edit_mode");
      let boxNoEditMode = document.getElementById(id + "no_edit_mode");

      let subject = {
        id: id,
        name: subjectInput.value,
      };

      this.editSubject(subject);

      boxEditMode.classList.add("hidden");
      boxNoEditMode.classList.remove("hidden");
    },
    editSubjectInput(id) {
      let boxEditMode = document.getElementById(id + "edit_mode");
      let boxNoEditMode = document.getElementById(id + "no_edit_mode");

      boxEditMode.classList.remove("hidden");
      boxNoEditMode.classList.add("hidden");

      /* boxEditMode.className.replace("block", "hidden");
      boxNoEditMode.className.replace("hidden", "block"); */
    },
    cancelEdit(id) {
      let boxEditMode = document.getElementById(id + "edit_mode");
      let boxNoEditMode = document.getElementById(id + "no_edit_mode");
      boxEditMode.classList.add("hidden");
      boxNoEditMode.classList.remove("hidden");
    },
  },
};
</script>

<style></style>
