<template>
  <div class="">
    <h1 class="text-white text-center text-3xl font-semibold pt-1">{{ getWord({file:'lang',word:'teacher_chathink',lang}) }}</h1>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getWord } from "@/utils/lang";
export default {
  name: "Home",
  computed: {
    ...mapState(['lang']),
  },
  methods: {
    getWord,
  },
};
</script>
