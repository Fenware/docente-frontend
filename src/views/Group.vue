<template>
  <!-- <h1 class="text-center text-3xl mt-1">
      Grupo <span class="font-semibold">{{ group.full_name }}</span>
    </h1> -->
  <div>
    <!-- <div class="flex justify-end">
      <button class="btn-info px-1.5 py-0.5 text-sm mt-2 mr-16">
        <i class="fas fa-reply "></i>
        Volver</button>
    </div> -->
    <div class=" mx-2 mt-10 sm:ml-10 grid grid-cols-5 gap-10 text-white">
      <div class="col-span-2">
        <h2 class="text-2xl text-center mb-2">Información del grupo</h2>
        <hr />
        <div class="col-span-2 mt-5">
          <p class="pb-2 font-bold text-2xl text-indigo-300">
            {{ group.full_name }}
          </p>

          <p>
            Grupo: <span class="font-bold">{{ group.name }}</span>
          </p>

          <p>
            Año:
            <span class="font-bold text-xl">
              {{ group.orientation_year }}
            </span>
          </p>

          <p>
            Orientación:
            <span class="font-bold text-xl">
              {{ group.orientation_name }}
            </span>
          </p>

          <p class="mb-5">
            Código de acceso:
            <span class="font-bold text-xl"> {{ group.code }} </span
            ><i
              class="fas fa-copy ml-2 text-gray-400 cursor-pointer transition-colors duration-300 hover:text-gray-300"
            ></i>
          </p>
          <hr />
        </div>
        <button @click="confirmDeletion()" class="btn-danger mt-5">
          <i class="fas fa-exclamation-triangle mr-1"></i>
          Darme de baja
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
                Tomar materias
              </h2>
            </div>
            <div class="flex items-center"></div>
          </div>

          <div
            class="min-h-full p-3 border-b-2 border-l-2 border-r-2 border-gray-700 rounded-b-2xl"
          >
            <label class="block text-lg text-center"
              >Seleccionar materias</label
            >
            <div
              class="max-h-80 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 overflow-auto"
            >
              <div
                class=" flex cursor-pointer items-center justify-between m-3 px-2 py-2
                      bg-gray-700 bg-opacity-90 border-2 border-gray-600 rounded-xl transform transition-transform"
                :id="'subject_' + subject.id"
                v-for="subject in group.subjects"
                :key="subject.id"
                @click="selectSubject(subject.id)"
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
              <button class="btn-success ">Guardar cambios</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import showAlert from "@/utils/alerts";

export default {
  name: "Group",
  data() {
    return {
      group: {},
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
        this.group = group;
        console.log(group);
      } else {
        showAlert({ type: "error", message: "Elegí un grupo de la lista" });
        this.$router.push({ name: "Groups" });
      }
    });
  },
  computed: {
    ...mapState({ groups: (state) => state.groups.groups }),
  },
  methods: {
    ...mapActions(["getTeacherGroups", "unsuscribeGroup"]),
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
    /* toogleSubject(is_selected, id_group, id_subject) {
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
    }, */
  },
};
</script>

<style></style>
