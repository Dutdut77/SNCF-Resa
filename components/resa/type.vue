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
  <div class="relative w-full h-full flex flex-col -mt-8">
    <!-- SALLES -->
    <div class="relative w-full h-full">
      <input id="0" type="radio" v-model="formRadio" value="0" class="hidden peer" />
      <label for="0" class="h-full w-full flex items-center justify-around gap-2 bg-gradient-to-br from-transparent to-transparent border-slate-600 hover:bg-opacity-75 saturate-0 peer-checked:saturate-100 cursor-pointer transition duration-200">
        <div class="w-1/2 h-1/2 flex">
          <img src="/assets/img/bureau.png" class="w-auto h-auto mx-auto" alt="" />
        </div>

        <div class="w-1/2 h-full flex justify-center items-center">
          <div class="relative w-2/3 h-1/3 flex justify-center items-center">
            <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-700 to-sky-500 scale-110 rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
            <span class="absolute top-0 left-0 w-full h-full border rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>

            <div class="uppercase font-bold text-xl z-10 text-white text-center flex flex-col">
              <div class="">Salles</div>
            </div>
          </div>
        </div>
      </label>
    </div>

    <div class="absolute top-1/2 h-10 w-full bg-slate-100 z-20 -mt-5 -skew-y-6 md:-skew-y-6 flex items-center justify-center text-slate-800 italic uppercase"><Arrow class="w-8 h-8 -rotate-90" /> Toucher pour réserver <Arrow class="w-8 h-8 rotate-90" /></div>

    <!-- VEHICULES -->
    <div class="relative w-full h-full">
      <input id="1" type="radio" v-model="formRadio" value="1" class="hidden peer" />
      <label for="1" class="h-full w-full flex items-center justify-center gap-2 bg-gradient-to-br from-transparent to-transparent border-slate-600 hover:bg-opacity-75 saturate-0 peer-checked:saturate-100 cursor-pointer transition duration-200">
        <div class="w-1/2 h-full flex justify-center items-center pt-8">
          <div class="relative w-2/3 h-1/3 flex justify-center items-center">
            <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-700 to-sky-500 scale-110 rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
            <div class="absolute top-0 left-0 w-full h-full border rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></div>

            <div class="uppercase font-bold text-xl z-10 text-white text-center flex flex-col">
              <div class="">Véhicules</div>
            </div>
          </div>
        </div>

        <div class="w-1/2 h-3/4 flex pt-12">
          <img src="/assets/img/vehicule.png" class="w-auto h-auto mx-auto pl-8" alt="" />
        </div>
      </label>
    </div>
  </div>
</template>
