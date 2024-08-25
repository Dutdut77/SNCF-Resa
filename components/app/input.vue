<script setup>
// Exemple :
// <AppInput name="email" type="email" title="Email : " placeholder="Entrez votre email professionel" v-model="formValue.email" />

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "Entrez votre texte",
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
  <div class="w-full break-inside-avoid">
    <label :for="props.name" class="block text-sm text-gray-700">{{ props.title }}</label>
    <div class="mt-1">
      <input class="appearance-none border border-gray-200 bg-gray-50 text-sm rounded-md py-2 px-4 w-full text-gray-700 leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-300 focus:ring-0 placeholder:text-gray-400" autocomplete="off" :placeholder="props.placeholder" :id="props.name" :name="props.name" :type="props.type" :value="props.modelValue" v-model="inputValue" />
    </div>
  </div>
</template>

<style></style>
