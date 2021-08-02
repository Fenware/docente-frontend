<template>
  <div class="text-white  w-full px-2">
    <h2 class="text-center text-3xl mt-1">
      Tomar Grupos
    </h2>

    <div class="flex justify-between mt-10">
      <input
        type="text"
        id="code_input"
        placeholder="Código de grupo"
        v-model="group_code"
        class="w-96 mx-2 py-2 px-2 | bg-white transition duration-300 focus:bg-opacity-20 hover:bg-opacity-20 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-2xl  outline-none placeholder-white"
      />
      <button
        @click="group_code.trim() != '' ? takeGroup() : focusCodeInput()"
        class="ml-4 pr-2 | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl transition duration-300 focus:bg-opacity-20 hover:bg-opacity-20 shadow-2xl | rounded-2xl"
      >
        <i
          class="fas fa-plus text-white text-md py-3 px-3 | filter drop-shadow-xl transition-transform duration-300 transform hover:scale-110"
        ></i>
        Tomar grupo
      </button>
    </div>

    <div
      class="flex px-2 overflow-y-auto h-2/3 mx-auto flex-wrap md:max-w-2xl lg:max-w-3xl mt-10 bg-white bg-opacity-10  shadow-2xl | rounded-lg"
    >
      <GroupsContainer />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapState, mapMutations } from "vuex";
import GroupsContainer from "@/components/GroupsContainer";

export default {
  name: "Orientations",
  data: function() {
    return {
      group_code: "",
    };
  },
  components: {
    GroupsContainer,
  },
  computed: {
    ...mapState([
      "API_URL",
      "headers",
      "create_group_mode",
      "modify_group_mode",
      "orientations",
      "orientations_subjects",
    ]),
  },
  methods: {
    ...mapMutations(["clearGroups", "addGroup"]),
    ...mapActions([
      "syncOrientations",
      "syncSubjects",
      "syncTeacherGroups",
    ]),
    focusCodeInput(){
      document.getElementById('code_input').focus();
    },
    async takeGroup() {
      let data = {
        code: this.group_code,
      };
      await axios({
        method: "post",
        url: this.API_URL + "/user-grupo",
        data: data,
        headers: this.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            this.clearGroups();
            this.syncTeacherGroups();
            this.group_code = ""
          } else if(res.data == 0){
            alert('Ya has tomado este grupo!');
            this.group_code = "";
            console.log("Error: takeGroup -> " + res.data);
          }else{
            alert(res.data);
            console.log("Error: takeGroup -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.syncOrientations();
    this.syncSubjects();
    this.clearGroups();
    this.syncTeacherGroups();
  },
};
</script>

<style></style>
