<template>
  <div
    class="w-72 text-white h-full rounded-3xl | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
  >
    <h3 class=" px-1 text-xl text-center pt-2">Consultas pendientes</h3>
    <div class="mt-3 p-2 h-5/6 overflow-y-auto">
      <ConsultationsContainer/>
    </div>
  </div>
</template>

<script>
import ConsultationsContainer from '@/components/ConsultationsContainer.vue';
import { mapActions } from 'vuex';
export default {
  name: "SidebarComponent",
  components:{
    ConsultationsContainer,
  },
  methods:{
    ...mapActions(["syncConsultations"])
  },
  created() {
    this.syncConsultations();
  },
};
</script>

<style></style>
