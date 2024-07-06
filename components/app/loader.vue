<script setup>
const { loading } = useLoader();
</script>

<template>
  <Teleport to="body">
    <section v-if="loading" class="h-dvh w-dvw absolute z-[70] top-0 left-0 backdrop-blur-lg print:hidden">
      <div class="flex justify-center items-center h-full pb-16">
        <div class="relative h-40 w-40 rounded-full flex justify-center">
          <div class="z-50 absolute w-44 h-44 -mt-2 border-t-4 border-l-4 border-sky-800 rounded-full animate-spin"></div>
          <div class="absolute top-0 bottom-0 uppercase font-bold text-5xl z-10 text-white text-center flex flex-col justify-center">
            <div class="font-traverse">résa</div>
            <div class="ml-auto text-sm bg-white px-3 text-sky-700 rounded w-fit -mt-2">pro</div>
          </div>
        </div>
      </div>
    </section>
  </Teleport>
</template>

<style></style>
