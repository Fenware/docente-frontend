<template>
  <div
    class="w-72 text-white h-full rounded-2xl | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
  >
    <div class="truncate">
      <h3 class="font-bold px-1 text-xl text-center pt-2">Consultas pendientes</h3>
    </div>
    <div class="flex justify-end  items-center pr-3 mt-2">
      <button 
      @click="getConsultations()"
      class="text-xs px-2 py-0.5 mb-1 text-blue-900  transition-colors font-semibold rounded-md bg-indigo-200 hover:bg-indigo-300 shadow-lg">
        Actualizar
        <i class="fas fa-sync-alt "></i>
      </button>
    </div>
    <div class=" p-2 h-5/6 overflow-y-auto">
      <ConsultationsContainer />
    </div>
  </div>
</template>

<script>
import ConsultationsContainer from "@/components/ConsultationsContainer.vue";
import { mapActions } from "vuex";

export default {
  name: "SidebarComponent",
  components: {
    ConsultationsContainer,
  },
  methods: {
    ...mapActions(["getConsultations"]),
  }
};
</script>

<style></style>
