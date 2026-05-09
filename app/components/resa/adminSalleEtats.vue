<script setup>
const { setLoader } = useLoader();
const userProfil = useState("userProfil");
const {
  etatsSallesBySecteur,
  ETAT_TYPES,
  getEtatsSallesBySecteur,
  deleteEtat,
} = useSalleEtats();

const TYPE_ICONS = {
  1: "material-symbols:settings-alert-outline",
  2: "material-symbols:chair-outline",
  3: "material-symbols:cleaning-services-outline",
  4: "material-symbols:ac-unit",
  5: "material-symbols:info-outline",
};

const filterType = ref("all");

const filteredEtats = computed(() => {
  if (filterType.value === "all") return etatsSallesBySecteur.value;
  return etatsSallesBySecteur.value.filter((e) => String(e.type) === String(filterType.value));
});

const groupedBySalle = computed(() => {
  const map = new Map();
  for (const etat of filteredEtats.value) {
    const sid = etat.id_salle;
    if (!map.has(sid)) {
      map.set(sid, { salle: etat.salles, etats: [] });
    }
    map.get(sid).etats.push(etat);
  }
  return Array.from(map.values()).sort((a, b) => {
    const aDate = new Date(a.etats[0].created_at).getTime();
    const bDate = new Date(b.etats[0].created_at).getTime();
    return bDate - aDate;
  });
});

const collapsed = ref(new Set());
const isCollapsed = (id) => collapsed.value.has(id);
const toggleCollapse = (id) => {
  const next = new Set(collapsed.value);
  next.has(id) ? next.delete(id) : next.add(id);
  collapsed.value = next;
};

const refresh = async () => {
  if (!userProfil.value?.secteur_admin) return;
  await getEtatsSallesBySecteur(userProfil.value.secteur_admin);
};

const askDelete = async (etat) => {
  if (!confirm("Supprimer ce signalement ?")) return;
  setLoader(true);
  await deleteEtat(etat);
  await refresh();
  setLoader(false);
};

setLoader(true);
await refresh();
setLoader(false);
</script>

<template>
  <section class="w-full h-full flex flex-col gap-5 lg:overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
        <Icon name="material-symbols:warning-outline" size="22" class="text-amber-500" />
      </div>
      <div>
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Salles</p>
        <p class="text-xl font-bold text-slate-800 leading-tight">État des salles</p>
      </div>
      <span class="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        {{ etatsSallesBySecteur.length }} signalement{{ etatsSallesBySecteur.length > 1 ? "s" : "" }}
      </span>
    </div>

    <!-- Filtres par type -->
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer"
        :class="filterType === 'all' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
        @click="filterType = 'all'"
      >
        Tous ({{ etatsSallesBySecteur.length }})
      </button>
      <button
        v-for="t in ETAT_TYPES"
        :key="t.value"
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer"
        :class="filterType === t.value ? 'bg-sky-500 border-sky-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
        @click="filterType = t.value"
      >
        <Icon :name="TYPE_ICONS[t.value]" size="14" />
        {{ t.label }}
      </button>
    </div>

    <!-- Liste -->
    <div class="lg:flex-1 lg:min-h-0 lg:overflow-auto">
      <div v-if="filteredEtats.length === 0" class="bg-white border border-dashed border-slate-200 rounded-2xl px-5 py-10 text-sm text-slate-400 italic text-center">
        Aucun signalement pour ce filtre.
      </div>

      <div v-else class="flex flex-col gap-3">
        <div v-for="group in groupedBySalle" :key="group.salle.id" class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <!-- Header salle (cliquable pour replier) -->
          <button
            type="button"
            class="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition cursor-pointer text-left"
            :class="{ 'border-b border-slate-100': !isCollapsed(group.salle.id) }"
            @click="toggleCollapse(group.salle.id)"
          >
            <div class="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
              <Icon name="material-symbols:meeting-room" size="20" class="text-sky-500" />
            </div>
            <div class="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <p class="text-sm font-semibold text-slate-800 leading-tight truncate">{{ group.salle.name }}</p>
              <span v-if="group.salle.adresse" class="text-[11px] text-slate-500 truncate inline-flex items-center gap-1">
                <Icon name="material-symbols:location-on-outline" size="12" class="shrink-0" />
                {{ group.salle.adresse }}
              </span>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
              {{ group.etats.length }} signalement{{ group.etats.length > 1 ? "s" : "" }}
            </span>
            <Icon :name="isCollapsed(group.salle.id) ? 'material-symbols:keyboard-arrow-down' : 'material-symbols:keyboard-arrow-up'" size="20" class="text-slate-400 shrink-0" />
          </button>

          <!-- Signalements -->
          <div v-if="!isCollapsed(group.salle.id)" class="flex flex-col gap-2 p-3 bg-slate-50/50">
            <ResaEtatCard
              v-for="etat in group.etats"
              :key="etat.id"
              :etat="etat"
              kind="salle"
              deletable
              @delete="askDelete"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
