<script setup>
import ArrowRight from "@/assets/svg/ArrowRight.vue";
import More from "@/assets/svg/More.vue";

definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "Home - Résa Pro",
  description: "Page d'accueil",
});

const userProfil = useState("userProfil");
const client = useSupabaseClient();
const { setLoader } = useLoader();
const { getAllResaUserActuel, allResaUserActuel } = useResaVehicules();
const { getAllSallesResaUserActuel, allResaSallesUserActuel } = useResaSalles();
const { timestampToDateFr, timestampToHeure } = useFormatDate();

setLoader(true);
await getAllResaUserActuel();
await getAllSallesResaUserActuel();
setLoader(false);
</script>

<template>
  <section class="bg-slate-100 w-full h-full text-gray-700 overflow-auto pb-20">
    <div class="p-4 flex w-full items-center">
      <div class="">
        <p class="text-gray-700 text-xl">{{ userProfil.nom }} {{ userProfil.prenom }}</p>
        <p class="text-xs italic text-gray-500">{{ userProfil.email }}</p>
      </div>
      <img class="ml-auto w-12" src="../assets/img/logo.png" alt="" />
    </div>

    <div class="p-4">
      <div class="">
        <p class="text-base font-medium">Mes réservations de salles ({{ allResaSallesUserActuel.length }})</p>
        <div class="w-full h-[1px] bg-slate-300 mt-2"></div>
      </div>
      <!-- {{ allResaSallesUserActuel[0] }} -->
      <div v-if="allResaSallesUserActuel.length > 0" class="w-full flex flex-col gap-2 pt-4">
        <div v-for="(salle, index) in allResaSallesUserActuel" :key="index" class="relative w-full bg-white border rounded-lg p-4 flex flex-col">
          <div class="w-full flex flex-col items-center">
            <p class="font-bold text-center">{{ salle.secteurs.name }}</p>
            <p>Salle : {{ salle.salles.name }}</p>
          </div>
          <div class="w-full flex items-center justify-between pt-2 0">
            <div class="flex items-center bg-gradient-to-br from-sky-700 to-sky-500 text-white rounded-lg p-2 px-4 gap-2">{{ timestampToDateFr(salle.debut) }} {{ timestampToHeure(salle.debut) }}</div>
            <ArrowRight class="w-6 h-6 text-slate-700" />
            <div class="flex items-center bg-gradient-to-br from-sky-700 to-sky-500 text-white rounded-lg p-2 px-4 gap-2">{{ timestampToDateFr(salle.fin) }} {{ timestampToHeure(salle.fin) }}</div>
          </div>
          <More class="absolute top-4 right-4 w-6 h-6 cursor-pointer" />
        </div>
      </div>
      <div v-else class="py-2 text-xs italic">Aucune réservation pour le moment</div>
    </div>

    <div class="p-4">
      <div class="">
        <p class="text-base font-medium">Mes réservations de véhicules ({{ allResaUserActuel.length }})</p>
        <div class="w-full h-[1px] bg-slate-300 mt-2"></div>
      </div>
      <!-- {{ allResaUserActuel[0] }} -->
      <div v-if="allResaUserActuel.length > 0" class="w-full flex flex-col gap-2 pt-4">
        <div v-for="(vehicule, index) in allResaUserActuel" :key="index" class="relative w-full bg-white border rounded-lg p-4 flex flex-col">
          <div class="w-full flex flex-col items-center">
            <p class="font-bold text-center">{{ vehicule.secteurs.name }}</p>
            <p>Salle : {{ vehicule.vehicules.immat }}</p>
          </div>
          <div class="w-full flex items-center justify-between pt-2 0">
            <div class="flex items-center bg-gradient-to-br from-sky-700 to-sky-500 text-white rounded-lg p-2 px-4 gap-2">{{ timestampToDateFr(vehicule.debut) }} {{ timestampToHeure(vehicule.debut) }}</div>
            <ArrowRight class="w-6 h-6 text-slate-700" />
            <div class="flex items-center bg-gradient-to-br from-sky-700 to-sky-500 text-white rounded-lg p-2 px-4 gap-2">{{ timestampToDateFr(vehicule.fin) }} {{ timestampToHeure(vehicule.fin) }}</div>
          </div>
          <More class="absolute top-4 right-4 w-6 h-6 cursor-pointer" />
        </div>
      </div>
      <div v-else class="py-2 text-xs italic">Aucune réservation pour le moment</div>
    </div>
  </section>
</template>
