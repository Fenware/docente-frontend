<template>
  <div class="flex h-screen justify-center items-center">
    <form
      @submit.prevent="login(user)"
      class=" bg-gray-50 p-4 md:p-10 lg:p-10 xl:p-10 rounded-2xl bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-md"
    >
      <h1 class="text-center text-white text-4xl mb-12">
        {{
          getWord({file:"login",word:"login_header",lang})
        }}
      </h1>
      <div class="">
        <input
          class="block w-72 mx-auto my-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-white focus:placeholder-transparent focus:ring-4 ring-white ring-opacity-20"
          v-model="user.user"
          type="text"
          :placeholder="getWord({file:'login',word:'user_input',lang})"
          required
        />
        <input
          class="block w-72 mx-auto my-5 p-2 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-white focus:placeholder-opacity-0 focus:ring-4 ring-white ring-opacity-20"
          v-model="user.password"
          type="password"
          :placeholder="getWord({file:'login',word:'password',lang})"
          required
        />
      </div>
      <input
        class="block mx-auto mt-10 btn-success px-10 py-1.5 border-b-4"
        type="submit"
        :value="getWord({file:'login',word:'login',lang})"
      />
      <div class="text-center text-white mt-2">
        <span class="block mb-3">O</span>
        <router-link :to="{ name: 'Register' }" class=" mx-auto shadow-lg btn-info">
        {{  getWord({file:'login',word:'register',lang})  }}
        </router-link>
      </div>
    </form>
    <ToggleLanguageButton class="absolute bottom-0 right-0 m-2"/>
  </div>
</template>

<script>
import { mapActions,mapState } from "vuex";
import { getWord } from "@/utils/lang";
import ToggleLanguageButton from '@/components/ToggleLanguageButton.vue';

export default {
  name: "Login",
  data: function() {
    return {
      user: {
        user: "",
        password: "",
        type: "teacher",
      },
    };
  },
  computed: {
    ...mapState(['lang']),
  },
  methods: {
    ...mapActions(["login"]),
    getWord,
  },
  created(){
    //console.log(this.lang);
  },
  components: {
    ToggleLanguageButton,
  }
};
</script>

<style></style>
