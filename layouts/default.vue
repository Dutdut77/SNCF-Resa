<script setup></script>
<template>
  <div class="h-dvh w-full overflow-hidden print:overflow-visible flex flex-col">
    <!-- START : NAVBAR -->
    <navbar class="fixed bottom-0 z-50" />
    <!-- END : NAVBAR -->

    <!-- START : PAGE -->
    <div class="w-full h-full">
      <slot />
    </div>

    <!-- END : PAGE -->
    <!-- START : FOOTER -->
    <!-- <div class="fixed bottom-0 z-30 w-full h-10 print:hidden">
      <Footer class="" />
    </div> -->
    <!-- END : FOOTER -->
  </div>
</template>
