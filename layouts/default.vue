<script setup></script>
<template>
  <div class="h-dvh w-full flex gap-8 bg-gradient-to-b from-sky-600 to-sky-500 relative lg:p-16">
    <!-- START : NAVBAR -->
    <navbar class="fixed lg:relative bottom-0 z-50" />
    <!-- END : NAVBAR -->

    <!-- START : PAGE -->
    <div class="w-full h-full overflow-auto pb-20 lg:pb-0">
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
