<script setup>
import ArrowRight from "@/assets/svg/ArrowRight.vue";
import Check from "@/assets/svg/Check.vue";
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
  <section class="w-full h-full flex flex-col gap-4 overflow-hidden">
    <div class="w-full flex">
      <div class="font-bold text-xl flex flex-col lg:flex-row items-center gap-4 pl-2">
        <div class="relative w-fit text-xl -skew-x-[20deg] uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-gradient-to-br from-slate-600 to-slate-900 px-8 py-2">
          <div class="font-medium text-gray-50">Réservations des véhicules</div>
        </div>
      </div>
    </div>
    <div class="w-full overflow-auto p-4 bg-slate-50 rounded-lg shadow-lg border mt-1">
      <table v-if="allResaSecteurActuel.length > 0" class="w-full">
        <thead>
          <tr class="font-medium text-base border-b">
            <th class="text-left w-fit pb-4">Immat</th>
            <th class="text-left pb-4">Réservation</th>
            <th class="px-6 pb-4">Début</th>
            <th class="px-6 pb-4">Fin</th>
            <th class="px-6 pb-4">Observation</th>
            <th class="px-4 pb-4">Validée</th>
          </tr>
        </thead>
        <tbody>
          <tr class="cursor-pointer border-b hover:bg-slate-100 h-full" v-for="data in allResaSecteurActuel" :key="data.id">
            <td>{{ data.vehicules.immat }}</td>
            <td>{{ data.profiles.nom }} {{ data.profiles.prenom }}</td>
            <td class="text-center">{{ timestampToDateFr(data.debut) }}</td>
            <td class="text-center">{{ timestampToDateFr(data.fin) }}</td>
            <td class="text-center">{{ data.titre }}</td>
            <td class="text-center h-full">
              <div class="h-full flex gap-2 justify-center items-center">
                <AppButtonValidated v-if="data.is_validated == 0" class="md:w-24 w-full text-sm" theme="cancel" @click="validerResaVehicule(data)"> <template #default> Valider </template> </AppButtonValidated>
                <AppButtonValidated class="md:w-24 w-full text-sm" theme="delete" @click="supprimerResaVehicule(data)"> <template #default> Supprimer </template> </AppButtonValidated>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="italic" v-else>Aucune réservation !</div>
    </div>

    <AppModalSide :sideModal="sideModalResaVehicule" :closeSideModal="showSideResaVehicule">
      <template #default>
        <AppModalSideContent v-if="sideModalResaVehicule" :closeSideModal="showSideResaVehicule">
          <template #header>
            <div class="text-center">
              <div class="font-medium text-xl text-gray-700">Réservation d'un véhicule</div>
            </div>
          </template>
          <template #default>
            <div class="w-full pt-8">
              <div class="text-gray-700">
                <div class="text-center">
                  <p class="font-bold">{{ nameReservationVehicule.nom }} {{ nameReservationVehicule.prenom }}</p>
                  <p>({{ nameReservationVehicule.email }})</p>
                  <p class="pt-4">a réservé le véhicule suivant :</p>
                </div>
              </div>

              <div class="text-center py-4">
                <div class="font-medium text-xl text-gray-700">{{ resaVehiculeForm.vehicules.marque }} {{ resaVehiculeForm.vehicules.model }}</div>
                <div class="font-medium text-xl text-gray-700">{{ resaVehiculeForm.vehicules.immat }}</div>
              </div>
              <div class="w-full flex items-center justify-between pt-2 gap-2">
                <div class="w-full text-center bg-sky-500 text-white rounded-lg p-2 px-2 gap-2 text-sm">{{ timestampToDateFr(resaVehiculeForm.debut) }} {{ timestampToHeure(resaVehiculeForm.debut) }}</div>
                <ArrowRight class="w-4 h-4 flex-none text-slate-700" />
                <div class="w-full text-center bg-sky-500 text-white rounded-lg p-2 px-2 gap-2 text-sm">{{ timestampToDateFr(resaVehiculeForm.fin) }} {{ timestampToHeure(resaVehiculeForm.fin) }}</div>
              </div>
              <div v-if="resaVehiculeForm.is_validated == 0" class="mt-8 pt-4 text-sm text-center border-t text-red-700">Cette réservation n'est pas validée. Il faut la valider pour qu'elle soit prise en compte. Un email de confirmation sera envoyé au demandeur.</div>
            </div>
          </template>
          <template #footer>
            <div class="flex gap-2 w-full justify-end pt-6">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideResaVehicule()"> <template #default> Annuler </template> </AppButtonValidated>
              <AppButtonValidated v-if="resaVehiculeForm.is_validated == 0" class="md:w-32 w-full text-sm" theme="" @click="validerResaVehicule(resaVehiculeForm)"> <template #default> Valider </template> </AppButtonValidated>
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="delete" @click="supprimerResaVehicule(resaVehiculeForm)"> <template #default> Supprimer </template> </AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>
  </section>
</template>
