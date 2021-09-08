<template>
  <div
    class="flex justify-between text-white w-full min-h-full"
    style="min-width: 15rem;"
  >
    <div class="w-full flex justify-center items-center">
      <TheChat v-if="!create_chat_mode && chat != null" />

      <div
        class="flex justify-center items-center h-full"
        v-if="!create_chat_mode && chat == null"
      >
        <p class="text-2xl">Seleccione un chat</p>
      </div>
    </div>
    <div class="h-92vh bg-gray-700 rounded-2xl shadow-xl">
      <div
        class="flex justify-center px-2 bg-gray-600 rounded-t-xl rounded-b-md"
      >
        <h2 class="text-center text-2xl my-2 min-w-max font-medium">
          Salas de chat
        </h2>
      </div>

      <div class=" overflow-y-auto px-2 mt-3" style="height: 80vh;">
        <!-- <div class="" v-if="chats.length == 0">
          <p>No tienes salas de chat activas</p>
        </div> -->

        <div class="" v-for="group in group_chats" :key="group.id">
          <p
            class="px-2 text-xl font-medium text-indigo-400 border-b-2 border-gray-500 rounded-b-sm"
          >
            {{ group.name }}
          </p>

          <div
            @click="openChat(chat)"
            class=" text-white my-1 mb-0.5 py-3 px-2 hover:bg-gray-800 hover:bg-opacity-40 transition-colors rounded-xl cursor-pointer"
            v-for="chat in group.chats"
            :key="chat.id"
            :id="'chat_' + chat.id"
          >
            <div class="select-none">
              <div>
                <div
                  class="flex justify-between items-center flex-wrap min-w-max"
                >
                  <p
                    class="ml-2 font-semibold px-1 rounded-md select-none truncate"
                    style="max-width: 12rem;"
                  >
                    {{ chat.subject_name }}
                  </p>
                  <span class="text-xs pr-3 select-none"
                    >{{ getHour(chat.creation_date) }}
                  </span>
                </div>
                <p
                  class="text-sm pl-5 pt-0.5 text-gray-300 truncate"
                  style="max-width: 15rem;"
                >
                  {{ chat.theme }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import TheChat from "@/components/TheChat.vue";
import moment from "moment";

export default {
  name: "ChatRooms",
  data: function() {
    return {
      create_chat_mode: false,
      matter: "",
      subject_id: null,
      chat_selected: null,
    };
  },
  components: {
    TheChat,
  },
  created() {
    // Obtengo los grupos del docente
    this.getTeacherGroups().then(() => {
      // Cuando se obtengan los grupos obtengo los chats del docente
      this.getChatRooms();
    });
    this.getUserData();
  },
  computed: {
    ...mapState({
      group_chats: (state) => state.chatRooms.group_chats,
      chat: (state) => state.chatRooms.chat,
    }),
  },
  methods: {
    ...mapMutations(["setChat"]),
    ...mapActions([
      "getChatRooms",
      "getChatMesages",
      "getTeacherGroups",
      "wsMessagesConnection",
      "getUserData"
    ]),
    getHour(date) {
      // Formateo la fecha a español
      let date_formated = moment(date).locale("es");
      if (moment(date_formated).calendar().length > 15) {
        date_formated = moment(date_formated).format("l");
      } else {
        date_formated = moment(date_formated).calendar();
      }
      return date_formated;
    },
    toggleSubject(subject_id) {
      let subjectDiv = document.getElementById("subject_" + subject_id);
      let subjectIcon = document.getElementById("subject_icon_" + subject_id);
      let subjectName = document.getElementById("subject_name_" + subject_id);

      subjectDiv.classList.add("scale-95");
      subjectDiv.classList.replace("bg-gray-700", "bg-gray-800");
      subjectIcon.classList.replace("fa-square", "fa-check-square");
      subjectIcon.classList.add("text-indigo-400");
      subjectIcon.classList.replace(
        "hover:text-indigo-400",
        "hover:text-indigo-300"
      );
      subjectName.classList.add("text-indigo-400");
      subjectDiv.classList.remove("hover:bg-gray-600");

      if (this.subject_id != null && this.subject_id != subject_id) {
        // Añado las clases al div y al icono para deseleccioarla
        let subjectDivToDeselect = document.getElementById(
          "subject_" + this.subject_id
        );
        let subjectIconToDeselect = document.getElementById(
          "subject_icon_" + this.subject_id
        );
        let subjectNameToDeselect = document.getElementById(
          "subject_name_" + this.subject_id
        );
        subjectDivToDeselect.classList.remove("scale-95");
        subjectDivToDeselect.classList.replace("bg-gray-800", "bg-gray-700");
        subjectDivToDeselect.classList.add("hover:bg-gray-600");
        subjectIconToDeselect.classList.replace("fa-check-square", "fa-square");
        subjectIconToDeselect.classList.remove("text-indigo-400");
        subjectNameToDeselect.classList.remove("text-indigo-400");
      }
      this.subject_id = subject_id;
    },
    openChat(chat) {
      this.create_chat_mode = false;
      this.setChat(chat);
      this.getChatMesages(chat.id);
      this.wsMessagesConnection();
      this.toggleChatSelected(chat.id);
    },
    toggleChatSelected(id) {
      let div = document.getElementById("chat_" + id);
      div.classList.add("bg-indigo-600");
      div.classList.remove("hover:bg-gray-800");
      div.classList.remove("hover:bg-opacity-40");

      if (this.chat_selected != null && this.chat_selected != id) {
        let selected_div = document.getElementById(
          "chat_" + this.chat_selected
        );
        selected_div.classList.remove("bg-indigo-600");
        selected_div.classList.add("hover:bg-gray-800");
        selected_div.classList.add("hover:bg-opacity-40");
      }

      this.chat_selected = id;
    },
  },
};
</script>

<style></style>
