<script setup>
definePageMeta({
  requiresAuth: true,
  isAdmin: true,
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
        <div class="bg-slate-50 border rounded-lg py-4">
          <div class="w-full hover:bg-slate-100 cursor-pointer px-4" :class="activeMenu == 1 ? 'text-sky-600 font-medium' : ''" @click="activeMenu = 1">Liste des véhicules</div>
          <div class="w-full hover:bg-slate-100 cursor-pointer px-4" :class="activeMenu == 2 ? 'text-sky-600 font-medium' : ''" @click="activeMenu = 2">Réservations</div>
        </div>
      </div>
      <div>
        <p class="font-medium text-base uppercase italic">Salles</p>
        <div class="bg-slate-50 border rounded-lg py-4">
          <div class="w-full hover:bg-slate-100 cursor-pointer px-4" :class="activeMenu == 3 ? 'text-sky-600 font-medium' : ''" @click="activeMenu = 3">Liste des Salles</div>
          <div class="w-full hover:bg-slate-100 cursor-pointer px-4" :class="activeMenu == 4 ? 'text-sky-600 font-medium' : ''" @click="activeMenu = 4">Réservations</div>
        </div>
      </div>
      <div>
        <p class="font-medium text-base uppercase italic">Autorisations</p>
        <div class="bg-slate-50 border rounded-lg py-4">
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
      <ResaAdminResaSalles />
    </div>

    <div v-if="activeMenu == 5" class="w-full h-full flex flex-col gap-4">
      <ResaAdminReservation />
    </div>

    <div v-if="activeMenu == 6" class="w-full h-full flex flex-col gap-4">
      <ResaAdminAdministration />
    </div>

    <div class="mt-auto lg:hidden block">
      <AppButtonValidated class="w-full text-sm" theme="cancel" @click="goToCalendrier()"> <template #default> Calendrier </template> </AppButtonValidated>
    </div>
  </section>
</template>
