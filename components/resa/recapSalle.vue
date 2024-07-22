<script setup>
import Group from "@/assets/svg/Group.vue";
import Wifi from "@/assets/svg/Wifi.vue";
import Pmr from "@/assets/svg/Pmr.vue";
import Clim from "@/assets/svg/Clim.vue";
import VideoProj from "@/assets/svg/VideoProj.vue";
import Jabra from "@/assets/svg/Jabra.vue";
import WhiteBoard from "@/assets/svg/WhiteBoard.vue";
import Webcam from "@/assets/svg/Webcam.vue";
import ArrowRight from "@/assets/svg/ArrowRight.vue";

const { setLoader } = useLoader();
const { getAllAnomaliesSalle, anomalies } = useAnomalies();
const { formatedDate } = useFormatDate();

const props = defineProps({
  data: {
    default: [],
  },
});
setLoader(true);
await getAllAnomaliesSalle(props.data.salle.id);
setLoader(false);
</script>

<template>
  <div class="flex flex-col gap-4 px-4">
    <p class="text-xl font-bold">{{ props.data.secteur.name }}</p>

    <div class="w-full flex bg-white rounded-lg overflow-hidden shadow-lg border">
      <div class="w-2/5 border-r text-xl p-2 flex items-center justify-center">{{ props.data.salle.name }}</div>
      <div class="w-3/5 flex flex-col gap-3 p-2">
        <div>
          <p class="font-bold text-sm">Adresse :</p>
          <p class="text-xs">{{ props.data.salle.adresse }}</p>
        </div>
        <div>
          <p class="font-bold text-sm">Informations :</p>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="flex gap-1">
              <Group class="w-4 h-4" />
              <p>{{ props.data.salle.capacite }}</p>
            </div>
            <div class="flex gap-1">
              <Wifi class="w-4 h-4" />
              <p :class="props.data.salle.wifi ? '' : 'line-through  decoration-slate-900 decoration-2'">Wifi</p>
            </div>
            <div class="flex gap-1">
              <Pmr class="w-4 h-4" />
              <p :class="props.data.salle.pmr ? '' : 'line-through  decoration-slate-900 decoration-2'">PMR</p>
            </div>
            <div class="flex gap-1">
              <Clim class="w-4 h-4" />
              <p :class="props.data.salle.clim ? '' : 'line-through  decoration-slate-900 decoration-2'">Clim</p>
            </div>
            <div class="flex gap-1">
              <VideoProj class="w-4 h-4" />
              <p :class="props.data.salle.video_proj ? '' : 'line-through decoration-slate-900  decoration-2 '">VP</p>
            </div>
            <div class="flex gap-1">
              <Jabra class="w-4 h-4" />
              <p :class="props.data.salle.jabra ? '' : 'line-through  decoration-slate-900 decoration-2'">Jabra</p>
            </div>
            <div class="flex gap-1">
              <WhiteBoard class="w-4 h-4" />
              <p :class="props.data.salle.white_board ? '' : 'line-through  decoration-slate-900 decoration-2'">Tableau</p>
            </div>
            <div class="flex gap-1">
              <Webcam class="w-4 h-4" />
              <p :class="props.data.salle.webcam ? '' : 'line-through  decoration-slate-900 decoration-2'">Webcam</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="text-xl font-bold pt-4">Période :</p>

    <div class="w-full flex justify-between items-center gap-1">
      <div class="w-full h-28 border border-slate-300 cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-lg">
        <div class="h-full w-full bg-gradient-to-br from-sky-700 to-sky-500 text-white flex items-center justify-center gap-2 px-2 pb-1 pt-2">
          <div class="flex-1 h-full text-5xl font-traverse flex items-center justify-end pt-2">{{ formatedDate(props.data.dateDebut).jour }}</div>
          <div class="flex-1 h-full flex flex-col items-start justify-center">
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
          <div class="flex-1 h-full text-5xl font-traverse flex items-center justify-end pt-2">{{ formatedDate(props.data.dateFin).jour }}</div>
          <div class="flex-1 h-full flex flex-col items-start justify-center">
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
      <p v-if="props.data.salle.autres">{{ props.data.salle.autres }}</p>
      <p v-else class="italic text-sm">Néant</p>
    </div>

    <div v-if="anomalies.length > 0">
      <p class="text-xl font-bold pt-4">Anomalies :</p>
      <p v-for="(anomalie, index) in anomalies" :key="index" class="text-sm pl-2">- {{ anomalie.anomalie }}</p>
    </div>
  </div>
</template>
