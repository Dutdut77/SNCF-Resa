<script setup>
definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "PAge Not Found",
  description: "",
});
</script>

<template>
  <ResaPage>
    <template #title> Administration </template>
    <template #default> <div class="my-auto mx-auto">Vous n'êtes pas autorisé à accéder à cette page.</div></template>
    <template #footer></template>
    <template #modal></template>
  </ResaPage>
</template>
