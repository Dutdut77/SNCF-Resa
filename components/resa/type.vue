<script setup>
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
  <div class="relative w-full h-full flex flex-col">
    <!-- SALLES -->
    <div class="relative w-full h-full">
      <input id="0" type="radio" v-model="formRadio" value="0" class="hidden peer" />
      <label for="0" class="h-full w-full flex items-center justify-around gap-2 bg-gradient-to-br from-transparent to-transparent border-slate-600 hover:bg-opacity-75 saturate-0 peer-checked:saturate-100 peer-checked:shadow-xl peer-checked:from-sky-700 peer-checked:to-sky-500 peer-checked:border-sky-700 peer-checked:text-white cursor-pointer transition delay-100">
        <div class="w-1/2 h-1/2 flex">
          <img src="/assets/img/bureau.png" class="w-auto h-auto mx-auto" alt="" />
        </div>
        <div class="uppercase w-1/2 h-full flex items-center justify-center text-2xl pb-14"><p class="">Salles</p></div>
      </label>

      <!-- <div class="flex absolute top-2 right-2 bottom-0 w-5 h-5 rounded-full border-2 scale-0 peer-checked:scale-100 transition delay-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-3 text-white my-auto mx-auto" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
        </svg>
      </div> -->
    </div>

    <div class="absolute top-1/2 h-16 w-full bg-slate-200 z-20 -mt-8 -skew-y-6 md:-skew-y-6 flex items-center justify-center text-slate-800 italic text-lg uppercase">--- Toucher pour réserver ---</div>

    <!-- VEHICULES -->
    <div class="relative w-full h-full">
      <input id="1" type="radio" v-model="formRadio" value="1" class="hidden peer" />
      <label for="1" class="h-full w-full flex items-center justify-center gap-2 bg-gradient-to-br from-transparent to-transparent border-slate-600 hover:bg-opacity-75 saturate-0 peer-checked:saturate-100 marker:peer-checked:shadow-xl peer-checked:from-sky-700 peer-checked:to-sky-500 peer-checked:border-sky-700 peer-checked:text-white cursor-pointer transition delay-100">
        <div class="uppercase w-1/2 h-full flex items-center justify-center text-2xl pt-14"><p class="">Véhicules</p></div>

        <div class="w-1/2 h-3/4 flex pt-12">
          <img src="/assets/img/vehicule.png" class="w-auto h-auto mx-auto pl-8" alt="" />
        </div>
      </label>

      <!-- <div class="flex absolute top-2 right-2 bottom-0 w-5 h-5 rounded-full border-2 scale-0 peer-checked:scale-100 transition delay-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-3 text-white my-auto mx-auto" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
        </svg>
      </div> -->
    </div>
  </div>
</template>
