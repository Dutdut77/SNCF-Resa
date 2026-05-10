<script setup>
const props = defineProps({
  salle: {
    type: Object,
    required: true,
  },
  defaultOpenForm: {
    type: Boolean,
    default: false,
  },
});

const {
  etatsBySalle,
  ETAT_TYPES,
  getEtatsBySalle,
  addEtat,
} = useSalleEtats();

const showForm = ref(props.defaultOpenForm);
const submitting = ref(false);
const form = reactive({
  type: 1,
  commentaire: "",
  files: [],
});
const previews = ref([]);
const fileInput = ref(null);

const TYPE_ICONS = {
  1: "material-symbols:settings-alert-outline",
  2: "material-symbols:chair-outline",
  3: "material-symbols:cleaning-services-outline",
  4: "material-symbols:ac-unit",
  5: "material-symbols:info-outline",
};

const formValid = computed(() => {
  if (!form.type) return false;
  if (form.type == 5 && !form.commentaire?.trim()) return false;
  return true;
});

const onFiles = (e) => {
  const list = Array.from(e.target.files || []);
  if (list.length === 0) return;
  form.files = [...form.files, ...list];
  previews.value = [
    ...previews.value,
    ...list.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
  ];
  if (fileInput.value) fileInput.value.value = "";
};

const removeFile = (index) => {
  URL.revokeObjectURL(previews.value[index].url);
  previews.value.splice(index, 1);
  form.files = form.files.filter((_, i) => i !== index);
};

const resetForm = () => {
  form.type = 1;
  form.commentaire = "";
  form.files = [];
  previews.value.forEach((p) => URL.revokeObjectURL(p.url));
  previews.value = [];
  if (fileInput.value) fileInput.value.value = "";
};

const cancelForm = () => {
  resetForm();
  showForm.value = false;
};

const submit = async () => {
  if (!formValid.value || submitting.value) return;
  submitting.value = true;
  await addEtat({
    id_salle: props.salle.id,
    type: form.type,
    commentaire: form.commentaire,
    files: form.files,
  });
  submitting.value = false;
  resetForm();
  showForm.value = false;
};

onMounted(async () => {
  await getEtatsBySalle(props.salle.id);
});

onBeforeUnmount(() => {
  previews.value.forEach((p) => URL.revokeObjectURL(p.url));
});
</script>

<template>
  <div class="w-full flex flex-col gap-4 px-4 pb-4">
    <!-- Bandeau titre / action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-200">
      <div class="flex items-center gap-2">
        <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wider">État de la salle</h3>
        <span v-if="etatsBySalle.length" class="text-xs text-slate-400">({{ etatsBySalle.length }})</span>
      </div>
      <button
        v-if="!showForm"
        type="button"
        class="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
        @click="showForm = true"
      >
        <Icon name="material-symbols:add" size="16" />
        Signaler un état
      </button>
    </div>

    <!-- Historique (en haut) -->
    <div v-if="etatsBySalle.length === 0" class="text-center text-sm text-slate-400 py-6 border border-dashed border-slate-200 rounded-lg">
      Aucun signalement pour cette salle.
    </div>

    <div v-else class="flex flex-col gap-2">
      <ResaEtatCard v-for="etat in etatsBySalle" :key="etat.id" :etat="etat" kind="salle" />
    </div>

    <!-- Formulaire (en bas, séparé par un trait pointillé) -->
    <div v-if="showForm" class="flex flex-col gap-5 pt-5 border-t border-dashed border-slate-300">
      <!-- Type -->
      <div class="flex flex-col gap-2">
        <label class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Type d'anomalie</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            v-for="t in ETAT_TYPES"
            :key="t.value"
            type="button"
            class="flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition cursor-pointer"
            :class="form.type == t.value ? 'bg-sky-500 border-sky-500 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'"
            @click="form.type = t.value"
          >
            <Icon :name="TYPE_ICONS[t.value]" size="18" class="shrink-0" />
            <span class="font-medium">{{ t.label }}</span>
          </button>
        </div>
      </div>

      <!-- Commentaire -->
      <div class="flex flex-col gap-2">
        <label class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Commentaire <span v-if="form.type == 5" class="text-red-500 normal-case">*</span>
          <span v-else class="text-slate-400 font-normal normal-case">(optionnel)</span>
        </label>
        <textarea
          v-model="form.commentaire"
          rows="3"
          class="w-full appearance-none border border-slate-200 bg-white text-sm rounded-lg py-2.5 px-3 text-slate-700 leading-relaxed focus:outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 placeholder:text-slate-400 resize-none"
          :placeholder="form.type == 5 ? 'Précisez le problème…' : 'Décrivez si nécessaire…'"
        ></textarea>
      </div>

      <!-- Photos -->
      <div class="flex flex-col gap-2">
        <label class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Photos <span class="text-slate-400 font-normal normal-case">(optionnel)</span>
        </label>
        <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFiles" />
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          <div v-for="(p, i) in previews" :key="p.url" class="relative aspect-square group">
            <img :src="p.url" class="w-full h-full object-cover rounded-lg border border-slate-200" />
            <button
              type="button"
              class="absolute top-1 right-1 size-6 rounded-full bg-slate-900/70 hover:bg-red-600 text-white flex items-center justify-center shadow transition cursor-pointer"
              title="Retirer cette photo"
              @click="removeFile(i)"
            >
              <Icon name="material-symbols:close" size="14" />
            </button>
          </div>
          <button
            type="button"
            class="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50/50 transition cursor-pointer"
            @click="fileInput?.click()"
          >
            <Icon name="material-symbols:add-photo-alternate-outline" size="24" />
            <span class="text-[10px] uppercase font-semibold tracking-wider">Ajouter</span>
          </button>
        </div>
      </div>

      <!-- Actions du formulaire -->
      <div class="flex justify-end gap-2 pt-1">
        <AppButtonValidated class="w-28" theme="cancel" :type="'button'" @click="cancelForm">
          <template #default>Annuler</template>
        </AppButtonValidated>
        <AppButtonValidated class="w-32" :validated="formValid && !submitting" :loading="submitting" :type="'button'" @click="submit">
          <template #default>Enregistrer</template>
        </AppButtonValidated>
      </div>
    </div>
  </div>
</template>
