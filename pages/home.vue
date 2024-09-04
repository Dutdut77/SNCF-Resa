<script setup>
import ArrowRight from "@/assets/svg/ArrowRight.vue";
import Check from "@/assets/svg/Check.vue";
import More from "@/assets/svg/More.vue";
import Group from "@/assets/svg/Group.vue";
import Wifi from "@/assets/svg/Wifi.vue";
import Pmr from "@/assets/svg/Pmr.vue";
import Clim from "@/assets/svg/Clim.vue";
import VideoProj from "@/assets/svg/VideoProj.vue";
import Jabra from "@/assets/svg/Jabra.vue";
import WhiteBoard from "@/assets/svg/WhiteBoard.vue";
import Webcam from "@/assets/svg/Webcam.vue";
import Electric from "@/assets/svg/Electric.vue";
import Fuel from "@/assets/svg/Fuel.vue";
import Manuel from "@/assets/svg/Manuel.vue";

definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "Home - Résa Pro",
  description: "Page d'accueil",
});

const userProfil = useState("userProfil");

const { setLoader } = useLoader();
const { getAllVehiculesResaUserActuel, allResaUserActuel, deleteResaVehicule } = useResaVehicules();
const { getAllSallesResaUserActuel, allResaSallesUserActuel, deleteResaSalle } = useResaSalles();
const { timestampToDateFr, timestampToHeure } = useFormatDate();
const { getAllAnomaliesVehicule, getAllAnomaliesSalle, anomalies } = useAnomalies();
const salle = ref("");
const modalSalle = ref(false);
const vehicule = ref("");
const modalVehicule = ref(false);

setLoader(true);
await getAllVehiculesResaUserActuel();
await getAllSallesResaUserActuel();
setLoader(false);

const showModalSalle = async (data) => {
  if (data) {
    await getAllAnomaliesSalle(data.id_salle);
    salle.value = data;
  } else {
    anomalies.value = [];
  }

  modalSalle.value = !modalSalle.value;
};

const showModalVehicule = async (data) => {
  if (data) {
    await getAllAnomaliesVehicule(data.id_vehicule);
    vehicule.value = data;
  } else {
    anomalies.value = [];
  }

  modalVehicule.value = !modalVehicule.value;
};

const annulationSalle = async (id) => {
  setLoader(true);
  await deleteResaSalle(id);
  await getAllSallesResaUserActuel();
  showModalSalle();
  setLoader(false);
};

const annulationVehicule = async (id) => {
  setLoader(true);
  await deleteResaVehicule(id);
  await getAllVehiculesResaUserActuel();
  showModalVehicule();
  setLoader(false);
};
</script>

<template>
  <ResaPage>
    <template #title>
      <div class="-space-y-1">
        <p class="font-bold text-xl">{{ userProfil.nom }} {{ userProfil.prenom }}</p>
        <p class="text-sm italic">{{ userProfil.email }}</p>
      </div>
    </template>

    <template #default>
      <div class="p-4">
        <div class="">
          <p class="text-base font-medium">Mes réservations de salles ({{ allResaSallesUserActuel.length }})</p>
          <div class="w-full h-[1px] bg-slate-300 mt-2"></div>
        </div>

        <div v-if="allResaSallesUserActuel.length > 0" class="w-full flex flex-col gap-2 pt-4 text-sm">
          <div v-for="(salle, index) in allResaSallesUserActuel" :key="index" class="relative w-full bg-white border rounded-lg p-4 flex flex-col cursor-pointer overflow-hidden" @click="showModalSalle(salle)">
            <div v-if="!salle.is_validated" class="text-center text-sm text-red-600">En attente de validation</div>
            <div v-else class="absolute top-3 right-3">
              <Check class="w-3 h-3 text-sky-500" />
            </div>
            <div class="w-full flex flex-col items-center">
              <p class="font-bold text-center">{{ salle.secteurs.name }}</p>
              <p class="font-medium">Salle : {{ salle.salles.name }}</p>
            </div>
            <div class="w-full flex items-center justify-between pt-2 0">
              <div class="flex items-center bg-sky-500 text-white rounded-lg p-2 px-2 gap-2">{{ timestampToDateFr(salle.debut) }} {{ timestampToHeure(salle.debut) }}</div>
              <ArrowRight class="w-6 h-6 text-slate-700" />
              <div class="flex items-center bg-sky-500 text-white rounded-lg p-2 px-2 gap-2">{{ timestampToDateFr(salle.fin) }} {{ timestampToHeure(salle.fin) }}</div>
            </div>
          </div>
        </div>
        <div v-else class="py-2 text-xs italic">Aucune réservation pour le moment</div>
      </div>

      <div class="p-4">
        <div class="">
          <p class="text-base font-medium">Mes réservations de véhicules ({{ allResaUserActuel.length }})</p>
          <div class="w-full h-[1px] bg-slate-300 mt-2"></div>
        </div>

        <div v-if="allResaUserActuel.length > 0" class="w-full flex flex-col gap-2 pt-4 text-sm">
          <div v-for="(vehicule, index) in allResaUserActuel" :key="index" class="relative w-full bg-white border rounded-lg p-4 flex flex-col cursor-pointer overflow-hidden" @click="showModalVehicule(vehicule)">
            <div v-if="!vehicule.is_validated" class="text-center text-sm text-red-600">En attente de validation</div>
            <div v-else class="absolute top-3 right-3">
              <Check class="w-3 h-3 text-sky-500" />
            </div>
            <div class="w-full flex flex-col items-center">
              <p class="font-bold text-center">{{ vehicule.secteurs.name }}</p>
              <p class="font-medium">{{ vehicule.vehicules.marque }} {{ vehicule.vehicules.model }} - {{ vehicule.vehicules.immat }}</p>
            </div>
            <div class="w-full flex items-center justify-between pt-2 0">
              <div class="flex items-center bg-sky-500 text-white rounded-lg p-2 px-2 gap-2">{{ timestampToDateFr(vehicule.debut) }} {{ timestampToHeure(vehicule.debut) }}</div>
              <ArrowRight class="w-6 h-6 text-slate-700" />
              <div class="flex items-center bg-sky-500 text-white rounded-lg p-2 px-2 gap-2">{{ timestampToDateFr(vehicule.fin) }} {{ timestampToHeure(vehicule.fin) }}</div>
            </div>
          </div>
        </div>
        <div v-else class="py-2 text-xs italic">Aucune réservation pour le moment</div>
      </div>
    </template>
    <template #footer></template>

    <template #modal>
      <AppModal v-if="modalSalle" :closeModal="showModalSalle">
        <template #title>
          <div class="w-full flex flex-col items-center text-lg text-slate-700">
            <p class="font-bold text-center">{{ salle.secteurs.name }}</p>
            <p class="font-medium">Salle : {{ salle.salles.name }}</p>
          </div>
        </template>
        <template #default>
          <div class="w-full flex flex-col gap-4 px-2">
            <div class="px-2">
              <p class="font-bold text-slate-700 underline underline-offset-4 text-sm">Adresse :</p>
              <p class="text-sm pt-1 text-slate-700">{{ salle.salles.adresse }}</p>
            </div>
            <div class="bg-sky-500 p-4 rounded-lg border text-white text-sm">
              <div class="grid grid-cols-3 gap-2">
                <div class="flex gap-1">
                  <Group class="w-4 h-4" />
                  <p>{{ salle.salles.capacite }}</p>
                </div>
                <div class="flex gap-1">
                  <Wifi class="w-4 h-4" />
                  <p :class="salle.salles.wifi ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Wifi</p>
                </div>
                <div class="flex gap-1">
                  <Pmr class="w-4 h-4" />
                  <p :class="salle.salles.pmr ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">PMR</p>
                </div>
                <div class="flex gap-1">
                  <Clim class="w-4 h-4" />
                  <p :class="salle.salles.clim ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Clim</p>
                </div>
                <div class="flex gap-1">
                  <VideoProj class="w-4 h-4" />
                  <p :class="salle.salles.video_proj ? '' : 'line-through decoration-white  decoration-2  text-slate-300 '">VP</p>
                </div>
                <div class="flex gap-1">
                  <Jabra class="w-4 h-4" />
                  <p :class="salle.salles.jabra ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Jabra</p>
                </div>
                <div class="flex gap-1">
                  <WhiteBoard class="w-4 h-4" />
                  <p :class="salle.salles.white_board ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Tableau</p>
                </div>
                <div class="flex gap-1">
                  <Webcam class="w-4 h-4" />
                  <p :class="salle.salles.webcam ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Webcam</p>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full text-gray-700 -space-y-1 px-4">
            <p class="font-bold underline underline-offset-2 text-sm">Divers :</p>
            <p v-if="salle.salles.autres" class="text-sm">{{ salle.salles.autres }}</p>
            <p v-else class="text-sm italic pt-1">Néant</p>
          </div>

          <div v-if="anomalies.length > 0" class="w-full text-gray-700 -space-y-1 px-4">
            <p class="font-bold underline underline-offset-2 text-sm pb-1">Anomalies :</p>
            <p v-for="(anomalie, index) in anomalies" :key="index" class="text-sm">{{ anomalie.anomalie }}</p>
          </div>
        </template>
        <template #footer>
          <div class="w-full flex justify-end gap-2 p-2 text-sm">
            <AppButtonValidated class="w-fit px-4 text-sm" theme="cancel" @click="showModalSalle()"> <template #default> Fermer </template> </AppButtonValidated>
            <AppButtonValidated class="w-fit px-4 text-sm" theme="delete" @click="annulationSalle(salle.id)"> <template #default> Annuler la réservation </template> </AppButtonValidated>
          </div>
        </template>
      </AppModal>

      <AppModal v-if="modalVehicule" :closeModal="showModalVehicule">
        <template #title>
          <div class="w-full flex flex-col items-center text-lg text-slate-700">
            <p class="font-bold text-center">{{ vehicule.secteurs.name }}</p>
            <p class="font-medium">{{ vehicule.vehicules.marque }} {{ vehicule.vehicules.model }} - {{ vehicule.vehicules.immat }}</p>
          </div>
        </template>
        <template #default>
          <div class="px-2 w-full">
            <div class="w-full flex flex-col gap-3 p-4 text-white bg-sky-500 rounded-lg border">
              <div class="flex justify-center gap-4">
                <div class="flex gap-1 items-center text-sm"><Group class="w-4 h-4" />{{ vehicule.vehicules.capacite }}</div>
                <div v-if="vehicule.vehicules.id_carburant == 1" class="flex gap-1 items-center text-sm">
                  <Electric class="w-4 h-4" />
                  <p class="first-letter:uppercase">électrique</p>
                </div>

                <div v-if="vehicule.vehicules.id_carburant == 2" class="flex gap-1 items-center text-sm"><Fuel class="w-4 h-4" />Diesel</div>
                <div v-if="vehicule.vehicules.id_carburant == 3" class="flex gap-1 items-center text-sm"><Fuel class="w-4 h-4" />Essence</div>

                <div v-if="vehicule.vehicules.vitesse == 0" class="flex gap-1 items-center text-sm">
                  <div class="w-4 h-4 border rounded flex items-center justify-center">A</div>
                  Auto
                </div>

                <div v-if="vehicule.vehicules.vitesse == 1" class="flex gap-1 items-center text-sm"><Manuel class="w-4 h-4" />Manuel</div>
              </div>
            </div>
          </div>

          <div class="w-full text-gray-700 -space-y-1 px-4">
            <p class="font-bold underline underline-offset-2 text-sm">Divers :</p>
            <p v-if="vehicule.vehicules.autres" class="text-sm pt-1">{{ vehicule.vehicules.autres }}</p>
            <p v-else class="text-sm italic pt-1">Néant</p>
          </div>

          <div v-if="anomalies.length > 0" class="w-full text-gray-700 -space-y-1 px-4">
            <p class="font-bold underline underline-offset-2 text-sm pb-1">Anomalies :</p>
            <p v-for="(anomalie, index) in anomalies" :key="index" class="text-sm">{{ anomalie.anomalie }}</p>
          </div>
        </template>
        <template #footer>
          <div class="w-full flex justify-end gap-2 p-2 text-sm">
            <AppButtonValidated class="w-fit px-4 text-sm" theme="cancel" @click="showModalVehicule()"> <template #default> Fermer </template> </AppButtonValidated>
            <AppButtonValidated class="w-fit px-4 text-sm" theme="delete" @click="annulationVehicule(vehicule.id)"> <template #default> Annuler la réservation </template> </AppButtonValidated>
          </div>
        </template>
      </AppModal>
    </template>
  </ResaPage>
</template>

<style scoped></style>
