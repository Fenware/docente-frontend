<template>
  <div
    class=""
    v-if="currentRouteName() == 'Login' || currentRouteName() == 'Register'"
  >
    <router-view />
  </div>
  <div class="flex items-center min-h-screen max-h-screen max-w-screen" v-else>
    <div
      class=" flex flex-col sm:flex-row sm:justify-between h-85vh w-90per mx-auto | bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-lg | rounded-2xl shadow-md  "
    >
      <Navbar />
      <Main class="mt-5 sm:mt-0"/>
      <Sidebar />
    </div>

  </div>
</template>
<script>
import Navbar from "@/components/Navbar";
import Main from "@/components/Main";
import Sidebar from "@/components/Sidebar";

export default {
  components: {
    Navbar,
    Main,
    Sidebar,
  },
  methods: {
    currentRouteName() {
      return this.$route.name;
    },
  },
};
</script>

<style>
body {
  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600&display=swap");
  font-family: "Montserrat", sans-serif !important;
  /* background: linear-gradient(to right top ,#175AD4,#65DF9D); */
  background-image: url("./assets/background.svg");
  background-image: no-repeat;
  background-image: fixed;
  background-image: center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;

  height: 100vh;
  width: 100vw;
}
.h-85vh {
  height: 90vh;
}
.w-90per {
  width: 95%;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  cursor: pointer;
}

::-webkit-scrollbar-track {
  background: #ddd;
}

::-webkit-scrollbar-thumb {
  background: #666;
}
</style>
