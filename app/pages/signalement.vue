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
const { setLoader } = useLoader();
const { allVehicules, getAllVehicules } = useVehicules();
const { secteurs, getAll: getAllSecteurs } = useSecteurs();

const tab = ref(route.query.salle ? "salles" : "vehicules");
const selectedVehiculeId = ref(route.query.vehicule ? String(route.query.vehicule) : "");
const selectedSalleId = ref(route.query.salle ? String(route.query.salle) : "");

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

const secteurName = (id) => secteurs.value?.find((s) => s.id == id)?.name ?? "";

const groupedVehicules = computed(() => {
  const groups = new Map();
  for (const v of allVehicules.value || []) {
    const key = v.id_secteur;
    if (!groups.has(key)) groups.set(key, { secteur: secteurName(key), items: [] });
    groups.get(key).items.push(v);
  }
  for (const g of groups.values()) {
    g.items.sort((a, b) => `${a.marque ?? ""} ${a.model ?? ""}`.localeCompare(`${b.marque ?? ""} ${b.model ?? ""}`));
  }
  return [...groups.values()].sort((a, b) => a.secteur.localeCompare(b.secteur));
});

const selectedVehicule = computed(() =>
  (allVehicules.value || []).find((v) => v.id == selectedVehiculeId.value),
);

const carburantLabel = (v) => {
  if (v.carburant?.name) return v.carburant.name;
  if (v.id_carburant == 1) return "Électrique";
  if (v.id_carburant == 2) return "Diesel";
  return "Essence";
};

const onSelectVehicule = (id) => {
  selectedVehiculeId.value = id ? String(id) : "";
  router.replace({ query: id ? { vehicule: id } : {} });
};

const pickerGroups = computed(() =>
  groupedVehicules.value.map((g) => ({ label: g.secteur, items: g.items })),
);

const resetVehicule = () => {
  selectedVehiculeId.value = "";
  router.replace({ query: {} });
};

watch(
  () => route.query.vehicule,
  (val) => {
    selectedVehiculeId.value = val ? String(val) : "";
  },
);

const groupedSalles = computed(() => {
  const groups = new Map();
  for (const s of allSalles.value || []) {
    const key = s.id_secteur;
    if (!groups.has(key)) groups.set(key, { secteur: secteurName(key), items: [] });
    groups.get(key).items.push(s);
  }
  for (const g of groups.values()) {
    g.items.sort((a, b) => `${a.name ?? ""}`.localeCompare(`${b.name ?? ""}`));
  }
  return [...groups.values()].sort((a, b) => a.secteur.localeCompare(b.secteur));
});

const selectedSalle = computed(() =>
  (allSalles.value || []).find((s) => s.id == selectedSalleId.value),
);

const sallePickerGroups = computed(() =>
  groupedSalles.value.map((g) => ({ label: g.secteur, items: g.items })),
);

const onSelectSalle = (id) => {
  selectedSalleId.value = id ? String(id) : "";
  router.replace({ query: id ? { salle: id } : {} });
};

const resetSalle = () => {
  selectedSalleId.value = "";
  router.replace({ query: {} });
};

watch(
  () => route.query.salle,
  (val) => {
    selectedSalleId.value = val ? String(val) : "";
  },
);
</script>

<template>
  <section class="w-full h-full overflow-auto bg-linear-to-b from-slate-50 to-slate-100">
    <div class="w-full max-w-4xl mx-auto px-4 py-6 lg:py-8 flex flex-col gap-6">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <Icon name="material-symbols:warning-outline" size="26" class="text-amber-500" />
        </div>
        <div>
          <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Signalement</p>
          <p class="text-xl lg:text-2xl font-bold text-slate-800 leading-tight">Signaler une anomalie</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="relative grid grid-cols-2 p-1 rounded-xl bg-white border border-slate-200 shadow-sm w-fit">
        <!-- Indicateur glissant -->
        <div
          class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-sncf-primary shadow-sm transition-transform duration-300 ease-out"
          :class="tab === 'salles' ? 'translate-x-full' : ''"
        />
        <button
          type="button"
          class="relative z-10 flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
          :class="tab === 'vehicules' ? 'text-white' : 'text-slate-600 hover:text-slate-800'"
          @click="tab = 'vehicules'"
        >
          <Icon name="material-symbols:directions-car-outline-rounded" size="18" />
          Véhicules
        </button>
        <button
          type="button"
          class="relative z-10 flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
          :class="tab === 'salles' ? 'text-white' : 'text-slate-600 hover:text-slate-800'"
          @click="tab = 'salles'"
        >
          <Icon name="material-symbols:meeting-room-outline" size="18" />
          Salles
        </button>
      </div>

      <!-- Tab Véhicules -->
      <div v-if="tab === 'vehicules'" class="flex flex-col gap-4">
        <!-- Sélecteur de véhicule -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col gap-3">
          <AppSearchSelect
            label="Choisir un véhicule"
            :model-value="selectedVehiculeId"
            :groups="pickerGroups"
            :search-keys="['marque', 'model', 'immat']"
            placeholder="— Sélectionnez un véhicule —"
            search-placeholder="Rechercher par marque, modèle ou immatriculation…"
            empty-text="Aucun véhicule trouvé."
            trigger-icon="material-symbols:directions-car-rounded"
            @update:model-value="onSelectVehicule"
          >
            <template #selected="{ item }">
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-sm font-semibold text-slate-700 truncate">{{ item.marque }} {{ item.model }}</span>
                <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded shrink-0">{{ item.immat }}</span>
              </div>
            </template>
            <template #option="{ item, selected }">
              <div class="flex items-center gap-3 min-w-0">
                <div class="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors" :class="selected ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-400'">
                  <Icon name="material-symbols:directions-car-rounded" size="18" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 truncate">{{ item.marque }} {{ item.model }}</p>
                  <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span class="font-mono font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 text-[10px]">{{ item.immat }}</span>
                    <span v-if="item.capacite" class="inline-flex items-center gap-0.5">
                      <Icon name="material-symbols:event-seat-outline" size="12" />
                      {{ item.capacite }}
                    </span>
                    <span class="inline-flex items-center gap-0.5">
                      <Icon :name="item.id_carburant == 1 ? 'material-symbols:bolt' : 'material-symbols:local-gas-station'" size="12" />
                      {{ carburantLabel(item) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </AppSearchSelect>
        </div>

        <!-- Aucun véhicule sélectionné -->
        <div v-if="!selectedVehicule" class="bg-white border border-dashed border-slate-200 rounded-2xl px-5 py-12 flex flex-col items-center text-center gap-2">
          <div class="size-12 rounded-full bg-slate-50 flex items-center justify-center">
            <Icon name="material-symbols:qr-code-scanner-rounded" size="24" class="text-slate-300" />
          </div>
          <p class="text-sm text-slate-500">Choisissez un véhicule ou scannez son QR code pour signaler une anomalie.</p>
        </div>

        <!-- Véhicule sélectionné -->
        <div v-else class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <!-- Bandeau véhicule -->
          <div class="flex items-center gap-4 p-5 border-b border-slate-100 bg-linear-to-br from-slate-50 to-white">
            <div class="size-14 rounded-2xl bg-sky-500/10 flex items-center justify-center shrink-0">
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
            <button
              type="button"
              class="shrink-0 size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Changer de véhicule"
              @click="resetVehicule"
            >
              <Icon name="material-symbols:close-rounded" size="20" />
            </button>
          </div>

          <!-- Signalements + formulaire -->
          <ResaVehiculeEtats :key="selectedVehicule.id" :vehicule="selectedVehicule" :default-open-form="false" />
        </div>
      </div>

      <!-- Tab Salles -->
      <div v-else class="flex flex-col gap-4">
        <!-- Sélecteur de salle -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col gap-3">
          <AppSearchSelect
            label="Choisir une salle"
            :model-value="selectedSalleId"
            :groups="sallePickerGroups"
            :search-keys="['name', 'adresse']"
            placeholder="— Sélectionnez une salle —"
            search-placeholder="Rechercher par nom ou adresse…"
            empty-text="Aucune salle trouvée."
            trigger-icon="material-symbols:meeting-room"
            @update:model-value="onSelectSalle"
          >
            <template #selected="{ item }">
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-sm font-semibold text-slate-700 truncate">{{ item.name }}</span>
                <span v-if="item.adresse" class="text-[11px] text-slate-500 truncate hidden sm:inline">· {{ item.adresse }}</span>
              </div>
            </template>
            <template #option="{ item, selected }">
              <div class="flex items-center gap-3 min-w-0">
                <div class="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors" :class="selected ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-400'">
                  <Icon name="material-symbols:meeting-room" size="18" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 truncate">{{ item.name }}</p>
                  <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span v-if="item.adresse" class="inline-flex items-center gap-0.5 truncate">
                      <Icon name="material-symbols:location-on-outline" size="12" />
                      {{ item.adresse }}
                    </span>
                    <span v-if="item.capacite" class="inline-flex items-center gap-0.5">
                      <Icon name="material-symbols:groups-outline" size="12" />
                      {{ item.capacite }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </AppSearchSelect>
        </div>

        <!-- Aucune salle sélectionnée -->
        <div v-if="!selectedSalle" class="bg-white border border-dashed border-slate-200 rounded-2xl px-5 py-12 flex flex-col items-center text-center gap-2">
          <div class="size-12 rounded-full bg-slate-50 flex items-center justify-center">
            <Icon name="material-symbols:meeting-room-outline" size="24" class="text-slate-300" />
          </div>
          <p class="text-sm text-slate-500">Choisissez une salle pour signaler une anomalie.</p>
        </div>

        <!-- Salle sélectionnée -->
        <div v-else class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <!-- Bandeau salle -->
          <div class="flex items-center gap-4 p-5 border-b border-slate-100 bg-linear-to-br from-slate-50 to-white">
            <div class="size-14 rounded-2xl bg-sky-500/10 flex items-center justify-center shrink-0">
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
            <button
              type="button"
              class="shrink-0 size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Changer de salle"
              @click="resetSalle"
            >
              <Icon name="material-symbols:close-rounded" size="20" />
            </button>
          </div>

          <!-- Signalements + formulaire -->
          <ResaSalleEtats :key="selectedSalle.id" :salle="selectedSalle" :default-open-form="false" />
        </div>
      </div>
    </div>
  </section>
</template>
