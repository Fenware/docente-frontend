<template>
  <div
    class="max-w-screen-sm mx-auto my-4 text-white bg-gray-600 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-2xl"
  >
    <div
      class="flex justify-between py-1 pl-5 items-center bg-gray-200 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-t-2xl"
    >
      <div class="flex items-center">
        <span class="material-icons">manage_accounts</span>
        <h2 class="px-2 font-extrabold select-none">Perfil del usuario</h2>
      </div>
      <div class="flex items-center ">
        <!-- <button
          @click="createUser()"
          class="px-3 m-1 py-1 text-xs font-semibold transition-colors rounded-md bg-indigo-200 hover:bg-indigo-300 text-blue-900"
        >
          Guardar
        </button> -->

        <!-- <button
          class="btn-info rounded-tr-xl px-2 m-1 py-1 border-0 text-xs flex items-center"
        >
          <span class="material-icons text-sm mr-1">arrow_back</span>

          Volver
        </button> -->
      </div>
    </div>

    <!-- Cuerpo__________________________ -->

    <div
      class="p-3 border-b-2 border-l-2 border-r-2 border-gray-700 rounded-b-2xl"
    >
      <div class="grid grid-cols-2 gap-2 px-10">
        <div class="mb-5 mt-2 col-span-2 flex items-center">
          <div class="p-2 w-5/12 mr-10 text-center">
            <img
              class="w-full mr-5"
              :src="
                require('@/assets/avatars/' +
                  (edited_user.avatar ? edited_user.avatar : '01-man.svg'))
              "
              alt="avatar"
            />
            <button @click="openModal()" class="mt-2 btn-info text-xs border-0">
              Cambiar avatar
            </button>
          </div>
          <div class="w-full">
            <div class="block">
              <span class="block select-none text-xs">
                Cédula de identidad
              </span>
              <p class="font-medium text-2xl tracking-widest px-2">
                {{ edited_user.ci }}
              </p>
            </div>

            <div class="block mt-2 ">
              <label for="nickname" class="block select-none text-xs"
                >Nombre de usuario</label
              >
              <input
                id="nickname"
                class="input w-full"
                type="text"
                v-model="edited_user.nickname"
                :placeholder="
                  edited_user.nickname
                    ? 'Ingrese el nombre de usuario'
                    : 'Ninguno'
                "
              />
            </div>
          </div>
        </div>

        <div>
          <label for="name" class="block select-none text-xs">Nombre</label>
          <input
            id="name"
            disabled
            class="input-disabled"
            type="text"
            v-model="edited_user.name"
          />
        </div>

        <div>
          <label for="middle_name" class="block select-none text-xs"
            >Segundo nombre</label
          >
          <input
            id="middle_name"
            disabled
            class="input-disabled"
            type="text"
            v-model="edited_user.middle_name"
            :placeholder="
              !edited_user.middle_name ? 'Ninguno' : 'Ingrese el segundo nombre'
            "
          />
        </div>
        <div>
          <label for="surname" class="block select-none text-xs"
            >Apellido</label
          >
          <input
            id="surname"
            disabled
            class="input-disabled"
            type="text"
            v-model="edited_user.surname"
          />
        </div>

        <div>
          <label for="second_surname" class="block select-none text-xs"
            >Segundo apellido</label
          >
          <input
            id="second_surname"
            disabled
            class="input-disabled"
            type="text"
            v-model="edited_user.second_surname"
            :placeholder="
              !edited_user.second_surname
                ? 'Ninguno'
                : 'Ingrese el segundo apellido'
            "
          />
        </div>
        <div class=" col-span-2 mt-">
          <label for="second_surname" class="block select-none text-xs"
            >Email</label
          >
          <input
            id="email"
            disabled
            class="input-disabled w-full"
            type="email"
            v-model="edited_user.email"
            :placeholder="
              !edited_user.email ? 'Ninguno' : 'Ingrese el segundo apellido'
            "
          />
        </div>
      </div>
      <div class="mt-5">
        <div
          v-show="wasEdited"
          class="flex justify-center text-yellow-200 items-center"
        >
          <span class="material-icons">warning</span>
          <span class="text-sm mt-0.5"> Tienes cambios sin guardar</span>
        </div>
        <div class="flex justify-between gap-2 ">
          <button
            @click="saveChanges()"
            :disabled="!wasEdited"
            :class="wasEdited ? 'btn-success' : 'btn-disabled'"
            class="text-sm mt-5 px-3 flex items-center"
          >
            <span class="mt-0.5">Guardar cambios</span>
          </button>
          <button
            @click="removeUser()"
            class="btn-danger text-sm mt-5 pt-0.5 px-3 flex items-center"
          >
            <span class="material-icons text-md mr-1">warning</span>
            <span class="mt-0.5">Darme de baja</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div
      class="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden hidden justify-center items-center animated fadeIn faster rounded-2xl"
      style="background: rgba(0,0,0,.5);"
    >
      <div
        style="max-height: 65vh;"
        class="border-2 border-gray-500 modal-container bg-gray-900 w-11/12 md:max-w-md mx-auto rounded-xl shadow-lg z-50 overflow-y-auto"
      >
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center">
            <p class="text-2xl font-bold">Cambiar avatar</p>
            <div class="modal-close cursor-pointer z-50" @click="modalClose()">
              <span class="material-icons text-red-400">close</span>
            </div>
          </div>
          <!--Body-->
          <div class="my-10">
            <div class="flex justify-center flex-wrap gap-3 px-5 mt-2">
              <button
                v-for="avatar_data in avatars"
                :key="avatar_data.id"
                :id="avatar_data.id"
                @click="selectAvatar(avatar_data.id)"
                class="w-16 transition duration-200 ease-in-out hover:bg-opacity-20 focus:bg-opacity-30 transform bg-white rounded-xl bg-opacity-10 cursor-pointer"
              >
                <img
                  class="max-h-14 my-3 mx-1"
                  :src="require('@/assets/avatars/' + avatar_data.file)"
                  alt="avatar"
                />
              </button>
            </div>
          </div>
          <!--Footer-->
          <div class="flex justify-center pt-2 mt-2">
            <button
              @click="modalClose()"
              class="btn-success flex items-center py-0.5"
            >
              Seleccionar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { confirmModal, showAlert } from "@/utils/alerts.js";

export default {
  name: "UserConfiguration",
  data: function() {
    return {
      edited_user: {},
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
  created() {
    this.getUserData().then(() => (this.edited_user = { ...this.user }));
  },
  computed: {
    ...mapState({
      user: (state) => state.userProfile.user,
    }),
    wasEdited() {
      return (
        this.user.avatar != this.edited_user.avatar ||
        this.user.nickname != this.edited_user.nickname
      );
    },
  },
  methods: {
    ...mapActions(["getUserData", "deleteUser", "editUser"]),
    validateData() {
      if (this.edited_user.name.length == 0) {
        showAlert({
          type: "error",
          message: `Debes ingresar un nombre`,
        });
        return false;
      } else if (this.edited_user.surname.length == 0) {
        showAlert({
          type: "error",
          message: `Debes ingresar un apellido`,
        });
        return false;
      } else if (this.edited_user.avatar.length == 0) {
        showAlert({
          type: "error",
          message: `Debes seleccionar un avatar válido`,
        });
        return false;
      } else if (this.edited_user.nickname.length == 0) {
        showAlert({
          type: "error",
          message: `Debes ingresar un nombre de usuario`,
        });
        return false;
      } else {
        return true;
      }
    },
    removeUser() {
      confirmModal({
        function: this.deleteUser,
        text: `<span class="text-white"> <span class="font-medium">¿Deseas darte de baja en el sistema?</span> <br> ¡No podrás volver a ingresar!</span>`,
        data: {},
        confirmButtonText: "Si, darme de baja",
      });
    },
    saveChanges() {
      if (this.validateData()) {
        this.editUser(this.edited_user);
      }
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
          this.edited_user.avatar = avatar.file;
        }
      });

      selectedAvatar.classList.add("scale-110");
      selectedAvatar.classList.add("bg-opacity-30");
    },
    openModal() {
      let modal = document.querySelector(".main-modal");
      modal.classList.remove("fadeOut");
      modal.classList.add("fadeIn");
      modal.style.display = "flex";
      this.selectAvatar(
        this.avatars.find((avatar) => avatar.file == this.user.avatar).id
      );
    },
    modalClose() {
      let modal = document.querySelector(".main-modal");
      modal.classList.remove("fadeIn");
      modal.classList.add("fadeOut");
      setTimeout(() => {
        modal.style.display = "none";
      }, 500);
    },
  },
};
</script>

<style>
.w-90per {
  width: 90%;
}
.input {
  @apply w-90per font-medium px-2 py-0.5 transition-all bg-opacity-0 focus:bg-opacity-10 hover:bg-opacity-10 bg-white rounded-md text-xl outline-none;
}
.input-disabled {
  @apply w-90per font-medium px-2 py-0.5 bg-opacity-0 bg-white rounded-md text-xl outline-none;
}
</style>
