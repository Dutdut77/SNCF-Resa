<script setup>
import Group from "@/assets/svg/Group.vue";
import Electric from "@/assets/svg/Electric.vue";
import Fuel from "@/assets/svg/Fuel.vue";
import Manuel from "@/assets/svg/Manuel.vue";
import Check from "@/assets/svg/Check.vue";
import Wifi from "@/assets/svg/Wifi.vue";
import Pmr from "@/assets/svg/Pmr.vue";
import Clim from "@/assets/svg/Clim.vue";
import VideoProj from "@/assets/svg/VideoProj.vue";
import Jabra from "@/assets/svg/Jabra.vue";
import WhiteBoard from "@/assets/svg/WhiteBoard.vue";
import Webcam from "@/assets/svg/Webcam.vue";

definePageMeta({
  requiresAuth: false,
  isAdmin: false,
  middleware: "secteur-exist",
});

useHead({
  title: `Calendrier`,
  description: "Calendrier des réservation",
});

const route = useRoute();
const userProfil = useState("userProfil");
const { formatedDate, getWeek } = useFormatDate();

const { setLoader } = useLoader();
const { getAllVehiculesBySecteur, allVehiculesSecteur } = useVehicules();
const { getAllSallesBySecteur, allSallesSecteur } = useSalles();

const selectedDate = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate(),
});
const modalVehicule = ref(false);
const modalSalle = ref(false);
const selectedVehicule = ref("");
const selectedSalle = ref("");
const listeVehiculesSelected = ref([]);
const listeSallesSelected = ref([]);
const typeSelected = ref(1);

setLoader(true);
await getAllSallesBySecteur(route.params.id);
await getAllVehiculesBySecteur(route.params.id);
setLoader(false);

const showModalVehicule = (data) => {
  if (data) {
    selectedVehicule.value = data;
    modalVehicule.value = !modalVehicule.value;
  } else {
    selectedVehicule.value = "";
    modalVehicule.value = !modalVehicule.value;
  }
};
const showModalSalle = (data) => {
  if (data) {
    selectedSalle.value = data;
    modalSalle.value = !modalSalle.value;
  } else {
    selectedSalle.value = "";
    modalSalle.value = !modalSalle.value;
  }
};

const selectedDateFormated = computed(() => {
  const dateObject = new Date(selectedDate.value.year, selectedDate.value.month, selectedDate.value.day);
  return formatedDate(dateObject.getTime());
});

const weekNumber = computed(() => {
  const date = new Date(selectedDate.value.year, selectedDate.value.month, selectedDate.value.day);
  return getWeek(date);
});

const dateIso = computed(() => {
  return new Date(selectedDate.value.year, selectedDate.value.month, selectedDate.value.day);
});
</script>

<template>
  <section class="w-full h-full flex flex-col lg:flex-row gap-4 p-4 text-sm text-gray-700 overflow-auto">
    <!-- PARTIE GAUCHE -->
    <div class="w-full lg:w-72 flex-none h-fit lg:h-full flex flex-col gap-4">
      <div class="flex gap-4">
        <div class="w-full p-2 h-24 border flex flex-col justify-center gap-2 items-center rounded-xl cursor-pointer uppercase text-xl font-bold" :class="typeSelected == 1 ? 'text-white bg-gradient-to-br from-slate-600 to-slate-900 ' : 'bg-white text-gray-400'" @click="typeSelected = 1">
          <p>Véhicules</p>
          <div class="font-traverse text-xl rounded-xl w-full text-center pt-1" :class="typeSelected == 1 ? 'text-white bg-gradient-to-br from-sncf-primary-light to-sncf-primary border-0 ' : 'bg-white text-gray-400 border'">{{ allVehiculesSecteur.length }}</div>
        </div>
        <div class="w-full p-2 h-24 border flex flex-col justify-center gap-2 items-center rounded-xl cursor-pointer uppercase text-xl font-bold" :class="typeSelected == 2 ? 'text-white bg-gradient-to-br from-slate-600 to-slate-900 ' : 'bg-white text-gray-400'" @click="typeSelected = 2">
          <p>Salles</p>
          <div class="font-traverse text-xl rounded-xl w-full text-center pt-1" :class="typeSelected == 2 ? 'text-white bg-gradient-to-br from-sncf-primary-light to-sncf-primary border-0 ' : 'bg-white text-gray-400 border'">{{ allSallesSecteur.length }}</div>
        </div>
      </div>

      <ResaCalendar class="w-full" v-model="selectedDate" />

      <div v-if="typeSelected == 1" class="w-full bg-slate-50 rounded-xl flex flex-col gap-2 border py-4">
        <p class="font-bold text-base px-4 cursor-default">Véhicules</p>
        <div v-if="allVehiculesSecteur.length > 0">
          <div class="w-full flex px-4 cursor-pointer pb-1" v-for="vehicule in allVehiculesSecteur" :key="vehicule.id">
            <input type="checkbox" :id="vehicule.immat" :value="vehicule.id" class="mr-2 hidden" v-model="listeVehiculesSelected" />
            <div class="w-full flex gap-2">
              <label :for="vehicule.immat" class="">
                <div class="relative h-3 w-3 p-2 border rounded-sm cursor-pointer" :class="listeVehiculesSelected.includes(vehicule.id) ? 'border-sky-500 bg-sky-500 ' : 'border-gray-500'">
                  <Check class="absolute top-[1px] left-[1px] h-3.5 w-3.5 text-white" :class="listeVehiculesSelected.includes(vehicule.id) ? 'block ' : 'hidden'" />
                </div>
              </label>
              <div class="cursor-default hover:bg-gray-200 flex w-full px-1" @click="showModalVehicule(vehicule)">
                <div>{{ vehicule.immat }} - {{ vehicule.model }}</div>
                <div class="ml-auto text-gray-400 flex gap-2 text-xs">
                  <div class="flex gap-1 items-center"><Group class="w-4 h-4" />{{ vehicule.capacite }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="italic px-4" v-else>Aucun véhicule.</div>
      </div>

      <div v-if="typeSelected == 2" class="w-full bg-slate-50 rounded-xl flex flex-col gap-2 border py-4">
        <p class="font-bold text-base px-4 cursor-default">Salles</p>
        <div v-if="allSallesSecteur.length > 0">
          <div class="w-full flex px-4 cursor-pointer pb-1" v-for="salle in allSallesSecteur" :key="salle.id">
            <input type="checkbox" :id="salle.id" :value="salle.id" class="mr-2 hidden" v-model="listeSallesSelected" />
            <div class="w-full flex gap-2">
              <label :for="salle.id" class="">
                <div class="relative h-3 w-3 p-2 border rounded-sm cursor-pointer" :class="listeSallesSelected.includes(salle.id) ? 'border-green-500 bg-green-500 ' : 'border-gray-500'">
                  <Check class="absolute top-[1px] left-[1px] h-3.5 w-3.5 text-white" :class="listeSallesSelected.includes(salle.id) ? 'block ' : 'hidden'" />
                </div>
              </label>
              <div class="cursor-default hover:bg-gray-200 flex w-full px-1" @click="showModalSalle(salle)">
                <div>{{ salle.name }}</div>
                <div class="ml-auto text-gray-400 flex gap-2 text-xs">
                  <div class="flex gap-1 items-center"><Group class="w-4 h-4" />{{ salle.capacite }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="italic px-4" v-else>Aucune salle.</div>
      </div>

      <div v-if="userProfil.secteur_admin == route.params.id" class="mt-auto hidden lg:block">
        <AppButtonValidated class="w-full text-sm" theme="cancel" @click=""> <template #default> Administration </template> </AppButtonValidated>
      </div>
    </div>

    <!-- PARTIE DROITE -->
    <div class="w-full h-full flex flex-col gap-4">
      <div class="font-bold text-xl flex flex-col lg:flex-row items-center gap-4">
        <div class="relative w-fit text-xl -skew-x-[20deg] uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-gradient-to-br from-slate-600 to-slate-900 px-4 py-2">
          <div class="font-medium text-gray-50">{{ selectedDateFormated.jourName }} {{ selectedDateFormated.jour }} {{ selectedDateFormated.mois }} {{ selectedDateFormated.annee }}</div>
        </div>
        <div class="bg-slate-50 px-2 text-sm rounded-full border border-gray-400 text-gray-600">Semaine {{ weekNumber }}</div>
        <AppButtonValidated class="w-fit px-4 text-sm lg:ml-auto font-normal" theme="" @click=""> <template #default> Nouvelle Réservation </template> </AppButtonValidated>
      </div>

      <div class="w-full h-full border rounded-xl bg-slate-50 p-4 overflow-auto">
        <ResaSemaine :startDate="dateIso" />
      </div>
    </div>

    <AppModal v-if="modalSalle" :closeModal="showModalSalle">
      <template #title>
        <div class="w-full flex flex-col items-center text-lg text-slate-700">
          <p class="font-medium">Salle : {{ selectedSalle.name }}</p>
        </div>
      </template>
      <template #default>
        <div class="w-full flex flex-col gap-4 px-2">
          <div class="px-2">
            <p class="font-bold text-slate-700 underline underline-offset-4 text-sm">Adresse :</p>
            <p class="text-sm pt-1 text-slate-700">{{ selectedSalle.adresse }}</p>
          </div>
          <div class="bg-gradient-to-br from-slate-600 to-slate-900 p-4 rounded-lg border text-white text-sm">
            <div class="grid grid-cols-3 gap-2">
              <div class="flex gap-1">
                <Group class="w-4 h-4" />
                <p>{{ selectedSalle.capacite }}</p>
              </div>
              <div class="flex gap-1">
                <Wifi class="w-4 h-4" />
                <p :class="selectedSalle.wifi ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Wifi</p>
              </div>
              <div class="flex gap-1">
                <Pmr class="w-4 h-4" />
                <p :class="selectedSalle.pmr ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">PMR</p>
              </div>
              <div class="flex gap-1">
                <Clim class="w-4 h-4" />
                <p :class="selectedSalle.clim ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Clim</p>
              </div>
              <div class="flex gap-1">
                <VideoProj class="w-4 h-4" />
                <p :class="selectedSalle.video_proj ? '' : 'line-through decoration-white  decoration-2  text-slate-300 '">VP</p>
              </div>
              <div class="flex gap-1">
                <Jabra class="w-4 h-4" />
                <p :class="selectedSalle.jabra ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Jabra</p>
              </div>
              <div class="flex gap-1">
                <WhiteBoard class="w-4 h-4" />
                <p :class="selectedSalle.white_board ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Tableau</p>
              </div>
              <div class="flex gap-1">
                <Webcam class="w-4 h-4" />
                <p :class="selectedSalle.webcam ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Webcam</p>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full text-gray-700 -space-y-1 px-4">
          <p class="font-bold underline underline-offset-2 text-sm">Divers :</p>
          <p v-if="selectedSalle.autres" class="text-sm">{{ selectedSalle.autres }}</p>
          <p v-else class="text-sm italic pt-1">Néant</p>
        </div>
      </template>
    </AppModal>

    <AppModal v-if="modalVehicule" :closeModal="showModalVehicule">
      <template #title>
        <div class="w-full flex flex-col items-center text-lg text-slate-700">
          <p class="font-medium">{{ selectedVehicule.marque }} {{ selectedVehicule.model }} - {{ selectedVehicule.immat }}</p>
        </div>
      </template>
      <template #default>
        <div class="px-2 w-full">
          <div class="w-full flex flex-col gap-3 p-4 text-white bg-gradient-to-br from-slate-600 to-slate-900 rounded-lg border">
            <div class="flex justify-center gap-4">
              <div class="flex gap-1 items-center text-sm"><Group class="w-4 h-4" />{{ selectedVehicule.capacite }}</div>
              <div v-if="selectedVehicule.id_carburant == 1" class="flex gap-1 items-center text-sm">
                <Electric class="w-4 h-4" />
                <p class="first-letter:uppercase">électrique</p>
              </div>

              <div v-if="selectedVehicule.id_carburant == 2" class="flex gap-1 items-center text-sm"><Fuel class="w-4 h-4" />Diesel</div>
              <div v-if="selectedVehicule.id_carburant == 3" class="flex gap-1 items-center text-sm"><Fuel class="w-4 h-4" />Essence</div>

              <div v-if="selectedVehicule.vitesse == 0" class="flex gap-1 items-center text-sm">
                <div class="w-4 h-4 border rounded flex items-center justify-center">A</div>
                Auto
              </div>

              <div v-if="selectedVehicule.vitesse == 1" class="flex gap-1 items-center text-sm"><Manuel class="w-4 h-4" />Manuel</div>
            </div>
          </div>
        </div>

        <div class="w-full text-gray-700 -space-y-1 px-4">
          <p class="font-bold underline underline-offset-2 text-sm">Divers :</p>
          <p v-if="selectedVehicule.autres" class="text-sm pt-1">{{ selectedVehicule.autres }}</p>
          <p v-else class="text-sm italic pt-1">Néant</p>
        </div>
      </template>
    </AppModal>
  </section>
</template>
