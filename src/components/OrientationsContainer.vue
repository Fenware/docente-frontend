<template>
  <div
    class="m-3 py-3 w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-2xl"
    v-for="orientation in orientations"
    :key="orientation.id"
  >
    <div class="flex px-2 justify-between">
      <span
        class="py-1 px-2 w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-lg"
        >{{ orientation.name }}</span
      >
      <span
        class="flex-none py-1 px-5 ml-3 | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-full"
        >Año: {{ orientation.year }}</span
      >
    </div>
    <span v-for='subject in getOrientationSubjects(parseInt(orientation.id))' :key="subject.id"> {{subject}} </span>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "OrientationsContainer",
  data: function() {
    return {
      edit_mode: false,
      orientation_data: { name: "", year: null, subjects: [] },
    };
  },
  computed: {
    ...mapState(["subjects", "orientations"]),
  },
  methods: {
    ...mapActions(["createOrientation", "getOrientationSubjects"]),
  },
};
</script>

<style></style>
