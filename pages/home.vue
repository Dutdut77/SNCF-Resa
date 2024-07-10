<script setup>
import Logout from "@/assets/svg/Logout.vue";

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
</script>

<template>
  <section class="bg-slate-100 w-full h-full text-gray-700">
    <div class="p-4 flex w-full items-center">
      <div class="">
        <p class="text-gray-700 text-xl">{{ userProfil.nom }} {{ userProfil.prenom }}</p>
        <p class="text-xs italic text-gray-500">{{ userProfil.email }}</p>
      </div>
      <img class="ml-auto w-12" src="../assets/img/logo.png" alt="" />
    </div>

    <div class="p-4">
      <div class="">
        <p class="text-base font-medium uppercase">Salles (3)</p>
        <div class="w-full h-[1px] bg-slate-300 mt-2"></div>
      </div>
      <div class="py-2 text-xs italic">Aucune réservation pour le moment</div>
    </div>

    <div class="p-4">
      <div class="">
        <p class="text-base font-medium uppercase">Véhicules (3)</p>
        <div class="w-full h-[1px] bg-slate-300 mt-2"></div>
      </div>
      <div class="py-2 text-xs italic">Aucune réservation pour le moment</div>
    </div>
  </section>
</template>
