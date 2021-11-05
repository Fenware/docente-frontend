<template>
  <div class="text-white flex item-center bg-gray-800 rounded-lg p-2 text-sm">
    <span class="material-icons mr-2 text-lg">translate</span>
    <button @click="changeLang('es')" class="px-3 rounded-lg transition-all mr-1 bg-white bg-opacity-0 hover:bg-opacity-10" :class="lang == 'es' ? 'bg-opacity-25 hover:bg-opacity-25' : ''">Español</button>
    <button @click="changeLang('en')" class="px-3 rounded-lg transition-all bg-white bg-opacity-0 hover:bg-opacity-10" :class="lang == 'en' ? 'bg-opacity-25 hover:bg-opacity-25' : ''" >English</button>
  </div>
  
</template>

<script>

import { mapMutations, mapState } from 'vuex';


export default {
    name:"ToggleLanguageButton",
    computed :{
        ...mapState({
          lang: (state) => state.lang,
        }),
        
    },
    methods: { 
      ...mapMutations(['setLang']),
      changeLang(lang){
        this.setLang(lang);
      }
    }
    
}
</script>

<style></style>
