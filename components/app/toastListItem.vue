<script setup>
import Success from "@/assets/svg/Success.vue";
import Info from "@/assets/svg/Info.vue";
import Error from "@/assets/svg/Error.vue";
import Warning from "@/assets/svg/Warning.vue";

const props = defineProps(["message", "title", "type"]);
const emit = defineEmits(["remove"]);

const color = computed(() => {
  if (props.type === "Success") {
    return "bg-green-100 text-green-500";
  }
  if (props.type === "Info") {
    return "bg-gray-100 text-gray-500";
  }
  if (props.type === "Error") {
    return "bg-red-100 text-red-500";
  }
  if (props.type === "Warning") {
    return "bg-yellow-100 text-yellow-500";
  }
});

const svg = computed(() => {
  if (props.type === "Success") {
    return Success;
  }
  if (props.type === "Info") {
    return Info;
  }
  if (props.type === "Error") {
    return Error;
  }
  if (props.type === "Warning") {
    return Warning;
  }
});

setTimeout(() => emit("remove"), 3000);
</script>

<template>
  <div class="z-50 font-avenir flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg" :class="color">
      <component :is="svg" />
      <span class="sr-only"> icon</span>
    </div>
    <div class="ml-3 text-sm font-normal">
      <p class="font-medium">{{ props.title }}</p>
      <p>{{ props.message }}</p>
    </div>

    <button @click="emit('remove')" type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">
      <span class="sr-only">Close</span>
      <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    </button>
  </div>
</template>

<style></style>
