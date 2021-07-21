<template>
  <nav
    class="w-1/6 md:w-16 lg:w-16 h-full rounded-3xl | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
  >
    <ul class="pt-4 h-full text-center flex flex-col justify-between">
      <div>
        <li>
          <router-link :to="{ name: 'Home' }" class="cursor-pointer">
            <i :class="'fa-home ' + icon_class"></i>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Groups' }" class="cursor-pointer">
            <i :class="'fa-users ' + icon_class"></i>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Subjects' }" class="cursor-pointer">
            <i :class="'fa-book ' + icon_class"></i>
          </router-link>
        </li>
        <li class="cursor-pointer">
          <i :class="'fa-user ' + icon_class"></i>
        </li>
      </div>
      <div>
        <li class="cursor-pointer">
          <router-link :to="{ name: 'Configuration' }" class="cursor-pointer">
            <i :class="'fa-cog ' + icon_class"></i>
          </router-link>
        </li>
        <li class="cursor-pointer">
          <i
            @click="logout()"
            :class="'fa-sign-out-alt  mb-4 ' + icon_class"
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
        "fas mt-6 text-3xl text-white duration-500 ease-in-out  transition-colors transition-transform filter hover:text-gray-200 transform hover:scale-110 drop-shadow-lg",
    };
  },
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>

<style lang="css" scoped></style>
