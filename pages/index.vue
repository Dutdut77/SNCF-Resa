<script setup>
definePageMeta({
  requiresAuth: false,
  isAdmin: false,
  layout: false,
});
useHead({
  title: "Resa - Login",
  description: "Réservation salles - Véhicules",
});
</script>
<template>
  <div class="flex flex-col justify-center items-center gap-16 h-dvh w-full bg-slate-900">
    <div class="relative w-[250px] h-[250px] flex justify-center items-center">
      <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-700 to-sky-500 rotate-45 rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
      <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-700 to-sky-500 opacity-25 scale-110 rotate-[60deg] rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
      <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-700 to-sky-500 opacity-50 scale-110 rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
      <span class="absolute top-0 left-0 w-full h-full border rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>

      <div class="uppercase font-bold text-6xl z-10 text-white text-center flex flex-col">
        <div class="font-traverse">résa</div>
        <div class="ml-auto text-sm bg-white px-3 text-sky-700 rounded w-fit -mt-2">pro</div>
      </div>
    </div>
    <div class="font-bold bg-gradient-to-br from-sky-700 to-sky-400 text-transparent text-2xl bg-clip-text animate-bounce">Taper pour commencer !</div>
  </div>
</template>
<style></style>
