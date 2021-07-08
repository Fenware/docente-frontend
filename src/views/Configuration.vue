<template>
  <div>
    <h1 class="text-white text-center text-3xl pt-1">
      Configuración de usuario
    </h1>

    <div
      class="mt-10 p-5 bg-white rounded-2xl bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-md"
    >

      <div class="">
        <!-- <img class=" w-10" :src="avatar" alt=""> -->
      </div>
      <div class="mt-3">
        <div class="flex items-center ">
          <div
            class="flex items-center  text-white rounded-full shadow-xl bg-gray-300 bg-opacity-25"
          >
            <span class="text-white pl-3">Nickname: </span>
            <p
              class="ml-2 px-3 py-1 font-bold | text-white rounded-full shadow-lg bg-white bg-opacity-20"
            >
              {{ user.nickname }}
            </p>
          </div>
        </div>
      </div>


      <div class="mt-3">
        <div class="flex items-center ">
          <div
            class="flex items-center  text-white rounded-full shadow-xl bg-gray-300 bg-opacity-25"
          >
            <span class="text-white pl-3">Cédula de identidad: </span>
            <p
              class="ml-2 px-3 py-1 font-bold oldstyle-nums tracking-widest | text-white rounded-full shadow-lg bg-white bg-opacity-20"
            >
              {{ user.ci }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <div
          class="flex items-center  text-white rounded-full shadow-xl bg-gray-300 bg-opacity-25"
        >
          <span class="text-white pl-3">Nombre completo: </span>
          <p
            class="ml-2 px-3 py-1 font-bold | text-white rounded-full shadow-lg bg-white bg-opacity-20"
          >
            {{ user.name }}
            {{ user.middle_name }}
            {{ user.surname }}
            {{ user.second_surname }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "Configuration",
  data: ()=>{
    return{
      avatar: "../assets/avatars/001-man.svg"
    }
  },
  computed: {
    ...mapState(["API_URL", "headers", "user"]),
  },
  methods: {
    ...mapMutations(["setUserData"]),
    ...mapActions(["syncToken", "checkSession"]),
    async getUserData() {
      await axios({
        method: "get",
        url: this.API_URL + "/user",
        headers: this.headers,
      })
        .then((res) => {
          this.setUserData(res.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.syncToken();
    this.checkSession();
    this.getUserData();
  },
};
</script>

<style></style>
