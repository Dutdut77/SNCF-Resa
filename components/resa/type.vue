<script setup>
import Arrow from "@/assets/svg/Arrow.vue";
const emits = defineEmits(["update:model-value"]);

const props = defineProps({
  modelValue: {
    default: "",
  },
});

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
  <div class="relative w-full h-full flex flex-col -mt-8 pt-4">
    <!-- SALLES -->
    <div class="relative w-full h-full">
      <input id="0" type="radio" v-model="formRadio" value="0" class="hidden peer" />
      <label for="0" class="h-full w-full flex items-center justify-center gap-2 border-slate-600 peer-checked:text-white cursor-pointer transition duration-300">
        <div class="text-3xl font-traverse z-40">Salles</div>
      </label>
      <div class="absolute top-0 left-0 h-full w-0 bg-gradient-to-br from-sky-700 to-sky-500 peer-checked:w-full transition-all duration-300"></div>
    </div>

    <div class="absolute top-1/2 h-10 w-full bg-white drop-shadow-[0_0px_15px_rgba(0,0,0,0.25)] z-20 -mt-3 flex items-center justify-center text-slate-700 italic uppercase text-sm font-medium"><Arrow class="w-8 h-8 -rotate-90 mr-4" /> Toucher pour réserver <Arrow class="w-8 h-8 rotate-90 ml-4" /></div>

    <!-- VEHICULES -->
    <div class="relative w-full h-full">
      <input id="1" type="radio" v-model="formRadio" value="1" class="hidden peer" />
      <label for="1" class="h-full w-full flex items-center justify-center gap-2 border-slate-600 peer-checked:text-white cursor-pointer transition duration-300">
        <div class="text-3xl font-traverse z-40">Véhicules</div>
      </label>
      <div class="absolute top-0 left-0 h-full w-0 bg-gradient-to-br from-sky-700 to-sky-500 peer-checked:w-full transition-all duration-300"></div>
    </div>
  </div>
</template>
