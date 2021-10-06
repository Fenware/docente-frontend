/* eslint-disable no-unused-vars */
import axios from "axios";

// Modulo donde manejo las alertas
import { showAlert } from "@/utils/alerts";

export default {
  state: {
    group_chats: [],
    chat: null,
    user_subjects: [],
    ws_messages_connection: null,
    ws_chat_rooms_connection: null,
    selected_chat: null,
  },
  mutations: {
    setChats(state, chats) {
      state.group_chats = chats;
    },
    setChat(state, chat) {
      // Arreglar, que haya un endpoint para obtener participantes
      let messages =
        state.chat && state.chat.messages ? state.chat.messages : [];
      state.chat = chat;
      state.chat.messages = messages;
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
        if (
          group_chat.id == chat.id_group &&
          !group_chat.chats.includes(chat)
        ) {
          state.group_chats[index].chats.push(chat);
        }
      });
    },
    setWsMessagesConnection(state, conn) {
      state.ws_messages_connection = conn;
    },
    setWsChatRoomsConnection(state, conn) {
      state.ws_chat_rooms_connection = conn;
    },
    setChatId(state, id) {
      state.selected_chat = id;
    },
    clearChatId(state) {
      state.selected_chat = null;
    },
    clearChat(state) {
      state.chat = null;
    },
  },
  actions: {
    async getChatRooms({ rootState, commit, state }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat/getActiveChats",
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            let chats = [];

            // Recorriendo los grupos del modulo de grupos
            rootState.groups.groups.forEach((group) => {
              // Asigno id de grupo y el nombre, declaro array de chats
              let chat_by_group = {
                id: group.id,
                name: group.full_name,
                chats: [],
              };
              // Recorro el array de chats que devolvio el backend
              res.data.forEach((chat) => {
                // Si alguna sala coincide con el grupo
                if (chat.id_group == group.id) {
                  // Añado el chat al array
                  chat_by_group.chats.push(chat);
                }
              });
              /* dispatch("wsChatRoomsConnection", group.id); */
              // Añado el chat_by_group al array chats
              chats.push(chat_by_group);
            });
            if (state.chat) {
              let chat = res.data.find((chat) => chat.id == state.chat.id);
              if (!chat) {
                commit("clearChatId");
                commit("clearChat");
              }
            }
            commit("setChats", chats);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getChatRoomById({ rootState, commit }, chat_id) {
      let data = {
        chat: parseInt(chat_id)
      }
      await axios({
        method: "post",
        url: rootState.API_URL + `/chat/getChatById`,
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (!("result" in res.data)) {
            // LLamo a la funcion logout
            commit("setChat", res.data);
          } else {
            console.log("Error -> getChatRoomById");
            console.log(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getChatMessages({ rootState, commit, state }, chat_id) {
      let data ={
        chat: parseInt(chat_id)
      }
      await axios({
        method: "post",
        url: rootState.API_URL + `/chat/getMessages`,
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            if (state.chat) {
              if (state.chat.messages.length == 0) {
                commit("setMessages", res.data);
              } else if (
                state.chat.messages[state.chat.messages.length - 1].id !=
                res.data[res.data.length - 1].id
              ) {
                commit("setMessages", res.data);
              }
            }
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
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
        url: rootState.API_URL + "/chat/postMessage",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          if ("result" in res.data) {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /* wsChatRoomsConnection({ rootState, commit }, group_id) {
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
      if(state.ws_messages_connection){
        state.ws_messages_connection.close();
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
      commit("setWsMessagesConnection", conn);
    }, */
    listenMessages({ dispatch, state }) {
      setInterval(function() {
        if (state.chat) dispatch("getChatMessages", state.chat.id);
      }, 500);
    },
    listenRooms({ dispatch }) {
      setInterval(function() {
        dispatch("getChatRooms");
      }, 500);
    },
  },
};
