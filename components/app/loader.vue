<script setup>
const { loading } = useLoader();
</script>

<template>
  <Teleport to="body">
    <section v-if="loading" class="h-dvh w-dvw absolute z-[70] top-0 left-0 backdrop-blur-lg bg-slate-300/10 print:hidden">
      <div class="flex justify-center items-center h-full pb-16">
        <div class="relative h-40 w-40 bg-white rounded-full flex justify-center">
          <div class="z-50 absolute w-44 h-44 -mt-2 border-t-4 border-l-4 border-sky-500 rounded-full animate-spin"></div>
          <div class="absolute top-0 bottom-0 uppercase font-bold text-5xl z-10 text-gray-600 text-center flex flex-col justify-center">
            <div class="font-traverse">résa</div>
            <div class="ml-auto text-sm border border-sky-700 bg-white px-3 text-sky-700 rounded w-fit -mt-2">pro</div>
          </div>
        </div>
      </div>
    </section>
  </Teleport>
</template>

<style></style>
