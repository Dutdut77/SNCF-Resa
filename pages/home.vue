<script setup>
import ArrowRight from "@/assets/svg/ArrowRight.vue";
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
const salle = ref("");
const modalSalle = ref(false);
const vehicule = ref("");
const modalVehicule = ref(false);

setLoader(true);
await getAllVehiculesResaUserActuel();
await getAllSallesResaUserActuel();
setLoader(false);

const showModalSalle = (data) => {
  salle.value = data;
  modalSalle.value = !modalSalle.value;
};

const showModalVehicule = (data) => {
  vehicule.value = data;
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
  <section class="bg-slate-100 w-full h-full text-gray-700 overflow-auto pb-20">
    <div class="p-4 flex w-full items-center">
      <div class="">
        <p class="text-gray-700 text-xl">{{ userProfil.nom }} {{ userProfil.prenom }}</p>
        <p class="text-xs italic text-gray-500">{{ userProfil.email }}</p>
      </div>
      <img class="ml-auto w-12" src="../assets/img/logo.png" alt="" />
    </div>

    <div class="p-4">
      <div class="">
        <p class="text-base font-medium">Mes réservations de salles ({{ allResaSallesUserActuel.length }})</p>
        <div class="w-full h-[1px] bg-slate-300 mt-2"></div>
      </div>
      <!-- {{ allResaSallesUserActuel[0] }} -->
      <div v-if="allResaSallesUserActuel.length > 0" class="w-full flex flex-col gap-2 pt-4">
        <div v-for="(salle, index) in allResaSallesUserActuel" :key="index" class="relative w-full bg-white border rounded-lg p-4 flex flex-col cursor-pointer overflow-hidden" @click="showModalSalle(salle)">
          <div v-if="!salle.is_validated" class="absolute top-4 -right-4 bg-slate-200 rotate-45 px-4 text-xs">En cours</div>
          <div class="w-full flex flex-col items-center">
            <p class="font-bold text-center">{{ salle.secteurs.name }}</p>
            <p class="font-medium">Salle : {{ salle.salles.name }}</p>
          </div>
          <div class="w-full flex items-center justify-between pt-2 0">
            <div class="flex items-center bg-gradient-to-br from-sky-700 to-sky-500 text-white rounded-lg p-2 px-4 gap-2">{{ timestampToDateFr(salle.debut) }} {{ timestampToHeure(salle.debut) }}</div>
            <ArrowRight class="w-6 h-6 text-slate-700" />
            <div class="flex items-center bg-gradient-to-br from-sky-700 to-sky-500 text-white rounded-lg p-2 px-4 gap-2">{{ timestampToDateFr(salle.fin) }} {{ timestampToHeure(salle.fin) }}</div>
          </div>
          <!-- <More class="absolute top-4 right-4 w-6 h-6 cursor-pointer" @click="showModalSalle(salle)" /> -->
        </div>
      </div>
      <div v-else class="py-2 text-xs italic">Aucune réservation pour le moment</div>
    </div>

    <div class="p-4">
      <div class="">
        <p class="text-base font-medium">Mes réservations de véhicules ({{ allResaUserActuel.length }})</p>
        <div class="w-full h-[1px] bg-slate-300 mt-2"></div>
      </div>
      <!-- {{ allResaUserActuel[0] }} -->
      <div v-if="allResaUserActuel.length > 0" class="w-full flex flex-col gap-2 pt-4">
        <div v-for="(vehicule, index) in allResaUserActuel" :key="index" class="relative w-full bg-white border rounded-lg p-4 flex flex-col cursor-pointer overflow-hidden" @click="showModalVehicule(vehicule)">
          <div v-if="!vehicule.is_validated" class="absolute top-4 -right-4 bg-slate-200 rotate-45 px-4 text-xs">En cours</div>
          <div class="w-full flex flex-col items-center">
            <p class="font-bold text-center">{{ vehicule.secteurs.name }}</p>
            <p class="font-medium">{{ vehicule.vehicules.marque }} {{ vehicule.vehicules.model }} - {{ vehicule.vehicules.immat }}</p>
          </div>
          <div class="w-full flex items-center justify-between pt-2 0">
            <div class="flex items-center bg-gradient-to-br from-sky-700 to-sky-500 text-white rounded-lg p-2 px-4 gap-2">{{ timestampToDateFr(vehicule.debut) }} {{ timestampToHeure(vehicule.debut) }}</div>
            <ArrowRight class="w-6 h-6 text-slate-700" />
            <div class="flex items-center bg-gradient-to-br from-sky-700 to-sky-500 text-white rounded-lg p-2 px-4 gap-2">{{ timestampToDateFr(vehicule.fin) }} {{ timestampToHeure(vehicule.fin) }}</div>
          </div>
          <!-- <More class="absolute top-4 right-4 w-6 h-6 cursor-pointer" @click="showModalVehicule(vehicule)" /> -->
        </div>
      </div>
      <div v-else class="py-2 text-xs italic">Aucune réservation pour le moment</div>
    </div>

    <AppModal v-if="modalSalle" :closeModal="showModalSalle">
      <template #title>
        <div class="w-full flex flex-col items-center text-xl text-slate-700">
          <p class="font-bold text-center">{{ salle.secteurs.name }}</p>
          <p class="font-medium">Salle : {{ salle.salles.name }}</p>
        </div>
      </template>
      <template #default>
        <div class="w-full flex flex-col gap-3 p-2">
          <div class="bg-slate-200 p-4 rounded-lg border">
            <p class="font-bold text-slate-700 underline underline-offset-4">Adresse :</p>
            <p class="text-sm pt-4 text-slate-700">{{ salle.salles.adresse }}</p>
          </div>
          <div class="bg-gradient-to-br from-sky-700 to-sky-500 p-4 rounded-lg border text-white">
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
      </template>
      <template #footer>
        <div class="w-full flex justify-end gap-4 px-2">
          <AppButtonValidated class="w-full" theme="cancel" @click="showModalSalle()"> <template #default> Fermer </template> </AppButtonValidated>
          <AppButtonValidated class="w-full" theme="delete" @click="annulationSalle(salle.id)"> <template #default> Annuler la réservation </template> </AppButtonValidated>
        </div>
      </template>
    </AppModal>

    <AppModal v-if="modalVehicule" :closeModal="showModalVehicule">
      <template #title>
        <div class="w-full flex flex-col items-center text-xl text-slate-700">
          <p class="font-bold text-center">{{ vehicule.secteurs.name }}</p>
          <p class="font-medium">{{ vehicule.vehicules.marque }} {{ vehicule.vehicules.model }} - {{ vehicule.vehicules.immat }}</p>
        </div>
      </template>
      <template #default>
        <div class="w-full flex flex-col gap-3 p-4 text-white bg-gradient-to-br from-sky-700 to-sky-500 rounded-lg border">
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
      </template>
      <template #footer>
        <div class="w-full flex justify-end gap-4 px-2">
          <AppButtonValidated class="w-full" theme="cancel" @click="showModalVehicule()"> <template #default> Fermer </template> </AppButtonValidated>
          <AppButtonValidated class="w-full" theme="delete" @click="annulationVehicule(vehicule.id)"> <template #default> Annuler la réservation </template> </AppButtonValidated>
        </div>
      </template>
    </AppModal>
  </section>
</template>
