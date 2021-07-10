<template>
  <div class="flex h-screen justify-center items-center">
    <form
      @submit.prevent="userRegister()"
      class=" bg-gray-50 p-4 md:p-10 lg:p-10 xl:p-10 rounded-2xl bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-md"
    >
      <h1 class="text-center text-white text-4xl mb-8">Registro Docente</h1>
      <div class="">
        <div class="flex gap-4">
          <div class="">
            <input
              class="block mx-auto text-center mt-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-gray-300 focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
              v-model="user_data.ci"
              type="text"
              placeholder="Cédula de identidad"
              required
            />
            <span class="pl-1 text-yellow-400 text-xs">* Campo requerido</span>
          </div>
          <div>
            <input
              class="block mx-auto text-center mt-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-gray-300 focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
              v-model="user_data.nickname"
              type="text"
              placeholder="Nombre de usuario"
              required
            />
            <span class="pl-1 text-yellow-400 text-xs">* Campo requerido</span>
          </div>
        </div>
        <div>
          <input
            class="block w-full mx-auto text-center mt-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-gray-300 focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
            v-model="user_data.email"
            type="email"
            placeholder="Email"
            required
          />
          <span class="pl-1 text-yellow-400 text-xs">* Campo requerido</span>
        </div>
        <div class="flex gap-4">
          <div>
            <input
              class="block mx-auto text-center mt-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-gray-300 focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
              v-model="user_data.name"
              type="text"
              placeholder="Nombre"
              required
            />
            <span class="pl-1 text-yellow-400 text-xs">* Campo requerido</span>
          </div>
          <input
            class="block mx-auto text-center my-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-gray-300 focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
            v-model="user_data.middle_name"
            type="text"
            placeholder="Segundo nombre"
          />
        </div>
        <div class="flex gap-4">
          <div>
            <input
              class="block mx-auto text-center mt-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-gray-300 focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
              v-model="user_data.surname"
              type="text"
              placeholder="Apellido"
              required
            />
            <span class="pl-1 text-yellow-400 text-xs">* Campo requerido</span>
          </div>
          <input
            class="block mx-auto text-center my-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-gray-300 focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
            v-model="user_data.second_surname"
            type="text"
            placeholder="Segundo Apellido"
          />
        </div>
        <div class="flex gap-4">
          <div>
            <input
              class="block mx-auto text-center mt-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-gray-300 focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
              v-model="user_data.password"
              type="password"
              placeholder="Contraseña"
              required
            />
          </div>
          <div>
            <input
              class="block mx-auto text-center mt-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-gray-300 focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
              v-model="user_data.confirm_password"
              type="password"
              placeholder="Confirme la contraseña"
              required
            />
          </div>
        </div>
      </div>
      <input
        class="block mx-auto mt-10 py-2 px-10 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl cursor-pointer bg-gray-50 bg-opacity-25 hover:bg-opacity-40 outline-none focus:ring-4 ring-white ring-opacity-20 "
        type="submit"
        value="Registrarme"
      />
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
  name: "Register",
  data: () => {
    return {
      user_data: {
        ci: null,
        nickname: "",
        name: "",
        middle_name: "",
        surname: "",
        second_surname: "",
        email: "",
        password: "",
        confirm_password: "",
        type: "teacher",
      },
    };
  },
  computed: {
    ...mapState(["API_URL", "headers"]),
  },
  methods: {
    ...mapActions(["userRegister"]),

    async userRegister() {
      await axios({
        method: "post",
        url: this.API_URL + "/register",
        data: this.user_data,
        headers: this.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data == 1) {
            this.$router.push("login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style></style>
