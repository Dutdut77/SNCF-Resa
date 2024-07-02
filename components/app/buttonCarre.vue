<script setup>
//    <AppButtonValidated class="w-32" theme="cancel"> <template #default> Se connecter </template> </AppButtonValidated>
import Left from "@/assets/svg/Left.vue";
import Right from "@/assets/svg/Right.vue";

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
  <button   :disabled="!props.validated" class=" rounded-lg h-10 w-10 duration-300 border border-gray-500 flex justify-center items-center" :class="props.validated ? ' hover:shadow-md hover:shadow-sky-500 border-sky-700 cursor-pointer text-white bg-sky-600' : 'bg-gray-700 text-gray-600  cursor-not-allowed '">
    <Left v-if="props.direction == 'left'" class="w-10 h-10 text-gray-50 mr-1" />
    <Right v-else class="w-10 h-10 text-gray-50 ml-1 " />
  </button>
</template>

<style></style>