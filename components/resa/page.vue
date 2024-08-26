<!-- <ResaPage>

  <template #title></template> 
  <template #default></template> 
  <template #footer></template> 
    <template #modal></template> 
</ResaPage> -->

<template>
  <section class="bg-sky-500 w-full h-full text-gray-600 flex flex-col overflow-hidden">
    <!-- TITLE -->
    <div class="fixed top-0 text-white w-full h-16 p-4 flex items-center justify-between bg-gradient-to-b from-sky-600 to-sky-500 z-50">
      <slot name="title"></slot>
      <img class="w-14 h-auto ml-auto" src="@/assets/img/logo_sncf.png" alt="" />
    </div>

    <!-- DEFAULT -->
    <div class="w-full h-full bg-slate-100 rounded-t-xl mt-16 pt-4 flex flex-col overflow-auto">
      <slot name="default"></slot>
    </div>

    <!-- FOOTER -->
    <div class="w-full bg-slate-100 p-4">
      <slot name="footer"></slot>
    </div>

    <!-- MODAL -->
    <div class="">
      <slot name="modal"></slot>
    </div>
  </section>
</template>

<style scoped>
/* Cacher la barre de défilement */
::-webkit-scrollbar {
  display: none;
}
</style>
