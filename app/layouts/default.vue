<script setup></script>
<template>
  <div class="h-dvh w-full bg-slate-50 print:bg-white flex flex-col">
    <!-- NAVBAR -->
    <navbar class="shrink-0 z-50" />

    <!-- MAIN -->
    <main class="flex-1 min-h-0 w-full overflow-hidden">
      <slot />
    </main>

    <!-- FOOTER -->
    <div class="shrink-0 w-full h-10 z-30 print:hidden">
      <Footer />
    </div>
  </div>
</template>
