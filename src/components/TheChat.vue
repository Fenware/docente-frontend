<template>
  <div class="flex flex-col gap-1 justify-between h-full w-full">
    <div class="mt-1 flex flex-col justify-between h-full">
      <div
        @click="openModal()"
        class="pb-2 w-9/12 mx-auto hover:bg-gray-700 rounded-xl transition-colors cursor-pointer select-none"
      >
        <p class="text-3xl text-center">
          {{ chat != null ? chat.subject_name : "Esperando datos" }}
        </p>
        <p class=" text-center text-sm">
          {{ chat != null ? chat.theme : "Esperando datos" }}
        </p>
      </div>

      <div
        id="chat"
        class="flex gap-1 flex-col pl-5 pr-12 max-h-96 overflow-y-auto mx-5 xl:w-9/12 xl:mx-auto"
      >
        <div
          v-for="(message, index) in chat.messages"
          :key="message.id"
          :class="
            isTheLastMeesageSamePerson(message.id_user, index)
              ? isTheAuthorOfTheMessage(message.id_user)
                ? 'ml-auto bg-indigo-500 mt-0'
                : 'bg-gray-700 mt-0'
              : isTheAuthorOfTheMessage(message.id_user)
              ? 'ml-auto bg-indigo-500 rounded-tr-sm'
              : 'bg-gray-700 rounded-tl-sm mt-3'
          "
          class="w-max px-2 py-1 rounded-2xl"
        >
          <p
            class="leading-3 font-medium text-xs select-none"
            v-if="
              user.id != message.id_user &&
                !isTheLastMeesageSamePerson(message.id_user, index)
            "
          >
            {{ message.name }} {{ message.surname }}
          </p>

          <p
            class="pt-1 px-1 max-w-sm break-words"
            :class="
              (message.content.length < 20 ? 'leading-3 ' : 'leading-tight ') +
                (isTheAuthorOfTheMessage(message.id_user)
                  ? !isTheLastMeesageSamePerson(message.id_user, index)
                    ? 'pr-3'
                    : ''
                  : !isTheLastMeesageSamePerson(message.id_user, index)
                  ? 'pl-3'
                  : '')
            "
          >
            {{ message.content }}
          </p>

          <p
            class="leading-3 px-1 pl-3 pt-0.5 text-xs text-right text-gray-300 select-none"
          >
            {{ getHour(message.date) }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="flex justify-between lg:justify-center items-center mx-2 xl:w-9/12 xl:mx-auto"
    >
      <input
        v-model="new_message"
        v-on:keyup.enter="sendMessage()"
        type="text"
        maxlength="600"
        class="w-full bg-white bg-opacity-20 hover:bg-opacity-25 focus:bg-opacity-25 transition-all rounded-xl mb-2.5 mt-1 h-10 ml-0.5 mr-3 px-3 outline-none "
        placeholder="Escribir mensaje"
      />
      <div
        @click="sendMessage()"
        class=" transition-colors text-gray-400 hover:text-gray-300 cursor-pointer px-1 flex mb-2.5 mt-1"
      >
        <span class="material-icons ">send</span>
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
            <p class="text-2xl font-bold">{{ chat.subject_name }}</p>
            <div class="modal-close cursor-pointer z-50" @click="modalClose()">
              <span class="material-icons text-red-400">close</span>
            </div>
          </div>
          <!--Body-->
          <div class="my-1">
            <p class="text-lg font-medium mb-2">{{ chat.theme }}</p>
            <hr />
            <p class="mt-2 text-right">
              <span class="text-sm"> {{ getDate(chat.creation_date) }}</span>
            </p>
            <p class="">
              Grupo:
              <span class="font-medium text-indigo-400">{{
                chat.group_name
              }}</span>
            </p>
            <p class="">
              Creador:
              <span class="font-medium text-indigo-400">
                {{ chat.student_name }}</span
              >
            </p>
            <p class="">
              Docente:
              <span class="font-medium text-indigo-400">
                {{ chat.teacher_name }}</span
              >
            </p>

            <p class="mt-5 font-medium text-lg text-center">Participantes</p>

            <div>
              <ol class="overflow-y-auto max-h-28">
                <li v-for="participant in chat.participants" :key="participant">
                  -
                  {{ participant.name }}
                  {{ participant.surname }}
                  {{ participant.second_surname }}
                </li>
              </ol>
            </div>
          </div>
          <!--Footer-->
          <!-- <div class="flex justify-center pt-2 mt-2">
            <button
              v-if="user.id == chat.id_student"
              @click="closeChat()"
              class="btn-danger flex items-center py-0.5"
            >
              <span class="material-icons-round mr-1">warning_amber</span>
              Terminar sala de chat
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import moment from "moment";

export default {
  name: "TheChat",
  data: function() {
    return {
      new_message: "",
    };
  },
  computed: {
    ...mapState({
      chat: (state) => state.chatRooms.chat,
      user: (state) => state.userProfile.user,
    }),
  },
  updated() {
    this.scroll();
  },
  unmounted() {
    // Borrando el chat al salir del componente
    this.clearChat();
  },
  methods: {
    ...mapMutations(["clearChat"]),
    ...mapActions(["sendMessageToChat", "getChatRoomById"]),
    sendMessage() {
      this.sendMessageToChat({ id: this.chat.id, message: this.new_message });
      this.new_message = "";
    },
    getHour(date) {
      // Formateo la fecha a español
      let date_formated = moment(date).locale("es");
      date_formated = moment(date_formated).format("LT");
      /* return moment(date_formated).format('LT'); */
      return date_formated;
    },
    getDate(date) {
      // Formateo la fecha a español
      let date_formated = moment(date).locale("es");
      date_formated = moment(date_formated).format("LL");
      /* return moment(date_formated).format('LT'); */
      return date_formated;
    },
    scroll() {
      document.getElementById("chat").scrollTop = document.getElementById(
        "chat"
      ).scrollHeight;
    },
    isTheAuthorOfTheMessage(author_id) {
      return this.user.id == author_id;
    },
    isTheLastMeesageSamePerson(author_id, index) {
      if (index > 0) {
        return this.chat.messages[index - 1].id_user == author_id;
      } else {
        return false;
      }
    },
    openModal() {
      this.getChatRoomById(this.chat.id).then(() => {
        let modal = document.querySelector(".main-modal");
        modal.classList.remove("fadeOut");
        modal.classList.add("fadeIn");
        modal.style.display = "flex";
      });
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

<style></style>
