<template>
  <div class="text-white  w-full px-2">
    <h2 class="text-white text-center text-3xl font-semibold pt-1">
      {{ getWord({file:'group',word:'groups',lang}) }}
    </h2>

    <div class="flex justify-center mt-10">
      <input
        type="text"
        id="code_input"
        :placeholder="getWord({file:'group',word:'access_code',lang})"
        v-model="group_code"
        class="mx-2 py-2 px-2 w-56 focus:w-64 text-center bg-white transition-all duration-300 focus:bg-opacity-20 hover:bg-opacity-20 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-xl outline-none"
      />
      <button
        @click="group_code.trim() != '' ? take() : focusCodeInput()"
        class="btn-success px-3  my-1"
      >
        {{getWord({file:'group',word:'take_group',lang})}}
      </button>
    </div>

    <div
      class="mt-5 grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 max-h-96 overflow-y-auto "
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
            <span class="font-semibold select-none">{{getWord({file:'group',word:'code',lang})}}:</span>
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
          <router-link
            :to="{ name: 'Group', params: { code: group.code } }"
            class=" pr-3 pl-5 py-1.5 text-xs btn-info"
          >
            {{ getWord({file:'lang',word:'open',lang})  }}
            <i
              class="fas fa-caret-down text-blue-600 mx-1 text-md drop-shadow-lg"
            ></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getWord } from "@/utils/lang";
/* import GroupCard from "@/components/TheGroupCard"; */

export default {
  name: "Groups",
  data: function() {
    return {
      group_code: "",
    };
  },
  created() {
    this.getTeacherGroups();
  },
  computed: {
    ...mapState({ 
      groups: (state) => state.groups.groups ,
      lang: (state) => state.lang
    }),
  },
  methods: {
    ...mapActions(["getTeacherGroups", "takeGroup", "unsuscribeGroup"]),
    take() {
      this.takeGroup(this.group_code).then(() => {
        this.group_code = "";
      });
    },
    focusCodeInput() {
      document.getElementById("code_input").focus();
    },
    getWord,
  },
};
</script>

<style></style>
