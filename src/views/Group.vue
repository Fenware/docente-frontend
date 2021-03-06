<template>
  <div>
    <div class=" mx-2 mt-10 sm:ml-10 grid grid-cols-5 gap-10 text-white">
      <div class="col-span-2">
        <h2 class="text-2xl text-center mb-2">{{ getWord({file:'group',word:'group_information',lang}) }}</h2>
        <hr />
        <div class="col-span-2 mt-5">
          <p class="pb-2 font-bold text-2xl text-indigo-300">
            {{ group.full_name }}
          </p>

          <p>
            {{ getWord({file:'group',word:'group',lang}) }}: <span class="font-bold">{{ group.name }}</span>
          </p>

          <p>
            {{ getWord({file:'group',word:'year',lang}) }}:
            <span class="font-bold text-xl">
              {{ group.orientation_year }}
            </span>
          </p>

          <p>
            {{ getWord({file:'group',word:'orientation',lang}) }}:
            <span class="font-bold text-xl">
              {{ group.orientation_name }}
            </span>
          </p>

          <p class="mb-5">
            {{ getWord({file:'group',word:'access_code',lang}) }}:
            <span class="font-bold text-xl"> {{ group.code }} </span
            ><i
              class="fas fa-copy ml-2 text-gray-400 cursor-pointer transition-colors duration-300 hover:text-gray-300"
            ></i>
          </p>
          <hr />
        </div>
        <button @click="confirmDeletion()" class="btn-danger mt-5">
          <i class="fas fa-exclamation-triangle mr-1"></i>
          {{ getWord({file:'group',word:'leave_group',lang}) }}
        </button>
      </div>

      <div class="col-span-3 mt-2 mx-10">
        <div
          class=" max-w-screen-sm mx-auto mb-4 text-white bg-gray-600 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-2xl"
        >
          <div
            class="flex justify-between pl-5 py-0.5 items-center bg-gray-200 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-t-2xl"
          >
            <div class="flex items-center">
              <i class="fas fa-clipboard-check pb-0.5"></i>
              <h2 class="px-2 font-extrabold select-none">
                {{ getWord({file:'group',word:'take_subjects',lang}) }}
              </h2>
            </div>
            <div class="flex items-center">
              <span
                v-show="
                  unsuscribed_subjects.length > 0 ||
                    subjects_selected.length > 0
                "
                class="text-sm font-semibold mr-5 transition-all text-yellow-300"
              >
                {{ getWord({file:'lang',word:'unsaved_changes',lang}) }}
              </span>

              <span
                v-show="changes_saved"
                class="text-sm font-semibold mr-5 transition-all text-green-500"
                >
                {{ getWord({file:'lang',word:'succes_changes',lang}) }}
                <i class="fas fa-check"></i
              ></span>
            </div>
          </div>

          <div
            class="min-h-full p-3 border-b-2 border-l-2 border-r-2 border-gray-700 rounded-b-2xl"
          >
            <div class="flex justify-center">
              <input
                type="text"
                v-model="text_filter"
                class="mx-2 py-0.5 px-2 w-56 focus:w-64 text-center bg-white transition-all duration-300 focus:bg-opacity-20 hover:bg-opacity-20 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-lg outline-none"
                :placeholder="getWord({file:'group',word:'search_subjects',lang})"
              />
            </div>
            <div
              class="max-h-80 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 overflow-auto"
            >
              <div
                class=" flex cursor-pointer items-center justify-between m-3 px-2 py-2
                      bg-gray-700 bg-opacity-90 border-2 border-gray-600 rounded-xl transform transition-transform"
                :id="'subject_' + subject.id"
                v-for="subject in subjectsFiltered"
                :key="subject.id"
                @click="toggleSubject(subject.id)"
                style="height:fit-content"
              >
                <p
                  :id="'subject_name_' + subject.id"
                  :class="
                    (subject.name.length > 20 && subject.name.length < 35
                      ? 'text-sm'
                      : subject.name.length >= 35
                      ? 'text-xs'
                      : ' ') + '  bg-transparent select-none'
                  "
                  type="text"
                >
                  {{ subject.name }}
                </p>
                <i
                  :id="'subject_icon_' + subject.id"
                  class="far fa-square cursor-pointer text-white hover:text-indigo-400 transition-colors mx-1 text-md drop-shadow-lg "
                ></i>
              </div>
            </div>
            <div class="flex justify-center mt-5">
              <button
                :disabled="
                  unsuscribed_subjects.length == 0 &&
                    subjects_selected.length == 0
                "
                :class="
                  unsuscribed_subjects.length == 0 &&
                  subjects_selected.length == 0
                    ? 'btn-disabled'
                    : 'btn-success'
                "
                @click="saveChanges()"
              >
                {{ getWord({file:'lang',word:'save',lang}) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { showAlert } from "@/utils/alerts";
import { getWord } from "@/utils/lang";

export default {
  name: "Group",
  data() {
    return {
      // Le agrego el array de materias vacio para evitar errores con la funcion subjectsFiltered
      group: { subjects: [] },
      subjects_selected: [],
      unsuscribed_subjects: [],
      text_filter: "",
      changes_saved: false,
    };
  },
  created() {
    // Me aseguro que se obtenieron los grupos del docente
    this.getTeacherGroups().then(() => {
      // Obtengo el codigo de grupo por el parametro de la url
      let group_code = this.$route.params.code;
      // Busco el grupo en el array de grupos por su codigo
      let group = this.groups.find((group) => group.code == group_code);
      if (group) {
        // Obteniendo las materias ya tomadas del grupo
        this.getTeacherSubjectsTakenByGroup(group.id).then(() => {
          this.subjects_taken.forEach((subject) => {
            this.selectSubjectDiv(subject.id);
          });
        });
        this.group = group;
      } else {
        showAlert({ type: "error", message: "Escoja un grupo válido" });
        this.$router.push({ name: "Groups" });
      }
    });
  },
  computed: {
    ...mapState({
      groups: (state) => state.groups.groups,
      subjects_taken: (state) => state.groups.subjects_taken,
      lang: (state) => state.lang,
    }),
    subjectsFiltered() {
      // Filtro las materias por coincidencias de nombre
      let subjects_filtered = this.group.subjects.filter(
        (subject) =>
          subject.name.toLowerCase().indexOf(this.text_filter.toLowerCase()) >=
          0
      );
      return subjects_filtered;
    },
  },
  methods: {
    ...mapActions([
      "getTeacherGroups",
      "unsuscribeGroup",
      "getTeacherSubjectsTakenByGroup",
      "takeSubject",
      "unsuscribeGroupSubject",
    ]),
    confirmDeletion() {
      let alert = this.$swal.mixin({
        toast: false,
        position: "center",
        showConfirmButton: true,
        showDenyButton: true,
        timer: 60000,
        timerProgressBar: true,
        iconColor: "white",
        heightAuto: true,
        customClass: {
          popup: "colored-toast",
        },
      });
      alert
        .fire({
          html: `<span class="text-white">Dandote de baja del grupo <b>${this.group.full_name}</b> <br> <br> ¿Estas segurx? </span>  `,
          showCancelButton: false,
          confirmButtonText: `Darme de baja`,
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            /* this.removeSubject({id: parseInt( subject_id), name: subject_name}); */
            this.unsuscribeGroup(this.group).then(() => {
              this.$router.push({ name: "Groups" });
            });
          }
        });
    },
    saveChanges() {
      this.subjects_selected.forEach((subject_id) => {
        this.takeSubject({ subject_id, group_id: this.group.id }).then(() => {
          this.getTeacherSubjectsTakenByGroup(this.group.id);
        });
      });
      this.unsuscribed_subjects.forEach((subject_id) => {
        this.unsuscribeGroupSubject({
          subject_id,
          group_id: this.group.id,
        }).then(() => {
          this.getTeacherSubjectsTakenByGroup(this.group.id);
        });
      });
      this.changes_saved = true;
      this.subjects_selected = [];
      this.unsuscribed_subjects = [];
    },
    toggleSubject(id) {
      this.changes_saved = false;
      // Busco coincidencias en el array de materias ya seleccionadas
      let coincidencesInSubjectsTaken = this.subjects_taken.filter(
        (subject_taken) => subject_taken.id == id
      );

      // Si hay coincidencias y ya no fue removida
      if (
        coincidencesInSubjectsTaken.length > 0 &&
        !this.unsuscribed_subjects.includes(parseInt(id))
      ) {
        this.deselectSubjectDiv(id);

        // Añado el id al array de materias eliminadas
        this.unsuscribed_subjects.push(parseInt(id));

        // Si esta en el array de materias añadidas
      } else if (this.subjects_selected.includes(parseInt(id))) {
        this.deselectSubjectDiv(id);

        // Busco el id en el array y lo quito
        this.subjects_selected.forEach((subject_id, index) => {
          if (subject_id == parseInt(id)) {
            this.subjects_selected.splice(index, 1);
          }
        });

        // Si no esta seleccionada, o esta seleccionada (está en el array de preseleccionadas) pero fue removida
      } else {
        // Si la materia fue removida
        if (this.unsuscribed_subjects.includes(parseInt(id))) {
          // Busco el id de la materia en el array de eliminadas y lo quito
          this.unsuscribed_subjects.forEach((subject_id, index) => {
            if (subject_id == parseInt(id)) {
              this.unsuscribed_subjects.splice(index, 1);
            }
          });
        }

        // Si no esta preseleccionada la añado al array de seleccionadas
        if (coincidencesInSubjectsTaken.length == 0) {
          this.subjects_selected.push(parseInt(id));
        }
        this.selectSubjectDiv(id);
      }
    },
    deselectSubjectDiv(id) {
      let subjectDiv = document.getElementById("subject_" + id);
      let subjectIcon = document.getElementById("subject_icon_" + id);
      let subjectName = document.getElementById("subject_name_" + id);

      subjectDiv.classList.remove("scale-95");
      subjectDiv.classList.replace("bg-gray-800", "bg-gray-700");
      subjectIcon.classList.replace("fa-check-square", "fa-square");
      subjectIcon.classList.remove("text-indigo-300");
      subjectName.classList.remove("text-indigo-400");
    },
    selectSubjectDiv(id) {
      let subjectDiv = document.getElementById("subject_" + id);
      let subjectIcon = document.getElementById("subject_icon_" + id);
      let subjectName = document.getElementById("subject_name_" + id);

      subjectDiv.classList.add("scale-95");
      subjectDiv.classList.replace("bg-gray-700", "bg-gray-800");
      subjectIcon.classList.replace("fa-square", "fa-check-square");
      subjectIcon.classList.add("text-indigo-300");
      subjectIcon.classList.replace(
        "hover:text-indigo-300",
        "hover:text-indigo-400"
      );
      subjectName.classList.add("text-indigo-400");
    },
    getWord,
  },
};
</script>

<style></style>
