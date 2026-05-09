<script setup>
definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});

useHead({
  title: "Mes réservations",
  description: "Liste de mes réservations",
});

const userProfil = useState("userProfil");
const { timestampToDateFr, timestampToHeure } = useFormatDate();
const { getAllSallesResaUser, allResaSallesUserAll } = useResaSalles();
const { getAllVehiculesResaUser, allResaVehiculesUserAll } = useResaVehicules();

const filter = ref("all");

const merged = computed(() => {
  const salles = (allResaSallesUserAll.value || []).map((r) => ({ ...r, _kind: "salle" }));
  const vehicules = (allResaVehiculesUserAll.value || []).map((r) => ({ ...r, _kind: "vehicule" }));
  return [...salles, ...vehicules].sort((a, b) => Number(b.debut) - Number(a.debut));
});

const now = ref(Date.now());
const upcoming = computed(() => merged.value.filter((r) => Number(r.fin) >= now.value));
const past = computed(() => merged.value.filter((r) => Number(r.fin) < now.value));

const filtered = computed(() => {
  if (filter.value === "vehicules") return merged.value.filter((r) => r._kind === "vehicule");
  if (filter.value === "salles") return merged.value.filter((r) => r._kind === "salle");
  return merged.value;
});

const upcomingFiltered = computed(() => filtered.value.filter((r) => Number(r.fin) >= now.value).sort((a, b) => Number(a.debut) - Number(b.debut)));
const pastFiltered = computed(() => filtered.value.filter((r) => Number(r.fin) < now.value));

const fmtPlage = (debut, fin) => {
  const dDeb = timestampToDateFr(debut);
  const hDeb = timestampToHeure(debut);
  const dFin = timestampToDateFr(fin);
  const hFin = timestampToHeure(fin);
  if (dDeb === dFin) return `${dDeb} · ${hDeb} → ${hFin}`;
  return `${dDeb} ${hDeb} → ${dFin} ${hFin}`;
};

const openResa = (resa) => {
  navigateTo({
    path: `/calendrier/${resa.id_secteur}`,
    query: { resa: String(resa.id), type: resa._kind === "vehicule" ? "1" : "2" },
  });
};

const anomalyOpen = ref(false);
const anomalyVehicule = ref(null);
const openAnomaly = (resa) => {
  anomalyVehicule.value = resa.vehicules;
  anomalyOpen.value = true;
};

const titleOf = (resa) => {
  if (resa._kind === "vehicule") {
    const v = resa.vehicules;
    return `${v?.marque ?? ""} ${v?.model ?? ""}`.trim() || "Véhicule";
  }
  return resa.titre || resa.salles?.name || "Salle";
};

onMounted(async () => {
  if (!userProfil.value) return;
  await Promise.all([getAllSallesResaUser(), getAllVehiculesResaUser()]);
  now.value = Date.now();
});
</script>

<template>
  <section class="w-full h-full overflow-auto">
    <div class="w-full px-4 pt-3 pb-6 lg:px-8 lg:pt-4 lg:pb-8 flex flex-col gap-4">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-xl bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center shrink-0">
          <Icon name="material-symbols:event-note-outline" size="22" class="text-white" />
        </div>
        <div>
          <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Espace personnel</p>
          <h1 class="text-xl font-bold text-slate-800 leading-tight">Mes réservations</h1>
        </div>
        <div class="ml-auto hidden sm:flex items-center gap-3 text-xs text-slate-500">
          <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-sky-500"></span>{{ upcoming.length }} à venir</span>
          <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-slate-300"></span>{{ past.length }} passées</span>
        </div>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-2">
        <button type="button" class="px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer" :class="filter === 'all' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'" @click="filter = 'all'">
          Toutes ({{ merged.length }})
        </button>
        <button type="button" class="px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5" :class="filter === 'vehicules' ? 'bg-sky-500 border-sky-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'" @click="filter = 'vehicules'">
          <Icon name="material-symbols:directions-car" size="14" /> Véhicules
        </button>
        <button type="button" class="px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5" :class="filter === 'salles' ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'" @click="filter = 'salles'">
          <Icon name="material-symbols:meeting-room-outline" size="14" /> Salles
        </button>
      </div>

      <!-- Empty global -->
      <div v-if="merged.length === 0" class="text-center py-16 text-slate-400 text-sm bg-white border border-dashed border-slate-200 rounded-xl">
        Vous n'avez encore aucune réservation.
      </div>

      <!-- À venir -->
      <template v-if="upcomingFiltered.length">
        <div class="flex items-center gap-2 pt-2">
          <Icon name="material-symbols:upcoming-outline" size="18" class="text-sky-600" />
          <h2 class="text-sm font-bold text-slate-700 uppercase tracking-wider">À venir</h2>
          <span class="text-xs text-slate-400">{{ upcomingFiltered.length }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="resa in upcomingFiltered" :key="`u-${resa._kind}-${resa.id}`" role="button" tabindex="0" class="w-full bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:border-sky-400 hover:shadow-sm transition cursor-pointer text-left" @click="openResa(resa)" @keydown.enter="openResa(resa)" @keydown.space.prevent="openResa(resa)">
            <div class="size-10 rounded-xl flex items-center justify-center shrink-0" :class="resa._kind === 'vehicule' ? 'bg-sky-500/10' : 'bg-purple-500/10'">
              <Icon :name="resa._kind === 'vehicule' ? 'material-symbols:directions-car' : 'material-symbols:meeting-room-outline'" size="22" :class="resa._kind === 'vehicule' ? 'text-sky-500' : 'text-purple-500'" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-sm font-semibold text-slate-800 truncate">{{ titleOf(resa) }}</p>
                <span v-if="resa._kind === 'vehicule' && resa.vehicules?.immat" class="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded font-mono text-[11px] font-bold tracking-wider shrink-0">{{ resa.vehicules.immat }}</span>
              </div>
              <p v-if="resa._kind === 'salle' && resa.salles" class="text-xs text-slate-500 mt-0.5">
                <span class="font-medium">{{ resa.salles.name }}</span>
                <span v-if="resa.salles.adresse" class="text-slate-400"> · {{ resa.salles.adresse }}</span>
              </p>
              <p class="text-xs text-slate-500 mt-0.5">{{ fmtPlage(resa.debut, resa.fin) }}</p>
              <p class="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Secteur · {{ resa.secteurs?.name }}</p>
            </div>
            <button v-if="resa._kind === 'vehicule' && resa.vehicules" type="button" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300 text-amber-700 transition cursor-pointer shrink-0" title="Signaler une anomalie sur ce véhicule" @click.stop="openAnomaly(resa)">
              <Icon name="material-symbols:warning-outline" size="16" class="shrink-0" />
              <span class="hidden sm:block text-[11px] font-semibold uppercase tracking-wider">Signaler</span>
            </button>
            <span class="px-2 py-1 rounded-md text-[11px] font-semibold shrink-0" :class="resa.is_validated == 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'">
              {{ resa.is_validated == 1 ? "Validée" : "En attente" }}
            </span>
          </div>
        </div>
      </template>

      <!-- Passées -->
      <template v-if="pastFiltered.length">
        <div class="flex items-center gap-2 pt-2">
          <Icon name="material-symbols:history" size="18" class="text-slate-400" />
          <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider">Passées</h2>
          <span class="text-xs text-slate-400">{{ pastFiltered.length }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="resa in pastFiltered" :key="`p-${resa._kind}-${resa.id}`" class="w-full bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 text-left opacity-60">
            <div class="size-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <Icon :name="resa._kind === 'vehicule' ? 'material-symbols:directions-car' : 'material-symbols:meeting-room-outline'" size="22" class="text-slate-500" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-sm font-semibold text-slate-700 truncate">{{ titleOf(resa) }}</p>
                <span v-if="resa._kind === 'vehicule' && resa.vehicules?.immat" class="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded font-mono text-[11px] font-bold tracking-wider shrink-0">{{ resa.vehicules.immat }}</span>
              </div>
              <p v-if="resa._kind === 'salle' && resa.salles" class="text-xs text-slate-500 mt-0.5">
                <span class="font-medium">{{ resa.salles.name }}</span>
                <span v-if="resa.salles.adresse" class="text-slate-400"> · {{ resa.salles.adresse }}</span>
              </p>
              <p class="text-xs text-slate-500 mt-0.5">{{ fmtPlage(resa.debut, resa.fin) }}</p>
              <p class="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Secteur · {{ resa.secteurs?.name }}</p>
            </div>
          </div>
        </div>
      </template>

      <!-- Empty filtered -->
      <div v-if="merged.length > 0 && upcomingFiltered.length === 0 && pastFiltered.length === 0" class="text-center py-12 text-slate-400 text-sm bg-white border border-dashed border-slate-200 rounded-xl">
        Aucune réservation pour ce filtre.
      </div>
    </div>

    <!-- Modale signalement (pilotée depuis chaque card véhicule) -->
    <ResaQuickAnomaly v-model:open="anomalyOpen" :vehicule="anomalyVehicule" :show-trigger="false" />
  </section>
</template>
