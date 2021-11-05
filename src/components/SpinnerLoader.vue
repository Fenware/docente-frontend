<template>
    <div class="circle"></div>
</template>

<script>
export default {
  name: "SpinnerLoader"
}
</script>

<style scoped>
.circle {
  box-sizing: border-box;
  width: 35px !important;
  height: 35px !important;
  border-radius: 100%;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top-color: #FFF;
  animation: spin 1s infinite linear;
}
</style>