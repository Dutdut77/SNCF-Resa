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

const typeIcon = computed(() => {
  const map = props.kind === "salle" ? SALLE_TYPE_ICONS : VEHICULE_TYPE_ICONS;
  return map[props.etat.type] ?? "material-symbols:info-outline";
});
</script>

<template>
  <article class="border border-slate-200 rounded-lg overflow-hidden bg-white">
    <div class="flex items-stretch">
      <!-- Bandeau type (largeur fixe + pleine hauteur) -->
      <div class="w-28 shrink-0 flex flex-col items-center justify-center gap-1 px-2 py-3 border-r text-[11px] font-semibold uppercase tracking-wide text-center" :class="TYPE_COLORS[etat.type]">
        <Icon :name="typeIcon" size="22" />
        <span class="leading-tight">{{ labelOfType(etat.type) }}</span>
      </div>

      <!-- Contenu -->
      <div class="flex-1 min-w-0 p-3 flex flex-col gap-1.5 justify-center">
        <div class="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500">
          <Icon name="material-symbols:person-outline" size="14" class="text-slate-400 shrink-0" />
          <span class="font-semibold text-slate-700">{{ etat.profiles?.prenom }} {{ etat.profiles?.nom }}</span>
          <span class="text-slate-300">·</span>
          <Icon name="material-symbols:schedule-outline" size="13" class="text-slate-400 shrink-0" />
          <span>{{ timestampToDateFr(new Date(etat.created_at).getTime()) }} à {{ timestampToHeure(new Date(etat.created_at).getTime()) }}</span>
        </div>
        <p v-if="etat.commentaire" class="text-sm text-slate-700 whitespace-pre-line">{{ etat.commentaire }}</p>
      </div>

      <!-- Photos (à droite) -->
      <div v-if="photos?.length" class="shrink-0 flex items-center p-2 border-l border-slate-100 bg-slate-50/40">
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="(photo, i) in photos"
            :key="photo.id"
            type="button"
            class="block p-0 border-0 bg-transparent cursor-pointer"
            @click.stop="openLightbox(i)"
          >
            <img :src="photo.url" class="size-12 object-cover rounded-md border border-slate-200 hover:border-sky-400 transition" />
          </button>
        </div>
      </div>

      <!-- Action supprimer -->
      <button
        v-if="deletable"
        type="button"
        class="shrink-0 px-4 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer border-l border-slate-100"
        title="Supprimer ce signalement"
        @click="emit('delete', etat)"
      >
        <Icon name="material-symbols:delete-outline" size="20" />
      </button>
    </div>

    <AppLightbox v-model:open="lightboxOpen" :images="photoUrls" :start-index="lightboxStart" />
  </article>
</template>
