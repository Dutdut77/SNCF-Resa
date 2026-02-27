<script setup>
const { setLoader } = useLoader();
const { getAllSecteurDispo, vehicules } = useVehicules();
const { getAllResaSecteurTime, allResaSecteurTime } = useResaVehicules();
const userProfil = useState("userProfil");

const props = defineProps(["data", "modelValue"]);

const emits = defineEmits(["update:model-value"]);

setLoader(true);
await getAllSecteurDispo(props.data.secteur);
await getAllResaSecteurTime(props.data.secteur, props.data.dateDebut, props.data.dateFin);
setLoader(false);

const formRadio = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:model-value", value);
  },
});

// Vérifie si l'utilisateur est valideur pour ce secteur
const isValideur = computed(() => {
  if (!userProfil.value?.secteur_auth) return false;
  return userProfil.value.secteur_auth.split(",").includes(String(props.data.secteur));
});

const dispoVehicules = computed(() => {
  const filteredReservations = allResaSecteurTime.value.filter((item) => item.id !== props.data.updateRadioId);
  const reservedVehicleIds = new Set(filteredReservations.map((reservation) => reservation.id_vehicule));
  const availableVehicules = vehicules.value.filter((vehicle) => {
    if (reservedVehicleIds.has(vehicle.id)) return false;
    // Masquer les véhicules à accès restreint pour les non-valideurs
    if (vehicle.acces_restreint == 1 && !isValideur.value) return false;
    return true;
  });
  return availableVehicules;
});

watch(props.data, async (newValue, oldValue) => {
  await getAllResaSecteurTime(props.data.secteur, props.data.dateDebut, props.data.dateFin);
});
</script>

<template>
  <div class="w-full h-fit grid grid-cols-1 xl:grid-cols-2 gap-2">
    <template v-if="dispoVehicules.length > 0">
      <div v-for="(vehicule, index) in dispoVehicules" :key="index" class="relative w-full">
        <input :id="vehicule.id" type="radio" v-model="formRadio" :value="vehicule.id" class="hidden peer" />
        <label :for="vehicule.id" class="block rounded-xl border-2 border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm peer-checked:border-sky-500 peer-checked:bg-sky-50/60 peer-checked:shadow-md peer-checked:shadow-sky-100/60 cursor-pointer transition-all duration-200 p-3">
          <!-- Marque / Modèle + immat -->
          <div class="flex items-start justify-between gap-2 mb-2.5">
            <div>
              <p class="text-[10px] text-slate-400 uppercase tracking-wide">{{ vehicule.marque }}</p>
              <p class="font-semibold text-slate-800 text-sm leading-tight">{{ vehicule.model }}</p>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0">
              <span class="font-mono text-[11px] font-bold px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md">
                {{ vehicule.immat }}
              </span>
              <span v-if="vehicule.acces_restreint == 1" class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 border border-amber-200 text-amber-600">
                <Icon name="material-symbols:lock" size="11" />
                Valideurs
              </span>
            </div>
          </div>
          <!-- Specs -->
          <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            <div class="flex gap-1 items-center">
              <Icon name="material-symbols:group" size="13" class="text-slate-400" />
              <span>{{ vehicule.capacite }} places</span>
            </div>
            <div v-if="vehicule.id_carburant == 1" class="flex gap-1 items-center">
              <Icon name="material-symbols:bolt" size="13" class="text-emerald-500" />
              <span>Électrique</span>
            </div>
            <div v-if="vehicule.id_carburant == 2" class="flex gap-1 items-center">
              <Icon name="material-symbols:local-gas-station" size="13" class="text-emerald-500" />
              <span>Diesel</span>
            </div>
            <div v-if="vehicule.id_carburant == 3" class="flex gap-1 items-center">
              <Icon name="material-symbols:local-gas-station" size="13" class="text-emerald-50 0" />
              <span>Essence</span>
            </div>
            <div v-if="vehicule.vitesse == 0" class="flex gap-1 items-center">
              <span class="size-3.5 border border-slate-400 rounded text-[9px] font-bold text-slate-500 flex items-center justify-center">A</span>
              <span>Auto</span>
            </div>
            <div v-if="vehicule.vitesse == 1" class="flex gap-1 items-center">
              <Icon name="material-symbols:tune" size="13" class="text-slate-400" />
              <span>Manuel</span>
            </div>
          </div>
        </label>
        <!-- Indicateur sélectionné -->
        <div class="absolute bottom-2.5 right-3 size-5 rounded-full bg-sky-500 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-150 delay-75 pointer-events-none">
          <Icon name="material-symbols:check" size="12" class="text-white" />
        </div>
      </div>
    </template>
    <p v-else class="text-sm text-slate-400 italic">Aucun véhicule disponible.</p>
  </div>
</template>
