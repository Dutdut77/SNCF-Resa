<script setup>
import Check from "@/assets/svg/Check.vue";
import Close from "@/assets/svg/Close.vue";

definePageMeta({
  requiresAuth: true,
  isAdmin: true,
});
useHead({
  title: "",
  description: "",
});

const route = useRoute();
const { setLoader } = useLoader();
const { timestampToDateFr } = useFormatDate();
const { getAllVehiculesBySecteur, addVehicule, updateVehicule, deleteVehicule, allVehiculesSecteur } = useVehicules();
const { getAllSallesBySecteur, addSalle, updateSalle, deleteSalle, allSallesSecteur } = useSalles();
const { getAllAnomaliesSecteur, deleteAnomalie, allAnomaliesSecteur } = useAnomalies();
const { getAllSallesResaSecteurActuel, allSallesResaSecteurActuel } = useResaSalles();
const { getAllVehiculesResaSecteurActuel, allResaSecteurActuel } = useResaVehicules();
const { getAllProfiles, allProfiles } = useAuth();
const sideModalVehicules = ref(false);
const sideModalSalles = ref(false);
const sideModalAnomalieVehicule = ref(false);
const sideModalAnomalieSalle = ref(false);
const vehiculeForm = ref({
  marque: "",
  model: "",
  immat: "",
  capacite: "",
  vitesse: null,
  secteur: route.params.id,
  id_carburant: "",
  is_dispo: false,
});
const salleForm = ref({
  is_dispo: false,
  name: "",
  id_secteur: route.params.id,
  wifi: 0,
  jabra: 0,
  clim: 0,
  white_board: 0,
  pmr: 0,
  adresse: "",
  autres: "",
  capactie: "",
  video_proj: 0,
  webcam: 0,
});
const anomalieVehiculeForm = ref({});
const anomalieSalleForm = ref({});

setLoader(true);
await getAllVehiculesBySecteur(route.params.id);
await getAllSallesBySecteur(route.params.id);
await getAllAnomaliesSecteur(route.params.id);
await getAllSallesResaSecteurActuel(route.params.id);
await getAllVehiculesResaSecteurActuel(route.params.id);
await getAllProfiles();
setLoader(false);

const userAuth = computed(() => {
  const result = allProfiles.value.filter((user) => user.secteur_auth.split(",").includes(route.params.id));
  return result;
});

const userAdmin = computed(() => {
  const result = allProfiles.value.filter((user) => user.secteur_admin == route.params.id);
  return result;
});

const anomaliesVehicules = computed(() => {
  return allAnomaliesSecteur.value
    .filter((anomalie) => anomalie.type === 1 && anomalie.id_vehicule !== null) // Filtrer les anomalies liées aux véhicules
    .map((anomalie) => {
      const vehicule = allVehiculesSecteur.value.find((veh) => veh.id === anomalie.id_vehicule);
      if (vehicule) {
        return {
          id: anomalie.id,
          immat: vehicule.immat,
          model: vehicule.model,
          marque: vehicule.marque,
          anomalie: anomalie.anomalie,
        };
      }
      return null;
    })
    .filter((item) => item !== null); // Filtrer les valeurs nulles
});

const anomaliesSalles = computed(() => {
  return allAnomaliesSecteur.value
    .filter((anomalie) => anomalie.type === 0 && anomalie.id_salle !== null) // Filtrer les anomalies liées aux salles
    .map((anomalie) => {
      const salle = allSallesSecteur.value.find((sal) => sal.id === anomalie.id_salle);
      if (salle) {
        return {
          id: anomalie.id,
          name: salle.name,

          anomalie: anomalie.anomalie,
        };
      }
      return null;
    })
    .filter((item) => item !== null); // Filtrer les valeurs nulles
});
const validatedFieldsVehicule = computed(() => {
  return vehiculeForm.value.marque != "" && vehiculeForm.value.model != "" && vehiculeForm.value.immat != "" && vehiculeForm.value.capacite != "" && vehiculeForm.value.vitesse != null && vehiculeForm.value.id_carburant != "" ? true : false;
});
const validatedFieldsSalles = computed(() => {
  return salleForm.value.name != "" && salleForm.value.adresse != "" && salleForm.value.capacite != "" ? true : false;
});

// Véhicules
const showSideVehicules = (data) => {
  if (data) {
    vehiculeForm.value = data;
    data.is_dispo == 1 ? (vehiculeForm.value.is_dispo = true) : (vehiculeForm.value.is_dispo = false);
  } else {
    vehiculeForm.value = {
      marque: "",
      model: "",
      immat: "",
      capacite: "",
      vitesse: null,
      secteur: route.params.id,
      id_carburant: "",
      is_dispo: false,
    };
  }
  sideModalVehicules.value = !sideModalVehicules.value;
};
const ajouterVehicule = async () => {
  setLoader(true);
  vehiculeForm.value.is_dispo ? (vehiculeForm.value.is_dispo = 1) : (vehiculeForm.value.is_dispo = 0);
  await addVehicule(vehiculeForm.value);
  await getAllVehiculesBySecteur(route.params.id);
  showSideVehicules();
  setLoader(false);
};
const modifierVehicule = async () => {
  setLoader(true);
  vehiculeForm.value.is_dispo ? (vehiculeForm.value.is_dispo = 1) : (vehiculeForm.value.is_dispo = 0);
  await updateVehicule(vehiculeForm.value);
  await getAllVehiculesBySecteur(route.params.id);
  showSideVehicules();
  setLoader(false);
};
const supprimerVehicule = async () => {
  setLoader(true);
  await deleteVehicule(vehiculeForm.value.id);
  await getAllVehiculesBySecteur(route.params.id);
  showSideVehicules();
  setLoader(false);
};

// Salles
const showSideSalles = (data) => {
  if (data) {
    salleForm.value = data;
    data.is_dispo == 1 ? (salleForm.value.is_dispo = true) : (salleForm.value.is_dispo = false);
    data.clim == 1 ? (salleForm.value.clim = true) : (salleForm.value.clim = false);
    data.wifi == 1 ? (salleForm.value.wifi = true) : (salleForm.value.wifi = false);
    data.jabra == 1 ? (salleForm.value.jabra = true) : (salleForm.value.jabra = false);
    data.white_board == 1 ? (salleForm.value.white_board = true) : (salleForm.value.white_board = false);
    data.pmr == 1 ? (salleForm.value.pmr = true) : (salleForm.value.pmr = false);
    data.video_proj == 1 ? (salleForm.value.video_proj = true) : (salleForm.value.video_proj = false);
    data.webcam == 1 ? (salleForm.value.webcam = true) : (salleForm.value.webcam = false);
  } else {
    salleForm.value = {
      is_dispo: false,
      name: "",
      id_secteur: route.params.id,
      wifi: false,
      jabra: false,
      clim: false,
      white_board: false,
      pmr: false,
      adresse: "",
      autres: "",
      capacite: "",
      video_proj: false,
      webcam: false,
    };
  }
  sideModalSalles.value = !sideModalSalles.value;
};
const ajouterSalle = async () => {
  setLoader(true);
  salleForm.value.is_dispo ? (salleForm.value.is_dispo = 1) : (salleForm.value.is_dispo = 0);
  salleForm.value.clim ? (salleForm.value.clim = 1) : (salleForm.value.clim = 0);
  salleForm.value.wifi ? (salleForm.value.wifi = 1) : (salleForm.value.wifi = 0);
  salleForm.value.jabra ? (salleForm.value.jabra = 1) : (salleForm.value.jabra = 0);
  salleForm.value.white_board ? (salleForm.value.white_board = 1) : (salleForm.value.white_board = 0);
  salleForm.value.pmr ? (salleForm.value.pmr = 1) : (salleForm.value.pmr = 0);
  salleForm.value.video_proj ? (salleForm.value.video_proj = 1) : (salleForm.value.video_proj = 0);
  salleForm.value.webcam ? (salleForm.value.webcam = 1) : (salleForm.value.webcam = 0);
  await addSalle(salleForm.value);
  await getAllSallesBySecteur(route.params.id);
  showSideSalles();
  setLoader(false);
};
const modifierSalle = async () => {
  setLoader(true);
  salleForm.value.is_dispo ? (salleForm.value.is_dispo = 1) : (salleForm.value.is_dispo = 0);
  salleForm.value.clim ? (salleForm.value.clim = 1) : (salleForm.value.clim = 0);
  salleForm.value.wifi ? (salleForm.value.wifi = 1) : (salleForm.value.wifi = 0);
  salleForm.value.jabra ? (salleForm.value.jabra = 1) : (salleForm.value.jabra = 0);
  salleForm.value.white_board ? (salleForm.value.white_board = 1) : (salleForm.value.white_board = 0);
  salleForm.value.pmr ? (salleForm.value.pmr = 1) : (salleForm.value.pmr = 0);
  salleForm.value.video_proj ? (salleForm.value.video_proj = 1) : (salleForm.value.video_proj = 0);
  salleForm.value.webcam ? (salleForm.value.webcam = 1) : (salleForm.value.webcam = 0);
  await updateSalle(salleForm.value);
  await getAllSallesBySecteur(route.params.id);
  showSideSalles();
  setLoader(false);
};
const supprimerSalle = async () => {
  setLoader(true);
  await deleteSalle(salleForm.value.id);
  await getAllSallesBySecteur(route.params.id);
  showSideSalles();
  setLoader(false);
};

// Anomalies
const showSideAnomalieVehicule = (data) => {
  if (data) {
    anomalieVehiculeForm.value = data;
  } else {
    anomalieVehiculeForm.value = {};
  }
  sideModalAnomalieVehicule.value = !sideModalAnomalieVehicule.value;
};
const showSideAnomalieSalle = (data) => {
  if (data) {
    anomalieSalleForm.value = data;
  } else {
    anomalieSalleForm.value = {};
  }
  sideModalAnomalieSalle.value = !sideModalAnomalieSalle.value;
};
const supprimerAnomalie = async (id) => {
  setLoader(true);
  await deleteAnomalie(id);
  await getAllAnomaliesSecteur(route.params.id);
  sideModalAnomalieSalle.value = false;
  sideModalAnomalieVehicule.value = false;
  setLoader(false);
};
</script>

<template>
  <ResaPage>
    <template #title> Administration </template>
    <template #default>
      <div class="px-4 pt-1 pb-4 flex flex-col gap-4">
        <ResaAdminCard>
          <template #title>
            <p>Véhicules :</p>
            <div class="h-5 w-5 bg-white border rounded-full flex items-center justify-center cursor-pointer" @click="showSideVehicules()"><p class="text-gray-500 pb-0.5">+</p></div>
          </template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Marque</th>
                  <th>Model</th>
                  <th>Immat</th>
                  <th>Dispo</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in allVehiculesSecteur" :key="data.id">
                  <td>{{ data.marque }}</td>
                  <td class="text-center">{{ data.model }}</td>
                  <td class="text-center">{{ data.immat }}</td>
                  <td class="text-center"><Check v-if="data.is_dispo == 1" class="w-3 h-3 mx-auto text-green-500" /><Close v-else class="w-4 h-4 mx-auto text-red-500" /></td>
                  <td class="text-right cursor-pointer" @click="showSideVehicules(data)">...</td>
                </tr>
              </tbody>
            </table>
          </template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title>
            <p>Salles :</p>
            <div class="h-5 w-5 bg-white border rounded-full flex items-center justify-center cursor-pointer" @click="showSideSalles()"><p class="text-gray-500 pb-0.5">+</p></div>
          </template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Nom</th>
                  <th>Dispo</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in allSallesSecteur" :key="data.id">
                  <td>{{ data.name }}</td>
                  <td class="text-center"><Check v-if="data.is_dispo == 1" class="w-3 h-3 mx-auto text-green-500" /><Close v-else class="w-4 h-4 mx-auto text-red-500" /></td>
                  <td class="text-right cursor-pointer" @click="showSideSalles(data)">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Anomalies Véhicules :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Immat</th>
                  <th>Anomalie</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in anomaliesVehicules" :key="data.id">
                  <td>{{ data.immat }}</td>
                  <td class="text-center">{{ data.anomalie }}</td>
                  <td class="text-right cursor-pointer" @click="showSideAnomalieVehicule(data)">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Anomalies Salles :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Nom</th>
                  <th>Anomalie</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in anomaliesSalles" :key="data.id">
                  <td>{{ data.name }}</td>
                  <td class="text-center">{{ data.anomalie }}</td>
                  <td class="text-right cursor-pointer" @click="showSideAnomalieSalle(data)">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Réservations Véhicules :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Immat</th>
                  <th class="text-left">Début</th>
                  <th class="text-left">Fin</th>
                  <th class="">Validée</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in allResaSecteurActuel" :key="data.id">
                  <td>{{ data.vehicules.immat }}</td>
                  <td class="">{{ timestampToDateFr(data.debut) }}</td>
                  <td class="">{{ timestampToDateFr(data.fin) }}</td>
                  <td class="text-center">
                    <Check v-if="data.is_validated == 1" class="w-3 h-3 mx-auto" />
                    <div v-else class="w-4 h-4 mx-auto text-red-500">?</div>
                  </td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Réservations Salles :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Salle</th>
                  <th class="text-left">Début</th>
                  <th class="text-left">Fin</th>
                  <th class="">Validée</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in allSallesResaSecteurActuel" :key="data.id">
                  <td>{{ data.salles.name }}</td>
                  <td class="">{{ timestampToDateFr(data.debut) }}</td>
                  <td class="">{{ timestampToDateFr(data.fin) }}</td>
                  <td class="text-center">
                    <Check v-if="data.is_validated == 1" class="w-3 h-3 mx-auto" />
                    <div v-else class="w-4 h-4 mx-auto text-red-500">?</div>
                  </td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Profiles Valideur :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Nom</th>
                  <th class="text-left">Prénom</th>
                  <th>Email</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in userAuth" :key="data.id">
                  <td>{{ data.nom }}</td>
                  <td class="text-center">{{ data.prenom }}</td>
                  <td class="text-center">{{ data.email }}</td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Profiles Administrateur :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Nom</th>
                  <th class="text-left">Prénom</th>
                  <th>Email</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in userAdmin" :key="data.id">
                  <td>{{ data.nom }}</td>
                  <td class="text-center">{{ data.prenom }}</td>
                  <td class="text-center">{{ data.email }}</td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>
      </div>

      <AppModalSide :sideModal="sideModalVehicules" :closeSideModal="showSideVehicules">
        <template #default>
          <AppModalSideContent v-if="sideModalVehicules" :closeSideModal="showSideVehicules">
            <template #header>
              <div v-if="vehiculeForm.id" class="text-center">
                <div class="font-medium text-xl text-gray-700">{{ vehiculeForm.marque }} {{ vehiculeForm.model }}</div>
                <div class="font-medium text-xl text-gray-700">{{ vehiculeForm.immat }}</div>
              </div>
              <p v-else class="font-medium text-xl text-gray-700 uppercase px-4 text-center">Ajouter un nouveau véhicule</p>
            </template>
            <template #default>
              <div class="ml-auto flex items-center">
                <p v-if="vehiculeForm.is_dispo" class="pr-2 text-gray-600 text-sm font-medium">Disponible</p>
                <p v-else class="pr-2 text-gray-600 text-sm font-medium">Indisponible</p>
                <label class="w-8 cursor-pointer">
                  <input type="checkbox" class="peer hidden rounded-md" v-model="vehiculeForm.is_dispo" />
                  <span class="w-8 h-5 flex items-center flex-shrink-0 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-sky-500 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-2.5"></span>
                </label>
              </div>
              <AppInput class="pt-4" name="marque" type="text" title="Marque : " v-model="vehiculeForm.marque" />
              <AppInput class="pt-4" name="model" type="text" title="Model : " v-model="vehiculeForm.model" />
              <AppInput class="pt-4" name="immat" type="text" title="Immatriculation : " v-model="vehiculeForm.immat" />
              <AppInput class="pt-4" name="capa" type="text" title="Nb de sièges : " v-model="vehiculeForm.capacite" />
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-3 text-sm text-gray-700">
                <AppRadio :name="['auto', 'manuel']" :value="[0, 1]" :radioTitle="['Automatique', 'Manuel']" title="Transmission :" v-model="vehiculeForm.vitesse" />
              </div>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-3 text-sm text-gray-700">
                <AppRadio :name="['elec', 'gazoil', 'essence']" :value="[1, 2, 3]" :radioTitle="['Electrique', 'Gazoil', 'Essence']" title="Carburant :" v-model="vehiculeForm.id_carburant" />
              </div>
              <div class="pt-4">
                <p class="text-sm font-medium text-gray-700">Divers :</p>
                <textarea class="mt-1 appearance-none border text-sm text-gray-600 border-gray-400 rounded-lg p-4 w-full focus:outline-none focus:border-gray-600 focus:ring-0" name="emplacementba" id="" cols="50" rows="5" v-model="vehiculeForm.autres" placeholder=""></textarea>
              </div>
            </template>
            <template #footer>
              <div v-if="!vehiculeForm.id" class="flex gap-4 w-full justify-end pt-6">
                <AppButtonValidated class="md:w-32 w-full" theme="cancel" @click="showSideVehicules()"> <template #default> Annuler </template> </AppButtonValidated>
                <AppButtonValidated :validated="validatedFieldsVehicule" class="md:w-32 w-full" theme="" @click="ajouterVehicule()"> <template #default> Enregistrer </template> </AppButtonValidated>
              </div>
              <div v-else class="flex gap-2 w-full justify-end pt-6">
                <AppButtonValidated class="md:w-32 w-full" theme="cancel" @click="showSideVehicules()"> <template #default> Annuler </template> </AppButtonValidated>
                <AppButtonValidated :validated="validatedFieldsVehicule" class="md:w-32 w-full" theme="" @click="modifierVehicule()"> <template #default> Modifier </template> </AppButtonValidated>
                <AppButtonValidated class="md:w-32 w-full" theme="delete" @click="supprimerVehicule()"> <template #default> Supprimer </template> </AppButtonValidated>
              </div>
            </template>
          </AppModalSideContent>
        </template>
      </AppModalSide>

      <AppModalSide :sideModal="sideModalSalles" :closeSideModal="showSideSalles">
        <template #default>
          <AppModalSideContent v-if="sideModalSalles" :closeSideModal="showSideSalles">
            <template #header>
              <div v-if="salleForm.id" class="text-center">
                <div class="font-medium text-xl text-gray-700">{{ salleForm.name }}</div>
                <div class="font-medium text-sm text-gray-700">{{ salleForm.adresse }}</div>
              </div>
              <p v-else class="font-medium text-xl text-gray-700 uppercase px-4 text-center">Ajouter une nouvelle salle</p>
            </template>
            <template #default>
              <div class="ml-auto flex items-center">
                <p v-if="salleForm.is_dispo" class="pr-2 text-gray-600 text-sm font-medium">Disponible</p>
                <p v-else class="pr-2 text-gray-600 text-sm font-medium">Indisponible</p>
                <label class="w-8 cursor-pointer">
                  <input type="checkbox" class="peer hidden rounded-md" v-model="salleForm.is_dispo" />
                  <span class="w-8 h-5 flex items-center flex-shrink-0 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-sky-500 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-2.5"></span>
                </label>
              </div>
              <AppInput class="pt-4" name="name" type="text" title="Nom de la salle : " v-model="salleForm.name" />
              <AppInput class="pt-4" name="adresse" type="text" title="Adresse : " v-model="salleForm.adresse" />
              <AppInput class="pt-4" name="capa" type="text" title="Nb de places : " v-model="salleForm.capacite" />
              <div class="w-full">
                <div class="pt-4 uppercase text-sm text-gray-600 font-medium py-2 border-b text-left">Installations :</div>
                <div class="mt-3 text-sm text-gray-700 w-full grid grid-cols-2 gap-2">
                  <AppCheckbox v-model="salleForm.clim" label="Climatisation" id="clim" />
                  <AppCheckbox v-model="salleForm.wifi" label="Wifi" id="wifi" />
                  <AppCheckbox v-model="salleForm.jabra" label="Jabra" id="jabra" />
                  <AppCheckbox v-model="salleForm.white_board" label="Tableau blanc" id="white_board" />
                  <AppCheckbox v-model="salleForm.pmr" label="PMR" id="pmr" />
                  <AppCheckbox v-model="salleForm.video_proj" label="Vidéo-projecteur" id="video_proj" />
                  <AppCheckbox v-model="salleForm.webcam" label="Webcam" id="webcam" />
                </div>
              </div>
              <div class="pt-4">
                <p class="text-sm font-medium text-gray-700">Divers :</p>
                <textarea class="mt-1 appearance-none border text-sm text-gray-600 border-gray-400 rounded-lg p-4 w-full focus:outline-none focus:border-gray-600 focus:ring-0" name="emplacementba" id="" cols="50" rows="5" v-model="salleForm.autres" placeholder=""></textarea>
              </div>
            </template>
            <template #footer>
              <div v-if="!salleForm.id" class="flex gap-4 w-full justify-end pt-6">
                <AppButtonValidated class="md:w-32 w-full" theme="cancel" @click="showSideSalles()"> <template #default> Annuler </template> </AppButtonValidated>
                <AppButtonValidated :validated="validatedFieldsSalles" class="md:w-32 w-full" theme="" @click="ajouterSalle()"> <template #default> Enregistrer </template> </AppButtonValidated>
              </div>
              <div v-else class="flex gap-2 w-full justify-end pt-6">
                <AppButtonValidated class="md:w-32 w-full" theme="cancel" @click="showSideSalles()"> <template #default> Annuler </template> </AppButtonValidated>
                <AppButtonValidated :validated="validatedFieldsSalles" class="md:w-32 w-full" theme="" @click="modifierSalle()"> <template #default> Modifier </template> </AppButtonValidated>
                <AppButtonValidated class="md:w-32 w-full" theme="delete" @click="supprimerSalle()"> <template #default> Supprimer </template> </AppButtonValidated>
              </div>
            </template>
          </AppModalSideContent>
        </template>
      </AppModalSide>

      <AppModalSide :sideModal="sideModalAnomalieVehicule" :closeSideModal="showSideAnomalieVehicule">
        <template #default>
          <AppModalSideContent v-if="sideModalAnomalieVehicule" :closeSideModal="showSideAnomalieVehicule">
            <template #header>
              <div class="text-center">
                <div class="font-medium text-xl text-gray-700">{{ anomalieVehiculeForm.marque }} {{ anomalieVehiculeForm.model }}</div>
                <div class="font-medium text-xl text-gray-700">{{ anomalieVehiculeForm.immat }}</div>
              </div>
            </template>
            <template #default>
              <div class="w-full">
                <div class="pt-4 uppercase text-sm text-gray-600 font-medium py-2 border-b text-left">Anomalie :</div>
                <div class="mt-3 text-sm text-gray-700 w-full">
                  {{ anomalieVehiculeForm.anomalie }}
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex gap-2 w-full justify-end pt-6">
                <AppButtonValidated class="md:w-32 w-full" theme="cancel" @click="showSideAnomalieVehicule()"> <template #default> Annuler </template> </AppButtonValidated>
                <AppButtonValidated class="md:w-32 w-full" theme="" @click="supprimerAnomalie(anomalieVehiculeForm.id)"> <template #default> Clôturer </template> </AppButtonValidated>
              </div>
            </template>
          </AppModalSideContent>
        </template>
      </AppModalSide>

      <AppModalSide :sideModal="sideModalAnomalieSalle" :closeSideModal="showSideAnomalieSalle">
        <template #default>
          <AppModalSideContent v-if="sideModalAnomalieSalle" :closeSideModal="showSideAnomalieSalle">
            <template #header>
              <div class="text-center">
                <div class="font-medium text-xl text-gray-700">Salle</div>
                <div class="font-medium text-xl text-gray-700">{{ anomalieSalleForm.name }}</div>
              </div>
            </template>
            <template #default>
              <div class="w-full">
                <div class="pt-4 uppercase text-sm text-gray-600 font-medium py-2 border-b text-left">Anomalie :</div>
                <div class="mt-3 text-sm text-gray-700 w-full">
                  {{ anomalieSalleForm.anomalie }}
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex gap-2 w-full justify-end pt-6">
                <AppButtonValidated class="md:w-32 w-full" theme="cancel" @click="showSideAnomalieSalle()"> <template #default> Annuler </template> </AppButtonValidated>
                <AppButtonValidated class="md:w-32 w-full" theme="" @click="supprimerAnomalie(anomalieSalleForm.id)"> <template #default> Clôturer </template> </AppButtonValidated>
              </div>
            </template>
          </AppModalSideContent>
        </template>
      </AppModalSide>
    </template>
  </ResaPage>
</template>
