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
const { timestampToDateFr, timestampToHeure, formatedDate } = useFormatDate();

const etape = ref(0);

const formValue = ref({
  secteur: "",
});

const selectedDate = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate(),
});

watch(formValue.value, async (newValue, oldValue) => {
  setLoader(true);
  await getAllResaSecteurVehicule(newValue.secteur.id);
  await getAllResaSecteurSalle(newValue.secteur.id);
  setLoader(false);
});

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

const reservationVehiculeAtDate = computed(() => {
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

  const objetsActifs = allResaSecteurVehicule.value.filter((objet) => isSameDay(objet.debut, objet.fin, selectedDate.value));

  return objetsActifs;
});

const selectedDateFormat = computed(() => {
  const dateObject = new Date(selectedDate.value.year, selectedDate.value.month, selectedDate.value.day);
  return formatedDate(dateObject.getTime());
});

const dayIsReserved = computed(() => {
  const allDatesSalle = allResaSecteurSalle.value.flatMap((reservation) => {
    const startDate = new Date(parseInt(reservation.debut));
    const endDate = new Date(parseInt(reservation.fin));
    return getDatesInRange(startDate, endDate).map(formatDate);
  });

  const allDatesvehicule = allResaSecteurVehicule.value.flatMap((reservation) => {
    const startDate = new Date(parseInt(reservation.debut));
    const endDate = new Date(parseInt(reservation.fin));
    return getDatesInRange(startDate, endDate).map(formatDate);
  });

  const fusionAllDates = allDatesSalle.concat(allDatesvehicule);

  const uniqueDates = Array.from(new Set(fusionAllDates.map((date) => JSON.stringify(date)))).map((date) => JSON.parse(date));
  return uniqueDates;
});

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  // On ajuste l'heure à minuit pour éviter des problèmes de décalage horaire
  currentDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999); // Fin de la journée

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const formatDate = (date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth(), // getMonth() is zero-based
    day: date.getDate(),
  };
};
</script>

<template>
  <section class="bg-slate-100 w-full h-full text-gray-600 pb-20 flex flex-col overflow-auto m-0 p-0">
    <div class="fixed top-0 w-full h-16 p-4 flex items-center justify-between bg-sky-500 rounded-b-3xl z-50">
      <div class="-space-y-1 text-white">
        <p v-if="etape == 0" class="text-medium text-xl">Agenda</p>
        <p v-if="etape == 1" class="text-medium text-xl">Agenda - {{ formValue.secteur.name }}</p>
        <p v-if="etape == 0" class="text-sm italic">Selectionnez votre secteur</p>
        <p v-if="etape == 1" class="text-sm italic">Calendrier des réservations</p>
      </div>

      <img class="w-12" src="../assets/img/logo_sncf.png" alt="" />
    </div>

    <div class="w-full h-full bg-slate-100 rounded-t-3xl pt-20 flex flex-col">
      <div v-if="etape == 0" class="w-full h-fit flex flex-col px-4 pb-8 overflow-auto">
        <ResaRadioSecteur v-model="formValue.secteur" @change="etape = 1" />
      </div>

      <div v-if="etape == 1" class="">
        <ResaCalendar :dayIsReserved="dayIsReserved" v-model="selectedDate" />
        <div v-if="selectedDate.day" class="text-center font-medium text-lg p-4 first-letter:uppercase">{{ selectedDateFormat.jourName }} {{ selectedDateFormat.jour }} {{ selectedDateFormat.mois }} {{ selectedDateFormat.annee }}</div>

        <div class="px-4">
          <p class="font-medium">Réservations des salles :</p>
          <div class="pt-2" v-if="reservationSalleAtDate.length > 0">
            <div class="relative bg-white border w-full rounded-lg p-2 overflow-hidden mb-2" v-for="(resa, index) in reservationSalleAtDate" :key="index">
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

        <div class="px-4 pt-2">
          <p class="font-medium">Réservations des véhicules :</p>
          <div class="pt-2" v-if="reservationVehiculeAtDate.length > 0">
            <div class="relative bg-white border w-full rounded-lg p-2 overflow-hidden mb-2" v-for="(resa, index) in reservationVehiculeAtDate" :key="index">
              <div v-if="!resa.is_validated" class="absolute top-3 right-3 text-xs">?</div>
              <div v-else class="absolute top-3 right-3">
                <Check class="w-3 h-3 text-sky-500" />
              </div>

              <div class="flex justify-start gap-2 items-center text-sm">
                <p class="font-medium text-base">{{ resa.vehicules.immat }} - {{ resa.vehicules.marque }} {{ resa.vehicules.model }}</p>
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
    </div>
  </section>
</template>

<style scoped>
/* Cacher la barre de défilement */
::-webkit-scrollbar {
  display: none;
}
</style>
