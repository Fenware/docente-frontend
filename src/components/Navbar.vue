<template>
  <nav
    class="w-full sm:w-1/6 md:w-16 lg:w-16 sm:h-full rounded-2xl | bg-gray-700 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
  >
    <ul
      class="p-2 sm:py-4 sm:px-0 h-full text-center flex flex-row sm:flex-col justify-between"
    >
      <div class="flex gap-2 sm:gap-0 sm:block">
        <li v-for="item in nav_items" :key="item" >
          <router-link class="relative group" :to="{ name: item.view }" v-slot="{ isActive }">
            <span
              :class="[isActive && 'active']"
              class="nav-icon mt-1 material-icons"
            >
              {{ item.icon }}
            </span>

            <span class="tooltip group-hover:scale-100">{{ item.tooltip }}</span>
          </router-link>
        </li>
      </div>

      
      <div class="flex gap-2 sm:gap-0 sm:block">
        <li>
          <router-link class="relative group" :to="{ name: 'UserConfiguration' }"  v-slot="{ isActive }">
            <span
              :class="[isActive && 'active']"
              class="nav-icon mt-1 material-icons"
            >
              manage_accounts
            </span>

            <span class="tooltip group-hover:scale-100">Configuración de usuario</span>
          </router-link>
        </li>
        
        <li class="group relative cursor-pointer">
          <a  @click="logout()">
            <span class="nav-icon material-icons">
              logout
            </span>
          </a>
          
          <span class="tooltip group-hover:scale-100 ml-3">Cerrar sesión</span>
        </li>
      </div>
    </ul>
  </nav>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Navbar",
  data: () => {
    return {
      nav_items: [
        { view: "Home", icon: "home", tooltip: "Inicio" },
        { view: "Groups", icon: "groups", tooltip: "Grupos" },
        { view: "Consultations", icon: "inbox", tooltip: "Consultas" },
        { view: "ChatRooms", icon: "question_answer", tooltip: "Salas de chat" },
        { view: "Schedule", icon: "date_range", tooltip: "Tus horarios" },
      ],
    };
  },
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

.tooltip {
  @apply transform absolute mt-3.5 w-auto p-2 m-2 min-w-max left-12 rounded-md shadow-lg text-white bg-gray-900 text-sm font-bold transition-all duration-100 scale-0 origin-left;
}
</style>
