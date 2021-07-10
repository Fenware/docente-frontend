<template>
  <div class="">
    <h1 class="text-white text-center text-3xl pt-1">Docente Chathink</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from "vuex";

export default {
  name: "Home",
  methods: {
    ...mapActions(["syncToken", "checkSession"]),
  },
  created() {
    this.syncToken();
    this.checkSession();
  },
};
</script>
