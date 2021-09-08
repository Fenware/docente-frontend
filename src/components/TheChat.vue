<template>
  <div class="flex flex-col gap-1 justify-between h-full w-full">
    <div class="mt-1 flex flex-col justify-between h-full">
      <div class="select-none">
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
        <!-- <i class="fas fa-paper-plane px-2 mr-0.5"></i> -->
        <span class="material-icons ">send</span>
      </div>
    </div>
    <!-- 
    </input> -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
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
  methods: {
    ...mapActions(["sendMessageToChat"]),
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
  },
};
</script>

<style></style>
