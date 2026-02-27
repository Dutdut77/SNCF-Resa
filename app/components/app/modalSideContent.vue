<script setup>
const props = defineProps(["closeSideModal"]);
</script>

<template>
  <div id="modalSideContent" class="relative flex flex-col w-full h-dvh bg-white shadow-2xl">
    <!-- Header dark -->
    <div class="flex-none bg-linear-to-br from-sky-400 to-sncf-primary px-5 py-4 flex items-center gap-3">
      <slot name="header"></slot>
      <button
        class="ml-auto size-8 shrink-0 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        @click="props.closeSideModal()"
      >
        <Icon name="material-symbols:close" size="18" class="text-white" />
      </button>
    </div>

    <!-- Contenu scrollable -->
    <div class="flex-1 overflow-auto px-5 py-5">
      <slot name="default"></slot>
    </div>

    <!-- Footer -->
    <div class="flex-none border-t border-slate-100 bg-white px-5 py-4">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
