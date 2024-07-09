<script setup>
const props = defineProps({
  data: {
    default: [],
  },
});
</script>

<template>
  <div class="p-2 bg-gradient-to-br from-sky-700 to-sky-500 w-full h-32 rounded-lg flex items-center justify-center">
    {{ props.data }}
  </div>
</template>
