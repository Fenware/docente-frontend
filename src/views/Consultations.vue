<template>
  <div class="text-white w-full min-h-full" style="min-width: 15rem;">
    <div class="flex justify-between ">
      <Consultation v-if = "consultation.active"/>
      <div class="flex justify-center items-center mx-auto" v-else>
        <p class="text-2xl">Seleccione una consulta</p>
      </div>

      <div class="h-92vh bg-gray-700 rounded-r-2xl shadow-xl">
        <h2 class="text-center text-2xl mt-1 mb-5">
          Consultas
        </h2>

        <div class=" overflow-y-auto px-2" style="height: 82vh;">
          <div v-if="consultations.length == 0">
            <p>No tienes consultas pendientes</p>
          </div>
          <div
            @click="viewConsultation(consultation)"
            class=" text-white my-0.5 py-3 px-2 hover:bg-gray-800 hover:bg-opacity-40 transition-colors rounded-xl cursor-pointer"
            v-for="consultation in consultations"
            :key="consultation.id"
            :id="'consultation_' + consultation.id"
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
  data: function() {
    return {
      consultation_selected: null,
    };
  },
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
      this.toggleConsultationSelected(consultation.id);
    },
    toggleConsultationSelected(id) {
      let div = document.getElementById('consultation_' + id);
      div.classList.add("bg-gray-800");

      if (this.consultation_selected != null && this.consultation_selected != id) {
        console.log("s");
        let selected_div = document.getElementById('consultation_' + this.consultation_selected);
        selected_div.classList.remove("bg-gray-800");
      }

      this.consultation_selected = id;
    },
  },
};
</script>

<style></style>
