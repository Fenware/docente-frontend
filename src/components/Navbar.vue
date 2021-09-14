<template>
  <nav
    class="w-full sm:w-1/6 md:w-16 lg:w-16 sm:h-full rounded-2xl | bg-gray-700 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
  >
    <ul
      class="p-2 sm:py-4 sm:px-0 h-full text-center flex flex-row sm:flex-col justify-between"
    >
      <div class="flex gap-2 sm:gap-0 sm:block">
        <li>
          <router-link :to="{ name: 'Home' }"  v-slot="{ isActive }" class="cursor-pointer">
            <span :class="[isActive && 'active']" class="nav-icon mt-1 material-icons">
              home
            </span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Groups' }" v-slot="{ isActive }" class="cursor-pointer">
            <span :class="[isActive && 'active']"  class="nav-icon material-icons">
              groups
            </span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Consultations' }" v-slot="{ isActive }" class="cursor-pointer">
            <span :class="[isActive && 'active']"  class="nav-icon material-icons">
              inbox
            </span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'ChatRooms' }" v-slot="{ isActive }" class="cursor-pointer">
            <span :class="[isActive && 'active']"  class="nav-icon material-icons">
              question_answer
            </span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Schedule' }" v-slot="{ isActive }" class="cursor-pointer">
            <span :class="[isActive && 'active']"  class="nav-icon material-icons">
              date_range
            </span>
          </router-link>
        </li>
      </div>

      
      <div class="flex gap-2 sm:gap-0 sm:block">
        <li class="cursor-pointer">
          <router-link :to="{ name: 'Configuration' }" v-slot="{ isActive }" class="cursor-pointer">
            <span :class="[isActive && 'active']"  class="nav-icon material-icons">
              manage_accounts
            </span>
          </router-link>
        </li>
        <li class="cursor-pointer">
          <span @click="logout()" class="nav-icon material-icons">
            logout
          </span>
        </li>
      </div>
    </ul>
  </nav>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Navbar",
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>

<style lang="css" scoped>
.nav-icon {
  @apply mt-0 px-2 py-1 sm:mt-2 text-3xl text-white transition-colors ease-in-out hover:bg-gray-600 rounded-xl;
}
.active{
  @apply bg-gray-600 transition-colors shadow-lg;
}
</style>
