/* eslint-disable no-unused-vars */
import axios from "axios";

// Modulo donde manejo las alertas
import { showAlert } from "@/utils/alerts";

export default {
  state: {
    group_chats: [],
    chat: null,
    user_subjects: [],
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
    setMessages(state, { messages, id }) {
      state.group_chats.forEach((group) => {
        group.chats.forEach((chat) => {
          if (parseInt(chat.id) == id) {
            chat.messages = messages;
          }
        });
      });
    },
    pushMessage(state, { message, chat_id }) {
      state.group_chats.forEach((group) => {
        group.chats.forEach((chat) => {
          if (parseInt(chat.id) == parseInt(chat_id)) {
            chat.messages.push(message);
          }
        });
      });
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
    setChatId(state, id) {
      state.selected_chat = id;
    },
    clearChatId(state) {
      state.selected_chat = null;
    },
    clearChat(state) {
      state.chat = null;
    },
    removeChatRoom(state, chat_id) {
      state.group_chats.forEach((group) => {
        group.chats.forEach((chat, index) => {
          if (parseInt(chat.id) == chat_id) {
            group.chats.splice(index, 1);
          }
        });
      });
    },
    setSocket(state, socket) {
      state.socket = socket;
    },
  },
  actions: {
    async getChatRooms({ rootState, commit, state, dispatch }) {
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
                dispatch("getChatMessages", chat.id);
              });
              // Añado el chat_by_group al array chats
              chats.push(chat_by_group);
            });
            commit("setChats", chats);
            dispatch("wsMessagesConnection");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getChatRoomById({ rootState, commit }, chat_id) {
      let data = {
        chat: parseInt(chat_id),
      };
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
      let data = {
        chat: parseInt(chat_id),
      };
      await axios({
        method: "post",
        url: rootState.API_URL + `/chat/getMessages`,
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("setMessages", {
              messages: res.data,
              id: parseInt(chat_id),
            });
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async sendMessageToChat({ rootState, state }, payload) {
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
          if (!("result" in res.data)) {
            state.socket.emit("room:newMessage", res.data);
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    wsChatRoomsConnection({ rootState, commit, dispatch, state }) {
      rootState.groups.groups.forEach((teacher_group) => {
        let group = `group:${teacher_group.id}`;
        console.log(group);
        state.socket.emit("join:group", group);

        state.socket.on(`group:newGroup`, (data) => {
          commit("pushNewChat", data);
          dispatch("newWsMessagesConnection", data);
        });
        state.socket.on(`group:removeGroup`, (data) => {
          commit("removeChatRoom", data.chat);
          if (parseInt(state.chat.id) == data.chat) {
            commit("clearChatId");
            commit("clearChat");
          }
        });
      });
    },
    wsMessagesConnection({ state, commit }) {
      state.group_chats.forEach((group) => {
        group.chats.forEach((chatRoom) => {
          let room = `room:${chatRoom.id}`;

          // Ingreso a la sala de chat
          state.socket.emit("join:room", room);

          //Por ahora no se usa, es para ver usuarios conectados
          /* state.socket.on("roomUsers", (data) => {
            console.log("ws:roomUsers ->");
            console.log(data);
          }); */

          state.socket.on("room:message", (message) => {
            if (message.id_query == chatRoom.id) {
              commit("pushMessage", { message, chat_id: chatRoom.id });
            }
          });
        });
      });
    },
    newWsMessagesConnection({ state, commit }, chat) {
      let room = `room:${chat.id}`;

      // Ingreso a la sala de chat
      state.socket.emit("join:room", room);

      // Por ahora no se usa, es para ver usuarios conectados
      /* state.socket.on("roomUsers", (data) => {
        console.log("ws:roomUsers ->");
        console.log(data);
      }); */

      state.socket.on("room:message", (message) => {
        if (message.id_query == chat.id) {
          commit("pushMessage", {message, chat_id: chat.id});
        }
      });
    },
    closeSocketConnection({state}){
      state.socket.disconnect();
    }
  },
};
