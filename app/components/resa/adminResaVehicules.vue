<script setup>
const { setLoader } = useLoader();
const userProfil = useState("userProfil");
const { timestampToDateFr, timestampToHeure } = useFormatDate();
const { getAllVehiculesResaSecteurActuel, deleteResaVehicule, validResaVehicule, allResaSecteurActuel } = useResaVehicules();
const { getAllProfiles, addValideur, deleteValideur, addAdmin, deleteAdmin, allProfiles } = useAuth();
const { sendEmailValidationVehicule, sendEmailRefusVehicule } = useEmail();

const sideModalResaVehicule = ref(false);
const resaVehiculeForm = ref({});

setLoader(true);
await getAllVehiculesResaSecteurActuel(userProfil.value.secteur_admin);
await getAllProfiles();
setLoader(false);

const nameReservationVehicule = computed(() => {
  const found = allProfiles.value.find((user) => user.id === resaVehiculeForm.value.id_user);
  if (found) {
    return found; // Si l'utilisateur est trouvé, on le stocke
  } else {
    return ""; // Si aucun utilisateur n'est trouvé, on réinitialise
  }
});

const showSideResaVehicule = (data) => {
  if (data) {
    resaVehiculeForm.value = data;
  } else {
    resaVehiculeForm.value = {};
  }
  sideModalResaVehicule.value = !sideModalResaVehicule.value;
};

const validerResaVehicule = async (data) => {
  setLoader(true);
  await validResaVehicule(data.id);
  await getAllVehiculesResaSecteurActuel(userProfil.value.secteur_admin);
  await sendEmailValidationVehicule(data);
  sideModalResaVehicule.value = false;
  setLoader(false);
};

const supprimerResaVehicule = async (data) => {
  setLoader(true);
  await deleteResaVehicule(data.id);
  await getAllVehiculesResaSecteurActuel(userProfil.value.secteur_admin);
  await sendEmailRefusVehicule(data);
  sideModalResaVehicule.value = false;
  setLoader(false);
};
</script>

<template>
  <section class="w-full h-full flex flex-col gap-5 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
        <Icon name="material-symbols:directions-car" size="22" class="text-sky-500" />
      </div>
      <div>
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Véhicules</p>
        <p class="text-xl font-bold text-slate-800 leading-tight">Réservations véhicules</p>
      </div>
    </div>

    <!-- Table -->
    <div class="w-full overflow-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
      <table v-if="allResaSecteurActuel.length > 0" class="w-full">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Immat</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Réservé par</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Début</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fin</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Observation</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr class="hover:bg-sky-50/30 transition-colors" v-for="data in allResaSecteurActuel" :key="data.id">
            <td class="px-5 py-3">
              <span class="font-mono text-xs font-bold px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-md">{{ data.vehicules.immat }}</span>
            </td>
            <td class="px-4 py-3 text-sm text-slate-700">{{ data.profiles.nom }} {{ data.profiles.prenom }}</td>
            <td class="px-4 py-3 text-xs text-slate-600 text-center whitespace-nowrap">{{ timestampToDateFr(data.debut) }}</td>
            <td class="px-4 py-3 text-xs text-slate-600 text-center whitespace-nowrap">{{ timestampToDateFr(data.fin) }}</td>
            <td class="px-4 py-3 text-xs text-slate-500 text-center">{{ data.titre }}</td>
            <td class="px-4 py-3 text-center">
              <span v-if="data.is_validated == 1" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Icon name="material-symbols:check-circle" size="11" />
                Validée
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                <Icon name="material-symbols:schedule" size="11" />
                En attente
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-1.5 justify-center">
                <button v-if="data.is_validated == 0" class="size-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 flex items-center justify-center transition-colors" @click="validerResaVehicule(data)">
                  <Icon name="material-symbols:check-circle" size="16" />
                </button>
                <button class="size-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors" @click="supprimerResaVehicule(data)">
                  <Icon name="material-symbols:delete" size="16" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="px-5 py-8 text-sm text-slate-400 italic text-center">Aucune réservation en cours.</div>
    </div>

    <AppModalSide :sideModal="sideModalResaVehicule" :closeSideModal="showSideResaVehicule">
      <template #default>
        <AppModalSideContent v-if="sideModalResaVehicule" :closeSideModal="showSideResaVehicule">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Icon name="material-symbols:directions-car" size="20" class="text-white" />
              </div>
              <div>
                <p class="text-[10px] text-white/70 uppercase tracking-wider">Réservation</p>
                <p class="text-base font-semibold text-white leading-tight">Véhicule</p>
              </div>
            </div>
          </template>
          <template #default>
            <div class="flex flex-col gap-4">
              <!-- Demandeur -->
              <div>
                <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                  <Icon name="material-symbols:person-outline-rounded" size="14" class="text-sky-500" />
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Demandeur</p>
                </div>
                <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div class="size-10 rounded-full bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm shrink-0 uppercase">
                    {{ nameReservationVehicule.prenom?.[0] ?? "" }}{{ nameReservationVehicule.nom?.[0] ?? "" }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-slate-800 truncate">{{ nameReservationVehicule.nom }} {{ nameReservationVehicule.prenom }}</p>
                    <p class="text-xs text-slate-500 truncate">{{ nameReservationVehicule.email }}</p>
                  </div>
                </div>
              </div>

              <!-- Véhicule -->
              <div>
                <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                  <Icon name="material-symbols:directions-car" size="14" class="text-sky-500" />
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Véhicule réservé</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <p class="text-[10px] text-slate-400 uppercase tracking-wide">{{ resaVehiculeForm.vehicules.marque }}</p>
                      <p class="font-semibold text-slate-800">{{ resaVehiculeForm.vehicules.model }}</p>
                    </div>
                    <span class="font-mono text-xs font-bold px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-md shrink-0">{{ resaVehiculeForm.vehicules.immat }}</span>
                  </div>
                </div>
              </div>

              <!-- Période -->
              <div>
                <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                  <Icon name="material-symbols:calendar-month" size="14" class="text-sky-500" />
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Période</p>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex-1 text-center bg-sky-50 border border-sky-200 rounded-xl p-3">
                    <p class="text-[10px] text-sky-500 font-semibold uppercase tracking-wide">Début</p>
                    <p class="text-sm font-semibold text-slate-800 mt-0.5">{{ timestampToDateFr(resaVehiculeForm.debut) }}</p>
                    <p class="text-xs text-slate-500">{{ timestampToHeure(resaVehiculeForm.debut) }}</p>
                  </div>
                  <Icon name="material-symbols:arrow-forward" size="16" class="text-slate-300 shrink-0" />
                  <div class="flex-1 text-center bg-sky-50 border border-sky-200 rounded-xl p-3">
                    <p class="text-[10px] text-sky-500 font-semibold uppercase tracking-wide">Fin</p>
                    <p class="text-sm font-semibold text-slate-800 mt-0.5">{{ timestampToDateFr(resaVehiculeForm.fin) }}</p>
                    <p class="text-xs text-slate-500">{{ timestampToHeure(resaVehiculeForm.fin) }}</p>
                  </div>
                </div>
              </div>

              <!-- Alerte validation -->
              <div v-if="resaVehiculeForm.is_validated == 0" class="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <Icon name="material-symbols:warning-rounded" size="18" class="text-amber-500 shrink-0 mt-0.5" />
                <p class="text-xs text-amber-700 leading-relaxed">Cette réservation n'est pas encore validée. Validez-la pour que le demandeur reçoive sa confirmation par email.</p>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex gap-3 w-full justify-end">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideResaVehicule()"><template #default>Annuler</template></AppButtonValidated>
              <AppButtonValidated v-if="resaVehiculeForm.is_validated == 0" class="md:w-32 w-full text-sm" theme="" @click="validerResaVehicule(resaVehiculeForm)"><template #default>Valider</template></AppButtonValidated>
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="delete" @click="supprimerResaVehicule(resaVehiculeForm)"><template #default>Supprimer</template></AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>
  </section>
</template>
