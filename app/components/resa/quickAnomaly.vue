<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "button", // 'button' (desktop) ou 'menuItem' (drawer mobile)
  },
  vehicule: {
    type: Object,
    default: null, // si fourni, on saute le picker et on ouvre directement le formulaire
  },
  open: {
    type: Boolean,
    default: undefined, // mode contrôlé via v-model:open
  },
  showTrigger: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["open", "update:open"]);

const { allVehicules, getAllVehicules } = useVehicules();
const { secteurs, getAll: getAllSecteurs } = useSecteurs();

const internalOpen = ref(false);
const isControlled = computed(() => props.open !== undefined);

const modalOpen = computed({
  get() {
    return isControlled.value ? props.open : internalOpen.value;
  },
  set(v) {
    if (isControlled.value) emit("update:open", v);
    else internalOpen.value = v;
  },
});

const selectedId = ref("");

function secteurName(id) {
  return secteurs.value?.find((s) => s.id == id)?.name ?? "";
}

const sortedVehicules = computed(() =>
  [...(allVehicules.value || [])].sort((a, b) => {
    const sa = secteurName(a.id_secteur).localeCompare(secteurName(b.id_secteur));
    if (sa !== 0) return sa;
    return `${a.marque ?? ""} ${a.model ?? ""}`.localeCompare(`${b.marque ?? ""} ${b.model ?? ""}`);
  })
);

const selectedVehicule = computed(() => {
  if (props.vehicule) return props.vehicule;
  return (allVehicules.value || []).find((v) => v.id == selectedId.value);
});

const ensureLoaded = async () => {
  if (props.vehicule) return;
  if (!secteurs.value || secteurs.value.length === 0) await getAllSecteurs();
  if (!allVehicules.value || allVehicules.value.length === 0) await getAllVehicules();
};

const openModal = async () => {
  emit("open");
  modalOpen.value = true;
  await ensureLoaded();
};

const closeModal = () => {
  modalOpen.value = false;
  selectedId.value = "";
};

watch(modalOpen, async (val) => {
  if (val) await ensureLoaded();
  else selectedId.value = "";
});
</script>

<template>
  <button
    v-if="showTrigger && variant === 'button'"
    type="button"
    class="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 transition-colors cursor-pointer"
    title="Signaler une anomalie"
    @click="openModal"
  >
    <Icon name="material-symbols:warning-outline" size="20" class="text-amber-600 shrink-0" />
    <span class="hidden lg:block font-semibold uppercase text-xs text-amber-700 tracking-wider">Signaler</span>
  </button>
  <button
    v-else-if="showTrigger"
    type="button"
    class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer border border-amber-400/30 bg-amber-500/5"
    @click="openModal"
  >
    <Icon name="material-symbols:warning-outline" size="20" class="shrink-0" />
    Signaler une anomalie
  </button>

  <AppModal v-if="modalOpen" :closeModal="closeModal">
    <template #title>
      <div class="flex items-center gap-3 w-full">
        <div class="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <Icon name="material-symbols:warning-outline" size="22" class="text-amber-500" />
        </div>
        <div>
          <p class="text-[10px] text-slate-400 uppercase tracking-wider font-normal">Signalement</p>
          <p class="text-base font-semibold text-slate-800 leading-tight">
            <template v-if="vehicule">{{ vehicule.marque }} {{ vehicule.model }} · {{ vehicule.immat }}</template>
            <template v-else>Anomalie véhicule</template>
          </p>
        </div>
      </div>
    </template>
    <template #default>
      <div class="w-full flex flex-col gap-4 px-4 pb-4">
        <AppSelect v-if="!vehicule" name="anomalyVehicule" title="Véhicule concerné :" v-model="selectedId">
          <template #options>
            <option value="" disabled hidden>— Sélectionnez un véhicule —</option>
            <option v-for="v in sortedVehicules" :key="v.id" :value="v.id">
              [{{ secteurName(v.id_secteur) }}] {{ v.marque }} {{ v.model }} · {{ v.immat }}
            </option>
          </template>
        </AppSelect>

        <div v-if="!selectedVehicule" class="text-center text-sm text-slate-400 py-6 border border-dashed border-slate-200 rounded-xl">
          Choisissez un véhicule pour signaler son état.
        </div>

        <ResaVehiculeEtats
          v-else
          :key="selectedVehicule.id"
          :vehicule="selectedVehicule"
          :default-open-form="true"
        />
      </div>
    </template>
  </AppModal>
</template>
