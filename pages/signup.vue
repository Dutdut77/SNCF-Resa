<script setup>
definePageMeta({
  requiresAuth: false,
  isAdmin: false,
  layout: false,
});
useHead({
  title: "Login - Résa Pro",
  description: "Page d'authentification",
});

const { signup } = useAuth();
const { setLoader } = useLoader();

const formValue = ref({
  nom: "",
  prenom: "",
  email: "",
  password: "",
});

const validated = computed(() => {
  return formValue.value.nom != "" && formValue.value.prenom != "" && formValue.value.email != "" && formValue.value.password != "" ? true : false;
});

const goToLogin = async () => {
  await navigateTo("/login");
};

const register = async () => {
  setLoader(true);
  await signup(formValue.value);
  await navigateTo("/home");
  setLoader(false);
};
</script>

<template>
  <section class="relative h-dvh w-full text-gray-50 flex flex-col bg-gradient-to-br from-slate-900 to-slate-700 pt-12 overflow-auto">
    <img class="absolute top-12 right-8 w-14" src="../assets/img/logo_sncf.png" alt="" />
    <p class="font-bold text-2xl text-gray-100 px-8">Enregistrement</p>
    <div class="flex flex-col gap-4 pt-10 px-8">
      <AppInput name="nom" type="text" title="Nom : " placeholder="Entrez votre nom" v-model="formValue.nom" />
      <AppInput name="prenom" type="text" title="Prénom : " placeholder="Entrez votre prénom" v-model="formValue.prenom" />
      <AppInput name="email" type="email" title="Email : " placeholder="Entrez votre email pro" v-model="formValue.email" />
      <div class="flex flex-col">
        <AppInput name="password" type="password" title="Mot de passe : " placeholder="" v-model="formValue.password" />
        <p class="text-xs ml-auto pt-2.5 text-gray-300">Minimun 8 charactères</p>
      </div>

      <AppButtonCarre class="ml-auto my-4" direction="" :validated="validated" @click="register()"> <template #default> Se connecter </template> </AppButtonCarre>
    </div>
    <div class="relative mt-auto">
      <svg class="absolute bottom-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#0284c7" fill-opacity="1" d="M0,32L48,32C96,32,192,32,288,80C384,128,480,224,576,245.3C672,267,768,213,864,208C960,203,1056,245,1152,234.7C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      <svg class="absolute bottom-14 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#0284c7" fill-opacity="1" d="M0,288L48,282.7C96,277,192,267,288,224C384,181,480,107,576,80C672,53,768,75,864,117.3C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      <svg class="absolute bottom-14 opacity-25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#0284c7" fill-opacity="1" d="M0,128L48,138.7C96,149,192,171,288,154.7C384,139,480,85,576,80C672,75,768,117,864,117.3C960,117,1056,75,1152,85.3C1248,96,1344,160,1392,192L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      <div class="h-16 w-full bg-[#0284c7] px-4"></div>
      <p class="absolute bottom-0 left-0 right-0 text-center text-gray-50 text-sm p-4 cursor-pointer" @click="goToLogin()">Déjà un compte ? Par ici</p>
    </div>
  </section>
</template>

<style></style>
