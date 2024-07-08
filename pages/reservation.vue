<script setup>
definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "Réservation - Résa Pro",
  description: "Réservation utilisateur",
});

const { setLoader } = useLoader();
const { getAll, secteurs } = useSecteurs();

setLoader(true);
await getAll();
setLoader(false);

const etape = ref(0);
const formValue = ref({
  secteur: "",
  type: "",
});

const validatedSecteur = computed(() => {
  return formValue.value.secteur != "" ? true : false;
});

const validatedType = computed(() => {
  return formValue.value.type != "" ? true : false;
});
</script>

<template>
  <section class="bg-gradient-to-br from-slate-900 to-slate-700 w-full h-full text-gray-200 pb-20 flex flex-col">
    <div class="p-4 flex w-full items-center">
      <div class="font-traverse font-medium text-3xl pt-1">Réservation</div>

      <img class="ml-auto w-12" src="../assets/img/logo_sncf.png" alt="" />
    </div>

    <div class="h-full flex flex-col overflow-auto" v-if="etape == 0">
      <div class="h-fit px-4">
        <ResaRadioSecteur :data="secteurs" v-model="formValue.secteur" />
      </div>
      <div class="mt-auto px-4 flex justify-between items-center">
        <AppButtonCarre class="ml-auto my-4" direction="right" :validated="validatedSecteur" @click="etape++"> </AppButtonCarre>
      </div>
    </div>

    <div class="h-full flex flex-col" v-if="etape == 1">
      <div class="relative h-full">
        <ResaType v-model="formValue.type" />
      </div>

      <div class="mt-auto px-4 flex justify-between items-center">
        <AppButtonCarre class="my-4" direction="left" @click="etape--"> </AppButtonCarre>
        <AppButtonCarre class="my-4" direction="right" :validated="validatedType" @click="etape++"> </AppButtonCarre>
      </div>
    </div>
  </section>
</template>
