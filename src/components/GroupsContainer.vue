<template>
  <div
    class=" max-h-28 m-3 pt-3 w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-2xl"
    v-for="group in groups"
    :key="group.id"
  >
    <div>
      <GroupCard :group="group" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import GroupCard from "@/components/GroupCard";

export default {
  name: "GroupsContainer",
  components: {
    GroupCard,
  },
  data: function() {
    return {
      edit_mode: false,
    };
  },
  computed: {
    ...mapState(["API_URL", "headers", "groups"]),
  },
};
</script>

<style></style>
