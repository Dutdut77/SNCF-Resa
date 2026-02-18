<script setup>
const props = defineProps({
  closeModal: {
    type: Function,
  },
});
</script>

<template>
  <section>
    <Teleport to="body">
      <div class="absolute top-0 right-0 z-[90] backdrop-blur-sm bg-slate-700/80 w-full h-full overflow-hidden" @click="props.closeModal()">
        <div class="w-full h-full flex justify-center items-center p-4">
          <div class="relative w-full p-2 md:w-1/2 max-h-full bg-white rounded-lg border border-gray-300 shadow-md animate__animated animate__fadeIn flex flex-col overflow-hidden" @click.stop>
            <p class="absolute top-4 right-5 hover:text-sncf-primary cursor-pointer text-gray-600" @click="props.closeModal()"><Icon name="material-symbols:close" class="w-6 h-6" /></p>
            <div class="w-full h-full flex flex-col justify-center items-center pt-4 gap-4 overflow-auto">
              <slot name="title"></slot>

              <slot name="default"></slot>

              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style></style>
