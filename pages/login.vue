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

const { login } = useAuth();
const { setLoader } = useLoader();
const { addToast } = useToast();
const supabase = useSupabaseClient();

const formValue = ref({
  email: "",
  password: "",
});
const modalPassword = ref(false);
const emailResetPassword = ref("");

const validated = computed(() => {
  return formValue.value.email != "" && formValue.value.password != "" ? true : false;
});

const validatedEmail = computed(() => {
  return emailResetPassword.value != "" ? true : false;
});

const goToSignup = async () => {
  await navigateTo("/signup");
};

const signIn = async () => {
  setLoader(true);
  await login(formValue.value);
  await navigateTo("/home");
  setLoader(false);
};

const showModalPassword = () => {
  modalPassword.value = !modalPassword.value;
};

const sendResetMdp = async () => {
  try {
    setLoader(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(emailResetPassword.value, {
      redirectTo: "http://localhost:3000/resetMdp",
    });
    modalPassword.value = false;
    setLoader(false);

    addToast({ type: "Success", title: "Demande envoyé", message: "Un email vous à été envoyé." });
  } catch (err) {
    addToast({ type: "Error", title: "Problème lors de la modification du mot de passe.", message: err.message });

    setLoader(false);
  }
};
</script>

<template>
  <section class="relative h-dvh w-full text-gray-50 flex flex-col bg-slate-100 pt-12 overflow-auto">
    <img class="absolute top-12 right-8 w-14" src="../assets/img/logo.png" alt="" />

    <p class="font-bold text-2xl text-gray-700 px-8">Authentification</p>

    <form class="mb-0 space-y-6" @submit.prevent="signIn()">
      <div class="flex flex-col gap-4 pt-10 px-8">
        <AppInput name="email" type="email" title="Email : " placeholder="Entrez votre email professionel" v-model="formValue.email" />
        <div class="flex flex-col">
          <AppInput name="password" type="password" title="Mot de passe : " placeholder="" v-model="formValue.password" />
          <p class="text-xs ml-auto pt-2.5 text-gray-700 cursor-pointer" @click="showModalPassword()">Mot de passe oublié ?</p>
        </div>
        <AppButtonCarre class="ml-auto my-4" direction="" :validated="validated" type="submit"> <template #default> Se connecter </template> </AppButtonCarre>
      </div>
    </form>
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
      <p class="absolute bottom-0 left-0 right-0 text-center text-gray-50 text-sm p-4 cursor-pointer pb-8" @click="goToSignup()">Pas de compte ? Inscription par ici !</p>
    </div>

    <AppModal v-if="modalPassword" :closeModal="showModalPassword">
      <template #title>
        <span class="text-lg text-gray-700 font-medium text-center">Pour réinitialiser votre mot de passe, merci de renseigner votre adressse mail professionel.</span>
      </template>
      <template #default>
        <div class="w-full">
          <AppInput name="email" type="email" title="Email : " v-model="emailResetPassword" />
        </div>

        <span class="text-base text-cyan-700 font-bold"> </span>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4">
          <AppButtonValidated class="w-32" theme="cancel" @click="showModalPassword()"> <template #default> Annuler </template> </AppButtonValidated>
          <AppButtonValidated class="w-32" theme="" :validated="validatedEmail" @click="sendResetMdp()"> <template #default> Envoyer </template> </AppButtonValidated>
        </div>
      </template>
    </AppModal>
  </section>
</template>
