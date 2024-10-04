<script setup>
definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});

useHead({
  title: `Administration`,
  description: "Administration Résa Pro",
});

const activeMenu = ref(1);

const goToCalendrier = async () => {
  await navigateTo("/");
};
</script>

<template>
  <section class="w-full h-full flex flex-col lg:flex-row gap-4 p-4 text-sm text-gray-700 overflow-auto">
    <!-- PARTIE GAUCHE -->
    <div class="w-full lg:w-72 flex-none h-fit lg:h-full flex flex-col gap-4">
      <p class="font-medium text-center text-lg">Administration</p>
      <div>
        <p class="font-medium text-base uppercase italic">Véhicules</p>
        <div class="bg-white border rounded-lg py-4">
          <div class="w-full hover:bg-slate-100 cursor-pointer px-4" :class="activeMenu == 1 ? 'text-sky-600 font-medium' : ''" @click="activeMenu = 1">Liste des véhicules</div>
          <div class="w-full hover:bg-slate-100 cursor-pointer px-4" :class="activeMenu == 2 ? 'text-sky-600 font-medium' : ''" @click="activeMenu = 2">Réservations</div>
        </div>
      </div>
      <div>
        <p class="font-medium text-base uppercase italic">Salles</p>
        <div class="bg-white border rounded-lg py-4">
          <div class="w-full hover:bg-slate-100 cursor-pointer px-4" :class="activeMenu == 3 ? 'text-sky-600 font-medium' : ''" @click="activeMenu = 3">Liste des Salles</div>
          <div class="w-full hover:bg-slate-100 cursor-pointer px-4" :class="activeMenu == 4 ? 'text-sky-600 font-medium' : ''" @click="activeMenu = 4">Réservations</div>
        </div>
      </div>
      <div>
        <p class="font-medium text-base uppercase italic">Autorisations</p>
        <div class="bg-white border rounded-lg py-4">
          <div class="w-full hover:bg-slate-100 cursor-pointer px-4" :class="activeMenu == 5 ? 'text-sky-600 font-medium' : ''" @click="activeMenu = 5">Réservations</div>
          <div class="w-full hover:bg-slate-100 cursor-pointer px-4" :class="activeMenu == 6 ? 'text-sky-600 font-medium' : ''" @click="activeMenu = 6">Administration</div>
        </div>
      </div>

      <div class="mt-auto hidden lg:block">
        <AppButtonValidated class="w-full text-sm" theme="cancel" @click="goToCalendrier()"> <template #default> Calendrier </template> </AppButtonValidated>
      </div>
    </div>

    <!-- PARTIE DROITE -->
    <div v-if="activeMenu == 1" class="w-full h-full">
      <ResaAdminVehicules />
    </div>

    <div v-if="activeMenu == 2" class="w-full h-full flex flex-col gap-4">
      <ResaAdminResaVehicules />
    </div>

    <div v-if="activeMenu == 3" class="w-full h-full flex flex-col gap-4">
      <ResaAdminSalles />
    </div>

    <div v-if="activeMenu == 4" class="w-full h-full flex flex-col gap-4">
      <div class="font-bold text-xl flex flex-col lg:flex-row items-center gap-4 pl-2">
        <div class="relative w-fit text-xl -skew-x-[20deg] uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-gradient-to-br from-slate-600 to-slate-900 px-8 py-2">
          <div class="font-medium text-gray-50">Réservations de salles</div>
        </div>
      </div>
      <ResaAdminResaSalles />
    </div>

    <div v-if="activeMenu == 5" class="w-full h-full flex flex-col gap-4">
      <div class="font-bold text-xl flex flex-col lg:flex-row items-center gap-4 pl-2">
        <div class="relative w-fit text-xl -skew-x-[20deg] uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-gradient-to-br from-slate-600 to-slate-900 px-8 py-2">
          <div class="font-medium text-gray-50">Réservations directes</div>
        </div>
      </div>
      <ResaAdminReservation />
    </div>

    <div v-if="activeMenu == 6" class="w-full h-full flex flex-col gap-4">
      <div class="font-bold text-xl flex flex-col lg:flex-row items-center gap-4 pl-2">
        <div class="relative w-fit text-xl -skew-x-[20deg] uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-gradient-to-br from-slate-600 to-slate-900 px-8 py-2">
          <div class="font-medium text-gray-50">Liste des administrateurs</div>
        </div>
      </div>
      <ResaAdminAdministration />
    </div>
  </section>
</template>
