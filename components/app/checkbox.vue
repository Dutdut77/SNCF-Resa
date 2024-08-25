<script setup>
import Check from "@/assets/svg/Check.vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "text",
  },
  modelValue: {
    default: null,
  },
});

const emits = defineEmits(["update:model-value"]);

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:model-value", value);
  },
});
</script>

<template>
  <div>
    <input type="checkbox" :id="id" class="mr-2 hidden" v-model="inputValue" />
    <div class="flex gap-2">
      <label :for="id" class="">
        <div class="relative h-3 w-3 p-2 border rounded cursor-pointer" :class="inputValue ? 'border-sky-500 bg-sky-500 ' : 'border-gray-500'">
          <Check class="absolute top-[1px] left-[1px] h-3.5 w-3.5 text-white" :class="inputValue ? 'block ' : 'hidden'" />
        </div>
      </label>
      <p class="cursor-default">
        {{ label }}
      </p>
    </div>
  </div>
</template>
