<template>
  <div class="text-white w-full min-h-full" style="min-width: 15rem;">
    <div class="flex justify-between ">
      <Consultation v-if="consultation.active" />
      <div class="flex justify-center items-center mx-auto" v-else>
        <p class="text-2xl">{{ getWord({file:'consultation',word:'select_consultation',lang}) }} </p>
      </div>

      <div class="h-92vh bg-gray-700 rounded-r-2xl shadow-xl">
        <h2 class="text-center text-2xl mt-1 mb-5">
          {{ getWord({file:'consultation',word:'consultations',lang}) }}
        </h2>

        <div class=" mt-2 overflow-y-auto px-2" style="height: 82vh;">
          <div v-if="consultations.length == 0">
            <p>{{ getWord({file:'consultation',word:'no_consultations',lang}) }}</p>
          </div>
          <div
            @click="viewConsultation(consultation)"
            class=" text-white my-0.5 py-3 px-2 hover:bg-gray-800 hover:bg-opacity-40 transition-colors rounded-xl cursor-pointer"
            v-for="consultation in consultations"
            :key="consultation.id"
            :id="'consultation_' + consultation.id"
          >
            <div class="flex justify-between">
              <div class="mr-3">
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
                class="mr-1  text-green-500"
              >
                <span class="material-icons text-xl">check_circle_outline</span>
              </div>
              <div
                v-show="consultation.state == 1"
                class="rounded-full mr-1  text-gray-500"
              >
                <span class="material-icons text-xl"
                  >radio_button_unchecked</span
                >
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
import { getWord } from "@/utils/lang";

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
      lang: (state) => state.lang,
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
      let div = document.getElementById("consultation_" + id);
      div.classList.add("bg-gray-800");

      if (
        this.consultation_selected != null &&
        this.consultation_selected != id
      ) {
        let selected_div = document.getElementById(
          "consultation_" + this.consultation_selected
        );
        selected_div.classList.remove("bg-gray-800");
      }

      this.consultation_selected = id;
    },
    getWord,
  },
};
</script>

<style></style>
