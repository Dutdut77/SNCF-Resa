<script setup>
definePageMeta({
  requiresAuth: false,
  isAdmin: false,
  layout: false,
});
useHead({
  title: "Resa - Bienvenue",
  description: "Réservation salles - Véhicules",
});
</script>
<template>
  <section class="bg-slate-50 w-full h-dvh text-gray-600 flex flex-col overflow-hidden">
    <NuxtLink to="/calendrier/5" class="relative group flex flex-col items-center flex-1 h-full justify-center">
      <div class="h-full w-full flex flex-col items-center justify-center gap-8">
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

        <div class="lg:hidden font-bold bg-sky-500 text-transparent text-2xl bg-clip-text animate-bounce">Toucher pour commencer !</div>
        <div class="hidden lg:block font-bold bg-sky-500 text-transparent text-2xl bg-clip-text animate-bounce">Cliquer pour commencer !</div>
      </div>
    </NuxtLink>
  </section>
</template>
<style></style>
