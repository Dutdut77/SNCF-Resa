<script setup>
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

const iconName = computed(() => {
  if (props.type === "Success") return "material-symbols:check-circle";
  if (props.type === "Info") return "material-symbols:info";
  if (props.type === "Error") return "material-symbols:cancel";
  if (props.type === "Warning") return "material-symbols:warning";
});

setTimeout(() => emit("remove"), 3000);
</script>

<template>
  <div class="z-50 font-avenir flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg" :class="color">
      <Icon :name="iconName" size="20" />
      <span class="sr-only"> icon</span>
    </div>
    <div class="ml-3 text-sm font-normal">
      <p class="font-medium">{{ props.title }}</p>
      <p>{{ props.message }}</p>
    </div>

    <button @click="emit('remove')" type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">
      <span class="sr-only">Close</span>
      <Icon name="material-symbols:close" size="20" />
    </button>
  </div>
</template>

<style></style>
