<template>
  <div class="flex h-screen justify-center items-center">
    <form
      @submit.prevent="login(user)"
      class=" bg-gray-50 p-4 md:p-10 lg:p-10 xl:p-10 rounded-2xl bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-md"
    >
      <h1 class="text-center text-white text-4xl mb-12">Ingresar</h1>
      <div class="">
        <input
          class="block w-72 mx-auto my-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-white focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
          v-model="user.user"
          type="text"
          placeholder="Nombre de usuario o Email "
          required
        />
        <input
          class="block w-72 mx-auto my-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-white focus:placeholder-opacity-0 focus:ring-4 ring-white ring-opacity-20"
          v-model="user.password"
          type="password"
          placeholder="Contraseña"
          required
        />
      </div>
      <input
        class="block mx-auto mt-10 py-2 px-10 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl cursor-pointer bg-gray-50 bg-opacity-25 hover:bg-opacity-40 outline-none focus:ring-4 ring-white ring-opacity-20"
        type="submit"
        value="Ingresar"
      />
      <div class="text-center text-white mt-2">
        <span class="block mb-3">O</span>
        <router-link :to="{ name: 'Register' }" class=" mx-auto py-2 px-5 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl cursor-pointer bg-gray-50 bg-opacity-25 hover:bg-opacity-40 outline-none focus:ring-4 ring-white ring-opacity-20">
          Registro
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Login",
  data: function() {
    return {
      user: {
        user: "lucaspintos909@gmail.com",
        password: "lucas",
        type: "teacher",
      },
    };
  },
  computed: {
    ...mapState(["API_URL"]),
  },
  methods: {
    ...mapActions(["login"]),
  },
};
</script>

<style></style>
