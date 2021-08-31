<template>
  <div class="text-white w-full min-h-full">
    <div class="flex justify-between ">
      <Consultation />

      <div class="h-92vh bg-gray-700 rounded-r-2xl shadow-xl">
        <h2 class="text-center text-2xl mt-1 mb-5">
          Consultas
        </h2>

        <div class=" overflow-y-auto pl-2 pr-3" style="height: 82vh;">
          <div
            @click="viewConsultation(consultation)"
            class=" text-white py-3 px-2 hover:bg-gray-600 transition-colors rounded-xl cursor-pointer"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import Consultation from "@/components/Consultation";

export default {
  name: "Consultations",
  components: {
    Consultation,
  },
  computed: {
    ...mapState({
      consultations: (state) => state.consultations.consultations,
      consultation: (state) => state.consultations.consultation,
    }),
  },
  created() {
    this.getConsultations();
  },
  methods: {
    ...mapMutations(["setConsultation"]),
    ...mapActions([
      "getConsultations",
      "getConsultation",
      "getConsultationMessages",
    ]),
    viewConsultation(consultation) {
      this.getConsultation(consultation.id);
    },
  },
};
</script>

<style></style>
