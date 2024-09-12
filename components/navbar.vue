<script setup>
import User from "@/assets/svg/User.vue";
import Right from "@/assets/svg/Right.vue";

const route = useRoute();

const secteurs = useState("secteurs");
const showSubmenuSecteurs = ref(false);

const secteurActive = computed(() => {
  const result = secteurs.value.find((obj) => obj.id == route.params.id);
  return result;
});
</script>

<template>
  <section class="w-full h-16 flex items-center text-gray-700">
    <div class="h-full w-20 pl-4 uppercase font-bold flex flex-col justify-center -mt-0.5">
      <div class="font-traverse text-xl first-letter:text-sncf-primary text-center tracking-widest">résa</div>
      <div class="text-sm bg-gradient-to-br from-sncf-primary-light to-sncf-primary px-4 text-white rounded w-fit -mt-1">pro</div>
    </div>

    <div class="relative w-full h-full flex flex-col items-center justify-center">
      <div class="relative w-fit h-full flex flex-col items-center justify-center cursor-pointer" @click="showSubmenuSecteurs = !showSubmenuSecteurs">
        <div class="font-bold uppercase text-xl">{{ secteurActive.name }}</div>
        <Right class="absolute bottom-0 size-6 rotate-90" />

        <div v-if="showSubmenuSecteurs" class="absolute -bottom-44 z-40 p-4 w-72 bg-gradient-to-br from-slate-600 to-slate-900 border rounded-xl grid grid-cols-2 gap-2 shadow-lg">
          <NuxtLink :to="`/calendrier/${secteur.id}`" class="px-2 py-1 border bg-white uppercase font-medium rounded-lg text-center text-sm hover:text-sncf-primary" v-for="(secteur, index) in secteurs" :key="index">
            {{ secteur.name }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="h-full w-20 pr-4 flex items-center justify-end">
      <div class="h-10 w-10 bg-gray-100 border border-gray-700 rounded-full flex justify-center items-center">
        <User class="w-6 h-6 text-gray-600" />
      </div>
    </div>
  </section>
</template>
