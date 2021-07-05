<template>
  <div class="text-white w-full h-full">
    <h2 @click="createOrientation()" class="text-center text-3xl mt-1">
      Orientaciones
    </h2>

    <div class="flex justify-between mt-10">
      <input
        type="text"
        placeholder="Buscar orientacion"
        v-model="text_filter"
        v-on:keyup="searcher(text_filter)"
        class="w-96 mx-2 py-2 px-2 | bg-white transition duration-300 focus:bg-opacity-20 hover:bg-opacity-20 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-2xl  outline-none placeholder-white"
      />
      <div
        class="ml-4 pr-2 | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl transition duration-300 focus:bg-opacity-20 hover:bg-opacity-20 shadow-2xl | rounded-2xl"
      >
        <button @click="addOrientation()">
          <i
            class="fas fa-plus text-white text-md py-3 px-3 | filter drop-shadow-xl transition-transform duration-300 transform hover:scale-110"
          ></i>
          Agregar orientacion
        </button>
      </div>
    </div>

    <div
      class="flex overflow-auto flex-wrap md:max-w-2xl lg:max-w-3xl mt-20 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-xl"
    >
      <OrientationsContainer />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import OrientationsContainer from "@/components/OrientationsContainer";

export default {
  name: "Orientetions",
  data: function() {
    return {
      orientation_data: {
        id: null,
        name: "",
        year: null,
      },
      text_filter: ''
    };
  },
  components: {
    OrientationsContainer,
  },
  computed: {
    ...mapState(["subjects", "orientations"]),
  },
  methods: {
    ...mapActions(["checkSession", "syncOrientations", "createOrientation"]),
    addOrientation(){

    }
  },
  created() {
    this.checkSession();
    this.syncOrientations();
  },
};
</script>

<style></style>
