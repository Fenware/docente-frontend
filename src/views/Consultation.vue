<template>
  <div class="text-white">
    <h2 class="text-center text-3xl pt-1">Consulta</h2>
    <div class="flex justify-center my-10">
      <div
        class="text-white rounded-3xl | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl max-w-lg"
      >
        <div class="flex justify-between mb-3 items-center py-4 px-5">
          <div class="flex gap-2 select-none">
            <span
              class="text-sm text-white rounded-lg px-3 py-0.5 | bg-purple-500 backdrop-filter backdrop-blur-xl shadow-2xl"
            >
              {{ consultation.group_name }}
            </span>
            <span
              class="text-sm text-white rounded-lg px-3 py-0.5 | bg-blue-500 backdrop-filter backdrop-blur-xl shadow-2xl"
            >
              {{ consultation.subject_name }}
            </span>
          </div>
          <router-link
            :to="{ name: 'Home' }"
            class="text-sm text-white rounded-full px-3 py-0.5 | bg-gray-700 border-2 border-gray-400 hover:bg-opacity-80 transition-all ease-linear backdrop-filter backdrop-blur-xl shadow-2xl"
          >
            <i class="fas fa-reply"></i>
          </router-link>
        </div>

        <div class="flex items-center mx-20 mb-2">
          <span class="mr-3">Alumno: </span>
          <p class="font-bold text-white rounded-lg px-1 py-1">
            {{ consultation.student_name }}
          </p>
        </div>

        <div class="flex items-center mx-20 mb-8">
          <span class="mr-3">Fecha de creación: </span>
          <p class="font-bold text-white rounded-lg px-1 py-1">
            {{ consultation.creation_date }}
          </p>
        </div>

        <div class=" items-center mx-20 mb-5">
          <span class="mr-3 ">Asunto: </span>
          <p
            class="text-white wrap rounded-lg px-3 py-1 | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
          >
            {{ consultation.theme }}
          </p>
        </div>

        <div class="  mx-20">
          <span class="block mr-3">Descripción: </span>
          <textarea
            class=" w-max text-white rounded-lg px-3 py-1 | outline-none bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
            v-model="consultation.body"
            cols="35"
            rows="4"
            disabled
          ></textarea>
          <div class="flex mt-3">
            <button
              @click="toogleNewMessageMode()"
              class="ml-auto px-2 py-1 bg-blue-500 hover:bg-blue-600 transition-colors ease-linear duration-100 rounded-lg"
            >
              Responder
              <i class="fas fa-comment"></i>
            </button>
          </div>
        </div>

        <div class="mt-5 pb-2">
          <h3 class="pl-3 text-xl">Respuestas</h3>

          <div class="my-2 mx-8">
            <p class="text-center" v-if="consultation.messages.length == 0">
              Aún no hay respuestas
            </p>
            <div
              class=" flex mb-2"
              v-for="message in consultation.messages"
              :key="message.id"
            >
              <div
                class="bg-gray-700  pr-5 py-0.5 rounded-3xl rounded-tl-sm w-full"
              >
                <span class="pl-2 text-xs font-bold flex justify-between"
                  ><span>{{ message.name }} {{ message.surname }}</span>
                  <span>{{ message.date }}</span></span
                >
                <p class="pl-8">{{ message.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-show="new_message_mode" class="flex justify-center mt-2 py-2">
          <div>
            <label for="new_message" class=" block text-sm"
              >Nueva respuesta:</label
            >
            <textarea
              class="text-sm w-96 text-white rounded-lg px-3 py-1 | outline-none bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
              v-model="new_message"
              autofocus="autofocus"
              id="new_message"
              cols="30"
              rows="5"
            ></textarea>
            <div class="flex mt-0.5">
              <button
                @click="toogleNewMessageMode()"
                class="text-sm ml-auto px-2 py-0.5 bg-red-500 hover:bg-red-600 transition-colors ease-linear duration-100 rounded-lg"
              >
                Cancelar
                <i class="fas fa-times"></i>
              </button>
              <button
                @click="new_message.trim() != '' ? sendMessage() : focusMessageInput()"
                class="text-sm ml-1 px-2 py-0.5 bg-green-500 hover:bg-green-600 transition-colors ease-linear duration-100 rounded-lg"
              >
                Enviar
                <i class="fas fa-reply"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import axios from "axios";

export default {
  name: "Consultation",
  data: function() {
    return {
      new_message: "",
    };
  },
  computed: {
    ...mapState(["API_URL", "headers", "consultation", "new_message_mode"]),
  },
  created() {
    var id = this.$route.params.id;
    if (this.consultation == null) {
      this.getConsultation(id);
    } else if (parseInt(this.consultation.id) != parseInt(id)) {
      this.getConsultation(id);
    }
  },
  methods: {
    ...mapMutations([
      "setConsultation",
      "removeConsultation",
      "toogleNewMessageMode",
      "setNewMessage",
      "setConsultationStateAnswered",
    ]),
    ...mapActions(["getConsultationMessages", "sendConsultationMessage"]),
    focusMessageInput(){
      document.getElementById('new_message').focus();
    },
    sendMessage() {
      this.setConsultationStateAnswered();
      this.setNewMessage(this.new_message);
      this.sendConsultationMessage(parseInt(this.consultation.id));
      this.new_message = '';
    },
    async getConsultation(id) {
      let data = `consulta=${id}`;
      await axios({
        method: "get",
        url: this.API_URL + `/consulta?${data}`,
        headers: this.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            res.data[0].messages = [];
            this.setConsultation(res.data[0]);
            this.getConsultationMessages(id);
          } else {
            console.log("Error: getConsultation ->" + res.data);
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
