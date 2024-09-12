<script setup></script>
<template>
  <div class="relative h-dvh w-full">
    <div class="print:hidden absolute -z-40 inset-0 bg-[url('@/assets/img/pattern3.png')] bg-cover"></div>
    <!-- START : NAVBAR -->
    <navbar class="fixed left-0 right-0 z-50 top-0" />
    <!-- END : NAVBAR -->

    <!-- START : PAGE -->
    <div class="w-full h-dvh overflow-hidden pt-16 pb-10">
      <slot />
    </div>

    <!-- END : PAGE -->
    <!-- START : FOOTER -->
    <div class="fixed bottom-0 z-30 w-full h-10 print:hidden">
      <Footer class="" />
    </div>
    <!-- END : FOOTER -->
  </div>
</template>
