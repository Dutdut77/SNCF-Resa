<script setup>
import Close from "@/assets/svg/Close.vue";

const props = defineProps(["closeSideModal"]);
</script>

<template>
  <div class="relative flex items-center w-ful h-dvh p-4 text-gray-500 bg-gray-50">
    <div class="cursor-pointer h-10 w-10 bg-gradient-to-tl from-sky-500 to-sky-700 hover:shadow-lg hover:shadow-sncf-start/50 flex duration-500 justify-center items-center absolute z-20 top-6 -left-5 rounded-xl" @click="props.closeSideModal()"><Close class="text-white h-6 w-6" /></div>
    <div class="relative flex flex-col justify-start items-center gap-4 w-full h-full overflow-auto p-2">
      <div class="w-full flex flex-col items-center gap-2"><slot name="header"></slot></div>
      <div class="w-full h-full flex flex-col"><slot name="default"></slot></div>
      <div class="w-full mt-auto"><slot name="footer"></slot></div>
    </div>
  </div>
</template>

<style></style>
