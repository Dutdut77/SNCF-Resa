<script setup>
import Group from "@/assets/svg/Group.vue";
import Electric from "@/assets/svg/Electric.vue";
import Fuel from "@/assets/svg/Fuel.vue";
import Manuel from "@/assets/svg/Manuel.vue";

const { setLoader } = useLoader();
const { getAllSecteurDispo, vehicules } = useVehicules();
const { getAllResaSecteurTime, allResaSecteurTime } = useResaVehicules();

const props = defineProps({
  data: {
    default: [],
  },

  modelValue: {
    default: "",
  },
});

const emits = defineEmits(["update:model-value"]);

setLoader(true);
await getAllSecteurDispo(props.data.secteur);
await getAllResaSecteurTime(props.data.secteur, props.data.dateDebut);
setLoader(false);

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
  <div class="w-full h-full flex flex-col gap-4 px-4">
    <div class="relative w-full h-fit" v-for="(vehicule, index) in vehicules" :key="index">
      <input :id="vehicule.id" type="radio" v-model="formRadio" :value="vehicule.id" class="hidden peer" />
      <label :for="vehicule.id" class="flex flex-col items-center border justify-center rounded-lg hover:bg-opacity-75 peer-checked:shadow-lg peer-checked:border-2 peer-checked:border-sky-500 cursor-pointer transition overflow-hidden">
        <div class="w-full cursor-pointer bg-white flex">
          <div class="w-2/5 bg-gradient-to-br from-sky-700 to-sky-500 text-white text-xl p-2 flex items-center justify-center">{{ vehicule.immat }}</div>
          <div class="w-3/5 flex flex-col gap-3 p-4">
            <p class="text-center font-medium text-lg">{{ vehicule.marque }} {{ vehicule.model }}</p>
            <div class="flex justify-center gap-4">
              <div class="flex gap-1 items-center text-sm"><Group class="w-4 h-4" />{{ vehicule.capacite }}</div>
              <div v-if="vehicule.id_carburant == 1" class="flex gap-1 items-center text-sm">
                <Electric class="w-4 h-4" />
                <p class="first-letter:uppercase">électrique</p>
              </div>
              <div v-if="vehicule.id_carburant == 2" class="flex gap-1 items-center text-sm"><Fuel class="w-4 h-4" />Diesel</div>
              <div v-if="vehicule.id_carburant == 3" class="flex gap-1 items-center text-sm"><Fuel class="w-4 h-4" />Essence</div>

              <div v-if="vehicule.vitesse == 0" class="flex gap-1 items-center text-sm">
                <div class="w-4 h-4 border rounded flex items-center justify-center">A</div>
                Auto
              </div>
              <div v-if="vehicule.vitesse == 1" class="flex gap-1 items-center text-sm"><Manuel class="w-4 h-4" />Manuel</div>
            </div>
          </div>
        </div>
      </label>
      <div class="flex absolute top-2 right-2 bottom-0 w-5 h-5 rounded-full border-2 scale-0 peer-checked:scale-100 transition delay-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-3 text-gray-700 my-auto mx-auto" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style></style>
