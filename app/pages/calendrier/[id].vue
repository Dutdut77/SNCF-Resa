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
  if (userProfil.value?.secteur_auth) {
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
    formValue.value.dateFin = e + 60 * 60 * 1000;
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

const handleDayClick = (timestamp) => {
  formValue.value = {
    id: "",
    secteur: route.params.id,
    type: typeSelected.value,
    dateDebut: timestamp,
    dateFin: timestamp + 60 * 60 * 1000,
    vehicule: "",
    salle: "",
    titre: "",
    update: false,
    updateRadioId: "",
    id_user: "",
  };
  sideModal.value = true;
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
  modalChoiceSecteur.value = false;
  setLoader(false);
  if (route.params.id != id) {
    await navigateTo(`/calendrier/${id}`);
  }
};

watch(
  () => userProfil.value,
  (profil) => {
    if (profil && !profil.favorite_secteur) {
      modalChoiceSecteur.value = true;
    }
  },
  { immediate: true },
);
</script>

<template>
  <section class="w-full h-full flex flex-col lg:flex-row gap-4 p-4 text-sm text-gray-700 overflow-auto">
    <!-- PARTIE GAUCHE -->
    <div class="w-full lg:w-72 flex-none h-fit lg:h-full flex flex-col gap-4">
      <div class="flex gap-4">
        <div class="w-full p-2 h-24 border border-gray-200 flex flex-col justify-center gap-2 items-center rounded-xl cursor-pointer uppercase text-xl font-bold" :class="typeSelected == 1 ? 'text-white bg-linear-to-br from-slate-600 to-slate-900 ' : 'bg-white text-gray-400'" @click="((typeSelected = 1), (formValue.type = 1))">
          <p>Véhicules</p>
          <div class="font-traverse text-xl rounded-xl w-full text-center pt-1" :class="typeSelected == 1 ? 'text-white bg-linear-to-br from-sncf-primary-light to-sncf-primary border-0 ' : 'bg-white text-gray-400 border'">{{ allVehiculesWithColors.length }}</div>
        </div>
        <div class="w-full p-2 h-24 border border-gray-200 flex flex-col justify-center gap-2 items-center rounded-xl cursor-pointer uppercase text-xl font-bold" :class="typeSelected == 2 ? 'text-white bg-linear-to-br from-slate-600 to-slate-900 ' : 'bg-white text-gray-400'" @click="((typeSelected = 2), (formValue.type = 2))">
          <p>Salles</p>
          <div class="font-traverse text-xl rounded-xl w-full text-center pt-1" :class="typeSelected == 2 ? 'text-white bg-linear-to-br from-sncf-primary-light to-sncf-primary border-0 ' : 'bg-white text-gray-400 border'">{{ allSallesWithColors.length }}</div>
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
                  <Icon name="material-symbols:check" size="14" class="absolute top-px left-px text-white" :class="listeVehiculesSelected.includes(vehicule.id) ? 'block ' : 'hidden'" />
                </div>
              </label>
              <div class="cursor-default hover:bg-gray-200 flex w-full px-1" @click="showModalVehicule(vehicule)">
                <div>{{ vehicule.immat }} - {{ vehicule.model }}</div>
                <div class="ml-auto text-gray-400 flex gap-2 text-xs">
                  <div class="flex gap-1 items-center"><Icon name="material-symbols:group" size="16" />{{ vehicule.capacite }}</div>
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
                  <Icon name="material-symbols:check" size="14" class="absolute top-[1px] left-[1px] text-white" :class="listeSallesSelected.includes(salle.id) ? 'block ' : 'hidden'" />
                </div>
              </label>
              <div class="cursor-default hover:bg-gray-200 flex w-full px-1" @click="showModalSalle(salle)">
                <div>{{ salle.name }}</div>
                <div class="ml-auto text-gray-400 flex gap-2 text-xs">
                  <div class="flex gap-1 items-center"><Icon name="material-symbols:group" size="16" />{{ salle.capacite }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="italic px-4" v-else>Aucune salle.</div>
      </div>

      <div v-if="userProfil?.secteur_admin == route.params.id" class="mt-auto hidden lg:block">
        <AppButtonValidated class="w-full text-sm" theme="cancel" @click="goToAdministration()"> <template #default> Administration </template> </AppButtonValidated>
      </div>
    </div>

    <!-- PARTIE DROITE -->
    <div class="w-full h-full flex flex-col gap-4">
      <div class="font-bold text-xl flex flex-col lg:flex-row items-center gap-4 pl-2">
        <div class="relative w-full text-center lg:text-left lg:w-fit text-xl -skew-x-20 uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-linear-to-br from-slate-600 to-slate-900 px-8 py-2 flex items-center justify-center gap-4">
          <div class="font-medium text-gray-50">Semaine {{ weekNumber }}</div>
          <div class="ml-auto flex lg:hidden gap-1"><Icon name="material-symbols:chevron-left" size="32" class="cursor-pointer text-gray-50" @click="subSemaine()" /><Icon name="material-symbols:chevron-right" size="32" class="cursor-pointer text-gray-50" @click="addSemaine()" /></div>
        </div>
        <div class="hidden lg:flex gap-1"><Icon name="material-symbols:chevron-left" size="32" class="cursor-pointer hover:text-sky-500" @click="subSemaine()" /><Icon name="material-symbols:chevron-right" size="32" class="cursor-pointer hover:text-sky-500" @click="addSemaine()" /></div>
        <AppButtonValidated class="w-fit px-4 text-sm lg:ml-auto font-normal uppercase" theme="" @click="showSideModal()"> <template #default> Nouvelle Réservation </template> </AppButtonValidated>
      </div>

      <div class="w-full h-full border border-gray-200 rounded-xl bg-slate-50 pr-4 overflow-auto">
        <ResaSemaine :startDate="dateIso" :allReservations="filteredReservations" class="" @selectedResa="showSideModal" @clickDay="handleDayClick" />
      </div>

      <div v-if="userProfil?.secteur_admin == route.params.id" class="mt-auto lg:hidden block">
        <AppButtonValidated class="w-full text-sm" theme="cancel" @click="goToAdministration()"> <template #default> Administration </template> </AppButtonValidated>
      </div>
    </div>

    <AppModal v-if="modalSalle" :closeModal="showModalSalle">
      <template #title>
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
            <Icon name="material-symbols:meeting-room" size="22" class="text-sky-500" />
          </div>
          <div>
            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-normal">Salle</p>
            <p class="text-base font-semibold text-slate-800 leading-tight">{{ selectedSalle.name }}</p>
          </div>
        </div>
      </template>
      <template #default>
        <div class="w-full flex flex-col gap-4 px-4 pb-2">
          <!-- Adresse -->
          <div class="flex items-start gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <Icon name="material-symbols:location-on" size="16" class="text-slate-400 mt-0.5 shrink-0" />
            <span>{{ selectedSalle.adresse || "Adresse non renseignée" }}</span>
          </div>
          <!-- Capacité -->
          <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <Icon name="material-symbols:group" size="20" class="text-sky-500 shrink-0" />
            <span class="text-sm text-slate-500">Capacité</span>
            <div class="ml-auto flex items-baseline gap-1">
              <span class="text-2xl font-bold text-slate-800">{{ selectedSalle.capacite }}</span>
              <span class="text-xs text-slate-400">pers.</span>
            </div>
          </div>
          <!-- Équipements -->
          <div>
            <p class="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">Équipements</p>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="feature in [
                  { label: 'Wifi', icon: 'material-symbols:wifi', active: selectedSalle.wifi },
                  { label: 'PMR', icon: 'material-symbols:accessible', active: selectedSalle.pmr },
                  { label: 'Climatisation', icon: 'material-symbols:ac-unit', active: selectedSalle.clim },
                  { label: 'Vidéoprojecteur', icon: 'material-symbols:connected-tv', active: selectedSalle.video_proj },
                  { label: 'Jabra', icon: 'material-symbols:headset-mic', active: selectedSalle.jabra },
                  { label: 'Tableau blanc', icon: 'material-symbols:draw', active: selectedSalle.white_board },
                  { label: 'Webcam', icon: 'material-symbols:videocam', active: selectedSalle.webcam },
                ]"
                :key="feature.label"
                class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
                :class="feature.active ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'"
              >
                <Icon :name="feature.icon" size="15" />
                <span class="truncate">{{ feature.label }}</span>
                <Icon v-if="feature.active" name="material-symbols:check" size="14" class="ml-auto shrink-0 text-emerald-500" />
              </div>
            </div>
          </div>
          <!-- Divers -->
          <div v-if="selectedSalle.autres" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <p class="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Divers</p>
            <p class="text-sm text-slate-600">{{ selectedSalle.autres }}</p>
          </div>
        </div>
      </template>
    </AppModal>

    <AppModal v-if="modalVehicule" :closeModal="showModalVehicule">
      <template #title>
        <div class="flex items-center gap-3 w-full pt-6 px-4">
          <div class="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
            <Icon name="material-symbols:directions-car" size="22" class="text-sky-500" />
          </div>
          <div>
            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-normal">{{ selectedVehicule.marque }}</p>
            <p class="text-base font-semibold text-slate-800 leading-tight">{{ selectedVehicule.model }}</p>
          </div>
          <div class="ml-auto px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-mono text-sm font-bold tracking-widest shrink-0">
            {{ selectedVehicule.immat }}
          </div>
        </div>
      </template>
      <template #default>
        <div class="w-full flex flex-col gap-4 px-4 pb-2">
          <!-- Caractéristiques -->
          <div class="grid grid-cols-3 gap-2">
            <div class="flex flex-col items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl py-3 px-2">
              <Icon name="material-symbols:group" size="22" class="text-sky-500" />
              <span class="text-lg font-bold text-slate-800 leading-none">{{ selectedVehicule.capacite }}</span>
              <span class="text-[10px] text-slate-400 uppercase tracking-wide">places</span>
            </div>
            <div class="flex flex-col items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl py-3 px-2">
              <Icon v-if="selectedVehicule.id_carburant == 1" name="material-symbols:bolt" size="22" class="text-emerald-500" />
              <Icon v-else name="material-symbols:local-gas-station" size="22" class="text-orange-500" />
              <span class="text-xs font-semibold text-slate-800 text-center leading-none">
                <template v-if="selectedVehicule.id_carburant == 1">Électrique</template>
                <template v-else-if="selectedVehicule.id_carburant == 2">Diesel</template>
                <template v-else>Essence</template>
              </span>
              <span class="text-[10px] text-slate-400 uppercase tracking-wide">Carburant</span>
            </div>
            <div class="flex flex-col items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl py-3 px-2">
              <Icon v-if="selectedVehicule.vitesse == 1" name="material-symbols:tune" size="22" class="text-slate-500" />
              <div v-else class="size-5.5 border-2 border-slate-400 rounded flex items-center justify-center text-xs font-bold text-slate-500">A</div>
              <span class="text-xs font-semibold text-slate-800 leading-none">{{ selectedVehicule.vitesse == 1 ? "Manuel" : "Auto" }}</span>
              <span class="text-[10px] text-slate-400 uppercase tracking-wide">Boîte</span>
            </div>
          </div>
          <!-- Divers -->
          <div v-if="selectedVehicule.autres" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <p class="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Divers</p>
            <p class="text-sm text-slate-600">{{ selectedVehicule.autres }}</p>
          </div>
        </div>
      </template>
    </AppModal>

    <AppModalSide :sideModal="sideModal" :closeSideModal="showSideModal">
      <template #default>
        <AppModalSideContent v-if="sideModal" :closeSideModal="showSideModal">
          <template #header>
            <div class="size-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Icon :name="typeSelected == 1 ? 'material-symbols:directions-car' : 'material-symbols:meeting-room'" size="20" class="text-white" />
            </div>
            <div>
              <p class="text-[10px] text-sky-100 uppercase tracking-wider">{{ secteurActive.name }}</p>
              <p class="text-sm font-semibold text-white">{{ formValue.update ? "Modifier la réservation" : "Nouvelle réservation" }}</p>
            </div>
            <span class="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/20 text-white">
              {{ typeSelected == 1 ? "Véhicule" : "Salle" }}
            </span>
          </template>
          <template #default>
            <div class="w-full flex flex-col gap-5">
              <!-- Section Période -->
              <div class="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Icon name="material-symbols:calendar-month" size="16" class="text-sky-500" />
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Période</span>
              </div>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                <div class="w-full">
                  <label class="block text-xs font-medium text-slate-400 mb-1.5">Date de début</label>
                  <div class="w-full py-2.5 px-3 border border-slate-200 bg-slate-50 rounded-xl text-sm cursor-pointer flex items-center gap-2 hover:border-sky-400 transition-colors group" @click="showDatePickerDebut()">
                    <Icon name="material-symbols:calendar-today" size="15" class="text-slate-400 shrink-0 group-hover:text-sky-500 transition-colors" />
                    <span v-if="formValue.dateDebut" class="first-letter:uppercase text-slate-700"> {{ formatedDate(formValue.dateDebut).jourName }} {{ formatedDate(formValue.dateDebut).jour }} {{ formatedDate(formValue.dateDebut).mois }} — {{ formatedDate(formValue.dateDebut).heure }}h{{ formatedDate(formValue.dateDebut).minute }} </span>
                    <span v-else class="text-slate-400">Sélectionnez une date</span>
                  </div>
                  <div v-if="datePickerDebutIsVisible" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-40">
                    <div class="w-full h-full flex justify-center items-center">
                      <div class="w-full flex justify-center">
                        <AppDateTimePicker class="" v-model="formValue.dateDebut" :action="showDatePickerDebut" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full">
                  <label class="block text-xs font-medium text-slate-400 mb-1.5">Date de fin</label>
                  <div class="w-full py-2.5 px-3 border border-slate-200 bg-slate-50 rounded-xl text-sm cursor-pointer flex items-center gap-2 hover:border-sky-400 transition-colors group" @click="showDatePickerFin()">
                    <Icon name="material-symbols:event" size="15" class="text-slate-400 shrink-0 group-hover:text-sky-500 transition-colors" />
                    <span v-if="formValue.dateFin" class="first-letter:uppercase text-slate-700"> {{ formatedDate(formValue.dateFin).jourName }} {{ formatedDate(formValue.dateFin).jour }} {{ formatedDate(formValue.dateFin).mois }} — {{ formatedDate(formValue.dateFin).heure }}h{{ formatedDate(formValue.dateFin).minute }} </span>
                    <span v-else class="text-slate-400">Sélectionnez une date</span>
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

              <!-- Section Véhicules -->
              <div v-if="formValue.type == 1" class="flex flex-col gap-4 pt-2">
                <div class="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Icon name="material-symbols:info-outline-rounded" size="16" class="text-sky-500" />
                  <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Objet</span>
                </div>
                <AppInput name="titre" type="text" title="Objet de la réservation :" placeholder="" v-model="formValue.titre" />

                <div class="flex items-center gap-2 pb-2 border-b border-slate-200 mt-2">
                  <Icon name="material-symbols:directions-car" size="16" class="text-sky-500" />
                  <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Véhicules disponibles</span>
                </div>
                <div v-if="valideDate" class="w-full">
                  <ResaRadioVehicule :data="formValue" v-model="formValue.vehicule" />
                </div>
                <div v-else class="text-sm text-slate-400 italic">Sélectionnez une période pour voir les véhicules disponibles.</div>
              </div>

              <!-- Section Salles -->
              <div v-if="formValue.type == 2" class="flex flex-col gap-4 pt-2">
                <div class="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Icon name="material-symbols:info-outline-rounded" size="16" class="text-sky-500" />
                  <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Objet</span>
                </div>
                <AppInput name="titre" type="text" title="Objet de la réunion :" placeholder="" v-model="formValue.titre" />

                <div class="flex items-center gap-2 pb-2 border-b border-slate-200 mt-2">
                  <Icon name="material-symbols:meeting-room" size="16" class="text-sky-500" />
                  <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Salles disponibles</span>
                </div>
                <div v-if="valideDate">
                  <ResaRadioSalle :data="formValue" v-model="formValue.salle" />
                </div>
                <div v-else class="text-sm text-slate-400 italic">Sélectionnez une période pour voir les salles disponibles.</div>
              </div>
            </div>
          </template>
          <template #footer>
            <div v-if="formValue.update" class="w-full flex gap-4">
              <AppButtonValidated class="w-full ml-auto md:w-32" theme="cancel" @click="showSideModal()"> <template #default> Fermer </template> </AppButtonValidated>
              <div v-if="formValue.id_user == userProfil?.id || userProfil?.secteur_admin == route.params.id" class="flex gap-4">
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
          <div class="border bg-linear-to-tl from-sky-600 to-sky-500 uppercase font-medium rounded-lg text-center text-sm hover:text-white cursor-pointer px-4 py-2 duration-300" v-for="(secteur, index) in secteurs" :key="index" @click="updateSecteur(secteur.id)">
            {{ secteur.name }}
          </div>
        </div>
      </template>
    </AppModal>
  </section>
</template>
