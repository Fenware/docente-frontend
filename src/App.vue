<template>
  <div class="" v-if="currentRouteName() == 'Login' || currentRouteName() == 'Register'">
    <router-view />
  </div>
  <div class="flex items-center min-h-screen max-h-screen max-w-screen" v-else>
    <div
      class=" flex lg:justify-between h-85vh w-90per mx-auto | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl | rounded-3xl shadow-md "
    >
      <Navbar />
      <Main />
      <!-- <Sidebar /> -->
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import Navbar from "@/components/Navbar";
import Main from "@/components/Main";
/* import Sidebar from "@/components/Sidebar"; */

export default {
  components: {
    Navbar,
    Main,
    /* Sidebar, */
  },
  methods: {
    ...mapActions(["syncToken"]),
    currentRouteName() {
      return this.$route.name;
    }
  },
  beforeCreated(){
    if(this.currentRouteName() != "Register"){
      this.syncToken();
    }
  }
};
</script>

<style>
body {
  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600&display=swap");
  font-family: "Nunito", sans-serif;
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
</style>
