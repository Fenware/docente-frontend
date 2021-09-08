/* eslint-disable no-unused-vars */
import axios from "axios";

// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

export default {
  state: {
    group_chats: [],
    chat: null,
    user_subjects: [],
    ws_connection: null
  },
  mutations: {
    setChats(state, chats) {
      state.group_chats = chats;
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
      state.group_chats.forEach((group_chat, index) => {
        if(group_chat.id == chat.id_group && !group_chat.chats.includes(chat)){
          state.group_chats[index].chats.push(chat);
        }
      });
    },
    setWsConnection(state, conn){
      state.ws_connection = conn;
    }
  },
  actions: {
    async getChatRooms({ rootState, commit, dispatch }) {
      await axios({
        method: "get",
        url: rootState.API_URL + "/chat",
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (Array.isArray(res.data)) {
            
            let chats = [];

            // Recorriendo los grupos del modulo de grupos
            rootState.groups.groups.forEach(group => {
              // Asigno id de grupo y el nombre, declaro array de chats
              let chat_by_group = {
                id: group.id,
                name: group.full_name,
                chats: []
              };
              // Recorro el array de chats que devolvio el backend
              res.data.forEach((chat) => {
                // Si alguna sala coincide con el grupo 
                if(chat.id_group == group.id){
                  // Añado el chat al array
                  chat_by_group.chats.push(chat);
                }
              });

              dispatch("wsChatRoomsConnection", group.id);

              // Añado el chat_by_group al array chats
              chats.push(chat_by_group);
            });
            commit("setChats", chats);
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
    wsChatRoomsConnection({ rootState, commit }, group_id) {
      console.log(group_id);
      require("@/utils/websockets");
      // eslint-disable-next-line no-undef
      let conn = new ab.Session(
        `ws://localhost:8085?token=${rootState.token}`,
        function() {
          conn.subscribe(`${group_id}`, function(topic, data) {
            if (data.chat != null) {

              commit("pushNewChat", data.chat);
            }
          });
        },
        function() {
          console.warn("WebSocket connection rooms closed");
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
            if (data.msg != null) {
              commit("pushMessage", data.msg);
            }
          });
        },
        function() {
          console.warn("WebSocket connection messages closed");
        },
        { skipSubprotocolCheck: true }
      );
      commit("setWsConnection", conn);
    },
  },
};
