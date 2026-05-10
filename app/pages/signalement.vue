<script setup>
definePageMeta({
  requiresAuth: true,
});

useHead({
  title: "Signalement",
  description: "Signaler une anomalie sur un véhicule ou une salle",
});

const route = useRoute();
const router = useRouter();
const supabase = useSupabaseClient();
const userProfil = useState("userProfil");
const { setLoader } = useLoader();
const { allVehicules, getAllVehicules } = useVehicules();
const { secteurs, getAll: getAllSecteurs } = useSecteurs();

const allSalles = useState("allSallesSignalement", () => []);
const fetchAllSalles = async () => {
  const { data, error } = await supabase.from("salles").select("*").order("name", { ascending: true });
  if (error) {
    console.log("erreurs salles :", error);
    allSalles.value = [];
    return;
  }
  allSalles.value = data || [];
};

setLoader(true);
await Promise.all([
  !allVehicules.value || allVehicules.value.length === 0 ? getAllVehicules() : Promise.resolve(),
  fetchAllSalles(),
  !secteurs.value || secteurs.value.length === 0 ? getAllSecteurs() : Promise.resolve(),
]);
setLoader(false);

const tab = ref(route.query.salle ? "salles" : "vehicules");
const selectedVehiculeId = ref(route.query.vehicule ? String(route.query.vehicule) : "");
const selectedSalleId = ref(route.query.salle ? String(route.query.salle) : "");
const search = ref("");

const initialSecteurId = (() => {
  if (route.query.vehicule) {
    const v = (allVehicules.value || []).find((x) => x.id == route.query.vehicule);
    if (v) return v.id_secteur;
  }
  if (route.query.salle) {
    const s = (allSalles.value || []).find((x) => x.id == route.query.salle);
    if (s) return s.id_secteur;
  }
  return userProfil.value?.favorite_secteur || secteurs.value?.[0]?.id || null;
})();

const activeSecteurId = ref(initialSecteurId);

const activeSecteur = computed(() => secteurs.value?.find((s) => s.id == activeSecteurId.value));
const secteurName = (id) => secteurs.value?.find((s) => s.id == id)?.name ?? "";

const carburantLabel = (v) => {
  if (!v) return "";
  if (v.carburant?.name) return v.carburant.name;
  if (v.id_carburant == 1) return "Électrique";
  if (v.id_carburant == 2) return "Diesel";
  return "Essence";
};

const vehiculesSecteur = computed(() =>
  (allVehicules.value || [])
    .filter((v) => v.id_secteur == activeSecteurId.value)
    .sort((a, b) => `${a.marque ?? ""} ${a.model ?? ""}`.localeCompare(`${b.marque ?? ""} ${b.model ?? ""}`)),
);

const sallesSecteur = computed(() =>
  (allSalles.value || [])
    .filter((s) => s.id_secteur == activeSecteurId.value)
    .sort((a, b) => `${a.name ?? ""}`.localeCompare(`${b.name ?? ""}`)),
);

const normalize = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const matches = (item, keys) => {
  const q = normalize(search.value.trim());
  if (!q) return true;
  return keys.some((k) => normalize(item[k]).includes(q));
};

const filteredVehicules = computed(() => vehiculesSecteur.value.filter((v) => matches(v, ["marque", "model", "immat"])));
const filteredSalles = computed(() => sallesSecteur.value.filter((s) => matches(s, ["name", "adresse"])));

const selectedVehicule = computed(() => vehiculesSecteur.value.find((v) => v.id == selectedVehiculeId.value));
const selectedSalle = computed(() => sallesSecteur.value.find((s) => s.id == selectedSalleId.value));

const hasSelection = computed(() => (tab.value === "vehicules" ? !!selectedVehicule.value : !!selectedSalle.value));

const onSelectVehicule = (id) => {
  selectedVehiculeId.value = id ? String(id) : "";
  router.replace({ query: id ? { vehicule: String(id) } : {} });
};

const onSelectSalle = (id) => {
  selectedSalleId.value = id ? String(id) : "";
  router.replace({ query: id ? { salle: String(id) } : {} });
};

const resetVehicule = () => onSelectVehicule(null);
const resetSalle = () => onSelectSalle(null);

const setTab = (newTab) => {
  if (tab.value === newTab) return;
  tab.value = newTab;
  search.value = "";
  if (newTab === "vehicules" && selectedVehiculeId.value) {
    router.replace({ query: { vehicule: selectedVehiculeId.value } });
  } else if (newTab === "salles" && selectedSalleId.value) {
    router.replace({ query: { salle: selectedSalleId.value } });
  } else {
    router.replace({ query: {} });
  }
};

watch(
  () => route.query.vehicule,
  (val) => {
    selectedVehiculeId.value = val ? String(val) : "";
  },
);
watch(
  () => route.query.salle,
  (val) => {
    selectedSalleId.value = val ? String(val) : "";
  },
);
</script>

<template>
  <section class="w-full h-full flex flex-col lg:flex-row gap-4 p-4 overflow-hidden bg-linear-to-b from-slate-50 to-slate-100 text-sm text-gray-700">
    <!-- PARTIE GAUCHE : sélection -->
    <div :class="['w-full lg:w-80 flex-none h-full min-h-0 overflow-y-auto flex-col gap-3', hasSelection ? 'hidden lg:flex' : 'flex']">
      <!-- Header secteur -->
      <div class="flex items-center gap-3">
        <div class="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <Icon name="material-symbols:warning-outline" size="26" class="text-amber-500" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Signalement</p>
          <p class="text-base lg:text-lg font-bold text-slate-800 leading-tight truncate">{{ activeSecteur?.name || "Aucun secteur" }}</p>
        </div>
      </div>

      <!-- Toggle Véhicules / Salles -->
      <div class="grid grid-cols-2 gap-2">
        <button type="button" class="p-3 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer" :class="tab === 'vehicules' ? 'bg-linear-to-br from-slate-700 to-slate-900 border-transparent text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'" @click="setTab('vehicules')">
          <Icon name="material-symbols:directions-car-rounded" size="22" />
          <p class="text-[11px] font-bold uppercase tracking-wider">Véhicules</p>
          <span class="text-xs font-semibold px-2 rounded-full" :class="tab === 'vehicules' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'">{{ vehiculesSecteur.length }}</span>
        </button>
        <button type="button" class="p-3 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer" :class="tab === 'salles' ? 'bg-linear-to-br from-slate-700 to-slate-900 border-transparent text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'" @click="setTab('salles')">
          <Icon name="material-symbols:meeting-room" size="22" />
          <p class="text-[11px] font-bold uppercase tracking-wider">Salles</p>
          <span class="text-xs font-semibold px-2 rounded-full" :class="tab === 'salles' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'">{{ sallesSecteur.length }}</span>
        </button>
      </div>

      <!-- Recherche -->
      <div class="relative shrink-0">
        <Icon name="material-symbols:search-rounded" size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input v-model="search" type="text" :placeholder="tab === 'vehicules' ? 'Rechercher (marque, modèle, immat)…' : 'Rechercher (nom, adresse)…'" class="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition" />
        <button v-if="search" type="button" class="absolute right-2 top-1/2 -translate-y-1/2 size-6 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer" @click="search = ''">
          <Icon name="material-symbols:close-rounded" size="14" />
        </button>
      </div>

      <!-- Liste véhicules -->
      <div v-if="tab === 'vehicules'" class="lg:flex-1 lg:min-h-0 lg:overflow-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div v-if="filteredVehicules.length === 0" class="px-4 py-8 flex flex-col items-center gap-2 text-slate-400 text-sm">
          <Icon name="material-symbols:search-off-rounded" size="22" />
          <span class="italic">Aucun véhicule trouvé.</span>
        </div>
        <div v-else class="divide-y divide-slate-100">
          <button v-for="v in filteredVehicules" :key="v.id" type="button" class="w-full flex items-center gap-3 px-3 py-2.5 text-left transition cursor-pointer" :class="v.id == selectedVehiculeId ? 'bg-sky-50' : 'hover:bg-slate-50'" @click="onSelectVehicule(v.id)">
            <div class="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors" :class="v.id == selectedVehiculeId ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-400'">
              <Icon name="material-symbols:directions-car-rounded" size="18" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-700 truncate">{{ v.marque }} {{ v.model }}</p>
              <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <span class="font-mono font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 text-[10px]">{{ v.immat }}</span>
                <span class="inline-flex items-center gap-0.5">
                  <Icon :name="v.id_carburant == 1 ? 'material-symbols:bolt' : 'material-symbols:local-gas-station'" size="12" />
                  {{ carburantLabel(v) }}
                </span>
              </div>
            </div>
            <Icon v-if="v.id == selectedVehiculeId" name="material-symbols:check-circle-rounded" size="18" class="text-sky-500 shrink-0" />
          </button>
        </div>
      </div>

      <!-- Liste salles -->
      <div v-else class="lg:flex-1 lg:min-h-0 lg:overflow-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div v-if="filteredSalles.length === 0" class="px-4 py-8 flex flex-col items-center gap-2 text-slate-400 text-sm">
          <Icon name="material-symbols:search-off-rounded" size="22" />
          <span class="italic">Aucune salle trouvée.</span>
        </div>
        <div v-else class="divide-y divide-slate-100">
          <button v-for="s in filteredSalles" :key="s.id" type="button" class="w-full flex items-center gap-3 px-3 py-2.5 text-left transition cursor-pointer" :class="s.id == selectedSalleId ? 'bg-sky-50' : 'hover:bg-slate-50'" @click="onSelectSalle(s.id)">
            <div class="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors" :class="s.id == selectedSalleId ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-400'">
              <Icon name="material-symbols:meeting-room" size="18" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-700 truncate">{{ s.name }}</p>
              <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <span v-if="s.adresse" class="inline-flex items-center gap-0.5 truncate">
                  <Icon name="material-symbols:location-on-outline" size="12" />
                  {{ s.adresse }}
                </span>
                <span v-if="s.capacite" class="inline-flex items-center gap-0.5">
                  <Icon name="material-symbols:groups-outline" size="12" />
                  {{ s.capacite }}
                </span>
              </div>
            </div>
            <Icon v-if="s.id == selectedSalleId" name="material-symbols:check-circle-rounded" size="18" class="text-sky-500 shrink-0" />
          </button>
        </div>
      </div>
    </div>

    <!-- PARTIE DROITE : signalements -->
    <div :class="['w-full lg:flex-1 h-full min-h-0 overflow-y-auto flex-col gap-4', hasSelection ? 'flex' : 'hidden lg:flex']">
      <!-- État vide (desktop) -->
      <div v-if="!hasSelection" class="flex-1 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center gap-3">
        <div class="size-16 rounded-full bg-slate-50 flex items-center justify-center">
          <Icon :name="tab === 'vehicules' ? 'material-symbols:directions-car-rounded' : 'material-symbols:meeting-room'" size="32" class="text-slate-300" />
        </div>
        <p class="text-base font-semibold text-slate-700">Sélectionnez {{ tab === "vehicules" ? "un véhicule" : "une salle" }}</p>
        <p class="text-sm text-slate-400 max-w-sm">Choisissez {{ tab === "vehicules" ? "un véhicule" : "une salle" }} dans la liste pour consulter ou ajouter un signalement.</p>
      </div>

      <!-- Véhicule sélectionné -->
      <div v-else-if="tab === 'vehicules' && selectedVehicule" class="shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div class="flex items-center gap-3 lg:gap-4 p-4 lg:p-5 border-b border-slate-100 bg-linear-to-br from-slate-50 to-white">
          <div class="size-12 lg:size-14 rounded-2xl bg-sky-500/10 flex items-center justify-center shrink-0">
            <Icon name="material-symbols:directions-car-rounded" size="28" class="text-sky-500" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{{ secteurName(selectedVehicule.id_secteur) }}</p>
            <p class="text-base lg:text-lg font-bold text-slate-800 leading-tight truncate">{{ selectedVehicule.marque }} {{ selectedVehicule.model }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-1.5">
              <span class="font-mono text-[11px] font-bold px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded">{{ selectedVehicule.immat }}</span>
              <span v-if="selectedVehicule.capacite" class="inline-flex items-center gap-1 text-xs text-slate-500">
                <Icon name="material-symbols:event-seat-outline" size="13" />
                {{ selectedVehicule.capacite }} places
              </span>
              <span class="inline-flex items-center gap-1 text-xs text-slate-500">
                <Icon :name="selectedVehicule.id_carburant == 1 ? 'material-symbols:bolt' : 'material-symbols:local-gas-station'" size="13" />
                {{ carburantLabel(selectedVehicule) }}
              </span>
            </div>
          </div>
          <button type="button" class="shrink-0 size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer" title="Changer de véhicule" @click="resetVehicule">
            <Icon name="material-symbols:close-rounded" size="20" />
          </button>
        </div>
        <ResaVehiculeEtats :key="selectedVehicule.id" :vehicule="selectedVehicule" :default-open-form="false" />
      </div>

      <!-- Salle sélectionnée -->
      <div v-else-if="tab === 'salles' && selectedSalle" class="shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div class="flex items-center gap-3 lg:gap-4 p-4 lg:p-5 border-b border-slate-100 bg-linear-to-br from-slate-50 to-white">
          <div class="size-12 lg:size-14 rounded-2xl bg-sky-500/10 flex items-center justify-center shrink-0">
            <Icon name="material-symbols:meeting-room" size="28" class="text-sky-500" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{{ secteurName(selectedSalle.id_secteur) }}</p>
            <p class="text-base lg:text-lg font-bold text-slate-800 leading-tight truncate">{{ selectedSalle.name }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-1.5">
              <span v-if="selectedSalle.adresse" class="inline-flex items-center gap-1 text-xs text-slate-500">
                <Icon name="material-symbols:location-on-outline" size="13" />
                {{ selectedSalle.adresse }}
              </span>
              <span v-if="selectedSalle.capacite" class="inline-flex items-center gap-1 text-xs text-slate-500">
                <Icon name="material-symbols:groups-outline" size="13" />
                {{ selectedSalle.capacite }} places
              </span>
            </div>
          </div>
          <button type="button" class="shrink-0 size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer" title="Changer de salle" @click="resetSalle">
            <Icon name="material-symbols:close-rounded" size="20" />
          </button>
        </div>
        <ResaSalleEtats :key="selectedSalle.id" :salle="selectedSalle" :default-open-form="false" />
      </div>
    </div>
  </section>
</template>
