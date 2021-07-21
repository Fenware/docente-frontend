<template>
  <div class="">
    <div class="flex px-2 justify-between items-center">
      Grupo:
      <span
        class="mx-4 py-1 px-2 w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-lg "
        >{{ group.name }}</span
      >
      <span
        class="flex-none py-1 px-5 ml-3 | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-full"
        >Código: <span class="font-bold">{{ group.code }}</span></span
      >
    </div>
    <div class="mt-3 ml-2 flex justify-between items-center">
      <div div class="flex overflow-x-auto max-w-lg ">
        <div class="flex">
          <p
            class="px-2 mx-1 bg-white bg-opacity-20 backdrop-filter backdrop-blur-xl shadow-2xl rounded-full select-none"
          >
            Orientación:
            <span class="font-bold"> {{ group.orientation_name }} </span>
          </p>
        </div>
      </div>

      <div class="flex ml-1">
        <button
          @click="unsuscribeGroup()"
          class="py-1 pr-5 pl-4 mr-2 | transition-colors duration-200 bg-red-700  bg-opacity-50 hover:bg-opacity-70 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-full select-none "
        >
          <i class="fas fa-exclamation-triangle"></i>
          Darme de baja
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "GroupCard",
  props: {
    group: Object,
  },
  computed: {
    ...mapState(["API_URL", "headers", "orientations"]),
  },
  methods: {
    ...mapMutations(["setGroup", "removeGroup"]),
    ...mapActions([]),
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
  },
};
</script>

<style></style>
