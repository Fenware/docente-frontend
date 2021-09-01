<template>
  <div v-if="currentRouteName() == 'Login' || currentRouteName() == 'Register'">
    <router-view />
  </div>
  <div class="flex items-center min-h-screen max-h-screen max-w-screen" v-else>
    <div
      class="flex flex-col sm:flex-row sm:justify-between h-92vh w-95per mx-auto | bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-lg | rounded-2xl shadow-md"
    >
      <Navbar />
      <Main class="mt-5 sm:mt-0" />
      <!-- <Sidebar /> -->
    </div>
  </div>
</template>
<script>
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
    currentRouteName() {
      return this.$route.name;
    },
  },
};
</script>

<style>
body {
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
/* ----------------- Buttons ----------------- */

.btn-success {
  @apply px-3 py-1 min-w-max font-semibold rounded-md transition-colors border-b-2 hover:border-green-500 border-green-400 bg-green-200 hover:bg-green-300 text-green-900 cursor-pointer;
}
.btn-danger {
  @apply px-3 py-1 min-w-max font-semibold rounded-md transition-colors border-b-2 hover:border-red-500 border-red-400 bg-red-200 hover:bg-red-300 text-red-900 cursor-pointer;
}
.btn-warning {
  @apply px-3 py-1 min-w-max font-semibold rounded-md transition-colors border-b-2 hover:border-yellow-500 border-yellow-400 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 cursor-pointer;
}
.btn-info {
  @apply px-3 py-1 min-w-max font-semibold rounded-md transition-colors border-b-2 hover:border-gray-500 border-indigo-400 bg-indigo-200 hover:bg-indigo-300 text-blue-900 cursor-pointer;
}
.btn-disabled {
  @apply px-3 py-1 min-w-max font-semibold rounded-md transition-colors border-b-2  border-gray-400 bg-gray-200 text-gray-900 cursor-default;
}

/* --------------------------------------------- */

.h-92vh {
  height: 92vh;
}
.w-95per {
  width: 95%;
}
::-webkit-scrollbar {
  width: 5px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgb(242, 242, 242);
  border-radius: 1rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.05s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
