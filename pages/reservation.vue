<script setup>
import ArrowRight from "@/assets/svg/ArrowRight.vue";
import Left from "@/assets/svg/Left.vue";
import Right from "@/assets/svg/Right.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "Réservation - Résa Pro",
  description: "Réservation utilisateur",
});

const { setLoader } = useLoader();
const { getAll, secteurs } = useSecteurs();
const dateFin = ref("");
const dateDebut = ref("");

const selectDate = () => {
  dateDebut.value.selectDate();
  dateFin.value.selectDate();
};

setLoader(true);
await getAll();
setLoader(false);

const etape = ref(0);
const formValue = ref({
  secteur: "",
  type: "",
  dateDebut: "",
  dateFin: "",
});
const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
const heures = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
const selectedMinute = ref("");
const selectedHeure = ref("");

const activeIndexHeure = ref(new Date().getHours());

const activeIndexMinute = computed(() => {
  const date = new Date();
  let currentMinutes = date.getMinutes();

  // Arrondir les minutes à 5 près
  currentMinutes = Math.round(currentMinutes / 5) * 5;

  // Trouver l'index correspondant dans le tableau 'minutes'
  const index = minutes.indexOf(currentMinutes.toString().padStart(2, "0"));

  return index;
});

const progress = computed(() => {
  return Math.floor((100 * etape.value) / 6);
});

const validatedSecteur = computed(() => {
  return formValue.value.secteur != "" ? true : false;
});

const validatedType = computed(() => {
  return formValue.value.type != "" ? true : false;
});

const validatedDate = computed(() => {
  return formValue.value.dateDebut != "" && formValue.value.dateFin != "" ? true : false;
});

const formatedDate = (timestamp) => {
  const result = {};
  // Créer une nouvelle date à partir du timestamp
  let date = new Date(timestamp);

  // Obtenir les différentes parties de la date et de l'heure
  let day = date.getDate();
  let month = date.getMonth() + 1; // Les mois commencent à 0, donc nous ajoutons 1
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let dayOfWeek = date.getDay();

  // Formater les parties de la date pour ajouter des zéros si nécessaire
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Tableau des noms des jours et mois en français
  const dayNames = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  result.jourName = dayNames[dayOfWeek];
  result.jour = day;
  result.mois = monthNames[date.getMonth()];
  result.annee = year;
  result.heure = hours;
  result.minute = minutes;

  return result;
};
</script>

<template>
  <section class="bg-gradient-to-b from-slate-900 to-slate-700 w-full h-full max-h-full text-gray-200 pb-20 flex flex-col overflow-hidden">
    <div class="p-4 flex items-center">
      <div class="flex justify-start items-center flex-1">
        <AppProgressBar :percentage="progress" />
      </div>

      <div v-if="etape == 0" class="flex-1">
        <div class="text-2xl font-medium">Secteur</div>
        <div class="text-sm">Infrapôle Paris-Est</div>
      </div>

      <div v-if="etape == 1" class="flex-1">
        <div class="text-2xl font-medium">Type</div>
        <div class="text-sm">Salles / Véhicules</div>
      </div>

      <div v-if="etape == 2" class="flex-1 ml-auto text-right">
        <div class="text-3xl font-medium">Période</div>
        <div class="text-sm">Sélectionnez les dates</div>
      </div>

      <!-- <div v-if="etape == 3" class="flex-1">
        <div class="text-2xl font-medium">Date Fin</div>
        <div class="text-sm">Sélectionnez une date</div>
      </div> -->
    </div>

    <div v-if="etape == 0" class="h-full flex flex-col overflow-auto pb-4">
      <div class="h-fit px-4">
        <ResaRadioSecteur :data="secteurs" v-model="formValue.secteur" />
      </div>
    </div>

    <div v-if="etape == 1" class="h-full flex flex-col">
      <div class="relative h-full">
        <ResaType v-model="formValue.type" />
      </div>
    </div>

    <div v-if="etape == 2" class="flex justify-center">
      <AppDatePickerIos :items="minutes" v-model="selectedMinute" :viewIndex="activeIndexMinute" />
      <AppDatePickerIos :items="heures" v-model="selectedHeure" :viewIndex="activeIndexHeure" />
    </div>
    <p class="p-8 text-center">Résevertion : {{ selectedHeure }} h {{ selectedMinute }}</p>

    <!-- <div class="h-full flex flex-col px-4 gap-4" v-if="etape == 2">
      <VueDatePicker v-model="formValue.dateDebut" ref="dateDebut" locale="fr" model-type="timestamp" :month-change-on-scroll="false" teleport-center time-picker-inline menu-class-name="dp-custom-menu" calendar-cell-class-name="dp-custom-cell">
        <template #top-extra="{ value }">
          <div v-if="formValue.dateDebut" class="h-20 bg-gradient-to-br from-sky-700 to-sky-500 text-white mb-2 rounded flex flex-col justify-center">
            <p class="text-center first-letter:uppercase">{{ formatedDate(value).jourName }} {{ formatedDate(value).jour }} {{ formatedDate(value).mois }} {{ formatedDate(value).annee }}</p>
            <p class="text-center">{{ formatedDate(value).heure }} H {{ formatedDate(value).minute }}</p>
          </div>
        </template>
        <template #trigger>
          <p class="font-medium text-lg">Début :</p>
          <div v-if="formValue.dateDebut" class="border w-full h-32 rounded-lg flex overflow-hidden border-slate-500 mt-2">
            <div class="h-full w-36 bg-gradient-to-br from-sky-700 to-sky-500 text-white p-4 flex flex-col items-center justify-center">
              <p class="text-4xl font-traverse">{{ formatedDate(formValue.dateDebut).jour }}</p>
              <p class="text-lg uppercase">{{ formatedDate(formValue.dateDebut).mois }}</p>
            </div>
            <div class="w-full bg-slate-700 flex justify-center items-center">
              <p class="text-white text-3xl font-bold">{{ formatedDate(formValue.dateDebut).heure }} H {{ formatedDate(formValue.dateDebut).minute }}</p>
            </div>
          </div>
          <div v-else class="border w-full h-32 rounded-lg overflow-hidden border-slate-500 mt-2 flex justify-center items-center">Choisissez une date...</div>
        </template>
        <template #action-row="{ selectDate }">
          <div class="action-row w-full flex justify-center py-2">
            <button class="py-2 px-4 bg-gradient-to-br from-sky-700 to-sky-500 rounded-lg text-white mx-auto" @click="selectDate">Valider</button>
          </div>
        </template>
      </VueDatePicker>

      <VueDatePicker v-model="formValue.dateFin" ref="dateFin" locale="fr" model-type="timestamp" :month-change-on-scroll="false" teleport-center time-picker-inline menu-class-name="dp-custom-menu" calendar-cell-class-name="dp-custom-cell">
        <template #top-extra="{ value }">
          <div v-if="formValue.dateFin" class="h-20 bg-gradient-to-br from-sky-700 to-sky-500 text-white mb-2 rounded flex flex-col justify-center">
            <p class="text-center first-letter:uppercase">{{ formatedDate(value).jourName }} {{ formatedDate(value).jour }} {{ formatedDate(value).mois }} {{ formatedDate(value).annee }}</p>
            <p class="text-center">{{ formatedDate(value).heure }} H {{ formatedDate(value).minute }}</p>
          </div>
        </template>

        <template #trigger>
          <p class="font-medium text-lg">Fin :</p>
          <div v-if="formValue.dateFin" class="border w-full h-32 rounded-lg flex overflow-hidden border-slate-500 mt-2">
            <div class="h-full w-36 bg-gradient-to-br from-sky-700 to-sky-500 text-white p-4 flex flex-col items-center justify-center">
              <p class="text-4xl font-traverse">{{ formatedDate(formValue.dateFin).jour }}</p>
              <p class="text-lg uppercase">{{ formatedDate(formValue.dateFin).mois }}</p>
            </div>
            <div class="w-full bg-slate-700 flex justify-center items-center">
              <p class="text-white text-3xl font-bold">{{ formatedDate(formValue.dateFin).heure }} H {{ formatedDate(formValue.dateFin).minute }}</p>
            </div>
          </div>
          <div v-else class="border w-full h-32 rounded-lg overflow-hidden border-slate-500 mt-2 flex justify-center items-center">Choisissez une date...</div>
        </template>

        <template #action-row="{ selectDate }">
          <div class="action-row w-full flex justify-center py-2">
            <button class="py-2 px-4 bg-gradient-to-br from-sky-700 to-sky-500 rounded-lg text-white" @click="selectDate">Valider</button>
          </div>
        </template>
      </VueDatePicker>
    </div> -->

    <div class="mt-auto p-6 flex justify-between items-center">
      <AppButtonCarre class="mb-4" direction="left" @click="etape--"> </AppButtonCarre>
      <AppButtonCarre v-if="etape == 0" :validated="validatedSecteur" class="mb-4" direction="right" @click="etape++"> </AppButtonCarre>
      <AppButtonCarre v-if="etape == 1" :validated="validatedType" class="mb-4" direction="right" @click="etape++"> </AppButtonCarre>
      <AppButtonCarre v-if="etape == 2" :validated="validatedDate" class="mb-4" direction="right" @click="etape++"> </AppButtonCarre>
    </div>
  </section>
</template>

<style>
.dp-custom-menu {
  border-radius: 10px;
  padding: 10px 30px 10px 30px;
}
.dp-custom-cell {
  border-radius: 50%;
}
</style>
