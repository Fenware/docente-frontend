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
    <div class=" flex justify-between items-center">
      <button
        @click="viewConsultation(consultation)"
        class="mt-1 ml-3 text-xs bg-white bg-opacity-20 hover:bg-opacity-30 hover:shadow-xl transition-all ease-linear px-2 py-0.5 rounded-full"
      >
        Ver consulta
      </button>
      <div
        v-show="consultation.state == 2"
        class="rounded-full mr-2 text-green-500"
      >
        <i class="fas fa-check-circle"></i>
      </div>
      <div
        v-show="consultation.state == 1"
        class="rounded-full mr-2 text-gray-800"
      >
        <i class="far fa-circle"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "ConsultationsContainer",
  computed: {
    ...mapState(["consultations", "subjects"]),
  },
  methods: {
    ...mapMutations(["setConsultation"]),
    ...mapActions(["syncConsultations", "getConsultationMessages"]),
    viewConsultation(consultation) {
      consultation.messages = [];
      this.setConsultation(consultation);
      this.getConsultationMessages(parseInt(consultation.id));
      this.$router.push({
        name: "Consultation",
        params: { id: consultation.id },
      });
    },
  },
};
</script>

<style></style>
