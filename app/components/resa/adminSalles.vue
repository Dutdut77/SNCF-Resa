<script setup>
import QRCode from "qrcode";

const { setLoader } = useLoader();
const userProfil = useState("userProfil");

const { getAllSallesBySecteur, addSalle, updateSalle, deleteSalle, allSallesSecteur } = useSalles();

const sideModalSalles = ref(false);
const salleForm = ref({
  is_dispo: false,
  name: "",
  id_secteur: userProfil.value.secteur_admin,
  wifi: 0,
  jabra: 0,
  clim: 0,
  white_board: 0,
  pmr: 0,
  adresse: "",
  autres: "",
  capacite: "",
  video_proj: 0,
  webcam: 0,
});

const qrSvg = ref("");
const printMode = ref(false);
const printSalle = ref(null);
const printQrSvg = ref("");

setLoader(true);
await getAllSallesBySecteur(userProfil.value.secteur_admin);
setLoader(false);

const qrTargetUrl = (id) => `${window.location.origin}/signalement?salle=${id}`;

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

const printFiche = async (salle) => {
  if (!salle?.id || typeof window === "undefined") return;
  try {
    printQrSvg.value = await QRCode.toString(qrTargetUrl(salle.id), {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0f172a", light: "#ffffff" },
    });
  } catch (err) {
    console.log("erreur QR :", err);
    return;
  }
  printSalle.value = salle;
  printMode.value = true;
  await nextTick();
  window.print();
  setTimeout(() => {
    printMode.value = false;
  }, 500);
};

const validatedFieldsSalles = computed(() => {
  return salleForm.value.name != "" && salleForm.value.adresse != "" && salleForm.value.capacite != "" ? true : false;
});

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
    generateQr(data.id);
  } else {
    salleForm.value = {
      is_dispo: false,
      name: "",
      id_secteur: userProfil.value.secteur_admin,
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
    qrSvg.value = "";
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
  await getAllSallesBySecteur(userProfil.value.secteur_admin);
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
  await getAllSallesBySecteur(userProfil.value.secteur_admin);
  showSideSalles();
  setLoader(false);
};
const supprimerSalle = async () => {
  setLoader(true);
  await deleteSalle(salleForm.value.id);
  await getAllSallesBySecteur(userProfil.value.secteur_admin);
  showSideSalles();
  setLoader(false);
};
</script>

<template>
  <section class="w-full h-full flex flex-col gap-5 print:hidden">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
        <Icon name="material-symbols:meeting-room" size="22" class="text-sky-500" />
      </div>
      <div>
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Salles</p>
        <p class="text-xl font-bold text-slate-800 leading-tight">Liste des salles</p>
      </div>
      <button class="ml-auto flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg transition-colors" @click="showSideSalles()">
        <Icon name="material-symbols:add" size="18" />
        Ajouter
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden lg:overflow-auto">
      <table v-if="allSallesSecteur.length > 0" class="w-full">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Salle</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Places</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Équipements</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">PMR</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">QR code</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr class="cursor-pointer hover:bg-sky-50/40 transition-colors" v-for="data in allSallesSecteur" :key="data.id" @click="showSideSalles(data)">
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                  <Icon name="material-symbols:meeting-room" size="18" class="text-sky-500" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-800 leading-tight truncate">{{ data.name }}</p>
                  <p v-if="data.adresse" class="text-xs text-slate-500 leading-tight truncate flex items-center gap-1">
                    <Icon name="material-symbols:location-on-outline" size="12" class="shrink-0" />
                    {{ data.adresse }}
                  </p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <span v-if="data.capacite" class="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                <Icon name="material-symbols:groups-outline" size="14" class="text-slate-400" />
                {{ data.capacite }}
              </span>
              <span v-else class="text-xs text-slate-300">—</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-1 flex-wrap">
                <span v-if="data.wifi == 1" class="inline-flex items-center justify-center size-6 rounded-md bg-sky-50 border border-sky-200 text-sky-600" title="Wifi">
                  <Icon name="material-symbols:wifi" size="13" />
                </span>
                <span v-if="data.clim == 1" class="inline-flex items-center justify-center size-6 rounded-md bg-sky-50 border border-sky-200 text-sky-600" title="Climatisation">
                  <Icon name="material-symbols:ac-unit" size="13" />
                </span>
                <span v-if="data.video_proj == 1" class="inline-flex items-center justify-center size-6 rounded-md bg-sky-50 border border-sky-200 text-sky-600" title="Vidéo-projecteur">
                  <Icon name="material-symbols:connected-tv" size="13" />
                </span>
                <span v-if="data.webcam == 1" class="inline-flex items-center justify-center size-6 rounded-md bg-sky-50 border border-sky-200 text-sky-600" title="Webcam">
                  <Icon name="material-symbols:videocam" size="13" />
                </span>
                <span v-if="data.jabra == 1" class="inline-flex items-center justify-center size-6 rounded-md bg-sky-50 border border-sky-200 text-sky-600" title="Jabra">
                  <Icon name="material-symbols:headset-mic" size="13" />
                </span>
                <span v-if="data.white_board == 1" class="inline-flex items-center justify-center size-6 rounded-md bg-sky-50 border border-sky-200 text-sky-600" title="Tableau blanc">
                  <Icon name="material-symbols:draw" size="13" />
                </span>
                <span v-if="!data.wifi && !data.clim && !data.video_proj && !data.webcam && !data.jabra && !data.white_board" class="text-xs text-slate-300">—</span>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <span v-if="data.pmr == 1" class="inline-flex items-center justify-center size-6 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600" title="Accessible PMR">
                <Icon name="material-symbols:accessible" size="14" />
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
              <span v-if="data.is_dispo == 1" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
      <div v-else class="px-5 py-8 text-sm text-slate-400 italic text-center">Aucune salle enregistrée.</div>
    </div>

    <AppModalSide :sideModal="sideModalSalles" :closeSideModal="showSideSalles">
      <template #default>
        <AppModalSideContent v-if="sideModalSalles" :closeSideModal="showSideSalles">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Icon name="material-symbols:meeting-room" size="20" class="text-white" />
              </div>
              <div>
                <p class="text-[10px] text-white/70 uppercase tracking-wider">Salles</p>
                <p class="text-base font-semibold text-white leading-tight">
                  {{ salleForm.id ? salleForm.name : "Nouvelle salle" }}
                </p>
              </div>
            </div>
          </template>
          <template #default>
            <!-- Toggle disponibilité -->
            <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-700">Disponibilité</p>
                <p class="text-xs text-slate-400">{{ salleForm.is_dispo ? "Salle disponible à la réservation" : "Salle indisponible" }}</p>
              </div>
              <label class="w-8 cursor-pointer shrink-0">
                <input type="checkbox" class="peer hidden" v-model="salleForm.is_dispo" />
                <span class="w-8 h-5 flex items-center flex-shrink-0 p-1 bg-slate-300 rounded-full duration-300 ease-in-out peer-checked:bg-sky-500 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-2.5"></span>
              </label>
            </div>

            <!-- Informations -->
            <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
              <Icon name="material-symbols:info-outline-rounded" size="14" class="text-sky-500" />
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Informations</p>
            </div>
            <AppInput name="name" type="text" title="Nom de la salle : " v-model="salleForm.name" />
            <AppInput class="pt-3" name="adresse" type="text" title="Adresse : " v-model="salleForm.adresse" />
            <AppInput class="pt-3" name="capa" type="text" title="Nb de places : " v-model="salleForm.capacite" />

            <!-- Installations -->
            <div class="flex items-center gap-2 pb-2 mt-5 mb-3 border-b border-slate-100">
              <Icon name="material-symbols:settings" size="14" class="text-sky-500" />
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Installations</p>
            </div>
            <div class="grid grid-cols-2 gap-2 items-stretch">
              <div class="relative flex">
                <input id="chk-clim" type="checkbox" v-model="salleForm.clim" class="hidden peer" />
                <label for="chk-clim" class="flex flex-1 items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-200 peer-checked:border-sky-400 peer-checked:bg-sky-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:ac-unit" size="18" class="text-slate-400 shrink-0" />
                  <span class="text-sm font-medium text-slate-600">Climatisation</span>
                </label>
                <div class="absolute top-2.5 right-2.5 size-4 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
              <div class="relative flex">
                <input id="chk-wifi" type="checkbox" v-model="salleForm.wifi" class="hidden peer" />
                <label for="chk-wifi" class="flex flex-1 items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-200 peer-checked:border-sky-400 peer-checked:bg-sky-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:wifi" size="18" class="text-slate-400 shrink-0" />
                  <span class="text-sm font-medium text-slate-600">Wifi</span>
                </label>
                <div class="absolute top-2.5 right-2.5 size-4 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
              <div class="relative flex">
                <input id="chk-jabra" type="checkbox" v-model="salleForm.jabra" class="hidden peer" />
                <label for="chk-jabra" class="flex flex-1 items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-200 peer-checked:border-sky-400 peer-checked:bg-sky-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:headset-mic" size="18" class="text-slate-400 shrink-0" />
                  <span class="text-sm font-medium text-slate-600">Jabra</span>
                </label>
                <div class="absolute top-2.5 right-2.5 size-4 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
              <div class="relative flex">
                <input id="chk-white_board" type="checkbox" v-model="salleForm.white_board" class="hidden peer" />
                <label for="chk-white_board" class="flex flex-1 items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-200 peer-checked:border-sky-400 peer-checked:bg-sky-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:draw" size="18" class="text-slate-400 shrink-0" />
                  <span class="text-sm font-medium text-slate-600">Tableau blanc</span>
                </label>
                <div class="absolute top-2.5 right-2.5 size-4 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
              <div class="relative flex">
                <input id="chk-pmr" type="checkbox" v-model="salleForm.pmr" class="hidden peer" />
                <label for="chk-pmr" class="flex flex-1 items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-200 peer-checked:border-sky-400 peer-checked:bg-sky-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:accessible" size="18" class="text-slate-400 shrink-0" />
                  <span class="text-sm font-medium text-slate-600">PMR</span>
                </label>
                <div class="absolute top-2.5 right-2.5 size-4 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
              <div class="relative flex">
                <input id="chk-video_proj" type="checkbox" v-model="salleForm.video_proj" class="hidden peer" />
                <label for="chk-video_proj" class="flex flex-1 items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-200 peer-checked:border-sky-400 peer-checked:bg-sky-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:connected-tv" size="18" class="text-slate-400 shrink-0" />
                  <span class="text-sm font-medium text-slate-600">Vidéo-proj.</span>
                </label>
                <div class="absolute top-2.5 right-2.5 size-4 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
              <div class="relative flex">
                <input id="chk-webcam" type="checkbox" v-model="salleForm.webcam" class="hidden peer" />
                <label for="chk-webcam" class="flex flex-1 items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-200 peer-checked:border-sky-400 peer-checked:bg-sky-50 cursor-pointer transition-all duration-150">
                  <Icon name="material-symbols:videocam" size="18" class="text-slate-400 shrink-0" />
                  <span class="text-sm font-medium text-slate-600">Webcam</span>
                </label>
                <div class="absolute top-2.5 right-2.5 size-4 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none">
                  <Icon name="material-symbols:check" size="10" class="text-white" />
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="flex items-center gap-2 pb-2 mt-5 mb-3 border-b border-slate-100">
              <Icon name="material-symbols:notes" size="14" class="text-sky-500" />
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</p>
            </div>
            <textarea class="appearance-none border text-sm text-slate-600 border-slate-200 rounded-xl p-3 w-full focus:outline-none focus:border-sky-400 focus:ring-0 resize-none bg-slate-50" rows="4" v-model="salleForm.autres" placeholder="Informations complémentaires..."></textarea>

            <!-- QR Code (uniquement pour salle existante) -->
            <div v-if="salleForm.id">
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
                  <p class="text-xs text-slate-500 leading-snug">Imprimez et collez ce QR code dans la salle pour permettre aux utilisateurs de signaler une anomalie en le scannant.</p>
                  <button type="button" class="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-linear-to-br from-slate-700 to-slate-900 text-white text-xs font-semibold hover:shadow-md transition cursor-pointer" @click="printFiche(salleForm)">
                    <Icon name="material-symbols:print-outline-rounded" size="14" />
                    Imprimer la fiche
                  </button>
                </div>
              </div>
            </div>
          </template>
          <template #footer>
            <div v-if="!salleForm.id" class="flex gap-3 w-full justify-end">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideSalles()"><template #default>Annuler</template></AppButtonValidated>
              <AppButtonValidated :validated="validatedFieldsSalles" class="md:w-32 w-full text-sm" theme="" @click="ajouterSalle()"><template #default>Enregistrer</template></AppButtonValidated>
            </div>
            <div v-else class="flex gap-3 w-full justify-end">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideSalles()"><template #default>Annuler</template></AppButtonValidated>
              <AppButtonValidated :validated="validatedFieldsSalles" class="md:w-32 w-full text-sm" theme="" @click="modifierSalle()"><template #default>Modifier</template></AppButtonValidated>
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="delete" @click="supprimerSalle()"><template #default>Supprimer</template></AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>
  </section>

  <!-- ===== MODE IMPRESSION (téléporté au body, masqué hors impression) ===== -->
  <Teleport to="body">
    <div v-if="printMode && printSalle" class="qr-print-card">
      <div class="qr-print-card-inner">
        <div class="qr-print-header">
          <p class="qr-print-overline">Signalement d'anomalie</p>
          <p class="qr-print-title">{{ printSalle.name }}</p>
        </div>
        <div v-if="printSalle.adresse" class="qr-print-address">
          <Icon name="material-symbols:location-on-outline" size="12" />
          <span>{{ printSalle.adresse }}</span>
        </div>
        <div v-if="printQrSvg" v-html="printQrSvg" class="qr-print-svg"></div>
        <div class="qr-print-instructions">
          <p class="qr-print-instruction-strong">Scannez avec votre téléphone</p>
          <p class="qr-print-instruction-light">pour signaler un problème de matériel, mobilier, propreté…</p>
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
  .qr-print-address {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: #475569;
    text-align: center;
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
