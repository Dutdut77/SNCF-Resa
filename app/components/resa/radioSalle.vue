<script setup>
const { setLoader } = useLoader();
const { getAllSallesSecteurDispo, salles } = useSalles();
const { getAllResaSallesSecteurTime, allResaSallesSecteurTime } = useResaSalles();

const props = defineProps(["data", "modelValue"]);
const emits = defineEmits(["update:model-value"]);

setLoader(true);
await getAllSallesSecteurDispo(props.data.secteur);
await getAllResaSallesSecteurTime(props.data.secteur, props.data.dateDebut, props.data.dateFin);
setLoader(false);

const formRadio = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:model-value", value);
  },
});

const dispoSalles = computed(() => {
  const filteredReservations = allResaSallesSecteurTime.value.filter((item) => item.id !== props.data.updateRadioId);
  const reservedSalleIds = new Set(filteredReservations.map((reservation) => reservation.id_salle));
  const availableSalles = salles.value.filter((salle) => !reservedSalleIds.has(salle.id));
  return availableSalles;
});

watch(props.data, async (newValue, oldValue) => {
  await getAllResaSallesSecteurTime(props.data.secteur, props.data.dateDebut, props.data.dateFin);
});
</script>

<template>
  <div class="w-full h-fit grid grid-cols-1 lg:grid-cols-2 gap-2">
    <template v-if="dispoSalles.length > 0">
      <div v-for="(salle, index) in dispoSalles" :key="index" class="relative w-full">
        <input :id="salle.id" type="radio" v-model="formRadio" :value="salle.id" class="hidden peer" />
        <label
          :for="salle.id"
          class="block rounded-xl border-2 border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm peer-checked:border-sky-500 peer-checked:bg-sky-50/60 peer-checked:shadow-md peer-checked:shadow-sky-100/60 cursor-pointer transition-all duration-200 p-3"
        >
          <!-- Nom + adresse -->
          <div class="mb-2.5">
            <p class="font-semibold text-slate-800 text-sm leading-tight">{{ salle.name }}</p>
            <p v-if="salle.adresse" class="text-[10px] text-slate-400 mt-0.5 truncate">{{ salle.adresse }}</p>
          </div>
          <!-- Capacité + features -->
          <div class="flex flex-wrap gap-1.5">
            <!-- Capacité toujours visible -->
            <span class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700">
              <Icon name="material-symbols:group" size="12" />
              {{ salle.capacite }}
            </span>
            <!-- Features : visible seulement si actif -->
            <span v-if="salle.wifi" class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Icon name="material-symbols:wifi" size="12" />Wifi
            </span>
            <span v-if="salle.pmr" class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Icon name="material-symbols:accessible" size="12" />PMR
            </span>
            <span v-if="salle.clim" class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Icon name="material-symbols:ac-unit" size="12" />Clim
            </span>
            <span v-if="salle.video_proj" class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Icon name="material-symbols:connected-tv" size="12" />VP
            </span>
            <span v-if="salle.jabra" class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Icon name="material-symbols:headset-mic" size="12" />Jabra
            </span>
            <span v-if="salle.white_board" class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Icon name="material-symbols:draw" size="12" />Tableau
            </span>
            <span v-if="salle.webcam" class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Icon name="material-symbols:videocam" size="12" />Webcam
            </span>
          </div>
        </label>
        <!-- Indicateur sélectionné -->
        <div class="absolute top-2.5 right-3 size-5 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 delay-75 pointer-events-none">
          <Icon name="material-symbols:check" size="12" class="text-white" />
        </div>
      </div>
    </template>
    <p v-else class="text-sm text-slate-400 italic">Aucune salle disponible.</p>
  </div>
</template>
