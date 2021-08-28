<template>
  <div class="text-white  w-full px-2">
    <h2 class="text-center text-3xl mt-1">
      Grupos
    </h2>

    <div class="flex justify-center mt-10">
      <input
        type="text"
        id="code_input"
        placeholder="Código de grupo"
        v-model="group_code"
        class="mx-2 py-2 px-2 w-56 focus:w-64 text-center bg-white transition-all duration-300 focus:bg-opacity-20 hover:bg-opacity-20 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-xl outline-none"
      />
      <button
        @click="group_code.trim() != '' ? takeGroup() : focusCodeInput()"
        class="btn-success px-3  my-1"
      >
        Tomar grupo
      </button>
    </div>

    <!-- <div
      class="flex px-2 overflow-y-auto h-2/3 mx-auto flex-wrap md:max-w-2xl lg:max-w-3xl mt-10 bg-white bg-opacity-10  shadow-2xl | rounded-lg"
    > -->
    <div
      class="mt-5 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 max-h-96 overflow-y-auto "
    >
      <!-- Haciendo un for de los usuarios filtrados (por defecto se muestran todos) -->
      <div
        v-for="group in groups"
        :key="group.id"
        class="sm:flex sm:justify-between items-center  my-2 mx-3 py-2 px-3 bg-gray-700 border-2 border-gray-600 shadow-md rounded-2xl"
      >
        <div class="w-8/12">
          <p>
            <span class="font-bold text-xl text-indigo-400 ">
              <span>
                {{ group.full_name }}
              </span>
              <span class="font-normal text-sm text-white">
                - {{ group.orientation_name }}
              </span></span
            >
          </p>
          <p class="w-max">
            <span class="font-semibold select-none">Código:</span>
            <span class="px-2 py-0.5 ml-1 bg-white rounded-md bg-opacity-10">{{
              group.code
            }}</span>
            <i
              class="fas fa-copy ml-1 text-gray-400 cursor-pointer transition-colors duration-300 hover:text-gray-300"
            ></i>
          </p>
        </div>

        <div
          class="flex md:flex-col flex-wrap gap-2 justify-center md:justify-end"
        >
            <!-- @click="changeMode({ mode: 'edit', group: group })" -->
          <button
            class=" pr-3 pl-5 py-1.5 text-xs btn-info"
          >
            Ver materias
            <i
              class="fas fa-caret-down text-blue-600 mx-1 text-md drop-shadow-lg"
            ></i>
          </button>
          <button
            @click="confirmDeletion(group.id, group.name, group.year)"
            class="flex justify-center items-center pl-3 pr-5 py-1.5 text-xs font-semibold transition-colors duration-200 rounded-md border-b-2 hover:border-red-400 border-red-300    bg-red-200 hover:bg-red-300 text-red-900"
          >
            <i
              class="fas fa-exclamation-triangle mx-1 text-md drop-shadow-lg "
            ></i>
            Darme de baja
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
/* import GroupCard from "@/components/TheGroupCard"; */

export default {
  name: "Groups",
  data: function() {
    return {
      group_code: "",
    };
  },
  components: {
/*     GroupCard, */
  },
  computed: {
    ...mapState({ groups: (state) => state.groups.groups }),
  },
  methods: {
    ...mapMutations(["clearGroups", "addGroup"]),
    ...mapActions(["takeGroup", "getOrientations", "getSubjects", "getTeacherGroups"]),
    focusCodeInput() {
      document.getElementById("code_input").focus();
    },
  },
  created() {
    /* this.getOrientations(); */
    /* this.clearGroups(); */
    this.getTeacherGroups();
  },
};
</script>

<style></style>
