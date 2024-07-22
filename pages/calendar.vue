<script setup>
import ArrowRight from "@/assets/svg/ArrowRight.vue";
import Check from "@/assets/svg/Check.vue";

definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "Calendrier - Résa Pro",
  description: "Calendrier utilisateur",
});

const { setLoader } = useLoader();
const { getAllResaSecteurVehicule, allResaSecteurVehicule } = useResaVehicules();
const { getAllResaSecteurSalle, allResaSecteurSalle } = useResaSalles();
const { timestampToDateFr, timestampToHeure } = useFormatDate();

const etape = ref(0);
const formValue = ref({
  secteur: "",
});

const selectedDate = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate(),
});

// Utilise watch pour surveiller les changements de 'message'
watch(formValue.value, async (newValue, oldValue) => {
  setLoader(true);
  await getAllResaSecteurVehicule(newValue.secteur.id);
  await getAllResaSecteurSalle(newValue.secteur.id);
  setLoader(false);
});

const dayIsReserved = computed(() => {
  let dateObjects = [];
  allResaSecteurVehicule.value.forEach((reservation) => {
    dateObjects.push(getDateObject(reservation.debut));
    dateObjects.push(getDateObject(reservation.fin));
  });
  allResaSecteurSalle.value.forEach((reservation) => {
    dateObjects.push(getDateObject(reservation.debut));
    dateObjects.push(getDateObject(reservation.fin));
  });

  // Suppression des doublons en utilisant un Set
  const uniqueDateObjects = Array.from(new Set(dateObjects.map(JSON.stringify))).map(JSON.parse);

  return uniqueDateObjects;
});

const getDateObject = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  return {
    year: date.getFullYear(),
    month: date.getMonth(), // Les mois sont de 0 à 11
    day: date.getDate(),
  };
};

const reservationSalleAtDate = computed(() => {
  // Fonction pour vérifier si le timestamp est le même jour que selectedDate
  function isSameDay(debut, fin, selectedDate) {
    const dateFromTimestampStart = new Date(Number(debut));
    const yearDebut = dateFromTimestampStart.getFullYear();
    const monthDebut = dateFromTimestampStart.getMonth();
    const dayDebut = dateFromTimestampStart.getDate();

    const dateFromTimestampFin = new Date(Number(fin));
    const yearFin = dateFromTimestampFin.getFullYear();
    const monthFin = dateFromTimestampFin.getMonth();
    const dayFin = dateFromTimestampFin.getDate();

    const dateDebut = new Date(yearDebut, monthDebut, dayDebut);
    const dateFin = new Date(yearFin, monthFin, dayFin);
    const dateCible = new Date(selectedDate.year, selectedDate.month, selectedDate.day);

    const estDansIntervalle = dateCible >= dateDebut && dateCible <= dateFin;

    return estDansIntervalle;
  }

  const objetsActifs = allResaSecteurSalle.value.filter((objet) => isSameDay(objet.debut, objet.fin, selectedDate.value));

  return objetsActifs;
});

const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
</script>

<template>
  <section class="bg-slate-100 w-full h-full text-gray-600 pb-20 flex flex-col gap-4 overflow-auto">
    <div class="sticky h-16 px-4 flex items-center justify-between bg-slate-100">
      <div class="-space-y-1">
        <p v-if="etape == 0" class="text-medium text-xl">Agenda</p>
        <p v-if="etape == 1" class="text-medium text-xl">Agenda - {{ formValue.secteur.name }}</p>
        <p v-if="etape == 0" class="text-sm italic">Selectionnez votre secteur</p>
        <p v-if="etape == 1" class="text-sm italic">Calendrier des réservations</p>
      </div>

      <img class="w-12" src="../assets/img/logo.png" alt="" />
    </div>

    <div v-if="etape == 0" class="w-full h-fit flex flex-col px-4 pb-8 overflow-auto">
      <ResaRadioSecteur v-model="formValue.secteur" @change="etape = 1" />
    </div>

    <div v-if="etape == 1">
      <ResaCalendar :dayIsReserved="dayIsReserved" v-model="selectedDate" />
      <div v-if="selectedDate.day" class="text-center font-medium text-lg p-4">{{ selectedDate.day }} {{ months[selectedDate.month] }} {{ selectedDate.year }}</div>

      <div class="px-4">
        <p class="font-medium">Réservations des salles :</p>
        <div class="pt-2" v-if="reservationSalleAtDate.length > 0">
          <div class="relative bg-white border w-full rounded-lg p-2 overflow-hidden" v-for="(resa, index) in reservationSalleAtDate" :key="index">
            <div v-if="!resa.is_validated" class="absolute top-3 right-3 text-xs">?</div>
            <div v-else class="absolute top-3 right-3">
              <Check class="w-3 h-3 text-sky-500" />
            </div>

            <div class="flex justify-start gap-2 items-center text-sm">
              <p class="font-medium text-base">{{ resa.salles.name }}</p>
              <p class="italic">({{ resa.profiles.nom }} {{ resa.profiles.prenom }})</p>
            </div>
            <div class="flex justify-start items-center gap-2 text-sm">
              <p class="">{{ timestampToDateFr(resa.debut) }} {{ timestampToHeure(resa.debut) }}</p>
              <ArrowRight class="w-4 h-4 text-gray-700" />
              <p class="">{{ timestampToDateFr(resa.fin) }} {{ timestampToHeure(resa.fin) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-sm italic">Néant</div>
      </div>
    </div>

    <div class="mt-auto mb-4 px-4 flex justify-between items-center">
      <AppButtonCarre v-if="etape == 1" class="mr-auto" direction="left" @click="etape--"> </AppButtonCarre>
    </div>
  </section>
</template>
