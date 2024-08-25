<script setup>
// Exemple :
// <Radio :name="['decret_92', 'decret_94']" :value="[92, 94]" :radioTitle="['92', '94']" title="Décret Test:" v-model="formValue.decret" />
//

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  name: {
    type: Array,
    default: [],
  },
  radioTitle: {
    type: Array,
    default: [],
  },
  value: {
    type: Array,
    default: [],
  },
  modelValue: {
    default: "",
  },
});

const emits = defineEmits(["update:model-value"]);

const formRadio = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:model-value", value);
  },
});
</script>

<template>
  <div class="py-1 w-full break-inside-avoid">
    <label :for="props.name" class="block text-sm font-medium text-gray-700">{{ props.title }}</label>
    <div class="mt-1 w-full flex gap-2">
      <div class="relative w-1/2" v-for="(name, index) in props.name" :key="index">
        <input :id="name" :name="props.name[0]" type="radio" v-model="formRadio" :value="props.value[index]" class="hidden peer" />
        <label :for="name" class="flex flex-col items-center gap-2 p-2 rounded-lg bg-slate-300 bg-opacity-90 hover:bg-opacity-75 peer-checked:shadow-xl peer-checked:bg-sky-500 peer-checked:text-white cursor-pointer transition">
          <div>
            <div class="">{{ props.radioTitle[index] }}</div>
          </div>
        </label>
        <div class="flex absolute top-2 right-2 bottom-0 w-5 h-5 rounded-full border-2 scale-0 peer-checked:scale-100 transition delay-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-3 text-white my-auto mx-auto" viewBox="0 0 16 16">
            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
