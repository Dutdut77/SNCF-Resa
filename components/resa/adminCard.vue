<!-- <ResaAdminCard>

  <template #title></template> 
  <template #default></template> 
  <template #footer></template> 
    <template #modal></template> 
</ResaAdminCard> -->

<template>
  <section class="bg-white w-full text-gray-600 flex flex-col overflow-hidden rounded-md shadow-lg">
    <!-- TITLE -->
    <div class="text-sm font-medium bg-gray-400 text-white p-2 flex justify-between">
      <slot name="title"></slot>
    </div>

    <!-- DEFAULT -->
    <div class="w-full p-2 text-xs">
      <slot name="default"></slot>
    </div>

    <!-- FOOTER -->
    <div class="">
      <slot name="footer"></slot>
    </div>

    <!-- MODAL -->
    <div class="">
      <slot name="modal"></slot>
    </div>
  </section>
</template>
