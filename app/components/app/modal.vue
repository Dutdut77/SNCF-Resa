<script setup>
const props = defineProps({
  closeModal: {
    type: Function,
  },
});

const slots = useSlots();
</script>

<template>
  <section>
    <Teleport to="body">
      <div class="absolute top-0 right-0 z-[90] backdrop-blur-sm bg-slate-700/80 w-full h-full overflow-hidden" @click="props.closeModal()">
        <div class="w-full h-full flex justify-center items-center p-4">
          <div class="relative w-full md:w-1/2 max-h-full bg-white rounded-lg border border-gray-300 shadow-md animate__animated animate__fadeIn flex flex-col overflow-hidden" @click.stop>
            <!-- Close X -->
            <button type="button" class="absolute top-3 right-3 z-10 text-gray-500 hover:text-sncf-primary cursor-pointer p-1" @click="props.closeModal()">
              <Icon name="material-symbols:close" size="24" />
            </button>

            <!-- Title (sticky) -->
            <div v-if="slots.title" class="w-full shrink-0 pt-4 pb-4 pl-4 pr-12 border-b border-slate-100">
              <slot name="title"></slot>
            </div>

            <!-- Body (scrollable) -->
            <div class="w-full min-h-0 flex-1 overflow-auto py-3">
              <slot name="default"></slot>
            </div>

            <!-- Footer (sticky) -->
            <div v-if="slots.footer" class="w-full shrink-0 pt-3 pb-3 px-4 border-t border-slate-100 bg-slate-50/50">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style></style>
