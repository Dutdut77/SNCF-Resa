<!-- <ResaPage>

  <template #title></template> 
  <template #default></template> 
  <template #footer></template> 
    <template #modal></template> 
</ResaPage> -->

<template>
  <section class="w-full h-full text-gray-600 flex flex-col overflow-hidden">
    <!-- TITLE -->
    <div class="text-white w-full h-16 p-4 flex items-center justify-between z-50">
      <slot name="title"></slot>
      <img class="w-14 h-auto ml-auto" src="@/assets/img/logo_sncf.png" alt="" />
    </div>

    <!-- DEFAULT -->
    <div class="w-full h-full bg-slate-100 lg:bg-white rounded-t-xl flex flex-col overflow-auto">
      <slot name="default"></slot>
    </div>

    <!-- FOOTER -->
    <div class="w-full h-fit bg-slate-100 lg:bg-white lg:rounded-b-xl p-4">
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
