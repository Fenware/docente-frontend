<template>
  <main class="mx-auto px-3" v-if="isLoginView()">
      <router-view />
  </main>
</template>

<script>
export default {
  name: "MainComponent",
  methods: {
    isLoginView() {
      return this.$route.name != "Login" || this.$route.name != "Register";
    },
  },
};
</script>

<style></style>
