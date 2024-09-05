<script setup>
import Train from "@/assets/svg/Train.vue";

const props = defineProps({
  modelValue: {
    default: "",
  },
});

const emits = defineEmits(["update:model-value"]);

const { setLoader } = useLoader();
const { getAll, secteurs } = useSecteurs();
const { getAllVehicules, allVehicules } = useVehicules();
const { getAllSalles, allSalles } = useSalles();

setLoader(true);
await getAll();
await getAllVehicules();
await getAllSalles();
setLoader(false);

const formRadio = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:model-value", value);
  },
});

const nbVehicules = (id) => {
  const result = allVehicules.value.filter((vehicle) => vehicle.id_secteur === id);
  return result.length;
};

const nbSalles = (id) => {
  const result = allSalles.value.filter((salle) => salle.id_secteur === id);
  return result.length;
};
</script>

<template>
  <div class="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-2">
    <div class="relative w-full h-fit" v-for="(secteur, index) in secteurs" :key="index">
      <input :id="secteur.id" type="radio" v-model="formRadio" :value="secteur" class="hidden peer" />

      <label :for="secteur.id" class="h-fit p-4 flex items-center rounded-lg bg-white text-gray-600 border border-slate-300 hover:bg-opacity-75 peer-checked:shadow-lg peer-checked:text-white cursor-pointer transition">
        <Train class="size-8 z-30" />
        <div class="w-full px-4 z-30">
          <div class="uppercase text-sm font-medium">{{ secteur.name }}</div>
          <div class="text-xs italic">Voiture(s) : {{ nbVehicules(secteur.id) }} - Salle(s) : {{ nbSalles(secteur.id) }}</div>
        </div>
      </label>
      <div class="absolute top-0 left-0 w-0 h-full bg-sky-500 peer-checked:shadow-sky-500/30 peer-checked:w-full transition-all duration-300 rounded-lg shadow-lg overflow-hidden"></div>

      <div class="flex absolute top-2 right-2 bottom-0 w-5 h-5 rounded-full border peer-checked:border-sky-600 peer-checked:bg-white scale-0 peer-checked:scale-100 transition delay-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-3 text-sky-500 my-auto mx-auto" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
        </svg>
      </div>
    </div>
  </div>
</template>
