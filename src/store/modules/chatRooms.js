/* eslint-disable no-unused-vars */
import axios from "axios";

// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

export default {
  state: {
    chats: [],
    chat: null,
    user_subjects: [],
    ws_connection: null
  },
  mutations: {
    setChats(state, chats) {
      state.chats = chats;
    },
    setChat(state, chat) {
      state.chat = chat;
    },
    setMessages(state, messages) {
      state.chat.messages = messages;
    },
    pushMessage(state, message) {
      state.chat.messages.push(message);
    },
    setUserSubjects(state, subjects) {
      state.user_subjects = subjects;
    },
    pushNewChat(state, chat) {
      state.chats.push(chat);
    },
    setWsConnection(state, conn){
      state.ws_connection = conn;
    }
  },
  actions: {
    async getChatRooms({ rootState, commit }) {
      await axios({
        method: "get",
        url: rootState.API_URL + "/chat",
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          // Si res.data no es "OK" significa que la sesion expiró o el token esta mal o no hay token
          if (Array.isArray(res.data)) {
            // LLamo a la funcion logout
            commit("setChats", res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createChatRoom({ rootState, commit }, chatRoomData) {
      let data = {
        materia: parseInt(chatRoomData.subject),
        asunto: chatRoomData.matter,
      };
      console.log(data);
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data == 1) {
            showAlert({
              type: "success",
              message: "Sala de chat creada correctamente",
            });
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getChatMesages({ rootState, commit }, chat_id) {
      let data = `chat=${chat_id}`;
      await axios({
        method: "get",
        url: rootState.API_URL + `/chat-mensaje?${data}`,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (Array.isArray(res.data)) {
            commit("setMessages", res.data);
          } else {
            alert(res.data.result.error_msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async sendMessageToChat({ rootState }, payload) {
      let data = {
        chat: parseInt(payload.id),
        msg: payload.message,
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat-mensaje",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          /* commit("toogleNewMessageMode");
          if (res.data == 1) {
            dispatch(
              "getConsultationMessages",
              parseInt(state.consultation.id)
            );
          } else {
            alert(res.data.result.error_msg);
          } */
        })
        .catch((error) => {
          console.log(error);
        });
    },
    wsChatRoomsConnection({ rootState, commit }) {
      require("@/utils/websockets");
      // eslint-disable-next-line no-undef
      let conn = new ab.Session(
        `ws://localhost:8085?token=${rootState.token}`,
        function() {
          conn.subscribe(`${rootState.group.id_group}`, function(topic, data) {
            if (data.chat != null) {
              commit("pushNewChat", data.chat);
            }
          });
        },
        function() {
          console.warn("WebSocket connection closed");
        },
        { skipSubprotocolCheck: true }
      );
    },
    wsMessagesConnection({ rootState, state, commit }) {
      require("@/utils/websockets");
      if(state.ws_connection){
        state.ws_connection.close();
      }
      // eslint-disable-next-line no-undef
      let conn = new ab.Session(
        `ws://localhost:8086?token=${rootState.token}`,
        function() {
          conn.subscribe(`${state.chat.id}`, function(topic, data) {
            console.log(data);
            if (data.msg != null) {
              commit("pushMessage", data.msg);
            }
            console.log(data);
          });
        },
        function() {
          /* console.warn("WebSocket connection closed"); */
        },
        { skipSubprotocolCheck: true }
      );
      commit("setWsConnection", conn);
    },
  },
};
