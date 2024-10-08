<script setup>
import ArrowRight from "@/assets/svg/ArrowRight.vue";
import Check from "@/assets/svg/Check.vue";
const { setLoader } = useLoader();
const userProfil = useState("userProfil");
const { timestampToDateFr, timestampToHeure } = useFormatDate();
const { getAllSallesResaSecteurActuel, deleteResaSalle, validResaSalle, allSallesResaSecteurActuel } = useResaSalles();
const { getAllProfiles, allProfiles } = useAuth();
const { sendEmailValidationSalle, sendEmailRefusSalle } = useEmail();

const sideModalResaSalle = ref(false);
const resaSalleForm = ref({});

setLoader(true);
await getAllSallesResaSecteurActuel(userProfil.value.secteur_admin);
await getAllProfiles();
setLoader(false);

const nameReservationSalle = computed(() => {
  const found = allProfiles.value.find((user) => user.id === resaSalleForm.value.id_user);
  if (found) {
    return found; // Si l'utilisateur est trouvé, on le stocke
  } else {
    return ""; // Si aucun utilisateur n'est trouvé, on réinitialise
  }
});

const showSideResaSalle = (data) => {
  if (data) {
    resaSalleForm.value = data;
  } else {
    resaSalleForm.value = {};
  }
  sideModalResaSalle.value = !sideModalResaSalle.value;
};
const supprimerResaSalle = async (data) => {
  setLoader(true);
  await deleteResaSalle(data.id);
  await getAllSallesResaSecteurActuel(userProfil.value.secteur_admin);
  await sendEmailRefusSalle(data);
  sideModalResaSalle.value = false;
  setLoader(false);
};
const validerResaSalle = async (data) => {
  setLoader(true);
  await validResaSalle(data.id);
  await getAllSallesResaSecteurActuel(userProfil.value.secteur_admin);
  await sendEmailValidationSalle(data);
  sideModalResaSalle.value = false;
  setLoader(false);
};
</script>

<template>
  <section class="w-full h-full flex flex-col gap-4">
    <div class="w-full flex">
      <div class="font-bold text-xl flex flex-col lg:flex-row items-center gap-4 pl-2">
        <div class="relative w-fit text-xl -skew-x-[20deg] uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-gradient-to-br from-slate-600 to-slate-900 px-8 py-2">
          <div class="font-medium text-gray-50">Réservations de salles</div>
        </div>
      </div>
    </div>

    <table v-if="allSallesResaSecteurActuel.length > 0" class="w-full">
      <thead>
        <tr class="font-medium text-base border-b">
          <th class="w-full text-left pb-4">Salle</th>
          <th class="px-6 pb-4">Début</th>
          <th class="px-6 pb-4">Fin</th>
          <th class="px-4 pb-4">Validée</th>
        </tr>
      </thead>
      <tbody>
        <tr class="cursor-pointer h-10 border-b hover:bg-slate-100" v-for="data in allSallesResaSecteurActuel" :key="data.id" @click="showSideResaSalle(data)">
          <td>{{ data.salles.name }}</td>
          <td class="text-center">{{ timestampToDateFr(data.debut) }}</td>
          <td class="text-center">{{ timestampToDateFr(data.fin) }}</td>
          <td class="text-center">
            <Check v-if="data.is_validated == 1" class="w-3 h-3 mx-auto text-green-500" />
            <div v-else class="w-4 h-4 mx-auto text-gray-500">?</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="italic" v-else>Aucune réservation !</div>

    <AppModalSide :sideModal="sideModalResaSalle" :closeSideModal="showSideResaSalle">
      <template #default>
        <AppModalSideContent v-if="sideModalResaSalle" :closeSideModal="showSideResaSalle">
          <template #header>
            <div class="text-center">
              <div class="font-medium text-xl text-gray-700">Réservation d'une salle</div>
            </div>
          </template>
          <template #default>
            <div class="w-full h-full pt-8">
              <div class="text-gray-700">
                <div class="text-center">
                  <p class="font-bold">{{ nameReservationSalle.nom }} {{ nameReservationSalle.prenom }}</p>
                  <p>({{ nameReservationSalle.email }})</p>
                  <p class="pt-4">a réservé la salle suivante :</p>
                </div>
              </div>

              <div class="text-center py-4">
                <div class="font-medium text-xl text-gray-700">{{ resaSalleForm.salles.name }}</div>
                <div class="font-medium text-xl text-gray-700">{{ resaSalleForm.salles.adresse }}</div>
              </div>
              <div class="w-full flex items-center justify-between pt-2 0">
                <div class="flex items-center bg-sky-500 text-white rounded-lg p-2 px-4 gap-2">{{ timestampToDateFr(resaSalleForm.debut) }} {{ timestampToHeure(resaSalleForm.debut) }}</div>
                <ArrowRight class="w-6 h-6 text-slate-700" />
                <div class="flex items-center bg-sky-500 text-white rounded-lg p-2 px-4 gap-2">{{ timestampToDateFr(resaSalleForm.fin) }} {{ timestampToHeure(resaSalleForm.fin) }}</div>
              </div>
              <div v-if="resaSalleForm.is_validated == 0" class="mt-8 pt-4 text-sm text-center border-t text-red-700">Cette réservation n'est pas validée par un administrateur. Vous devez la valider pour que le demandeur ai la confirmation de sa réservation.</div>
            </div>
          </template>
          <template #footer>
            <div class="flex gap-2 w-full justify-end pt-6">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideResaSalle()"> <template #default> Annuler </template> </AppButtonValidated>
              <AppButtonValidated v-if="resaSalleForm.is_validated == 0" class="md:w-32 w-full text-sm" theme="" @click="validerResaSalle(resaSalleForm)"> <template #default> Valider </template> </AppButtonValidated>
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="delete" @click="supprimerResaSalle(resaSalleForm)"> <template #default> Supprimer </template> </AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>
  </section>
</template>
