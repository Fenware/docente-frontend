<template>
  <div class="text-white w-full min-h-full">
    <div class="flex justify-between h-full">
      <div class=""></div>

      <div class="h-92vh bg-gray-700 rounded-r-2xl">
        <h2 class="text-center text-2xl mt-1 mb-5">
          Consultas
        </h2>

        <div class=" overflow-y-auto pl-2 pr-3" style="height: 82vh;">
          <div
            class=" text-white py-3 px-2 hover:bg-gray-600 transition-colors rounded-2xl cursor-pointer"
            v-for="consultation in consultations"
            :key="consultation.id"
          >
            <div class="flex justify-between items-center">
              <div>
                <div class="flex flex-wrap">
                  <span
                    class="ml-2 text-indigo-400 font-semibold px-1 rounded-md select-none"
                    >{{ consultation.subject_name }}</span
                  >
                </div>
                <p class="text-sm pl-5 pt-0.5">
                  {{ consultation.theme }}
                </p>
              </div>
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
            <!-- <div class=" flex justify-end items-center">
              <button
                @click="viewConsultation(consultation)"
                class="ml-2 mt-1 py-0.5 px-1.5 text-xs rounded-lg border-none btn-info"
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
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "Consultations",
  computed: {
    ...mapState({
      consultations: (state) => state.consultations.consultations,
    }),
  },
  created() {
    this.getConsultations();
  },
  methods: {
    ...mapMutations(["setConsultation"]),
    ...mapActions(["getConsultations", "getConsultationMessages"]),
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
