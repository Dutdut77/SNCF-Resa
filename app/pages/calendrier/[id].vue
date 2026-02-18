<script setup>
definePageMeta({
  requiresAuth: true,
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
const { getAll, getMailSuperviseursSecteur, secteurs } = useSecteurs();
const { getAllVehiculesBySecteur, allVehiculesSecteur } = useVehicules();
const { addResaVehicule, getAllResaSecteurVehicule, deleteResaVehicule, updateResaVehicule, allResaSecteurVehicule } = useResaVehicules();
const { getAllSallesBySecteur, allSallesSecteur } = useSalles();
const { addResaSalles, getAllResaSecteurSalle, deleteResaSalle, updateResaSalle, allResaSecteurSalle } = useResaSalles();
const { sendEmail, sendEmailAnnulation, sendEmailModification } = useEmail();
const { updateProfiles } = useAuth();

const selectedDate = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate(),
});
const modalVehicule = ref(false);
const modalSalle = ref(false);
const modalResa = ref(false);
const modalChoiceSecteur = ref(false);
const selectedVehicule = ref("");
const selectedSalle = ref("");
const selectedResa = ref("");
const listeVehiculesSelected = ref([]);
const listeSallesSelected = ref([]);
const typeSelected = ref(1);
// const selectedResa = ref("");
const sideModal = ref(false);
const datePickerDebutIsVisible = ref(false);
const datePickerFinIsVisible = ref(false);
const colors = [
  "#0284c7", // Sky-600
  "#9333ea", // purple-600
  "#e11d48", // rose-600
  "#ea580c", // orange-600
  "#dc2626", // red-600
  "#0d9488", // teal-600
  "#16a34a", // green-600
  "#0891b2", // cyan-600
];
const formValue = ref({
  id: "",
  secteur: route.params.id,
  type: typeSelected.value,
  dateDebut: "",
  dateFin: "",
  vehicule: "",
  salle: "",
  titre: "",
  update: false,
  updateRadioId: "",
  id_user: "",
});

setLoader(true);
await getAllSallesBySecteur(route.params.id);
await getAllVehiculesBySecteur(route.params.id);
await getAllResaSecteurVehicule(route.params.id);
await getAllResaSecteurSalle(route.params.id);
await getAll();
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

const secteurActive = computed(() => {
  const result = secteurs.value.find((obj) => obj.id == route.params.id);
  return result;
});

const allVehiculesWithColors = computed(() => {
  // Ajouter la clé color à chaque véhicule
  allVehiculesSecteur.value.forEach((vehicle, index) => {
    vehicle.color = colors[index % colors.length];
  });
  return allVehiculesSecteur.value;
});

const allSallesWithColors = computed(() => {
  // Ajouter la clé color à chaque véhicule
  allSallesSecteur.value.forEach((vehicle, index) => {
    vehicle.color = colors[index % colors.length];
  });
  return allSallesSecteur.value;
});

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

const filteredReservations = computed(() => {
  if (typeSelected.value == 1) {
    const result = allResaSecteurVehicule.value.filter((reservation) => listeVehiculesSelected.value.includes(reservation.id_vehicule));
    // Ajouter la couleur associée à chaque réservation
    const resultWithColors = result.map((reservation) => {
      // Trouver le véhicule correspondant à l'ID du véhicule dans la réservation
      const vehicle = allVehiculesWithColors.value.find((v) => v.id === reservation.id_vehicule);

      // Ajouter la couleur au résultat, ou null si non trouvé
      return {
        ...reservation,
        color: vehicle ? vehicle.color : null,
      };
    });

    return resultWithColors;
  }
  if (typeSelected.value == 2) {
    const result = allResaSecteurSalle.value.filter((reservation) => listeSallesSelected.value.includes(reservation.id_salle));
    // Ajouter la couleur associée à chaque réservation
    const resultWithColors = result.map((reservation) => {
      // Trouver le véhicule correspondant à l'ID du véhicule dans la réservation
      const salle = allSallesWithColors.value.find((v) => v.id === reservation.id_salle);

      // Ajouter la couleur au résultat, ou null si non trouvé
      return {
        ...reservation,
        color: salle ? salle.color : null,
      };
    });

    return resultWithColors;
  }
});

const isAuthToReserv = computed(() => {
  if (userProfil.value.secteur_auth) {
    const array = userProfil.value.secteur_auth.split(",").map(Number);
    return array.includes(Number(formValue.value.secteur));
  } else {
    return false;
  }
});

const validatedFormSalle = computed(() => {
  return valideDate.value && formValue.value.titre != "" && formValue.value.salle != "" ? true : false;
});

const validatedFormVehicule = computed(() => {
  return valideDate.value && formValue.value.titre != "" && formValue.value.vehicule != "" ? true : false;
});
const showSideModal = (e) => {
  if (e) {
    formValue.value.id = e.id;
    formValue.value.dateDebut = Number(e.debut);
    formValue.value.dateFin = Number(e.fin);
    formValue.value.profiles = e.profiles;
    formValue.value.is_validated = e.is_validated;
    if (typeSelected.value == 1) formValue.value.vehicule = e.vehicules.id;
    if (typeSelected.value == 2) formValue.value.salle = e.salles.id;
    formValue.value.titre = e.titre;
    formValue.value.update = true;
    if (typeSelected.value == 1) formValue.value.updateRadioId = e.id;
    if (typeSelected.value == 2) formValue.value.updateRadioId = e.id;
    formValue.value.id_user = e.id_user;
    sideModal.value = true;
  } else {
    formValue.value = {
      id: "",
      secteur: route.params.id,
      type: typeSelected.value,
      dateDebut: "",
      dateFin: "",
      vehicule: "",
      salle: "",
      titre: "",
      update: false,
      updateRadioId: "",
      id_user: "",
    };
    sideModal.value = !sideModal.value;
  }
};

const showModalChoiceSecteur = () => {
  modalChoiceSecteur.value = !modalChoiceSecteur.value;
};
const showDatePickerDebut = (e) => {
  if (e && formValue.value.dateFin == "") {
    formValue.value.dateFin = e;
  }
  datePickerDebutIsVisible.value = !datePickerDebutIsVisible.value;
};
const showDatePickerFin = () => {
  datePickerFinIsVisible.value = !datePickerFinIsVisible.value;
};
const valideDate = computed(() => {
  return formValue.value.dateDebut !== "" && formValue.value.dateFin !== "" && formValue.value.dateDebut < formValue.value.dateFin;
});

const addResa = async () => {
  if (isAuthToReserv.value) {
    formValue.value.is_validated = 1;
  } else {
    formValue.value.is_validated = 0;
  }

  formValue.value.id_user = userProfil.value.id;

  if (formValue.value.type == 2) {
    setLoader(true);
    if (!isAuthToReserv.value) {
      const listes = await getMailSuperviseursSecteur(formValue.value.secteur);
      await sendEmail(listes, userProfil.value, formValue.value);
    }

    await addResaSalles(formValue.value);
    await getAllResaSecteurSalle(route.params.id);
    showSideModal();
    setLoader(false);
  } else {
    setLoader(true);
    if (!isAuthToReserv.value) {
      const listes = await getMailSuperviseursSecteur(formValue.value.secteur);
      await sendEmail(listes, userProfil.value, formValue.value);
    }

    await addResaVehicule(formValue.value);
    await getAllResaSecteurVehicule(route.params.id);

    showSideModal();
    setLoader(false);
  }
};
const annulationSalle = async (data) => {
  setLoader(true);
  if (data.id_user != userProfil.value.id) {
    await sendEmailAnnulation(data);
  }
  await deleteResaSalle(data.id);
  await getAllResaSecteurSalle(route.params.id);
  showSideModal();
  setLoader(false);
};

const annulationVehicule = async (data) => {
  setLoader(true);
  if (data.id_user != userProfil.value.id) {
    await sendEmailAnnulation(data);
  }
  await deleteResaVehicule(data.id);
  await getAllResaSecteurVehicule(route.params.id);
  showSideModal();
  setLoader(false);
};

const updateSalle = async (data) => {
  setLoader(true);
  if (data.id_user != userProfil.value.id) {
    await sendEmailModification(data);
  }
  await updateResaSalle(data);
  await getAllResaSecteurSalle(route.params.id);
  showSideModal();
  setLoader(false);
};

const updateVehicule = async (data) => {
  setLoader(true);
  if (data.id_user != userProfil.value.id) {
    await sendEmailModification(data);
  }
  await updateResaVehicule(data);
  await getAllResaSecteurVehicule(route.params.id);
  showSideModal();
  setLoader(false);
};

const addSemaine = () => {
  // Créer une instance de Date à partir de l'objet
  const currentDate = new Date(selectedDate.value.year, selectedDate.value.month, selectedDate.value.day);
  // Ajouter les jours
  currentDate.setDate(currentDate.getDate() + 7);

  // Mettre à jour l'objet avec la nouvelle date
  selectedDate.value.year = currentDate.getFullYear();
  selectedDate.value.month = currentDate.getMonth(); // getMonth() renvoie un index (0 pour janvier)
  selectedDate.value.day = currentDate.getDate();
};
const subSemaine = () => {
  // Créer une instance de Date à partir de l'objet
  const currentDate = new Date(selectedDate.value.year, selectedDate.value.month, selectedDate.value.day);
  // Ajouter les jours
  currentDate.setDate(currentDate.getDate() - 7);
  // Mettre à jour l'objet avec la nouvelle date
  selectedDate.value.year = currentDate.getFullYear();
  selectedDate.value.month = currentDate.getMonth(); // getMonth() renvoie un index (0 pour janvier)
  selectedDate.value.day = currentDate.getDate();
};
const goToAdministration = async () => {
  await navigateTo("/administration");
};

const selectAllVehicules = async () => {
  if (listeVehiculesSelected.value.length > 0) {
    listeVehiculesSelected.value = [];
  } else {
    const result = allVehiculesSecteur.value.map((item) => item.id);
    listeVehiculesSelected.value = result;
  }
};
const selectAllSalles = async () => {
  if (listeSallesSelected.value.length > 0) {
    listeSallesSelected.value = [];
  } else {
    const result = allSallesSecteur.value.map((item) => item.id);
    listeSallesSelected.value = result;
  }
};
const updateSecteur = async (id) => {
  setLoader(true);
  userProfil.value.favorite_secteur = id;
  await updateProfiles(userProfil.value);

  showModalChoiceSecteur();
  const url = `/calendrier/${id}`;
  await navigateTo(url);
  setLoader(false);
};

if (userProfil.value.favorite_secteur == "" || userProfil.value.favorite_secteur == null) {
  modalChoiceSecteur.value = true;
}
</script>

<template>
  <section class="w-full h-full flex flex-col lg:flex-row gap-4 p-4 text-sm text-gray-700 overflow-auto">
    <!-- PARTIE GAUCHE -->
    <div class="w-full lg:w-72 flex-none h-fit lg:h-full flex flex-col gap-4">
      <div class="flex gap-4">
        <div class="w-full p-2 h-24 border border-gray-200 flex flex-col justify-center gap-2 items-center rounded-xl cursor-pointer uppercase text-xl font-bold" :class="typeSelected == 1 ? 'text-white bg-gradient-to-br from-slate-600 to-slate-900 ' : 'bg-white text-gray-400'" @click="((typeSelected = 1), (formValue.type = 1))">
          <p>Véhicules</p>
          <div class="font-traverse text-xl rounded-xl w-full text-center pt-1" :class="typeSelected == 1 ? 'text-white bg-gradient-to-br from-sncf-primary-light to-sncf-primary border-0 ' : 'bg-white text-gray-400 border'">{{ allVehiculesWithColors.length }}</div>
        </div>
        <div class="w-full p-2 h-24 border border-gray-200 flex flex-col justify-center gap-2 items-center rounded-xl cursor-pointer uppercase text-xl font-bold" :class="typeSelected == 2 ? 'text-white bg-gradient-to-br from-slate-600 to-slate-900 ' : 'bg-white text-gray-400'" @click="((typeSelected = 2), (formValue.type = 2))">
          <p>Salles</p>
          <div class="font-traverse text-xl rounded-xl w-full text-center pt-1" :class="typeSelected == 2 ? 'text-white bg-gradient-to-br from-sncf-primary-light to-sncf-primary border-0 ' : 'bg-white text-gray-400 border'">{{ allSallesWithColors.length }}</div>
        </div>
      </div>

      <ResaCalendar class="w-full" v-model="selectedDate" />

      <div v-if="typeSelected == 1" class="w-full bg-slate-50 rounded-xl flex flex-col gap-2 border border-gray-200 py-4">
        <div class="flex items-center">
          <p class="font-bold text-base px-4 cursor-default">Véhicules</p>
          <p class="ml-auto px-4 font-medium hover:text-sky-600 cursor-pointer" @click="selectAllVehicules()">Tous</p>
        </div>

        <div v-if="allVehiculesWithColors.length > 0">
          <div class="w-full flex px-4 cursor-pointer pb-1" v-for="vehicule in allVehiculesWithColors" :key="vehicule.id">
            <input type="checkbox" :id="vehicule.immat" :value="vehicule.id" class="mr-2 hidden" v-model="listeVehiculesSelected" />
            <div class="w-full flex gap-2">
              <label :for="vehicule.immat" class="">
                <div class="relative h-3 w-3 p-2 border rounded-sm cursor-pointer" :style="{ backgroundColor: listeVehiculesSelected.includes(vehicule.id) ? vehicule.color : '', borderColor: listeVehiculesSelected.includes(vehicule.id) ? vehicule.color : '#6b7280' }">
                  <Icon name="material-symbols:check" class="absolute top-px left-px h-3.5 w-3.5 text-white" :class="listeVehiculesSelected.includes(vehicule.id) ? 'block ' : 'hidden'" />
                </div>
              </label>
              <div class="cursor-default hover:bg-gray-200 flex w-full px-1" @click="showModalVehicule(vehicule)">
                <div>{{ vehicule.immat }} - {{ vehicule.model }}</div>
                <div class="ml-auto text-gray-400 flex gap-2 text-xs">
                  <div class="flex gap-1 items-center"><Icon name="material-symbols:group" class="w-4 h-4" />{{ vehicule.capacite }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="italic px-4" v-else>Aucun véhicule.</div>
      </div>

      <div v-if="typeSelected == 2" class="w-full bg-slate-50 rounded-xl flex flex-col gap-2 border border-gray-200 py-4">
        <div class="flex items-center">
          <p class="font-bold text-base px-4 cursor-default">Salles</p>
          <p class="ml-auto px-4 font-medium hover:text-sky-600 cursor-pointer" @click="selectAllSalles()">Tous</p>
        </div>
        <div v-if="allSallesWithColors.length > 0">
          <div class="w-full flex px-4 cursor-pointer pb-1" v-for="salle in allSallesWithColors" :key="salle.id">
            <input type="checkbox" :id="salle.name" :value="salle.id" class="mr-2 hidden" v-model="listeSallesSelected" />
            <div class="w-full flex gap-2">
              <label :for="salle.name" class="">
                <div class="relative h-3 w-3 p-2 border rounded-sm cursor-pointer" :style="{ backgroundColor: listeSallesSelected.includes(salle.id) ? salle.color : '', borderColor: listeSallesSelected.includes(salle.id) ? salle.color : '#6b7280' }">
                  <Icon name="material-symbols:check" class="absolute top-[1px] left-[1px] h-3.5 w-3.5 text-white" :class="listeSallesSelected.includes(salle.id) ? 'block ' : 'hidden'" />
                </div>
              </label>
              <div class="cursor-default hover:bg-gray-200 flex w-full px-1" @click="showModalSalle(salle)">
                <div>{{ salle.name }}</div>
                <div class="ml-auto text-gray-400 flex gap-2 text-xs">
                  <div class="flex gap-1 items-center"><Icon name="material-symbols:group" class="w-4 h-4" />{{ salle.capacite }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="italic px-4" v-else>Aucune salle.</div>
      </div>

      <div v-if="userProfil.secteur_admin == route.params.id" class="mt-auto hidden lg:block">
        <AppButtonValidated class="w-full text-sm" theme="cancel" @click="goToAdministration()"> <template #default> Administration </template> </AppButtonValidated>
      </div>
    </div>

    <!-- PARTIE DROITE -->
    <div class="w-full h-full flex flex-col gap-4">
      <div class="font-bold text-xl flex flex-col lg:flex-row items-center gap-4 pl-2">
        <div class="relative w-full text-center lg:text-left lg:w-fit text-xl -skew-x-[20deg] uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-gradient-to-br from-slate-600 to-slate-900 px-8 py-2 flex items-center justify-center gap-4">
          <div class="font-medium text-gray-50">Semaine {{ weekNumber }}</div>
          <div class="ml-auto flex lg:hidden gap-1"><Icon name="material-symbols:chevron-left" class="size-8 cursor-pointer text-gray-50" @click="subSemaine()" /><Icon name="material-symbols:chevron-right" class="size-8 cursor-pointer text-gray-50" @click="addSemaine()" /></div>
        </div>
        <div class="hidden lg:flex gap-1"><Icon name="material-symbols:chevron-left" class="size-8 cursor-pointer hover:text-sky-500" @click="subSemaine()" /><Icon name="material-symbols:chevron-right" class="size-8 cursor-pointer hover:text-sky-500" @click="addSemaine()" /></div>
        <AppButtonValidated class="w-fit px-4 text-sm lg:ml-auto font-normal uppercase" theme="" @click="showSideModal()"> <template #default> Nouvelle Réservation </template> </AppButtonValidated>
      </div>

      <div class="w-full h-full border border-gray-200 rounded-xl bg-slate-50 pr-4 overflow-auto">
        <ResaSemaine :startDate="dateIso" :allReservations="filteredReservations" class="" @selectedResa="showSideModal" />
      </div>

      <div v-if="userProfil.secteur_admin == route.params.id" class="mt-auto lg:hidden block">
        <AppButtonValidated class="w-full text-sm" theme="cancel" @click="goToAdministration()"> <template #default> Administration </template> </AppButtonValidated>
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
                <Icon name="material-symbols:group" class="w-4 h-4" />
                <p>{{ selectedSalle.capacite }}</p>
              </div>
              <div class="flex gap-1">
                <Icon name="material-symbols:wifi" class="w-4 h-4" />
                <p :class="selectedSalle.wifi ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Wifi</p>
              </div>
              <div class="flex gap-1">
                <Icon name="material-symbols:accessible" class="w-4 h-4" />
                <p :class="selectedSalle.pmr ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">PMR</p>
              </div>
              <div class="flex gap-1">
                <Icon name="material-symbols:ac-unit" class="w-4 h-4" />
                <p :class="selectedSalle.clim ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Clim</p>
              </div>
              <div class="flex gap-1">
                <Icon name="material-symbols:connected-tv" class="w-4 h-4" />
                <p :class="selectedSalle.video_proj ? '' : 'line-through decoration-white  decoration-2  text-slate-300 '">VP</p>
              </div>
              <div class="flex gap-1">
                <Icon name="material-symbols:headset-mic" class="w-4 h-4" />
                <p :class="selectedSalle.jabra ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Jabra</p>
              </div>
              <div class="flex gap-1">
                <Icon name="material-symbols:draw" class="w-4 h-4" />
                <p :class="selectedSalle.white_board ? '' : 'line-through  decoration-white decoration-2 text-slate-300'">Tableau</p>
              </div>
              <div class="flex gap-1">
                <Icon name="material-symbols:videocam" class="w-4 h-4" />
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
              <div class="flex gap-1 items-center text-sm"><Icon name="material-symbols:group" class="w-4 h-4" />{{ selectedVehicule.capacite }}</div>
              <div v-if="selectedVehicule.id_carburant == 1" class="flex gap-1 items-center text-sm">
                <Icon name="material-symbols:bolt" class="w-4 h-4" />
                <p class="first-letter:uppercase">électrique</p>
              </div>

              <div v-if="selectedVehicule.id_carburant == 2" class="flex gap-1 items-center text-sm"><Icon name="material-symbols:local-gas-station" class="w-4 h-4" />Diesel</div>
              <div v-if="selectedVehicule.id_carburant == 3" class="flex gap-1 items-center text-sm"><Icon name="material-symbols:local-gas-station" class="w-4 h-4" />Essence</div>

              <div v-if="selectedVehicule.vitesse == 0" class="flex gap-1 items-center text-sm">
                <div class="w-4 h-4 border rounded flex items-center justify-center">A</div>
                Auto
              </div>

              <div v-if="selectedVehicule.vitesse == 1" class="flex gap-1 items-center text-sm"><Icon name="material-symbols:tune" class="w-4 h-4" />Manuel</div>
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

    <AppModalSide :sideModal="sideModal" :closeSideModal="showSideModal">
      <template #default>
        <AppModalSideContent v-if="sideModal" :closeSideModal="showSideModal">
          <template #header>
            <div class="w-full text-center">
              <p class="text-xl font-medium">{{ secteurActive.name }}</p>
              <p>Réservation</p>
            </div>
          </template>
          <template #default>
            <div class="w-full flex flex-col gap-4">
              <div class="flex h-full"></div>
              <div class="uppercase text-base font-medium pb-2 border-b text-left">Période</div>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3 text-sm text-gray-700">
                <div class="w-full break-inside-avoid">
                  <label for="dateDebut" class="block text-sm">Date début :</label>
                  <div class="mt-1">
                    <div class="w-full py-2 px-4 border border-gray-300 bg-slate-50 text-sm text-gray-700 rounded-md cursor-pointer" @click="showDatePickerDebut()">
                      <div v-if="formValue.dateDebut" class="first-letter:uppercase">{{ formatedDate(formValue.dateDebut).jourName }} {{ formatedDate(formValue.dateDebut).jour }} {{ formatedDate(formValue.dateDebut).mois }} {{ formatedDate(formValue.dateDebut).annee }} - {{ formatedDate(formValue.dateDebut).heure }}h{{ formatedDate(formValue.dateDebut).minute }}</div>
                      <div v-else class="text-gray-400">Selectionnez une date</div>
                    </div>
                  </div>
                  <div v-if="datePickerDebutIsVisible" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-40">
                    <div class="w-full h-full flex justify-center items-center">
                      <div class="w-full flex justify-center">
                        <AppDateTimePicker class="" v-model="formValue.dateDebut" :action="showDatePickerDebut" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full break-inside-avoid">
                  <label for="dateFin" class="block text-sm">Date fin :</label>
                  <div class="mt-1">
                    <div class="w-full py-2 px-4 border border-gray-300 bg-slate-50 text-sm text-gray-700 rounded-md cursor-pointer" @click="showDatePickerFin()">
                      <div v-if="formValue.dateFin" class="first-letter:uppercase">{{ formatedDate(formValue.dateFin).jourName }} {{ formatedDate(formValue.dateFin).jour }} {{ formatedDate(formValue.dateFin).mois }} {{ formatedDate(formValue.dateFin).annee }} - {{ formatedDate(formValue.dateFin).heure }}h{{ formatedDate(formValue.dateFin).minute }}</div>
                      <div v-else class="text-gray-400">Selectionnez une date</div>
                    </div>
                  </div>
                  <div v-if="datePickerFinIsVisible" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 overscroll-none">
                    <div class="w-full h-full flex justify-center items-center">
                      <div class="w-full flex justify-center">
                        <AppDateTimePicker class="w-fit" v-model="formValue.dateFin" :action="showDatePickerFin" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="formValue.type == 1" class="h-full w-full pt-8 xl:pt-12">
                <div class="uppercase text-base font-medium py-2 border-b text-left">Divers</div>
                <AppInput name="titre" type="text" title="Objet de la réservation :" placeholder="" v-model="formValue.titre" class="pt-4 pb-6" />

                <div class="uppercase text-base font-medium py-2 border-b text-left">Véhicules disponible</div>
                <div v-if="valideDate" class="w-full h-fit flex flex-col justify-center py-6">
                  <ResaRadioVehicule :data="formValue" v-model="formValue.vehicule" />
                </div>
                <div v-else class="py-6">Aucun véhicule de disponible pour ces dates.</div>
              </div>
              <div v-if="formValue.type == 2" class="h-full w-full pt-8">
                <div class="uppercase text-base font-medium py-2 border-b text-left">Divers</div>
                <AppInput name="titre" type="text" title="Objet de la réunion :" placeholder="" v-model="formValue.titre" class="pt-4 pb-6" />

                <div class="uppercase text-base font-medium py-2 border-b text-left">Salles disponible</div>
                <div class="w-full h-fit flex flex-col justify-center py-6">
                  <div v-if="valideDate" class="w-full h-fit flex flex-col justify-center">
                    <ResaRadioSalle :data="formValue" v-model="formValue.salle" />
                  </div>
                  <div v-else class="font-normal text-sm text-gray-600">Aucune salle de disponible pour ces dates.</div>
                </div>
              </div>
            </div>
          </template>
          <template #footer>
            <div v-if="formValue.update" class="w-full flex gap-4">
              <AppButtonValidated class="w-full ml-auto md:w-32" theme="cancel" @click="showSideModal()"> <template #default> Fermer </template> </AppButtonValidated>
              <div v-if="formValue.id_user == userProfil.id || userProfil.secteur_admin == route.params.id" class="flex gap-4">
                <AppButtonValidated v-if="formValue.type == 1" class="w-full md:w-32 flex-none px-4" theme="success" @click="updateVehicule(formValue)"> <template #default> Modifier</template> </AppButtonValidated>
                <AppButtonValidated v-if="formValue.type == 2" class="w-full md:w-32 flex-none px-4" theme="success" @click="updateSalle(formValue)"> <template #default> Modifier</template> </AppButtonValidated>

                <AppButtonValidated v-if="formValue.type == 1" class="w-full md:w-fit flex-none px-4" theme="delete" @click="annulationVehicule(formValue)"> <template #default> Annuler la réservation</template> </AppButtonValidated>
                <AppButtonValidated v-if="formValue.type == 2" class="w-full md:w-fit flex-none px-4" theme="delete" @click="annulationSalle(formValue)"> <template #default> Annuler la réservation</template> </AppButtonValidated>
              </div>
            </div>
            <div v-else class="w-full flex gap-4">
              <AppButtonValidated class="w-full ml-auto md:w-32" theme="cancel" @click="showSideModal()"> <template #default> Annuler </template> </AppButtonValidated>
              <AppButtonValidated v-if="formValue.type == 1" class="w-full md:w-32" theme="success" :validated="validatedFormVehicule" @click="addResa()"> <template #default> Enregistrer </template> </AppButtonValidated>
              <AppButtonValidated v-if="formValue.type == 2" class="w-full md:w-32" theme="success" :validated="validatedFormSalle" @click="addResa()"> <template #default> Enregistrer </template> </AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>

    <AppModal v-if="modalChoiceSecteur" :closeModal="showModalChoiceSecteur">
      <template #title>
        <div class="w-full flex flex-col items-center text-lg text-slate-700">
          <p class="font-medium">Choisissez-votre secteur favori</p>
        </div>
      </template>
      <template #default>
        <div class="p-2 w-full flex gap-4 flex-wrap justify-center">
          <p class="py-2 text-gray-500 text-sm italic text-justify">Veuillez choisir votre secteur préféré afin d'accéder directement à son calendrier. Ce choix pourra être modifié ultérieurement dans votre page profil.</p>
          <div class="border bg-gradient-to-tl from-sky-600 to-sky-500 uppercase font-medium rounded-lg text-center text-sm hover:text-white cursor-pointer px-4 py-2 duration-300" v-for="(secteur, index) in secteurs" :key="index" @click="updateSecteur(secteur.id)">
            {{ secteur.name }}
          </div>
        </div>
      </template>
    </AppModal>
  </section>
</template>
