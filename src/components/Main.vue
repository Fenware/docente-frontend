<template>
  <main class=" mx-auto px-3" v-if="isLoginView()">
      <router-view />
  </main>
</template>

<script>

import { mapActions } from "vuex";

export default {
  name: "MainComponent",
  methods: {
    ...mapActions(["syncToken", "checkSession"]),
    isLoginView() {
      return this.$route.name != "Login" || this.$route.name != "Register";
    },
  },
  created() {
    this.syncToken();
  },
};
</script>

<style></style>
