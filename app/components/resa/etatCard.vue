<script setup>
const props = defineProps({
  etat: { type: Object, required: true },
  deletable: { type: Boolean, default: false },
  kind: { type: String, default: "vehicule" }, // 'vehicule' | 'salle'
});

const emit = defineEmits(["delete"]);

const { timestampToDateFr, timestampToHeure } = useFormatDate();

const vehiculeEtats = useVehiculeEtats();
const salleEtats = useSalleEtats();
const source = computed(() => (props.kind === "salle" ? salleEtats : vehiculeEtats));

const labelOfType = (type) => source.value.labelOfType(type);

const photos = computed(() =>
  props.kind === "salle" ? props.etat.salle_etat_photos : props.etat.vehicule_etat_photos,
);

const photoUrls = computed(() => (photos.value || []).map((p) => p.url));

const lightboxOpen = ref(false);
const lightboxStart = ref(0);

const openLightbox = (i) => {
  lightboxStart.value = i;
  lightboxOpen.value = true;
};

const VEHICULE_TYPE_ICONS = {
  1: "material-symbols:car-crash-outline",
  2: "material-symbols:tire-repair-outline",
  3: "material-symbols:broken-image-outline",
  4: "material-symbols:build-outline",
  5: "material-symbols:info-outline",
};

const SALLE_TYPE_ICONS = {
  1: "material-symbols:settings-alert-outline",
  2: "material-symbols:chair-outline",
  3: "material-symbols:cleaning-services-outline",
  4: "material-symbols:ac-unit",
  5: "material-symbols:info-outline",
};

const TYPE_COLORS = {
  1: "bg-red-50 border-red-200 text-red-700",
  2: "bg-amber-50 border-amber-200 text-amber-700",
  3: "bg-orange-50 border-orange-200 text-orange-700",
  4: "bg-sky-50 border-sky-200 text-sky-700",
  5: "bg-slate-50 border-slate-200 text-slate-700",
};

const TYPE_TEXT_COLORS = {
  1: "text-red-700",
  2: "text-amber-700",
  3: "text-orange-700",
  4: "text-sky-700",
  5: "text-slate-700",
};

const typeIcon = computed(() => {
  const map = props.kind === "salle" ? SALLE_TYPE_ICONS : VEHICULE_TYPE_ICONS;
  return map[props.etat.type] ?? "material-symbols:info-outline";
});
</script>

<template>
  <article class="border border-slate-200 rounded-lg overflow-hidden bg-white">
    <!-- En-tête : type + auteur/date + supprimer -->
    <div class="flex items-center gap-3 p-3" :class="(etat.commentaire || photos?.length) ? 'border-b border-slate-100' : ''">
      <div class="size-10 rounded-lg flex items-center justify-center shrink-0 border" :class="TYPE_COLORS[etat.type]">
        <Icon :name="typeIcon" size="20" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[11px] font-bold uppercase tracking-wider leading-tight" :class="TYPE_TEXT_COLORS[etat.type]">{{ labelOfType(etat.type) }}</p>
        <div class="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500 mt-0.5">
          <Icon name="material-symbols:person-outline" size="13" class="text-slate-400 shrink-0" />
          <span class="font-semibold text-slate-700 truncate">{{ etat.profiles?.prenom }} {{ etat.profiles?.nom }}</span>
          <span class="text-slate-300">·</span>
          <Icon name="material-symbols:schedule-outline" size="12" class="text-slate-400 shrink-0" />
          <span>{{ timestampToDateFr(new Date(etat.created_at).getTime()) }} · {{ timestampToHeure(new Date(etat.created_at).getTime()) }}</span>
        </div>
      </div>
      <button
        v-if="deletable"
        type="button"
        class="shrink-0 size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
        title="Supprimer ce signalement"
        @click="emit('delete', etat)"
      >
        <Icon name="material-symbols:delete-outline" size="20" />
      </button>
    </div>

    <!-- Commentaire -->
    <p v-if="etat.commentaire" class="text-sm text-slate-700 whitespace-pre-line px-3 pt-3" :class="photos?.length ? '' : 'pb-3'">{{ etat.commentaire }}</p>

    <!-- Photos en pleine largeur -->
    <div v-if="photos?.length" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 p-3">
      <button
        v-for="(photo, i) in photos"
        :key="photo.id"
        type="button"
        class="aspect-square block p-0 border-0 bg-transparent cursor-pointer"
        @click.stop="openLightbox(i)"
      >
        <img :src="photo.url" class="w-full h-full object-cover rounded-md border border-slate-200 hover:border-sky-400 transition" />
      </button>
    </div>

    <AppLightbox v-model:open="lightboxOpen" :images="photoUrls" :start-index="lightboxStart" />
  </article>
</template>
