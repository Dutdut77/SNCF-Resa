<script setup>
const props = defineProps(["closeSideModal", "sideModal"]);
</script>

<template>
  <section>
    <Teleport to="body">
      <div v-if="props.sideModal" class="absolute top-0 right-0 z-[70] backdrop-blur-sm bg-slate-800/80 w-full h-dvh cursor-pointer" @click="props.closeSideModal()"></div>
      <client-only>
        <transition-group tag="div" enter-from-class="translate-x-full opacity-0 " enter-active-class="duration-500" leave-active-class="duration-500" leave-to-class="translate-x-full opacity-0" class="fixed top-0 right-0 z-[70] lg:w-1/2 w-full pl-10 md:pl-0" @click.stop>
          <slot name="default"> </slot>
        </transition-group>
      </client-only>
    </Teleport>
  </section>
</template>

<style></style>
