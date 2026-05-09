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
</script>

<template>
  <section class="w-full h-full flex flex-col lg:flex-row text-sm text-gray-700 overflow-auto lg:overflow-hidden">
    <!-- SIDEBAR GAUCHE -->
    <aside class="w-full lg:w-60 flex-none h-fit lg:h-full lg:min-h-0 lg:overflow-auto flex flex-col gap-1 p-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white shrink-0">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
        <div class="size-9 rounded-xl bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center shrink-0">
          <Icon name="material-symbols:admin-panel-settings" size="20" class="text-white" />
        </div>
        <div>
          <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Espace</p>
          <p class="text-base font-bold text-slate-800 leading-tight">Administration</p>
        </div>
      </div>

      <!-- Véhicules -->
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 pb-1">Véhicules</p>
      <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left" :class="activeMenu == 1 ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'" @click="activeMenu = 1">
        <Icon name="material-symbols:directions-car" size="16" class="shrink-0" />
        Liste des véhicules
      </button>
      <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left" :class="activeMenu == 2 ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'" @click="activeMenu = 2">
        <Icon name="material-symbols:calendar-month" size="16" class="shrink-0" />
        Réservations
      </button>
      <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left" :class="activeMenu == 7 ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'" @click="activeMenu = 7">
        <Icon name="material-symbols:warning-outline" size="16" class="shrink-0" />
        Signalements
      </button>

      <!-- Salles -->
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 pb-1 mt-3">Salles</p>
      <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left" :class="activeMenu == 3 ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'" @click="activeMenu = 3">
        <Icon name="material-symbols:meeting-room" size="16" class="shrink-0" />
        Liste des salles
      </button>
      <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left" :class="activeMenu == 4 ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'" @click="activeMenu = 4">
        <Icon name="material-symbols:calendar-month" size="16" class="shrink-0" />
        Réservations
      </button>
      <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left" :class="activeMenu == 8 ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'" @click="activeMenu = 8">
        <Icon name="material-symbols:warning-outline" size="16" class="shrink-0" />
        Signalements
      </button>

      <!-- Autorisations -->
      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 pb-1 mt-3">Autorisations</p>
      <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left" :class="activeMenu == 5 ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'" @click="activeMenu = 5">
        <Icon name="material-symbols:verified-user" size="16" class="shrink-0" />
        Auto-validation
      </button>
      <button class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left" :class="activeMenu == 6 ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'" @click="activeMenu = 6">
        <Icon name="material-symbols:manage-accounts" size="16" class="shrink-0" />
        Administrateurs
      </button>
    </aside>

    <!-- PARTIE DROITE -->
    <div class="w-full lg:flex-1 lg:min-w-0 lg:min-h-0 lg:h-full lg:overflow-auto p-4 lg:p-6">
      <div v-if="activeMenu == 1"><ResaAdminVehicules /></div>
      <div v-if="activeMenu == 2"><ResaAdminResaVehicules /></div>
      <div v-if="activeMenu == 3"><ResaAdminSalles /></div>
      <div v-if="activeMenu == 4"><ResaAdminResaSalles /></div>
      <div v-if="activeMenu == 5"><ResaAdminReservation /></div>
      <div v-if="activeMenu == 6"><ResaAdminAdministration /></div>
      <div v-if="activeMenu == 7"><ResaAdminVehiculeEtats /></div>
      <div v-if="activeMenu == 8"><ResaAdminSalleEtats /></div>
    </div>
  </section>
</template>
