<script setup>
definePageMeta({
  requiresAuth: false,
  isAdmin: false,
  layout: false,
});
useHead({
  title: "Réinitialisation du mot de passe",
  description: "Réinitialisation du mot de passe.",
});

const { setLoader } = useLoader();
const { addToast } = useToast();
const supabase = useSupabaseClient();

const passwordOne = ref("");
const passwordTwo = ref("");
const pageStatus = ref("loading"); // loading | ready | error

const validatedMdp = computed(() => {
  return passwordOne.value.length >= 8 && passwordOne.value === passwordTwo.value;
});

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  pageStatus.value = session ? "ready" : "error";
});

const updateMdp = async () => {
  try {
    setLoader(true);
    const { error } = await supabase.auth.updateUser({ password: passwordOne.value });
    if (error) throw error;

    addToast({ type: "Success", title: "Félicitation", message: "Mot de passe mis à jour avec succès." });
    setLoader(false);
    await navigateTo("/login");
  } catch (err) {
    addToast({ type: "Error", title: "Problème lors de la modification du mot de passe.", message: err.message });
    setLoader(false);
  }
};
</script>

<template>
  <section class="relative h-dvh w-dvw overflow-hidden flex">
    <div class="relative w-full lg:w-1/2 h-full flex flex-col bg-slate-50 ml-auto">
      <div class="absolute top-6 right-6">
        <img class="h-12" src="@/assets/img/logo.png" alt="Logo SNCF" />
      </div>

      <div class="h-full px-6 pt-4 flex flex-col justify-center items-center text-gray-700 gap-4">

        <!-- Chargement -->
        <p v-if="pageStatus === 'loading'" class="text-slate-500 text-sm">Vérification en cours...</p>

        <!-- Lien invalide -->
        <div v-else-if="pageStatus === 'error'" class="flex flex-col items-center gap-4">
          <p class="text-red-600 font-semibold">Le lien est invalide ou a expiré.</p>
          <NuxtLink to="/login" class="text-sm text-slate-500 underline hover:text-slate-700">Retour à la connexion</NuxtLink>
        </div>

        <!-- Formulaire -->
        <template v-else>
          <div class="text-2xl font-Medium w-full 2xl:w-2/3 cursor-default">
            <p>Nouveau mot de passe</p>
            <p class="text-sm italic text-gray-500">Choisissez un mot de passe sécurisé (minimum 8 caractères)</p>
          </div>

          <div class="w-full 2xl:w-1/2 flex flex-col gap-4 pt-4">
            <AppInput name="password" type="password" title="Nouveau mot de passe : " placeholder="Minimum 8 caractères" v-model="passwordOne" />
            <AppInput name="passwordTwo" type="password" title="Confirmer le mot de passe : " placeholder="Répétez le mot de passe" v-model="passwordTwo" />
            <p v-if="passwordOne && passwordTwo && passwordOne !== passwordTwo" class="text-sm text-red-500">
              Les mots de passe ne correspondent pas.
            </p>
          </div>

          <div class="w-full 2xl:w-1/2 flex justify-end">
            <AppButtonCarre direction="" :validated="validatedMdp" @click="updateMdp()">
              <template #default>Enregistrer</template>
            </AppButtonCarre>
          </div>

          <div class="w-full 2xl:w-1/2">
            <NuxtLink to="/login" class="text-sm text-gray-500 hover:text-gray-800 hover:font-medium duration-300">
              Retour à la connexion
            </NuxtLink>
          </div>
        </template>

      </div>

      <div class="text-xs text-gray-600 cursor-default text-center p-4">Copyright © 2024 - GRANDMAIRE Nicolas</div>
    </div>

    <div class="hidden lg:block absolute top-0 bottom-0 w-1/2 z-40 left-0">
      <div class="w-full h-full flex flex-col items-center gap-8 justify-center bg-gradient-to-br from-slate-600 to-slate-900">
        <div class="relative w-[150px] h-[150px] flex justify-center items-center">
          <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-700 to-slate-500 rotate-45 rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-700 to-slate-500 opacity-25 scale-110 rotate-[60deg] rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-700 to-slate-500 opacity-50 scale-110 rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full border rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
          <div class="uppercase font-bold text-4xl z-10 text-white text-center flex flex-col">
            <div class="font-traverse">résa</div>
            <div class="ml-auto text-sm bg-white px-3 text-slate-700 rounded w-fit -mt-2">pro</div>
          </div>
        </div>
        <div class="w-3/4 text-white dark:text-gray-200 text-justify">
          Simplifiez vos réservations grâce à Resa Pro, une plateforme dédiée aux professionnels pour gérer vos réservations de véhicules et de salles en toute simplicité.
        </div>
      </div>
    </div>
  </section>
</template>
