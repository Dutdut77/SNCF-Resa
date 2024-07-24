<script setup>
import Group from "@/assets/svg/Group.vue";
import Electric from "@/assets/svg/Electric.vue";
import Fuel from "@/assets/svg/Fuel.vue";
import Manuel from "@/assets/svg/Manuel.vue";
import ArrowRight from "@/assets/svg/ArrowRight.vue";

const { setLoader } = useLoader();
const { formatedDate } = useFormatDate();
const { getAllAnomaliesVehicule, anomalies } = useAnomalies();

const props = defineProps({
  data: {
    default: [],
  },
});

setLoader(true);
await getAllAnomaliesVehicule(props.data.vehicule.id);
setLoader(false);
</script>

<template>
  <div class="flex flex-col gap-4 px-4">
    <p class="text-xl font-bold">{{ props.data.secteur.name }}</p>

    <div class="w-full flex bg-white rounded-lg overflow-hidden shadow-lg border">
      <div class="w-2/5 border-r text-xl p-2 flex items-center justify-center">{{ props.data.vehicule.immat }}</div>
      <div class="w-3/5 flex flex-col gap-3 p-2">
        <p class="text-center font-medium text-lg">{{ props.data.vehicule.marque }} {{ props.data.vehicule.model }}</p>
        <div class="flex justify-center gap-4">
          <div class="flex gap-1 items-center text-sm"><Group class="w-4 h-4" />{{ props.data.vehicule.capacite }}</div>
          <div v-if="props.data.vehicule.id_carburant == 1" class="flex gap-1 items-center text-sm">
            <Electric class="w-4 h-4" />
            <p class="first-letter:uppercase">électrique</p>
          </div>

          <div v-if="props.data.vehicule.id_carburant == 2" class="flex gap-1 items-center text-sm"><Fuel class="w-4 h-4" />Diesel</div>
          <div v-if="props.data.vehicule.id_carburant == 3" class="flex gap-1 items-center text-sm"><Fuel class="w-4 h-4" />Essence</div>

          <div v-if="props.data.vehicule.vitesse == 0" class="flex gap-1 items-center text-sm">
            <div class="w-4 h-4 border rounded flex items-center justify-center">A</div>
            Auto
          </div>

          <div v-if="props.data.vehicule.vitesse == 1" class="flex gap-1 items-center text-sm"><Manuel class="w-4 h-4" />Manuel</div>
        </div>
      </div>
    </div>

    <p class="text-xl font-bold pt-4">Période :</p>

    <div class="w-full flex justify-between items-center gap-4">
      <div class="w-full h-28 border border-slate-300 cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-lg">
        <div class="h-full w-full bg-gradient-to-br from-sky-700 to-sky-500 text-white flex items-center justify-center gap-2 px-2 pb-1 pt-2">
          <div class="w-full h-full text-5xl font-traverse flex items-center justify-end pt-2">{{ formatedDate(props.data.dateDebut).jour }}</div>
          <div class="w-full h-full flex flex-col items-start justify-center">
            <div class="text-base uppercase">{{ formatedDate(props.data.dateDebut).mois }}</div>
            <div class="text-base uppercase">{{ formatedDate(props.data.dateDebut).annee }}</div>
          </div>
        </div>
        <div class="h-full w-full bg-slate-700 flex justify-center items-center p-2">
          <p class="text-white text-xl font-bold">{{ formatedDate(props.data.dateDebut).heure }}</p>
          <p class="text-white text-xl font-bold">h</p>
          <p class="text-white text-xl font-bold">{{ formatedDate(props.data.dateDebut).minute }}</p>
        </div>
      </div>
      <ArrowRight class="w-14 h-14" />
      <div class="w-full h-28 border border-slate-300 cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-lg">
        <div class="h-full w-full bg-gradient-to-br from-sky-700 to-sky-500 text-white flex items-center justify-center gap-2 px-2 pb-1 pt-2">
          <div class="w-full h-full text-5xl font-traverse flex items-center justify-end pt-2">{{ formatedDate(props.data.dateFin).jour }}</div>
          <div class="w-full h-full flex flex-col items-start justify-center">
            <div class="text-base uppercase">{{ formatedDate(props.data.dateFin).mois }}</div>
            <div class="text-base uppercase">{{ formatedDate(props.data.dateFin).annee }}</div>
          </div>
        </div>
        <div class="h-full w-full bg-slate-700 flex justify-center items-center p-2">
          <p class="text-white text-xl font-bold">{{ formatedDate(props.data.dateFin).heure }}</p>
          <p class="text-white text-xl font-bold">h</p>
          <p class="text-white text-xl font-bold">{{ formatedDate(props.data.dateFin).minute }}</p>
        </div>
      </div>
    </div>

    <div>
      <p class="text-xl font-bold pt-4">Divers :</p>
      <p v-if="props.data.vehicule.autres">{{ props.data.vehicule.autres }}</p>
      <p v-else class="italic text-sm">Néant</p>
    </div>

    <div v-if="anomalies.length > 0">
      <p class="text-xl font-bold pt-4">Anomalies :</p>
      <p v-for="(anomalie, index) in anomalies" :key="index" class="text-sm pl-2">- {{ anomalie.anomalie }}</p>
    </div>
  </div>
</template>
