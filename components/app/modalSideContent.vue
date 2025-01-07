<script setup>
import Close from "@/assets/svg/Close.vue";

const props = defineProps(["closeSideModal"]);
</script>

<template>
  <div id="modalSideContent" class="relative flex items-center w-ful h-dvh text-gray-500 bg-gray-50">
    <div class="absolute inset-0 bg-cover"></div>
    <div class="cursor-pointer h-10 w-10 bg-gradient-to-tl from-sky-500 to-sky-700 hover:shadow-lg hover:shadow-sncf-start/50 flex duration-500 justify-center items-center absolute z-50 top-6 -left-5 rounded-xl" @click="props.closeSideModal()"><Close class="text-white h-6 w-6" /></div>
    <div class="relative flex flex-col justify-start items-center gap-4 w-full h-full">
      <div class="w-full flex flex-col items-center gap-2 p-4"><slot name="header"></slot></div>
      <div class="w-full flex flex-col p-4 overflow-auto"><slot name="default"></slot></div>
      <div class="w-full mt-auto p-4"><slot name="footer"></slot></div>
    </div>
  </div>
</template>

<style></style>
