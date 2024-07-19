<script setup>
definePageMeta({
  requiresAuth: false,
  isAdmin: false,
  layout: false,
});
useHead({
  title: "Réinitialisation mdp",
  description: "Réinitialisation du mot de passe.",
});
const { setLoader } = useLoader();
const { addToast } = useToast();
const route = useRoute();
const supabase = useSupabaseClient();

const passwordOne = ref("");
const passwordTwo = ref("");
const code = route.query.code;

const validatedMdp = computed(() => {
  return passwordOne.value != "" && passwordTwo.value != "" && passwordOne.value == passwordTwo.value ? true : false;
});

const updateMdp = async () => {
  try {
    setLoader(true);

    const { data, error } = await supabase.auth.updateUser({ password: passwordOne.value, access_token: code });
    if (error) throw error;

    addToast({ type: "Success", title: "Félicitation", message: "Enregistrement réussit." });

    setLoader(false);
    navigateTo("/home");
  } catch (err) {
    addToast({ type: "Error", title: "Problème lors de la modification du mot de passe.", message: err.message });

    setLoader(false);
  }
};
</script>

<template>
  <section class="relative h-dvh w-full text-gray-700 flex flex-col bg-slate-100 pt-12 overflow-auto gap-4">
    <img class="absolute top-12 right-8 w-14" src="../assets/img/logo.png" alt="" />

    <div class="flex flex-col justify-between items-start px-4">
      <p class="text-xl font-medium">Réinitialisation du</p>
      <p class="text-xl font-medium">mot de passe</p>
    </div>

    <div v-if="code" class="flex flex-col gap-8 pt-4">
      <div class="flex flex-col gap-4 px-4">
        <AppInput name="password" type="password" title="Nouveau mot de passe : " v-model="passwordOne" />
        <AppInput name="passwordTwo" type="password" title="Confirmer mot de passe : " v-model="passwordTwo" />
      </div>

      <div class="flex justify-end px-4">
        <AppButtonValidated class="w-32" theme="" :validated="validatedMdp" @click="updateMdp()"> <template #default> Envoyer </template> </AppButtonValidated>
      </div>
    </div>
    <div v-else class="pt-4">
      <p class="text-center px-8">Vous n'avez plus accès à la réinitialisation de votre mot de passe</p>
    </div>
  </section>
</template>
