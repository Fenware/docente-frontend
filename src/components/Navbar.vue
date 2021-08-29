<template>
  <nav
    class="w-full sm:w-1/6 md:w-16 lg:w-16 sm:h-full rounded-2xl | bg-gray-700 border-r-2 border-t-2 border-b-2 border-gray-700  bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
  >
    <ul
      class="p-2 sm:py-4 sm:px-0 h-full text-center flex flex-row sm:flex-col justify-between"
    >
      <div class="flex gap-2 sm:gap-0 sm:block">
        <li>
          <router-link :to="{ name: 'Home' }" class="cursor-pointer">
            <i class="fa-home" :class="icon_class"></i>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Groups' }" class="cursor-pointer">
            <i class="fa-users" :class="icon_class"></i>
          </router-link>
        </li>
        <!-- <li>
          <router-link :to="{ name: 'Subjects' }" class="cursor-pointer">
            <i class="fa-book" :class="icon_class"></i>
          </router-link>
        </li> -->
        <!-- <li class="cursor-pointer">
          <i :class="'fa-user ' + icon_class"></i>
        </li> -->
      </div>
      <div class="flex gap-2 sm:gap-0 sm:block">
        <li class="cursor-pointer">
          <router-link :to="{ name: 'Configuration' }" class="cursor-pointer">
            <i class="fa-cog" :class="icon_class"></i>
          </router-link>
        </li>
        <li class="cursor-pointer">
          <i
            @click="logout()"
            class="fa-sign-out-alt  mb-4 "
            :class="icon_class"
          ></i>
        </li>
      </div>
    </ul>
  </nav>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Navbar",
  data: function() {
    return {
      icon_class:
        "fas sm:mt-6 text-3xl text-white transition-colors transition-transform duration-500 ease-in-out filter hover:text-gray-200 transform hover:scale-110 drop-shadow-lg",
    };
  },
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>

<style lang="css" scoped></style>
