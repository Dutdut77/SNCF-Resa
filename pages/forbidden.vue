<script setup>
definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "Accès interdit",
  description: "",
});

const goToIndex = async () => {
  await navigateTo("/");
};
</script>

<template>
  <section class="w-full h-full flex flex-col justify-center items-center text-gray-700 gap-8">
    <div class="">Vous n'êtes pas autorisé à accéder à cette page.</div>
    <AppButtonValidated class="md:w-32 w-full text-sm" theme="" @click="goToIndex()"> <template #default> Retour </template> </AppButtonValidated>
  </section>
</template>
