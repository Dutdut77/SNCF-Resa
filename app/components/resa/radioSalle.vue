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
// console.log("data : ", props.data);

const dispoSalles = computed(() => {
  // Créer un ensemble (Set) des id_salle réservés

  const filteredReservations = allResaSallesSecteurTime.value.filter((item) => item.id !== props.data.updateRadioId);

  const reservedSalleIds = new Set(filteredReservations.map((reservation) => reservation.id_salle));

  // if (props.data.salle) {
  //   reservedSalleIds.delete(props.data.updateRadioId);
  // }
  // Filtrer les salles qui ne sont pas réservés
  const availableSalles = salles.value.filter((salle) => !reservedSalleIds.has(salle.id));

  return availableSalles;
});

watch(props.data, async (newValue, oldValue) => {
  await getAllResaSallesSecteurTime(props.data.secteur, props.data.dateDebut, props.data.dateFin);
});
</script>

<template>
  <div class="w-full h-fit grid grid-cols-1 lg:grid-cols-2 gap-2 px-4">
    <div v-if="dispoSalles.length > 0" class="relative w-full h-fit" v-for="(salle, index) in dispoSalles" :key="index">
      <input :id="salle.id" type="radio" v-model="formRadio" :value="salle.id" class="hidden peer" />
      <label :for="salle.id" class="rounded-lg shadow-lg overflow-hidden flex flex-col items-center border border-gray-200 justify-center bg-white hover:bg-opacity-75 peer-checked:text-white cursor-pointer transition">
        <div class="w-full h-30 cursor-pointer flex z-30">
          <div class="w-2/5 border-r text-lg p-2 flex flex-col items-center justify-center gap-2">
            <p>{{ salle.name }}</p>
            <div class="mt-auto">
              <!-- <p class="font-bold text-sm">Adresse :</p> -->
              <p class="text-xs italic text-center">{{ salle.adresse }}</p>
            </div>
          </div>
          <div class="w-3/5 flex flex-col gap-3 p-2">
            <!-- <div>
              <p class="font-bold text-sm">Adresse :</p>
              <p class="text-xs">{{ salle.adresse }}</p>
            </div> -->
            <div>
              <p class="font-bold text-sm">Informations :</p>
              <div class="grid grid-cols-3 gap-2 text-xs pt-1">
                <div class="flex gap-1">
                  <Icon name="material-symbols:group" class="w-4 h-4" />
                  <p>{{ salle.capacite }}</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:wifi" class="w-4 h-4" />
                  <p :class="salle.wifi ? '' : 'line-through  decoration-slate-900 decoration-2'">Wifi</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:accessible" class="w-4 h-4" />
                  <p :class="salle.pmr ? '' : 'line-through  decoration-slate-900 decoration-2'">PMR</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:ac-unit" class="w-4 h-4" />
                  <p :class="salle.clim ? '' : 'line-through  decoration-slate-900 decoration-2'">Clim</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:connected-tv" class="w-4 h-4" />
                  <p :class="salle.video_proj ? '' : 'line-through decoration-slate-900  decoration-2 '">VP</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:headset-mic" class="w-4 h-4" />
                  <p :class="salle.jabra ? '' : 'line-through  decoration-slate-900 decoration-2'">Jabra</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:draw" class="w-4 h-4" />
                  <p :class="salle.white_board ? '' : 'line-through  decoration-slate-900 decoration-2'">Tableau</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:videocam" class="w-4 h-4" />
                  <p :class="salle.webcam ? '' : 'line-through  decoration-slate-900 decoration-2'">Webcam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </label>
      <div class="absolute top-0 left-0 w-0 h-full bg-sky-500 peer-checked:shadow-sky-500/30 peer-checked:w-full transition-all duration-300 rounded-lg shadow-lg overflow-hidden"></div>
      <div class="flex absolute top-2 right-2 bottom-0 w-5 h-5 text-white rounded-full border-2 scale-0 peer-checked:scale-100 transition delay-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-3 text my-auto mx-auto" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
        </svg>
      </div>
    </div>
    <div v-else class="italic">Aucune salle de disponible.</div>
  </div>
</template>

<style></style>
