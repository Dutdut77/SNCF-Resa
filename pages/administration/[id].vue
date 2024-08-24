<script setup>
import Check from "@/assets/svg/Check.vue";
import Close from "@/assets/svg/Close.vue";

definePageMeta({
  requiresAuth: true,
  isAdmin: true,
});
useHead({
  title: "",
  description: "",
});

const route = useRoute();
const { setLoader } = useLoader();
const { timestampToDateFr, timestampToHeure } = useFormatDate();
const { getAllVehiculesBySecteur, allVehiculesSecteur } = useVehicules();
const { getAllSallesBySecteur, allSallesSecteur } = useSalles();
const { getAllAnomaliesSecteur, allAnomaliesSecteur } = useAnomalies();
const { getAllSallesResaSecteurActuel, allSallesResaSecteurActuel } = useResaSalles();
const { getAllVehiculesResaSecteurActuel, allResaSecteurActuel } = useResaVehicules();
const { getAllProfiles, allProfiles } = useAuth();

setLoader(true);
await getAllVehiculesBySecteur(route.params.id);
await getAllSallesBySecteur(route.params.id);
await getAllAnomaliesSecteur(route.params.id);
await getAllSallesResaSecteurActuel(route.params.id);
await getAllVehiculesResaSecteurActuel(route.params.id);
await getAllProfiles();
setLoader(false);

const userAuth = computed(() => {
  const result = allProfiles.value.filter((user) => user.secteur_auth.split(",").includes(route.params.id));
  return result;
});

const userAdmin = computed(() => {
  const result = allProfiles.value.filter((user) => user.secteur_admin == route.params.id);
  return result;
});

const anomaliesVehicules = computed(() => {
  return allAnomaliesSecteur.value
    .filter((anomalie) => anomalie.type === 1 && anomalie.id_vehicule !== null) // Filtrer les anomalies liées aux véhicules
    .map((anomalie) => {
      const vehicule = allVehiculesSecteur.value.find((veh) => veh.id === anomalie.id_vehicule);
      if (vehicule) {
        return {
          id: anomalie.id,
          immat: vehicule.immat,

          anomalie: anomalie.anomalie,
        };
      }
      return null;
    })
    .filter((item) => item !== null); // Filtrer les valeurs nulles
});

const anomaliesSalles = computed(() => {
  return allAnomaliesSecteur.value
    .filter((anomalie) => anomalie.type === 0 && anomalie.id_salle !== null) // Filtrer les anomalies liées aux salles
    .map((anomalie) => {
      const salle = allSallesSecteur.value.find((sal) => sal.id === anomalie.id_salle);
      if (salle) {
        return {
          id: anomalie.id,
          name: salle.name,

          anomalie: anomalie.anomalie,
        };
      }
      return null;
    })
    .filter((item) => item !== null); // Filtrer les valeurs nulles
});
</script>

<template>
  <ResaPage>
    <template #title> Administration </template>
    <template #default>
      <div class="px-4 pt-1 pb-4 flex flex-col gap-4">
        <ResaAdminCard>
          <template #title> <p>Véhicules :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Marque</th>
                  <th>Model</th>
                  <th>Immat</th>
                  <th>Dispo</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in allVehiculesSecteur" :key="data.id">
                  <td>{{ data.marque }}</td>
                  <td class="text-center">{{ data.model }}</td>
                  <td class="text-center">{{ data.immat }}</td>
                  <td class="text-center"><Check v-if="data.is_dispo == 1" class="w-3 h-3 mx-auto" /><Close v-else class="w-4 h-4 mx-auto text-red-500" /></td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Salles :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Nom</th>
                  <th>Dispo</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in allSallesSecteur" :key="data.id">
                  <td>{{ data.name }}</td>
                  <td class="text-center"><Check v-if="data.is_dispo == 1" class="w-3 h-3 mx-auto" /><Close v-else class="w-4 h-4 mx-auto text-red-500" /></td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Anomalies Véhicules :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Immat</th>
                  <th>Anomalie</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in anomaliesVehicules" :key="data.id">
                  <td>{{ data.immat }}</td>
                  <td class="text-center">{{ data.anomalie }}</td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Anomalies Salles :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Nom</th>
                  <th>Anomalie</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in anomaliesSalles" :key="data.id">
                  <td>{{ data.name }}</td>
                  <td class="text-center">{{ data.anomalie }}</td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Réservations Véhicules :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Immat</th>
                  <th class="text-left">Début</th>
                  <th class="text-left">Fin</th>
                  <th class="">Validée</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in allResaSecteurActuel" :key="data.id">
                  <td>{{ data.vehicules.immat }}</td>
                  <td class="">{{ timestampToDateFr(data.debut) }}</td>
                  <td class="">{{ timestampToDateFr(data.fin) }}</td>
                  <td class="text-center">
                    <Check v-if="data.is_validated == 1" class="w-3 h-3 mx-auto" />
                    <div v-else class="w-4 h-4 mx-auto text-red-500">?</div>
                  </td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Réservations Salles :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Salle</th>
                  <th class="text-left">Début</th>
                  <th class="text-left">Fin</th>
                  <th class="">Validée</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in allSallesResaSecteurActuel" :key="data.id">
                  <td>{{ data.salles.name }}</td>
                  <td class="">{{ timestampToDateFr(data.debut) }}</td>
                  <td class="">{{ timestampToDateFr(data.fin) }}</td>
                  <td class="text-center">
                    <Check v-if="data.is_validated == 1" class="w-3 h-3 mx-auto" />
                    <div v-else class="w-4 h-4 mx-auto text-red-500">?</div>
                  </td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Profiles Valideur :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Nom</th>
                  <th class="text-left">Prénom</th>
                  <th>Email</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in userAuth" :key="data.id">
                  <td>{{ data.nom }}</td>
                  <td class="text-center">{{ data.prenom }}</td>
                  <td class="text-center">{{ data.email }}</td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>

        <ResaAdminCard>
          <template #title> <p>Profiles Administrateur :</p></template>
          <template #default>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Nom</th>
                  <th class="text-left">Prénom</th>
                  <th>Email</th>
                  <th class="text-right">#</th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-default" v-for="data in userAdmin" :key="data.id">
                  <td>{{ data.nom }}</td>
                  <td class="text-center">{{ data.prenom }}</td>
                  <td class="text-center">{{ data.email }}</td>
                  <td class="text-right cursor-pointer">...</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #footer></template>
          <template #modal></template>
        </ResaAdminCard>
      </div>
    </template>
    <template #footer></template>
    <template #modal></template>
  </ResaPage>
</template>
