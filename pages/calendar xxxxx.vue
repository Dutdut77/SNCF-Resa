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

// const selectedDateFormat = computed(() => {
//   const dateObject = new Date(selectedDate.value.year, selectedDate.value.month, selectedDate.value.day);
//   return formatedDate(dateObject.getTime());
// });

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

const validatedSecteur = computed(() => {
  return formValue.value.secteur != "" ? true : false;
});
</script>

<template>
  <ResaPage>
    <template #title>
      <div class="-space-y-1 text-white">
        <p v-if="etape == 0" class="font-bold text-xl">Agenda</p>
        <p v-if="etape == 1" class="font-bold text-xl">Agenda - {{ formValue.secteur.name }}</p>
        <p v-if="etape == 0" class="text-sm italic">Selectionnez votre secteur</p>
        <p v-if="etape == 1" class="text-sm italic">Calendrier des réservations</p>
      </div>
    </template>

    <template #default>
      <div v-if="etape == 0" class="w-full h-fit flex flex-col px-4 py-6">
        <ResaRadioSecteur v-model="formValue.secteur" />
      </div>

      <div v-if="etape == 1" class="w-full h-full text-sm py-6 flex flex-col lg:flex-row lg:py-4">
        <ResaCalendar class="sticky top-6 z-20" :dayIsReserved="dayIsReserved" v-model="selectedDate" />
        <!-- <div v-if="selectedDate.day" class="text-center font-medium text-lg p-4 first-letter:uppercase">{{ selectedDateFormat.jourName }} {{ selectedDateFormat.jour }} {{ selectedDateFormat.mois }} {{ selectedDateFormat.annee }}</div> -->

        <div class="flex flex-col gap-4">
          <div class="px-4 pt-4 lg:pt-0">
            <p class="font-bold text-base">Réservations salles :</p>
            <div class="pt-2 pl-2 grid grid-cols-1 lg:grid-cols-1 gap-4" v-if="reservationSalleAtDate.length > 0">
              <div class="relative border-l-2 w-full px-2 overflow-hidden mb-2" :class="!resa.is_validated ? 'border-red-500' : 'border-sky-500'" v-for="(resa, index) in reservationSalleAtDate" :key="index">
                <div class="flex justify-between gap-2 items-center text-sm">
                  <p class="font-medium">{{ resa.salles.name }}</p>
                  <p class="italic text-gray-500">({{ resa.profiles.nom }} {{ resa.profiles.prenom }})</p>
                </div>
                <div class="flex justify-start items-center gap-2 text-sm text-gray-500">
                  <p class="">{{ timestampToDateFr(resa.debut) }} {{ timestampToHeure(resa.debut) }}</p>
                  <ArrowRight class="w-4 h-4 text-gray-500" />
                  <p class="">{{ timestampToDateFr(resa.fin) }} {{ timestampToHeure(resa.fin) }}</p>
                </div>
                <p v-if="!resa.is_validated" class="ml-auto text-red-500 italic">En attente de validation</p>
              </div>
            </div>
            <div v-else class="text-sm italic pl-2">Néant</div>
          </div>

          <div class="px-4 pt-2">
            <p class="font-bold text-base">Réservations véhicules :</p>
            <div class="pt-2 pl-2 grid grid-cols-1 lg:grid-cols-1 gap-4" v-if="reservationVehiculeAtDate.length > 0">
              <div class="relative border-l-2 w-full px-2 overflow-hidden mb-2" :class="!resa.is_validated ? 'border-red-500' : 'border-sky-500'" v-for="(resa, index) in reservationVehiculeAtDate" :key="index">
                <div class="flex justify-between gap-2 items-center text-sm">
                  <div class="flex flex-col">
                    <p class="font-medium">{{ resa.vehicules.model }} - {{ resa.vehicules.immat }}</p>
                  </div>

                  <p class="italic text-gray-500">({{ resa.profiles.nom }} {{ resa.profiles.prenom }})</p>
                </div>
                <div class="flex justify-start items-center gap-2 text-sm text-gray-500">
                  <p class="">{{ timestampToDateFr(resa.debut) }} {{ timestampToHeure(resa.debut) }}</p>
                  <ArrowRight class="w-4 h-4 text-gray-700" />
                  <p class="">{{ timestampToDateFr(resa.fin) }} {{ timestampToHeure(resa.fin) }}</p>
                </div>
                <p v-if="!resa.is_validated" class="ml-auto text-red-500 italic">En attente de validation</p>
              </div>
            </div>
            <div v-else class="text-sm italic pl-2">Néant</div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <AppButtonCarre v-if="etape == 0" :validated="validatedSecteur" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>
      <AppButtonCarre v-if="etape == 1" class="" direction="left" @click="etape--"> </AppButtonCarre>
    </template>
  </ResaPage>
</template>

<style scoped></style>
