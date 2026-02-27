<script setup>
//    <AppButtonValidated class="w-32" theme="cancel"> <template #default> Se connecter </template> </AppButtonValidated>
const props = defineProps({
  validated: {
    type: Boolean,
    default: true,
  },
  direction: {
    type: String,
    default: "right",
  },
});
</script>

<template>
  <button :disabled="!props.validated" class="rounded-lg h-10 w-10 duration-300 border border-gray-500 flex justify-center items-center z-10" :class="props.validated ? ' hover:shadow-md hover:shadow-slate-900/30 border-sky-500 cursor-pointer text-white bg-sky-500' : 'bg-gray-200 text-gray-600  cursor-not-allowed '">
    <Icon v-if="props.direction == 'left'" name="material-symbols:chevron-left" size="40" class="mr-1" :class="props.validated ? 'text-gray-50' : 'text-gray-600'" />
    <Icon v-else name="material-symbols:chevron-right" size="40" class="ml-1" :class="props.validated ? 'text-gray-50' : 'text-gray-600'" />
  </button>
</template>

<style></style>
