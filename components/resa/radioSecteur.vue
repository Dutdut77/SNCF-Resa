<script setup>
// Exemple :
// <Radio :name="['decret_92', 'decret_94']" :value="[92, 94]" :radioTitle="['92', '94']" title="Décret Test:" v-model="formValue.decret" />
//

const props = defineProps({
  data: {
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
  <div class="w-full h-full grid grid-cols-2 gap-4">
    <div class="relative w-full h-fit" v-for="(secteur, index) in props.data" :key="index">
      <input :id="secteur.id" type="radio" v-model="formRadio" :value="secteur.id" class="hidden peer" />
      <label :for="secteur.id" class="h-24 flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-white to-white border border-slate-300 hover:bg-opacity-75 peer-checked:shadow-xl peer-checked:from-sky-700 peer-checked:to-sky-500 peer-checked:border-sky-700 peer-checked:text-white cursor-pointer transition">
        <div class="uppercase text-lg">{{ secteur.name }}</div>
      </label>
      <div class="flex absolute top-2 right-2 bottom-0 w-5 h-5 rounded-full border-2 scale-0 peer-checked:scale-100 transition delay-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-3 text-white my-auto mx-auto" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style></style>
