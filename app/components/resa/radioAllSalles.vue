<script setup>
const { setLoader } = useLoader();
const { getAllSallesBySecteur, allSallesSecteur } = useSalles();

const props = defineProps({
  data: {
    default: [],
  },

  modelValue: {
    default: "",
  },
});
const emits = defineEmits(["update:model-value"]);

setLoader(true);
await getAllSallesBySecteur(props.data.secteur.id);
setLoader(false);

const formRadio = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:model-value", value);
  },
});
</script>

<template>
  <div class="w-full h-fit grid grid-cols-1 lg:grid-cols-2 gap-2 px-4">
    <div v-if="allSallesSecteur.length > 0" class="relative w-full h-fit" v-for="(salle, index) in allSallesSecteur" :key="index">
      <input :id="salle.id" type="radio" v-model="formRadio" :value="salle" class="hidden peer" />
      <label :for="salle.id" class="rounded-lg shadow-lg overflow-hidden flex flex-col items-center border border-gray-200 justify-center bg-white hover:bg-opacity-75 peer-checked:text-white cursor-pointer transition">
        <div class="w-full h-30 cursor-pointer flex z-30">
          <div class="w-2/5 border-r text-lg p-2 flex items-center justify-center">{{ salle.name }}</div>
          <div class="w-3/5 flex flex-col gap-3 p-2">
            <div>
              <p class="font-bold text-sm">Adresse :</p>
              <p class="text-xs">{{ salle.adresse }}</p>
            </div>
            <div>
              <p class="font-bold text-sm">Informations :</p>
              <div class="grid grid-cols-3 gap-2 text-xs">
                <div class="flex gap-1">
                  <Icon name="material-symbols:group" size="16" />
                  <p>{{ salle.capacite }}</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:wifi" size="16" />
                  <p :class="salle.wifi ? '' : 'line-through  decoration-slate-900 decoration-2'">Wifi</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:accessible" size="16" />
                  <p :class="salle.pmr ? '' : 'line-through  decoration-slate-900 decoration-2'">PMR</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:ac-unit" size="16" />
                  <p :class="salle.clim ? '' : 'line-through  decoration-slate-900 decoration-2'">Clim</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:connected-tv" size="16" />
                  <p :class="salle.video_proj ? '' : 'line-through decoration-slate-900  decoration-2 '">VP</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:headset-mic" size="16" />
                  <p :class="salle.jabra ? '' : 'line-through  decoration-slate-900 decoration-2'">Jabra</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:draw" size="16" />
                  <p :class="salle.white_board ? '' : 'line-through  decoration-slate-900 decoration-2'">Tableau</p>
                </div>
                <div class="flex gap-1">
                  <Icon name="material-symbols:videocam" size="16" />
                  <p :class="salle.webcam ? '' : 'line-through  decoration-slate-900 decoration-2'">Webcam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </label>
      <div class="absolute top-0 left-0 w-0 h-full bg-gradient-to-br from-sky-700 to-sky-500 peer-checked:shadow-sky-500/30 peer-checked:w-full transition-all duration-300 rounded-lg shadow-lg overflow-hidden"></div>
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
