<script setup>
const { setLoader } = useLoader();
const userProfil = useState("userProfil");
const { getAllVehiculesBySecteur, addVehicule, updateVehicule, deleteVehicule, allVehiculesSecteur } = useVehicules();

const sideModalVehicules = ref(false);
const vehiculeForm = ref({
  marque: "",
  model: "",
  immat: "",
  capacite: "",
  vitesse: null,
  secteur: userProfil.value.secteur_admin,
  id_carburant: "",
  is_dispo: false,
  acces_restreint: false,
});

setLoader(true);
await getAllVehiculesBySecteur(userProfil.value.secteur_admin);
setLoader(false);

// Véhicules
const showSideVehicules = (data) => {
  if (data) {
    vehiculeForm.value = data;
    data.is_dispo == 1 ? (vehiculeForm.value.is_dispo = true) : (vehiculeForm.value.is_dispo = false);
    data.acces_restreint == 1 ? (vehiculeForm.value.acces_restreint = true) : (vehiculeForm.value.acces_restreint = false);
  } else {
    vehiculeForm.value = {
      marque: "",
      model: "",
      immat: "",
      capacite: "",
      vitesse: null,
      secteur: userProfil.value.secteur_admin,
      id_carburant: "",
      is_dispo: false,
      acces_restreint: false,
    };
  }
  sideModalVehicules.value = !sideModalVehicules.value;
};

const validatedFieldsVehicule = computed(() => {
  return vehiculeForm.value.marque != "" && vehiculeForm.value.model != "" && vehiculeForm.value.immat != "" && vehiculeForm.value.capacite != "" && vehiculeForm.value.vitesse != null && vehiculeForm.value.id_carburant != "" ? true : false;
});

const ajouterVehicule = async () => {
  setLoader(true);
  vehiculeForm.value.is_dispo ? (vehiculeForm.value.is_dispo = 1) : (vehiculeForm.value.is_dispo = 0);
  vehiculeForm.value.acces_restreint ? (vehiculeForm.value.acces_restreint = 1) : (vehiculeForm.value.acces_restreint = 0);
  await addVehicule(vehiculeForm.value);
  await getAllVehiculesBySecteur(userProfil.value.secteur_admin);
  showSideVehicules();
  setLoader(false);
};
const modifierVehicule = async () => {
  setLoader(true);
  vehiculeForm.value.is_dispo ? (vehiculeForm.value.is_dispo = 1) : (vehiculeForm.value.is_dispo = 0);
  vehiculeForm.value.acces_restreint ? (vehiculeForm.value.acces_restreint = 1) : (vehiculeForm.value.acces_restreint = 0);
  await updateVehicule(vehiculeForm.value);
  await getAllVehiculesBySecteur(userProfil.value.secteur_admin);
  showSideVehicules();
  setLoader(false);
};
const supprimerVehicule = async () => {
  setLoader(true);
  await deleteVehicule(vehiculeForm.value.id);
  await getAllVehiculesBySecteur(userProfil.value.secteur_admin);
  showSideVehicules();
  setLoader(false);
};
</script>

<template>
  <section class="w-full h-full flex flex-col gap-5 lg:overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
        <Icon name="material-symbols:directions-car" size="22" class="text-sky-500" />
      </div>
      <div>
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Véhicules</p>
        <p class="text-xl font-bold text-slate-800 leading-tight">Liste des véhicules</p>
      </div>
      <button class="ml-auto flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg transition-colors" @click="showSideVehicules()">
        <Icon name="material-symbols:add" size="18" />
        Ajouter
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden lg:overflow-auto">
      <table v-if="allVehiculesSecteur.length > 0" class="w-full">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Marque</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Modèle</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Immat</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr class="cursor-pointer hover:bg-sky-50/40 transition-colors" v-for="data in allVehiculesSecteur" :key="data.id" @click="showSideVehicules(data)">
            <td class="px-5 py-3 text-sm font-medium text-slate-800">{{ data.marque }}</td>
            <td class="px-4 py-3 text-sm text-slate-600 text-center">{{ data.model }}</td>
            <td class="px-4 py-3 text-center">
              <span class="font-mono text-xs font-bold px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-md">{{ data.immat }}</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span v-if="data.is_dispo == 1 && data.acces_restreint == 1" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Icon name="material-symbols:lock" size="12" />
                Valideurs
              </span>
              <span v-else-if="data.is_dispo == 1" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Icon name="material-symbols:check-circle" size="12" />
                Disponible
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                <Icon name="material-symbols:cancel" size="12" />
                Indisponible
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="px-5 py-8 text-sm text-slate-400 italic text-center">Aucun véhicule enregistré.</div>
    </div>

    <AppModalSide :sideModal="sideModalVehicules" :closeSideModal="showSideVehicules">
      <template #default>
        <AppModalSideContent v-if="sideModalVehicules" :closeSideModal="showSideVehicules">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Icon name="material-symbols:directions-car" size="20" class="text-white" />
              </div>
              <div>
                <p class="text-[10px] text-white/70 uppercase tracking-wider">Véhicules</p>
                <p class="text-base font-semibold text-white leading-tight">
                  {{ vehiculeForm.id ? vehiculeForm.marque + " " + vehiculeForm.model : "Nouveau véhicule" }}
                </p>
              </div>
            </div>
          </template>
          <template #default>
            <!-- Sélecteur disponibilité 3 états -->
            <div class="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Disponibilité</p>
              <div class="grid grid-cols-3 gap-1.5">
                <!-- Indisponible -->
                <button
                  type="button"
                  class="flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-xs font-medium transition-colors border"
                  :class="!vehiculeForm.is_dispo ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'"
                  @click="vehiculeForm.is_dispo = false; vehiculeForm.acces_restreint = false"
                >
                  <Icon name="material-symbols:cancel" size="20" />
                  Indisponible
                </button>
                <!-- Disponible pour tous -->
                <button
                  type="button"
                  class="flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-xs font-medium transition-colors border"
                  :class="vehiculeForm.is_dispo && !vehiculeForm.acces_restreint ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'"
                  @click="vehiculeForm.is_dispo = true; vehiculeForm.acces_restreint = false"
                >
                  <Icon name="material-symbols:check-circle" size="20" />
                  Tous
                </button>
                <!-- Valideurs uniquement -->
                <button
                  type="button"
                  class="flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-xs font-medium transition-colors border"
                  :class="vehiculeForm.is_dispo && vehiculeForm.acces_restreint ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'"
                  @click="vehiculeForm.is_dispo = true; vehiculeForm.acces_restreint = true"
                >
                  <Icon name="material-symbols:lock" size="20" />
                  Valideurs
                </button>
              </div>
            </div>

            <!-- Informations -->
            <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
              <Icon name="material-symbols:info-outline-rounded" size="14" class="text-sky-500" />
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Informations</p>
            </div>
            <AppInput name="marque" type="text" title="Marque : " v-model="vehiculeForm.marque" />
            <AppInput class="pt-3" name="model" type="text" title="Modèle : " v-model="vehiculeForm.model" />
            <AppInput class="pt-3" name="immat" type="text" title="Immatriculation : " v-model="vehiculeForm.immat" />
            <AppInput class="pt-3" name="capa" type="text" title="Nb de sièges : " v-model="vehiculeForm.capacite" />

            <!-- Caractéristiques -->
            <div class="flex items-center gap-2 pb-2 mt-5 mb-3 border-b border-slate-100">
              <Icon name="material-symbols:settings" size="14" class="text-sky-500" />
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Caractéristiques</p>
            </div>

            <!-- Transmission -->
            <p class="text-xs font-medium text-slate-500 mb-2">Transmission</p>
            <div class="grid grid-cols-2 gap-2 items-stretch">
              <div class="relative flex">
                <input id="vitesse-0" type="radio" v-model="vehiculeForm.vitesse" :value="0" class="hidden peer" name="vitesse" />
                <label for="vitesse-0" class="flex flex-1 items-center gap-2.5 px-3 py-3 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-200 peer-checked:border-sky-400 peer-checked:bg-sky-50 cursor-pointer transition-all duration-150">
                  <span class="size-7 rounded-lg bg-slate-100 border border-slate-200 text-sm font-bold text-slate-500 flex items-center justify-center shrink-0">A</span>
                  <span class="text-sm font-medium text-slate-600">Automatique</span>
                </label>
                <div class="absolute top-2.5 right-2.5 size-4 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
              <div class="relative flex">
                <input id="vitesse-1" type="radio" v-model="vehiculeForm.vitesse" :value="1" class="hidden peer" name="vitesse" />
                <label for="vitesse-1" class="flex flex-1 items-center gap-2.5 px-3 py-3 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-200 peer-checked:border-sky-400 peer-checked:bg-sky-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:tune" size="20" class="text-slate-400 shrink-0" />
                  <span class="text-sm font-medium text-slate-600">Manuel</span>
                </label>
                <div class="absolute top-2.5 right-2.5 size-4 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
            </div>

            <!-- Carburant -->
            <p class="text-xs font-medium text-slate-500 mt-4 mb-2">Carburant</p>
            <div class="grid grid-cols-3 gap-2">
              <div class="relative">
                <input id="carb-1" type="radio" v-model="vehiculeForm.id_carburant" :value="1" class="hidden peer" name="carburant" />
                <label for="carb-1" class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 border-slate-200 bg-white hover:border-emerald-200 peer-checked:border-emerald-400 peer-checked:bg-emerald-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:bolt" size="22" class="text-slate-400" />
                  <span class="text-xs font-medium text-slate-600 text-center leading-tight">Électrique</span>
                </label>
                <div class="absolute top-2 right-2 size-4 rounded-full bg-emerald-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
              <div class="relative">
                <input id="carb-2" type="radio" v-model="vehiculeForm.id_carburant" :value="2" class="hidden peer" name="carburant" />
                <label for="carb-2" class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-200 peer-checked:border-sky-400 peer-checked:bg-sky-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:local-gas-station" size="22" class="text-slate-400" />
                  <span class="text-xs font-medium text-slate-600 text-center leading-tight">Gazoil</span>
                </label>
                <div class="absolute top-2 right-2 size-4 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
              <div class="relative">
                <input id="carb-3" type="radio" v-model="vehiculeForm.id_carburant" :value="3" class="hidden peer" name="carburant" />
                <label for="carb-3" class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 border-slate-200 bg-white hover:border-orange-200 peer-checked:border-orange-400 peer-checked:bg-orange-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:local-gas-station" size="22" class="text-slate-400" />
                  <span class="text-xs font-medium text-slate-600 text-center leading-tight">Essence</span>
                </label>
                <div class="absolute top-2 right-2 size-4 rounded-full bg-orange-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
            </div>

            <!-- Divers -->
            <div class="flex items-center gap-2 pb-2 mt-5 mb-3 border-b border-slate-100">
              <Icon name="material-symbols:notes" size="14" class="text-sky-500" />
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</p>
            </div>
            <textarea class="appearance-none border text-sm text-slate-600 border-slate-200 rounded-xl p-3 w-full focus:outline-none focus:border-sky-400 focus:ring-0 resize-none bg-slate-50" rows="4" v-model="vehiculeForm.autres" placeholder="Informations complémentaires..."></textarea>
          </template>
          <template #footer>
            <div v-if="!vehiculeForm.id" class="flex gap-3 w-full justify-end">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideVehicules()"><template #default>Annuler</template></AppButtonValidated>
              <AppButtonValidated :validated="validatedFieldsVehicule" class="md:w-32 w-full text-sm" theme="" @click="ajouterVehicule()"><template #default>Enregistrer</template></AppButtonValidated>
            </div>
            <div v-else class="flex gap-3 w-full justify-end">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideVehicules()"><template #default>Annuler</template></AppButtonValidated>
              <AppButtonValidated :validated="validatedFieldsVehicule" class="md:w-32 w-full text-sm" theme="" @click="modifierVehicule()"><template #default>Modifier</template></AppButtonValidated>
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="delete" @click="supprimerVehicule()"><template #default>Supprimer</template></AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>
  </section>
</template>
