<template>
  <main class="mx-auto w-full overflow-y-auto" v-if="isLoginView()">
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

<style>
main {
  font-family: "Montserrat", sans-serif !important;
}
</style>
