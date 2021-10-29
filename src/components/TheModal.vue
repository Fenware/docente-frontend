<template>
  <div
    class="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden hidden justify-center items-center animated fadeIn faster rounded-2xl"
    style="background: rgba(0,0,0,.5);"
  >
    <div
      class="border-2 border-gray-500 modal-container bg-gray-900 w-11/12 md:max-w-md mx-auto rounded-xl shadow-lg z-50 overflow-y-auto"
      style="max-height: 65vh;"
    >
      <div class="modal-content py-4 text-left px-6">
        <!--Title-->
        <div class="flex justify-between items-center">
          <p class="text-2xl font-bold">{{ title }}</p>
          <div class="modal-close cursor-pointer z-50" @click="modalClose()">
            <span class="material-icons text-red-400">close</span>
          </div>
        </div>
        <!--Body-->
        <slot></slot>
        <!--Footer-->
        <div class="flex justify-center pt-2 mt-2">
          <button
            class="btn-success flex items-center py-0.5"
            type="button"
            @click="modalClose()"
          >
            {{ closeButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheModal",
  props: {
    title: String,
    closeButtonText: String,
  },
  methods: {
    openModal() {
      let modal = document.querySelector(".main-modal");
      modal.classList.remove("fadeOut");
      modal.classList.add("fadeIn");
      modal.style.display = "flex";
    },
    modalClose() {
      let modal = document.querySelector(".main-modal");
      modal.classList.remove("fadeIn");
      modal.classList.add("fadeOut");
      setTimeout(() => {
        modal.style.display = "none";
      }, 500);
    }
  }
}
</script>

<style scoped>

</style>