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
    <label :for="props.name" class="block text-sm text-gray-700">{{ props.title }}</label>
    <div class="mt-2 w-full">
      <select class="block appearance-none border border-gray-200 bg-gray-50 text-sm rounded-md py-2 px-4 w-full text-gray-600 leading-tight focus:outline-none focus:border-gray-600 focus:ring-0" :id="props.name" :value="props.modelValue" v-model="selectValue">
        <slot name="options"></slot>
      </select>
    </div>
  </div>
</template>

<style></style>
