<script setup>
import { computed } from "vue";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  modelValue: {
    default: "",
  },
});

const emits = defineEmits(["update:model-value"]);

const selectValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:model-value", value);
  },
});
</script>
<template>
  <div class="w-full break-inside-avoid">
    <label :for="props.name" class="block text-sm font-medium text-gray-200">{{ props.title }}</label>
    <div class="mt-2 w-full">
      <select class="block appearance-none border border-gray-800 bg-gray-700 text-sm rounded-md py-2 px-4 w-full text-gray-100 leading-tight focus:outline-none focus:border-gray-600 focus:ring-0" :id="props.name" :value="props.modelValue" v-model="selectValue">
        <slot name="options"></slot>
      </select>
    </div>
  </div>
</template>

<style></style>
