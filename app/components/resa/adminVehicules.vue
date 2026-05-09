<script setup>
import QRCode from "qrcode";

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

const qrSvg = ref("");
const printMode = ref(false);
const printVehicule = ref(null);
const printQrSvg = ref("");

setLoader(true);
await getAllVehiculesBySecteur(userProfil.value.secteur_admin);
setLoader(false);

const qrTargetUrl = (id) => `${window.location.origin}/signalement?vehicule=${id}`;

const generateQr = async (id) => {
  qrSvg.value = "";
  if (!id || typeof window === "undefined") return;
  try {
    qrSvg.value = await QRCode.toString(qrTargetUrl(id), {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0f172a", light: "#ffffff" },
    });
  } catch (err) {
    console.log("erreur QR :", err);
  }
};

const printFiche = async (vehicule) => {
  if (!vehicule?.id || typeof window === "undefined") return;
  try {
    printQrSvg.value = await QRCode.toString(qrTargetUrl(vehicule.id), {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0f172a", light: "#ffffff" },
    });
  } catch (err) {
    console.log("erreur QR :", err);
    return;
  }
  printVehicule.value = vehicule;
  printMode.value = true;
  await nextTick();
  window.print();
  setTimeout(() => {
    printMode.value = false;
  }, 500);
};

// Véhicules
const showSideVehicules = (data) => {
  if (data) {
    vehiculeForm.value = data;
    data.is_dispo == 1 ? (vehiculeForm.value.is_dispo = true) : (vehiculeForm.value.is_dispo = false);
    data.acces_restreint == 1 ? (vehiculeForm.value.acces_restreint = true) : (vehiculeForm.value.acces_restreint = false);
    generateQr(data.id);
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
    qrSvg.value = "";
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
  <section class="w-full h-full flex flex-col gap-5 lg:overflow-hidden print:hidden">
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
            <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Véhicule</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Immatriculation</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Carburant</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Transmission</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sièges</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">QR code</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr class="cursor-pointer hover:bg-sky-50/40 transition-colors" v-for="data in allVehiculesSecteur" :key="data.id" @click="showSideVehicules(data)">
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                  <Icon name="material-symbols:directions-car" size="18" class="text-sky-500" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-800 leading-tight truncate">{{ data.marque }}</p>
                  <p class="text-xs text-slate-500 leading-tight truncate">{{ data.model }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="font-mono text-xs font-bold px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-md">{{ data.immat }}</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span v-if="data.id_carburant == 1" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Icon name="material-symbols:bolt" size="12" />
                Électrique
              </span>
              <span v-else-if="data.id_carburant == 2" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                <Icon name="material-symbols:local-gas-station" size="12" />
                Gazoil
              </span>
              <span v-else-if="data.id_carburant == 3" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                <Icon name="material-symbols:local-gas-station" size="12" />
                Essence
              </span>
              <span v-else class="text-xs text-slate-300">—</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span v-if="data.vitesse === 0" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <span class="size-3.5 rounded-sm bg-white border border-slate-300 text-[9px] font-bold text-slate-500 flex items-center justify-center">A</span>
                Automatique
              </span>
              <span v-else-if="data.vitesse === 1" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Icon name="material-symbols:tune" size="12" />
                Manuel
              </span>
              <span v-else class="text-xs text-slate-300">—</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span v-if="data.capacite" class="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                <Icon name="material-symbols:event-seat-outline" size="14" class="text-slate-400" />
                {{ data.capacite }}
              </span>
              <span v-else class="text-xs text-slate-300">—</span>
            </td>
            <td class="px-4 py-3 text-center" @click.stop>
              <button
                type="button"
                class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition cursor-pointer text-xs font-semibold"
                title="Télécharger / imprimer la fiche"
                @click="printFiche(data)"
              >
                <Icon name="material-symbols:qr-code-2-rounded" size="14" />
                <Icon name="material-symbols:download-rounded" size="12" />
              </button>
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

            <!-- QR Code (uniquement pour véhicule existant) -->
            <div v-if="vehiculeForm.id">
              <div class="flex items-center gap-2 pb-2 mt-5 mb-3 border-b border-slate-100">
                <Icon name="material-symbols:qr-code-2-rounded" size="14" class="text-sky-500" />
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">QR Code</p>
              </div>
              <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="size-24 shrink-0 flex items-center justify-center bg-white rounded-lg border-2 border-slate-100 p-1.5">
                  <div v-if="qrSvg" v-html="qrSvg" class="w-full h-full [&>svg]:w-full [&>svg]:h-full"></div>
                  <div v-else class="size-6 rounded-full border-2 border-slate-200 border-t-sky-500 animate-spin"></div>
                </div>
                <div class="flex-1 min-w-0 flex flex-col gap-2">
                  <p class="text-xs text-slate-500 leading-snug">Imprimez et collez ce QR code dans le véhicule pour permettre aux utilisateurs de signaler une anomalie en le scannant.</p>
                  <button type="button" class="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-linear-to-br from-slate-700 to-slate-900 text-white text-xs font-semibold hover:shadow-md transition cursor-pointer" @click="printFiche(vehiculeForm)">
                    <Icon name="material-symbols:print-outline-rounded" size="14" />
                    Imprimer la fiche
                  </button>
                </div>
              </div>
            </div>
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

  <!-- ===== MODE IMPRESSION (teleporté au body, masqué hors impression) ===== -->
  <Teleport to="body">
    <div v-if="printMode && printVehicule" class="qr-print-card">
      <div class="qr-print-card-inner">
        <div class="qr-print-header">
          <p class="qr-print-overline">Signalement d'anomalie</p>
          <p class="qr-print-title">{{ printVehicule.marque }} {{ printVehicule.model }}</p>
        </div>
        <div class="qr-print-plate">
          <div class="qr-print-plate-eu">
            <Icon name="circle-flags:european-union" size="14" class="rounded-full" />
            <span>F</span>
          </div>
          <div class="qr-print-plate-immat">{{ printVehicule.immat }}</div>
        </div>
        <div v-if="printQrSvg" v-html="printQrSvg" class="qr-print-svg"></div>
        <div class="qr-print-instructions">
          <p class="qr-print-instruction-strong">Scannez avec votre téléphone</p>
          <p class="qr-print-instruction-light">pour signaler un sinistre, une crevaison, un impact pare-brise…</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
.qr-print-card {
  display: none;
}

@media print {
  @page {
    margin: 1cm;
  }
  body * {
    visibility: hidden !important;
  }
  .qr-print-card,
  .qr-print-card * {
    visibility: visible !important;
  }
  .qr-print-card {
    display: flex !important;
    justify-content: center;
    position: absolute !important;
    left: 0;
    top: 0;
    width: 100%;
    padding: 1rem;
    background: white;
  }
  .qr-print-card-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    max-width: 14rem;
    border: 2px solid #0f172a;
    border-radius: 1rem;
    padding: 1rem;
  }
  .qr-print-header {
    width: 100%;
    text-align: center;
  }
  .qr-print-overline {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #94a3b8;
    font-weight: 600;
    margin: 0;
  }
  .qr-print-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin: 2px 0 0;
    line-height: 1.15;
  }
  .qr-print-plate {
    display: flex;
    align-items: stretch;
    overflow: hidden;
    border-radius: 4px;
    background: #fde047;
    color: #0f172a;
    border: 2px solid #0f172a;
  }
  .qr-print-plate-eu {
    background: #1d4ed8;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 2px;
    padding: 4px;
  }
  .qr-print-plate-eu span {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.2em;
    line-height: 1;
  }
  .qr-print-plate-immat {
    display: flex;
    align-items: center;
    padding: 6px 10px;
    font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 0.15em;
  }
  .qr-print-svg {
    width: 100%;
    max-width: 9.5rem;
  }
  .qr-print-svg svg {
    width: 100%;
    height: auto;
  }
  .qr-print-instructions {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .qr-print-instruction-strong {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.15;
    margin: 0;
  }
  .qr-print-instruction-light {
    font-size: 10px;
    color: #64748b;
    line-height: 1.3;
    margin: 0;
  }
}
</style>
