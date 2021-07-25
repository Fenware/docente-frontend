<template>
  <div
    class="mb-3 max-w-xs text-white rounded-xl pb-2 | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-xl"
    v-for="consultation in consultations"
    :key="consultation.id"
  >
    <div class="flex flex-wrap pt-1">
      <span
        class="ml-2 text-xs bg-blue-300 px-1 text-black rounded-md shadow-lg select-none"
        >{{ consultation.student_name }}</span
      >
      <span
        class="ml-2 text-xs bg-purple-800 px-1  rounded-md shadow-lg select-none"
        >{{ consultation.subject_name }}</span
      >
    </div>
    <p class="text-sm px-4 pt-1">
      {{ consultation.theme }}
    </p>
    <button
      @click="viewConsultation(consultation)"
      class="mt-1 ml-3 text-xs bg-white bg-opacity-20 hover:bg-opacity-30 hover:shadow-xl transition-all ease-linear px-2 py-0.5 rounded-full"
    >
      Ver consulta
    </button>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "ConsultationsContainer",
  computed: {
    ...mapState(["consultations", "subjects"]),
  },
  methods: {
    ...mapMutations(["setConsultation"]),
    viewConsultation(consultation) {
      this.setConsultation(consultation);
      this.$router.push({
        name: "Consultation",
        params: { id: consultation.id },
      });
    },
  },
};
</script>

<style></style>
