<template>
  <div
    class="antialiased sans-serif text-white h-full  items-center flex flex-col"
  >
    <h2
      v-show="step !== 'complete'"
      class="font-semibold text-center text-3xl pt-2"
    >
      Registro de docente
    </h2>

    <form
      class="flex flex-col justify-between w-full h-full"
      @submit.prevent="nextStep()"
    >
      <div class="w-9/12 mx-auto px-5 py-5">
        <!-- <div v-show.transition="step === 'complete'"> -->
        <div v-show="step === 'complete'">
          <div class="rounded-lg p-10 flex items-center justify-center">
            <div>
              <h2 class="text-2xl mb-4 text-center font-bold">
                Registro exitoso
              </h2>

              <div class="text-white text-center my-8">
                <p>
                  ¡{{ user.name }} {{ user.surname }} te has registrado
                  correctamente!
                </p>
                <p>
                  Debes esperar a que un administrador acepte la solicitud de
                  registro.
                </p>
              </div>

              <div class="flex justify-around mt-10">
                <router-link
                  :to="{ name: 'Login' }"
                  class="btn-info text-md px-4 py-1 mx-auto"
                  type="button"
                >
                  Volver al login
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div v-show="step !== 'complete'">
          <!-- Top Navigation -->

          <div class="border-b-2 pt-4 pb-3">
            <div
              class="uppercase tracking-wide text-xs font-bold text-indigo-400 mb-1 leading-tight"
            >
              <span>Paso: {{ step }} de 4</span>
            </div>
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div class="flex-1">
                <div v-show="step === 1">
                  <div class="text-xl font-bold leading-tight">
                    Datos personales
                  </div>
                </div>

                <div v-show="step === 2">
                  <div class="text-xl font-bold leading-tight">
                    Unir a grupo
                  </div>
                </div>

                <div v-show="step === 3">
                  <div class="text-lg font-bold leading-tight">
                    Perfil de usuario
                  </div>
                </div>

                <div v-show="step === 4">
                  <div class="text-lg font-bold leading-tight">
                    Seguridad de la cuenta
                  </div>
                </div>
              </div>

              <div class="flex items-center md:w-64">
                <div class="w-full bg-white bg-opacity-80 rounded-full mr-2">
                  <div
                    :style="
                      'width: ' + parseInt((step / steps_amount) * 100) + '%'
                    "
                    class="rounded-full bg-green-500 text-xs leading-none h-2 text-center text-white"
                  ></div>
                </div>
                <span class="text-xs tracking-wider w-10 text-gray-300">
                  <!-- {{ parseInt(((step - 1) / steps_amount) * 100) + "%" }} -->
                  {{ step + "/" + steps_amount }}
                </span>
              </div>
            </div>
          </div>
          <!-- /Top Navigation -->

          <!-- Step Content -->
          <div class="max-w-5xl mx-auto py-10">
            <div
              v-if="step === 1"
              class="grid grid-cols-2 gap-5 justify-center"
            >
              <div class="">
                <label class="font-medium text-sm mb-1 block" for="firstname"
                  >Primer nombre *</label
                >
                <input
                  id="firstname"
                  v-model="user.name"
                  autocomplete="off"
                  class="input"
                  placeholder="Ingrese su nombre"
                  required
                  type="text"
                />
              </div>

              <div>
                <label class="font-medium text-sm mb-1 block" for="middle_name"
                  >Segundo nombre</label
                >
                <input
                  id="middle_name"
                  v-model="user.middle_name"
                  autocomplete="off"
                  class="input"
                  placeholder="Ingrese su segundo nombre"
                  type="text"
                />
              </div>

              <div class="">
                <label class="font-medium text-sm mb-1 block" for="surname"
                  >Primer apellido *</label
                >
                <input
                  id="surname"
                  v-model="user.surname"
                  autocomplete="off"
                  class="input"
                  placeholder="Ingrese su apellido"
                  required
                  type="text"
                />
              </div>

              <div class="">
                <label
                  class="font-medium text-sm mb-1 block"
                  for="second_surname"
                  >Segundo apellido</label
                >
                <input
                  id="second_surname"
                  v-model="user.second_surname"
                  autocomplete="off"
                  class="input"
                  placeholder="Ingrese su segundo apellido"
                  type="text"
                />
              </div>

              <span
                class="mt-2 col-span-2 text-right  text-sm font-bold text-yellow-200"
                >* campos obligatorios</span
              >
            </div>

            <!-- ------------------------------------------- -->
            <div v-if="step === 2" class="grid grid-cols-2">
              <div class="flex flex-col gap-3">
                <div class="col-span-2 relative">
                  <label class="font-medium text-sm mb-1 block" for="ci"
                    >Cédula de identidad</label
                  >
                  <div class="">
                    <input
                      id="ci"
                      v-model="user.ci"
                      autocomplete="off"
                      class="input placeholder"
                      :class="
                        user.ci.toString().length === 8 &&
                        !ciIsTaken &&
                        ciIsValid
                          ? 'ring-2 ring-green-500'
                          : user.ci.toString().length === 8
                          ? 'ring-2 ring-red-500'
                          : ''
                      "
                      max="99999999"
                      min="10000000"
                      pattern="^(0|[1-9][0-9]*)$"
                      placeholder="Ingrese su cédula de identidad"
                      required
                      type="number"
                    />
                  </div>
                  <transition name="fade" type="out-in">
                    <span
                      v-if="user.ci.toString().length === 8 && !ciIsValid"
                      class="mt-1 text-red-500 font-medium absolute text-sm pl-1"
                    >
                      La cédula ingresada es inválida
                    </span>
                    <span
                      v-else-if="user.ci.toString().length === 8 && ciIsTaken"
                      class="mt-1 text-red-500 font-medium absolute text-sm pl-1"
                    >
                      La cédula ya está tomada
                    </span>
                    <span v-else class="mt-1 absolute text-xs pl-1">
                      * Sín puntos ni guiones. Ej: 56478622
                    </span>
                  </transition>
                </div>
              </div>
            </div>

            <!-- -------------------------------------------  -->

            <div v-if="step === 3" class="flex items-center gap-5">
              <div class="w-1/4 mx-10">
                <transition>
                  <img
                    :src="require('@/assets/avatars/' + user.avatar)"
                    alt="user_avatar"
                    class="w-90per mx-auto"
                  />
                </transition>
                <button
                  class="mt-4 btn-info mx-auto block text-xs border-0"
                  type="button"
                  @click="this.$refs.theModal.openModal()"
                >
                  Cambiar avatar
                </button>
              </div>
              <div class="w-9/12">
                <div class="mb-5 relative">
                  <label class="font-medium text-sm mb-1 block" for="nickname"
                    >Nombre de usuario</label
                  >
                  <div class="flex items-center gap-2">
                    <input
                      id="nickname"
                      v-model="user.nickname"
                      :class="
                        !nicknameIsTaken
                          ? user.nickname.length >= 4 && user.nickname !== ''
                            ? 'ring-2 ring-green-500'
                            : ''
                          : user.nickname !== '' && user.nickname.length >= 4
                          ? 'ring-2 ring-red-500'
                          : ''
                      "
                      autocomplete="off"
                      class="input max-w-sm"
                      minlength="4"
                      placeholder="Ingrese su nickname"
                      required
                      type="text"
                    />
                    <SpinnerLoader v-show="loaders.nickname" />

                    <span
                      v-if="
                        !nicknameIsTaken &&
                          user.nickname !== '' &&
                          user.nickname.length >= 4 &&
                          !loaders.nickname
                      "
                      class="material-icons text-green-500"
                      >check</span
                    >
                    <span
                      v-else-if="!loaders.nickname && user.nickname.length >= 4"
                      class="material-icons text-red-500"
                      >close</span
                    >
                  </div>
                  <span
                    v-show="
                      nicknameIsTaken &&
                        !loaders.nickname &&
                        user.nickname.length >= 4
                    "
                    class="text-sm mt-1 absolute text-red-500 font-medium"
                    >El nombre de usuario ya esta tomado</span
                  >
                </div>
                <div class="relative mt-10">
                  <label class="font-medium text-sm mb-1 block" for="email"
                    >Email</label
                  >
                  <div class="flex items-center">
                    <input
                      id="email"
                      v-model="user.email"
                      autocomplete="off"
                      class="input "
                      :class="
                        emailIsTaken && user.email !== ''
                          ? 'ring-2 ring-red-500'
                          : ''
                      "
                      minlength="4"
                      placeholder="Ingrese su correo electrónico"
                      required
                      type="email"
                    />
                    <span
                      v-show="emailIsTaken && user.email !== ''"
                      class="material-icons ml-2 text-red-500"
                      >warning_amber</span
                    >
                  </div>
                  <p
                    v-show="emailIsTaken && user.email !== ''"
                    class="flex items-center mt-1 ml-1 absolute font-medium text-sm text-red-500 "
                  >
                    El email ingresado ya fue usado en el sistema
                  </p>
                </div>
              </div>
            </div>

            <TheModal
              ref="theModal"
              closeButtonText="Seleccionar"
              title="Cambiar avatar"
            >
              <div class="my-10">
                <div class="flex justify-center flex-wrap gap-3 px-5 mt-2">
                  <button
                    v-for="avatar_data in avatars"
                    :id="avatar_data.id"
                    :key="avatar_data.id"
                    class="w-16 transition duration-200 ease-in-out hover:bg-opacity-20 focus:bg-opacity-30 transform bg-white rounded-xl bg-opacity-10 cursor-pointer"
                    type="button"
                    @click="selectAvatar(avatar_data.id)"
                  >
                    <img
                      :src="require('@/assets/avatars/' + avatar_data.file)"
                      alt="avatar"
                      class="max-h-14 my-3 mx-1"
                    />
                  </button>
                </div>
              </div>
            </TheModal>

            <!-- -------------------------------------------  -->
            <div v-if="step === 4" class="grid grid-cols-2 gap-5">
              <div class="">
                <label class="font-medium text-sm mb-1 block" for="password"
                  >Contraseña</label
                >
                <input
                  id="password"
                  v-model="user.password"
                  autocomplete="off"
                  class="input"
                  minlength="8"
                  placeholder="Ingrese una contraseña"
                  required
                  type="password"
                />

                <ul class="text-xs mt-1">
                  <li>
                    * Mínimo 8 caracteres
                  </li>
                </ul>
              </div>
              <div class="">
                <label class="font-medium text-sm mb-1 block" for="password"
                  >Confirmar contraseña</label
                >
                <div class="flex items-center">
                  <input
                    id="confirm_password"
                    v-model="user.confirm_password"
                    :class="
                      user.password === user.confirm_password &&
                      user.password !== ''
                        ? 'ring-2 ring-green-500'
                        : user.confirm_password !== ''
                        ? 'ring-2 ring-red-500'
                        : ''
                    "
                    autocomplete="off"
                    class="input"
                    minlength="8"
                    placeholder="Repita la contraseña"
                    required
                    type="password"
                  />
                  <span
                    :class="
                      user.password === user.confirm_password &&
                      user.password !== ''
                        ? 'opacity-100'
                        : 'opacity-0'
                    "
                    class="material-icons ml-2 text-3xl text-green-500 transition-all"
                    >check</span
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- / Step Content -->
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div v-show="step !== 'complete'" class="py-5">
        <div class="w-9/12 mx-auto px-4 ">
          <div class="flex justify-between">
            <div class="w-1/2 flex">
              <a
                v-show="step > 1"
                class="btn-warning flex items-center pr-5 pl-3 py-1.5 select-none"
                @click.prevent="previusStep()"
              >
                <span class=" mr-2 material-icons text-lg">
                  arrow_back
                </span>
                Paso anterior
              </a>
            </div>

            <div class="w-1/2 flex justify-end">
              <button
                v-show="step < steps_amount"
                :class="!validateDataByStep ? 'btn-disabled' : ''"
                :disabled="!validateDataByStep"
                class="btn-info pl-5 pr-3 py-1.5 flex items-center select-none"
              >
                Siguiente
                <span class="material-icons text-lg ml-2">
                  arrow_forward
                </span>
              </button>

              <div>
                <span> </span>
                <button
                  v-show="step === steps_amount"
                  id="create_user_button"
                  class="btn-success px-5 py-1.5"
                  type="button"
                  @click="create()"
                >
                  Completar registro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- / Bottom Navigation https://placehold.co/300x300/e2e8f0/cccccc -->
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import TheModal from "@/components/TheModal";
import SpinnerLoader from "@/components/SpinnerLoader";
/*import { showAlert } from "../utils/alerts";*/

export default {
  name: "UserRegistration",
  data: () => {
    return {
      step: 1,
      steps_amount: 4,
      togglePassword: false,
      selectedAvatar: null,
      loaders: {
        nickname: false,
        email: false,
        ci: false,
      },
      user: {
        ci: "",
        nickname: "",
        name: "",
        middle_name: "",
        surname: "",
        second_surname: "",
        type: "teacher",
        email: "",
        avatar: "01-man.svg",
        password: "",
        confirm_password: "",
      },
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
  components: {
    TheModal,
    SpinnerLoader,
  },
  watch: {
    "user.nickname": function() {
      this.validateNickname();
    },
    "user.ci": function() {
      this.validateUserCi();
    },
    "user.email": function() {
      this.validateEmail();
    },
  },
  computed: {
    ...mapState({
      nicknameIsTaken: (state) => state.user.nicknameIsTaken,
      emailIsTaken: (state) => state.user.emailIsTaken,
      ciIsTaken: (state) => state.user.ciIsTaken,
      ciIsValid: (state) => state.user.ciIsValid,
      registration_state: (state) => state.user.registration_state,
    }),
    validateDataByStep: function() {
      let isOk = false;
      if (this.step === 3 && !this.nicknameIsTaken && !this.emailIsTaken) {
        isOk = true;
      }
      if (this.step === 2) {
        if (!this.ciIsTaken && this.ciIsValid && this.user.ci.toString().length === 8                         ) isOk = true;
      }
      if (this.step === 1 || this.step === 4) {
        isOk = true;
      }
      return isOk;
    },
  },
  methods: {
    ...mapActions([
      "createUser",
      "validateUserNickname",
      "validateUserEmail",
      "validateUserCiIsTaken",
      "validateCi",
    ]),

    nextStep() {
      if (this.step === this.steps_amount) {
        this.step = "complete";
      } else if (this.step === "complete") {
        this.step = 1;
      } else {
        this.step++;
      }
    },
    previusStep() {
      this.step--;
    },
    validateUserCi() {
      // Para que valide el codigo solo si tiene 8 caracteres
      if (this.user.ci.toString().length === 8) {
        this.loaders.ci = true;
        this.validateCi(this.user.ci.toString()).then(() => {
          if (this.ciIsValid) {
            this.validateUserCiIsTaken(this.user.ci.toString()).then(() => {
              this.loaders.ci = false;
            });
          } else {
            this.loaders.ci = false;
          }
        });
      }
    },
    validateNickname() {
      // Para que valide el nickname solo si tiene 8 caracteres
      if (this.user.nickname.length >= 4) {
        this.loaders.nickname = true;
        this.validateUserNickname(this.user.nickname).then(() => {
          setTimeout(() => {
            this.loaders.nickname = false;
          }, 100);
        });
      }
    },
    validateEmail() {
      this.loaders.email = true;
      this.validateUserEmail(this.user.email).then(() => {
        setTimeout(() => {
          this.loaders.email = false;
        }, 100);
      });
    },
    create() {
      if (this.validateData()) {
        let button = document.getElementById("create_user_button");
        button.disabled = true;
        button.classList.replace("btn-success", "btn-disabled");

        this.user.ci = this.user.ci.toString();
        this.createUser(this.user).then(() => {
          if (this.registration_state) {
            setTimeout(() => {
              button.disabled = false;
              button.classList.replace("btn-disabled", "btn-success");
            }, 1500);
            setTimeout(() => {
              this.nextStep();
            }, 2000);
          } else {
            setTimeout(() => {
              button.disabled = false;
              button.classList.replace("btn-disabled", "btn-success");
            }, 1500);
          }
        });
      }
    },
    validateData() {
      let isOk = true;
      let keys = Object.keys(this.user);
      Object.values(this.user).forEach((element, index) => {
        if (
          element.toString() === "" &&
          keys[index] != "middle_name" &&
          keys[index] != "second_surname"
        ) {
          isOk = false;
        }
      });
      return isOk;
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
          this.user.avatar = avatar.file;
        }
      });

      selectedAvatar.classList.add("scale-110");
      selectedAvatar.classList.add("bg-opacity-30");
    },
  },
};
</script>

<style scoped>
.input {
  @apply block w-full font-normal text-lg bg-white bg-opacity-20 hover:bg-opacity-30 focus:bg-opacity-30 transition-all outline-none rounded-lg px-2 py-2;
}

label {
  @apply select-none;
}

span {
  @apply select-none;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
