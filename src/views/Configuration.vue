<template>
  <div>
    <h1 class="text-white text-center text-3xl pt-1">
      Configuración de usuario
    </h1>

    <div class=" flex justify-center">
      <div
        class="mt-10 p-5  bg-white rounded-2xl bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-md"
      >
        <div class="text-white">
          <div v-if="!editAvatarMode">
            <img
              id="avatar_img"
              class="max-h-32 mx-auto mb-6 "
              :src="require('@/assets/avatars/' + user.avatar)"
              alt="avatar"
            />
            <div>
              <button
                class="block m-3 px-3 text-sm py-1 mx-auto  transition-colors duration-200 hover:bg-opacity-20 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-full"
                @click="changeAvatarEditMode(true)"
              >
                Cambiar avatar
                <i
                  class="fas fa-pencil-alt text-yellow-300 mx-1 text-md drop-shadow-lg "
                ></i>
              </button>
            </div>
          </div>

          <div
            v-else
            class=" px-2 pb-5 bg-white rounded-2xl bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-sm"
          >
            <div class="flex justify-between items-center">
              <span class="text-center my-2 mx-2">Seleccione uno</span>
              <div>
                <button
                  @click="changeAvatar()"
                  class="  bg-green-700 py-1 px-2 text-xs rounded-full duration-300 transition hover:bg-green-600 "
                >
                  Guardar seleccion
                </button>
                <button
                  @click="changeAvatarEditMode(false)"
                  class=" ml-2 bg-red-700 py-1 px-2 text-xs rounded-full duration-300 transition hover:bg-red-600 "
                >
                  Cancelar
                </button>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 px-5 mt-2">
              <button
                v-for="avatar_data in avatars"
                :key="avatar_data.id"
                :id="avatar_data.id"
                @click="selectAvatar(avatar_data.id)"
                class="w-16 transition duration-200 ease-in-out hover:bg-opacity-20 focus:bg-opacity-30 transform bg-white rounded-2xl bg-opacity-10 backdrop-filter backdrop-blur-xl drop-shadow-xl cursor-pointer"
              >
                <img
                  class="max-h-14 my-3 mx-1"
                  :src="require('@/assets/avatars/' + avatar_data.file)"
                  alt="avatar"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="mt-10">
          <div class="flex items-center ">
            <div
              v-if="!editNicknameMode"
              class="flex items-center  text-white rounded-full shadow-xl bg-gray-300 bg-opacity-25"
            >
              <span class="text-white pl-3">Nickname: </span>
              <p
                class="ml-2 px-3 py-1 font-bold | text-white rounded-full shadow-lg bg-white bg-opacity-20"
              >
                {{ user.nickname }}
                <i
                  @click="changeNicknameEditMode(true)"
                  class="fas fa-pencil-alt text-yellow-300 transition-colors hover:text-yellow-400 ml-1 text-md drop-shadow-lg cursor-pointer"
                ></i>
              </p>
            </div>

            <div
              v-else
              class="flex items-center  text-white rounded-full shadow-xl bg-gray-300 bg-opacity-25"
            >
              <span class="text-white pl-3">Editar nickname: </span>
              <p
                class="ml-2 px-3 py-1 font-bold | text-white rounded-full shadow-lg bg-white bg-opacity-20"
              >
                <input
                  id="nickname_input"
                  class="bg-transparent outline-none"
                  type="text"
                  v-on:keyup.enter="editUserNickName()"
                  :value="user.nickname"
                  autofocus
                />
                <i
                  @click="editUserNickName()"
                  class="fas fa-save text-green-300 transition-colors transition-transform transform hover:scale-110 hover:text-green-400 ml-1 text-md drop-shadow-lg cursor-pointer"
                ></i>
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
                class="ml-2 px-3 py-1 font-bold tracking-widest | text-white rounded-full shadow-lg bg-white bg-opacity-20"
              >
                {{ user.ci }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <div class="flex items-center ">
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

        <div class="mt-3">
          <div class="flex items-center ">
            <div
              class="flex items-center  text-white rounded-full shadow-xl bg-gray-300 bg-opacity-25"
            >
              <span class="text-white pl-3">Email: </span>
              <p
                class="ml-2 px-3 py-1 font-bold | text-white rounded-full shadow-lg bg-white bg-opacity-20"
              >
                {{ user.email }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-5 text-white">
          <button
            @click="deleteUser()"
            class="px-2 py-1 rounded-lg bg-red-500 hover:bg-red-600 transition-colors ease-linear"
          >
            <i class="fas fa-exclamation-triangle"></i>
            Darme de baja
          </button>
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
  data: () => {
    return {
      editAvatarMode: false,
      editNicknameMode: false,
      avatar: "",
      selectedAvatar: null,
      avatars: [
        { id: 1, file: "01-man.svg" },
        { id: 2, file: "02-boy.svg" },
        { id: 3, file: "03-woman.svg" },
        { id: 4, file: "04-boy-1.svg" },
        { id: 5, file: "05-girl-1.svg" },
        { id: 6, file: "06-woman-3.svg" },
        { id: 7, file: "07-boy-2.svg" },
      ],
    };
  },
  computed: {
    ...mapState(["API_URL", "headers", "user"]),
  },
  methods: {
    ...mapMutations(["setUserData"]),
    ...mapActions(["logout"]),
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
    async setUserAvatar(avatar) {
      let data = {
        nickname: this.user.nickname,
        avatar: avatar,
      };
      await axios({
        method: "put",
        url: this.API_URL + "/user",
        data: data,
        headers: this.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            this.user.avatar = avatar;
          } else {
            console.log("Error: setUserAvatar");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeAvatarEditMode(condition) {
      this.editAvatarMode = condition;
      this.selectedAvatar = null;
    },
    changeNicknameEditMode(condition) {
      this.editNicknameMode = condition;
    },
    selectAvatar(id) {
      let selectedAvatar = document.getElementById(id);
      this.selectedAvatar = id;

      this.avatars.forEach((avatar) => {
        let avatarAny = document.getElementById(avatar.id);

        avatarAny.classList.remove("scale-110");
        avatarAny.classList.remove("bg-opacity-30");
        avatarAny.classList.add("hover:bg-opacity-20");

        if (avatar.id === id) {
          selectedAvatar.classList.remove("hover:bg-opacity-20");
        }
      });

      selectedAvatar.classList.add("scale-110");
      selectedAvatar.classList.add("bg-opacity-30");
    },
    changeAvatar() {
      this.avatars.forEach((avatar) => {
        if (avatar.id === this.selectedAvatar) {
          this.changeAvatarEditMode(false);
          this.setUserAvatar(avatar.file);
        }
      });
    },
    async editUserNickName() {
      let newUserNickname = document.getElementById("nickname_input").value;
      let data = {
        nickname: newUserNickname,
        avatar: this.user.avatar,
      };
      await axios({
        method: "put",
        url: this.API_URL + "/user",
        data: data,
        headers: this.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            this.user.nickname = newUserNickname;
            this.changeNicknameEditMode(false);
          } else {
            console.log("Error: setUserAvatar");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteUser() {
      await axios({
        method: "delete",
        url: this.API_URL + "/user",
        headers: this.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            this.logout();
          } else {
            console.log("Error: deleteUser");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.getUserData();
  },
};
</script>

<style></style>
