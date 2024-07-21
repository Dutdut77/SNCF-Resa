<script setup>
definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "Calendrier - Résa Pro",
  description: "Calendrier utilisateur",
});

const finalReservation = useState("finalReservation", () => ({}));

const etape = ref(0);
const formValue = ref({});
</script>

<template>
  <section class="bg-slate-100 w-full h-full text-gray-600 pb-20 flex flex-col gap-4 overflow-auto">
    <div class="sticky h-16 px-4 flex items-center justify-between bg-slate-100">
      <div class="-space-y-1">
        <p class="text-medium text-xl">Agenda</p>
        <p class="text-sm">Seclectionnez votre secteur.</p>
      </div>

      <img class="w-12" src="../assets/img/logo.png" alt="" />
    </div>

    <div v-if="etape == 0" class="w-full h-fit flex flex-col px-4 pb-8 overflow-auto">
      <ResaRadioSecteur v-model="formValue.secteur" @change="etape = 1" />
    </div>
  </section>
</template>
