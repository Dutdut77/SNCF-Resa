<script setup>
import Arrow from "@/assets/svg/Arrow.vue";
import Left from "@/assets/svg/Left.vue";
import Right from "@/assets/svg/Right.vue";
import Touch from "@/assets/svg/Touch.vue";

definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "Réservation - Résa Pro",
  description: "Réservation utilisateur",
});

const { setLoader } = useLoader();
const { getMailSuperviseursSecteur, secteurs } = useSecteurs();
const { addResaVehicule } = useResaVehicules();
const { addResaSalles } = useResaSalles();
const { formatedDate, monthLetter } = useFormatDate();
const { sendEmail } = useEmail();
const { getAllProfiles, allProfiles } = useAuth();
const userProfil = useState("userProfil");

const etape = ref(0);
const formValue = ref({
  secteur: "",
  type: "",
  dateDebut: "",
  dateFin: "",
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  vehicule: "",
  salle: "",
});

const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
const heures = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
const selectedMinute = ref("");
const selectedHeure = ref("");
const selectedDay = ref("");
const activeIndexHeure = ref(new Date().getHours());
const activeIndexDay = ref(ref(new Date().getDate() - 1));
const activeIndexMinute = computed(() => {
  const date = new Date();
  let currentMinutes = date.getMinutes();

  // Arrondir les minutes à 5 près
  currentMinutes = Math.ceil(currentMinutes / 5) * 5;

  // Trouver l'index correspondant dans le tableau 'minutes'
  const index = minutes.indexOf(currentMinutes.toString().padStart(2, "0"));

  return index;
});

setLoader(true);
await getAllProfiles();
setLoader(false);

const dayOfMonth = computed(() => {
  // Initialise le premier jour du mois
  const date = new Date(formValue.value.year, formValue.value.month, 1);
  const days = [];
  while (date.getMonth() === formValue.value.month) {
    const options = { weekday: "short", day: "2-digit" };

    days.push(date.toLocaleDateString("fr-FR", options));
    date.setDate(date.getDate() + 1);
  }
  return days;
});
const progress = computed(() => {
  return Math.floor((100 * etape.value) / 4);
});
const valideDate = computed(() => {
  if (formValue.value.dateFin < formValue.value.dateDebut) {
    return false;
  } else return true;
});
const validatedSecteur = computed(() => {
  return formValue.value.secteur != "" ? true : false;
});
const validatedType = computed(() => {
  return formValue.value.type != "" ? true : false;
});
const validatedDate = computed(() => {
  return formValue.value.dateDebut != "" && formValue.value.dateFin != "" && valideDate.value != false ? true : false;
});
const validatedSalle = computed(() => {
  return formValue.value.salle != "" ? true : false;
});
const validatedVehicule = computed(() => {
  return formValue.value.vehicule != "" ? true : false;
});
const isAuthToReserv = computed(() => {
  if (userProfil.value.secteur_auth) {
    const array = userProfil.value.secteur_auth.split(",").map(Number);
    return array.includes(formValue.value.secteur.id);
  } else {
    return false;
  }
});

// const listSecteurAdmin = computed(() => {
//   const emails = allProfiles.value.filter((user) => user.secteur_admin === formValue.value.secteur.id).map((user) => user.email);

//   return emails;
// });

const updateDateDebut = () => {
  const day = selectedDay.value.split(" ")[1];
  const date = new Date(formValue.value.year, formValue.value.month, day, selectedHeure.value, selectedMinute.value);
  formValue.value.dateDebut = date.getTime();
};

const updateDateFin = () => {
  const day = selectedDay.value.split(" ")[1];
  const date = new Date(formValue.value.year, formValue.value.month, day, selectedHeure.value, selectedMinute.value);
  formValue.value.dateFin = date.getTime();
};

const addResa = async () => {
  if (isAuthToReserv.value) {
    formValue.value.is_validated = 1;
  } else {
    formValue.value.is_validated = 0;
  }

  formValue.value.id_user = userProfil.value.id;

  if (formValue.value.type == 0) {
    setLoader(true);
    if (!isAuthToReserv.value) {
      const listes = await getMailSuperviseursSecteur(formValue.value.secteur.id);
      await sendEmail(listes, userProfil.value, formValue.value);
    }

    await addResaSalles(formValue.value);
    navigateTo("/home");
    setLoader(false);
  } else {
    setLoader(true);
    if (!isAuthToReserv.value) {
      const listes = await getMailSuperviseursSecteur(formValue.value.secteur.id);
      await sendEmail(listes, userProfil.value, formValue.value);
    }

    await addResaVehicule(formValue.value);
    navigateTo("/home");
    setLoader(false);
  }
};
</script>

<template>
  <ResaPage>
    <template #title>
      <AppProgressBar :percentage="progress" />

      <div v-if="etape == 0" class="-space-y-1 mr-auto pl-4">
        <div class="text-xl font-bold">Secteur</div>
        <div class="text-sm italic">Infrapôle Paris-Est</div>
      </div>

      <div v-if="etape == 1" class="-space-y-1 mr-auto pl-4">
        <div class="text-xl font-bold">Type</div>
        <div class="text-sm italic">Salles / Véhicules</div>
      </div>

      <div v-if="etape == 2" class="-space-y-1 mr-auto pl-4">
        <div class="text-xl font-bold">Période</div>
        <div class="text-sm italic">Sélectionnez vos dates</div>
      </div>

      <div v-if="etape == 3 && formValue.type == 0" class="-space-y-1 mr-auto pl-4">
        <div class="text-xl font-bold">Salles</div>
        <div class="text-sm italic">Sélectionnez votre salle</div>
      </div>

      <div v-if="etape == 3 && formValue.type == 1" class="-space-y-1 mr-auto pl-4">
        <div class="text-xl font-bold">Véhicules</div>
        <div class="text-sm italic">Sélectionnez votre véhicule</div>
      </div>

      <div v-if="etape == 4 && formValue.type == 0" class="-space-y-1 mr-auto pl-4">
        <div class="text-xl font-bold">Récapitulatif</div>
        <div class="text-sm italic">Réservation d'une salle</div>
      </div>

      <div v-if="etape == 4 && formValue.type == 1" class="-space-y-1 mr-auto pl-4">
        <div class="text-xl font-bold">Récapitulatif</div>
        <div class="text-sm italic">Réservation d'un véhicule</div>
      </div>
    </template>

    <template #default>
      <div v-if="etape == 0" class="w-full h-fit flex flex-col px-4 py-6 overflow-auto">
        <ResaRadioSecteur v-model="formValue.secteur" />
      </div>

      <div v-if="etape == 1" class="w-full h-full flex flex-col overflow-auto">
        <ResaType v-model="formValue.type" />
      </div>

      <div v-if="etape == 2" class="w-full h-fit flex flex-col justify-center py-6">
        <div class="flex items-center justify-center gap-4 pb-4 px-4">
          <div class="w-1/2 flex justify-center items-center gap-2 bg-white rounded-lg py-2 px-2 shadow-lg">
            <Left class="mr-auto h-6 w-6 cursor-pointer" @click="formValue.year--" />
            <p class="text-center font-medium">{{ formValue.year }}</p>
            <Right class="ml-auto h-6 w-6 cursor-pointer" @click="formValue.year++" />
          </div>
          <div class="w-1/2 flex justify-center items-center gap-2 bg-white shadow-lg rounded-lg py-2 px-2">
            <Left class="mr-auto h-6 w-6 cursor-pointer" @click="formValue.month--" :class="formValue.month > 0 ? 'visible' : 'invisible'" />
            <p class="text-center font-medium">{{ monthLetter(formValue.month) }}</p>
            <Right class="ml-auto h-6 w-6 cursor-pointer" @click="formValue.month++" :class="formValue.month < 11 ? 'visible' : 'invisible'" />
          </div>
        </div>

        <div class="flex w-full p-4">
          <AppDatePickerIos class="w-full" :items="dayOfMonth" v-model="selectedDay" :viewIndex="activeIndexDay" />
          <AppDatePickerIos class="w-36" :items="heures" v-model="selectedHeure" :viewIndex="activeIndexHeure" />
          <div class="h-full w-fit flex items-center">
            <p class="h-12 border-t border-b border-gray-700 flex items-center justify-center">h</p>
          </div>
          <AppDatePickerIos class="w-36" :items="minutes" v-model="selectedMinute" :viewIndex="activeIndexMinute" />
        </div>

        <div class="w-full flex justify-center items-center gap-4 py-2">
          <Arrow class="w-8 h-8 rotate-90" />
        </div>

        <div class="w-full h-full flex gap-4 px-4">
          <div class="w-full h-fit flex flex-col">
            <p class="px-4 pb-2 text-center uppercase font-medium">Début</p>
            <div v-if="formValue.dateDebut" class="w-full h-28 justify-center items-center border border-slate-300 cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-lg" @click="updateDateDebut()">
              <div class="h-full w-full bg-sky-500 text-white flex items-center justify-center gap-2 px-2 pb-1 pt-2">
                <div class="w-full h-full text-5xl font-traverse flex items-center justify-end pt-2">{{ formatedDate(formValue.dateDebut).jour }}</div>
                <div class="w-full h-full flex flex-col items-start justify-center">
                  <div class="text-base uppercase">{{ formatedDate(formValue.dateDebut).mois }}</div>
                  <div class="text-base uppercase">{{ formatedDate(formValue.dateDebut).annee }}</div>
                </div>
              </div>
              <div class="h-full w-full bg-slate-700 flex justify-center items-center p-2">
                <p class="text-white text-xl font-bold">{{ formatedDate(formValue.dateDebut).heure }}</p>
                <p class="text-white text-xl font-bold">h</p>
                <p class="text-white text-xl font-bold">{{ formatedDate(formValue.dateDebut).minute }}</p>
              </div>
            </div>
            <div v-else class="w-full h-28 border border-gray-100 flex flex-col gap-2 items-center justify-center text-center p-4 rounded-lg bg-white shadow-lg cursor-pointer italic" @click="updateDateDebut()">
              <Touch class="w-8 h-8 text-sky-500 animate__animated animate__heartBeat animate__repeat-3 animate__delay-1s" />

              <p class="text-sm">Mettre à jour</p>
            </div>
          </div>

          <div class="w-full h-fit flex flex-col">
            <p class="px-4 pb-2 text-center uppercase font-medium">Fin</p>
            <div v-if="formValue.dateFin" class="w-full h-28 justify-center items-center border border-slate-300 cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-lg" @click="updateDateFin()">
              <div class="h-full w-full bg-sky-500 text-white flex items-center justify-center gap-2 px-2 pb-1 pt-2">
                <div class="w-full h-full text-5xl font-traverse flex items-center justify-end pt-2">{{ formatedDate(formValue.dateFin).jour }}</div>
                <div class="w-full h-full flex flex-col items-start justify-center">
                  <div class="text-base uppercase">{{ formatedDate(formValue.dateFin).mois }}</div>
                  <div class="text-base uppercase">{{ formatedDate(formValue.dateFin).annee }}</div>
                </div>
              </div>
              <div class="h-full w-full bg-slate-700 flex justify-center items-center p-2">
                <p class="text-white text-xl font-bold">{{ formatedDate(formValue.dateFin).heure }}</p>
                <p class="text-white text-xl font-bold">h</p>
                <p class="text-white text-xl font-bold">{{ formatedDate(formValue.dateFin).minute }}</p>
              </div>
            </div>
            <div v-else class="w-full h-28 border border-gray-100 flex flex-col items-center justify-center gap-4 text-center p-4 rounded-lg bg-white shadow-lg cursor-pointer italic" @click="updateDateFin()">
              <Touch class="w-8 h-8 text-sky-500 animate__animated animate__heartBeat animate__repeat-3 animate__delay-1s" />
              <p class="text-sm">Mettre à jour</p>
            </div>
          </div>
        </div>

        <div v-if="!valideDate && formValue.dateDebut != '' && formValue.dateFin != ''" class="p-4 w-full">
          <p class="w-full text-center bg-red-100 rounded-lg p-4 text-red-700 italic">Attention, il y a une incohérence entre la date de début et celle de fin.</p>
        </div>

        <!-- <p class="p-8 text-center">Résevertion : Jour : {{ selectedDay }} month : {{ formValue.month }} annee : {{ formValue.year }} à {{ selectedHeure }} h {{ selectedMinute }}</p> -->
      </div>

      <div v-if="etape == 3 && formValue.type == 0" class="w-full h-fit flex flex-col justify-center py-6">
        <ResaRadioSalle :data="formValue" v-model="formValue.salle" />
      </div>

      <div v-if="etape == 3 && formValue.type == 1" class="w-full h-fit flex flex-col justify-center py-6">
        <ResaRadioVehicule :data="formValue" v-model="formValue.vehicule" />
      </div>

      <div v-if="etape == 4 && formValue.type == 0" class="w-full h-fit flex flex-col justify-center py-6">
        <ResaRecapSalle :data="formValue" />
      </div>

      <div v-if="etape == 4 && formValue.type == 1" class="w-full h-fit flex flex-col justify-center py-6">
        <ResaRecapVehicule :data="formValue" />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center">
        <AppButtonCarre v-if="etape > 0" class="" direction="left" @click="etape--"> </AppButtonCarre>
        <AppButtonCarre v-if="etape == 0" :validated="validatedSecteur" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>
        <AppButtonCarre v-if="etape == 1" :validated="validatedType" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>
        <AppButtonCarre v-if="etape == 2" :validated="validatedDate" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>
        <AppButtonCarre v-if="etape == 3 && formValue.type == 0" :validated="validatedSalle" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>
        <AppButtonCarre v-if="etape == 3 && formValue.type == 1" :validated="validatedVehicule" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>
        <AppButtonValidated v-if="etape == 4 && isAuthToReserv" class="w-fit ml-auto px-4" theme="" @click="addResa()"> <template #default> Réserver </template> </AppButtonValidated>
        <AppButtonValidated v-if="etape == 4 && !isAuthToReserv" class="w-fit ml-auto" theme="" @click="addResa()"> <template #default> Envoyer la demande </template> </AppButtonValidated>
      </div>
    </template>
  </ResaPage>
</template>

<style scoped>
/* Cacher la barre de défilement */
::-webkit-scrollbar {
  display: none;
}
</style>
