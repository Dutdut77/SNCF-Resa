<script setup>
const { addToast } = useToast();
const { setLoader } = useLoader();
const { login, signup, resetPassword } = useAuth();
const route = useRoute();

definePageMeta({
  requiresAuth: false,
  isAdmin: false,
  layout: false,
});
useHead({
  title: "Résa Pro - Login",
  description: "Page de connexion",
});

const email = ref("");
const password = ref("");
const formValue = ref({
  nom: "",
  prenom: "",
  email: "",
  password: "",
});
const viewSignup = ref(false);
const modalPassword = ref(false);
const emailResetPassword = ref("");

const validatedSignin = computed(() => {
  return email.value != "" && password.value != "" ? true : false;
});

const validatedSignup = computed(() => {
  return formValue.value.nom != "" && formValue.value.prenom != "" && formValue.value.email != "" && formValue.value.password != "" ? true : false;
});

const validatedEmail = computed(() => {
  return emailResetPassword.value !== "" && isEmailValid(emailResetPassword.value);
});

const isEmailValid = (email) => {
  return email.includes("@") && email.endsWith("reseau.sncf.fr");
};

const signIn = async () => {
  if (password.value.length < 8) {
    addToast({ type: "Error", title: "Mot de passe non conforme", message: "Votre mot de passe doit contenir au minimum 8 charactères" });
  } else if (!isEmailValid(email.value)) {
    addToast({ type: "Error", title: "Email non conforme", message: "Votre adresse doit contenir un @ et se terminer par reseau.sncf.fr" });
  } else {
    setLoader(true);
    await login({ email: email.value, password: password.value });
    if (route.query.redirect) {
      await navigateTo(route.query.redirect);
    } else {
      await navigateTo("/");
    }
    setLoader(false);
  }
};

const register = async () => {
  if (formValue.value.password.length < 8) {
    addToast({ type: "Error", title: "Mot de passe non conforme", message: "Votre mot de passe doit contenir au minimum 8 charactères" });
  } else if (!isEmailValid(formValue.value.email)) {
    addToast({ type: "Error", title: "Email non conforme", message: "Votre adresse doit contenir un @ et se terminer par reseau.sncf.fr" });
  } else {
    setLoader(true);
    await signup(formValue.value);
    setLoader(false);
    viewSignup.value = false;
  }
};
const showSignup = () => {
  viewSignup.value = !viewSignup.value;
};

const showModalPassword = () => {
  modalPassword.value = !modalPassword.value;
};

const sendResetMdp = async () => {
  if (!emailResetPassword.value) {
    addToast({ type: "Error", title: "Email requis", message: "Merci de renseigner votre email." });
    return;
  }
  setLoader(true);
  const { ok } = await resetPassword({
    email: emailResetPassword.value,
    redirectTo: import.meta.client ? `${window.location.origin}/reset-password` : undefined,
  });
  setLoader(false);
  if (ok) {
    modalPassword.value = false;
  }
};
</script>

<template>
  <section class="relative h-dvh w-dvw overflow-hidden flex bg-slate-50">
    <!-- Décor mobile : halos dégradés en arrière-plan -->
    <div class="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-24 -left-20 w-72 h-72 bg-linear-to-br from-slate-700 to-slate-500 opacity-30 rounded-full blur-3xl"></div>
      <div class="absolute top-1/3 -right-16 w-56 h-56 bg-linear-to-br from-slate-600 to-slate-400 opacity-25 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -right-16 w-72 h-72 bg-linear-to-br from-slate-700 to-slate-500 opacity-20 rounded-full blur-3xl"></div>
    </div>

    <div v-if="viewSignup" class="relative z-10 w-full lg:w-1/2 h-full flex flex-col lg:bg-slate-50 overflow-y-auto lg:overflow-visible">
      <div class="absolute top-6 right-6 z-10">
        <img class="h-12" src="@/assets/img/logo.png" alt="Logo SNCF" />
      </div>

      <form class="flex-1 px-6 pt-20 lg:pt-4 pb-10 lg:pb-4 flex flex-col justify-center-safe items-center text-gray-700 gap-4" @submit.prevent="register()">
        <!-- Logo Résa Pro mobile uniquement -->
        <div class="lg:hidden relative w-24 h-24 shrink-0 flex justify-center items-center mb-2">
          <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 rotate-45 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 opacity-25 scale-110 rotate-60 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 opacity-50 scale-110 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full border border-white/40 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
          <div class="uppercase font-bold text-2xl z-10 text-white text-center flex flex-col leading-none">
            <div class="font-traverse">résa</div>
            <div class="ml-auto text-[10px] bg-white px-1.5 text-slate-700 rounded w-fit -mt-0.5">pro</div>
          </div>
        </div>

        <div class="w-full max-w-md lg:max-w-none 2xl:w-2/3 cursor-default lg:bg-transparent bg-white/80 backdrop-blur-sm lg:backdrop-blur-none lg:p-0 p-6 rounded-2xl lg:rounded-none shadow-xl shadow-slate-900/5 lg:shadow-none">
          <div class="text-2xl font-Medium">
            <p>Enregistrement Résa Pro</p>
            <p class="text-sm italic text-gray-500">Votre solution de réservation en ligne pour véhicules et salles</p>
          </div>

          <div class="w-full flex flex-col gap-4 pt-4">
            <div class="flex flex-col xl:flex-row gap-4">
              <AppInput name="nom" type="text" title="Nom : " placeholder="Entrez votre nom" v-model="formValue.nom" />
              <AppInput name="prenom" type="text" title="Prénom : " placeholder="Entrez votre prénom" v-model="formValue.prenom" />
            </div>

            <AppInput name="email" type="text" title="Email : " placeholder="Entrez votre email professionnel" v-model="formValue.email" />
            <div class="flex flex-col">
              <AppInput name="password" type="password" title="Mot de passe : " placeholder="Minimun 8 charactères" v-model="formValue.password" />
            </div>

            <AppButtonCarre class="ml-auto my-4" direction="" :validated="validatedSignup"> <template #default> Se connecter </template> </AppButtonCarre>
          </div>
          <div class="w-full">
            <p class="text-center text-gray-500 text-sm cursor-pointer w-fit mx-auto hover:font-medium hover:text-gray-800 duration-300" @click="showSignup()">Déjà un compte ? Par ici</p>
          </div>
        </div>
      </form>

      <div class="shrink-0 text-xs text-gray-600 cursor-default text-center p-4">Copyright © 2024 - GRANDMAIRE Nicolas</div>
    </div>

    <div class="hidden lg:block absolute top-0 bottom-0 w-1/2 z-40 transition-all duration-500" :class="viewSignup ? ' translate-x-full ' : ' translate-x-0 '">
      <div class="w-full h-full flex flex-col items-center gap-8 justify-center bg-linear-to-br from-slate-600 to-slate-900">
        <div class="relative w-[150px] h-[150px] flex justify-center items-center">
          <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 rotate-45 rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 opacity-25 scale-110 rotate-[60deg] rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 opacity-50 scale-110 rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full border rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%]"></span>

          <div class="uppercase font-bold text-4xl z-10 text-white text-center flex flex-col">
            <div class="font-traverse">résa</div>
            <div class="ml-auto text-sm bg-white px-3 text-slate-700 rounded w-fit -mt-2">pro</div>
          </div>
        </div>
        <div class="w-3/4 text-white dark:text-gray-200 text-justify">
          Simplifiez vos réservations grâce à Resa Pro, une plateforme dédiée aux professionnels pour gérer vos réservations de véhicules et de salles en toute simplicité. Que vous ayez besoin d'une salle pour une réunion importante ou d'un véhicule pour vos déplacements, Resa Pro vous permet de réserver rapidement, suivre vos réservations en temps réel et optimiser la gestion de vos ressources.
        </div>
      </div>
    </div>

    <div v-if="!viewSignup" class="relative z-10 w-full lg:w-1/2 h-full flex flex-col ml-auto lg:bg-slate-50 overflow-y-auto lg:overflow-visible">
      <div class="absolute top-6 right-6 z-10">
        <img class="h-12" src="@/assets/img/logo.png" alt="Logo SNCF" />
      </div>

      <form class="flex-1 px-6 pt-20 lg:pt-4 pb-10 lg:pb-4 flex flex-col justify-center-safe items-center text-gray-700 gap-4" @submit.prevent="signIn()">
        <!-- Logo Résa Pro mobile uniquement -->
        <div class="lg:hidden relative w-24 h-24 shrink-0 flex justify-center items-center mb-2">
          <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 rotate-45 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 opacity-25 scale-110 rotate-60 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 opacity-50 scale-110 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
          <span class="absolute top-0 left-0 w-full h-full border border-white/40 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
          <div class="uppercase font-bold text-2xl z-10 text-white text-center flex flex-col leading-none">
            <div class="font-traverse">résa</div>
            <div class="ml-auto text-[10px] bg-white px-1.5 text-slate-700 rounded w-fit -mt-0.5">pro</div>
          </div>
        </div>

        <div class="w-full max-w-md lg:max-w-none 2xl:w-2/3 cursor-default lg:bg-transparent bg-white/80 backdrop-blur-sm lg:backdrop-blur-none lg:p-0 p-6 rounded-2xl lg:rounded-none shadow-xl shadow-slate-900/5 lg:shadow-none">
          <div class="text-2xl font-Medium">
            <p>Bienvenue sur Résa Pro</p>
            <p class="text-sm italic text-gray-500">Votre solution de réservation en ligne pour véhicules et salles</p>
          </div>

          <div class="w-full flex flex-col gap-4 pt-4">
            <AppInput name="Email" type="text" title="Email professionnel : " placeholder="Entrez votre email SNCF" v-model="email" />
            <AppInput name="password" type="password" title="Mot de passe : " placeholder="Entrez votre mot de passe" v-model="password" />
          </div>

          <div class="w-full flex gap-4 pt-4">
            <AppButtonCarre class="ml-auto" theme="primary" :validated="validatedSignin"> <template #default> Se connecter </template> </AppButtonCarre>
          </div>
          <div class="w-full pt-2">
            <div class="text-end text-gray-500 text-sm cursor-pointer w-fit ml-auto hover:font-medium hover:text-gray-800 duration-300"><p @click="showModalPassword()">Mot de passe oublié ?</p></div>
            <div class="text-end text-gray-500 text-sm cursor-pointer w-fit ml-auto hover:font-medium hover:text-gray-800 duration-300"><p @click="showSignup()">Pas de compte ? Inscription par ici !</p></div>
          </div>
        </div>
      </form>

      <div class="text-xs text-gray-600 cursor-default text-center p-4">Copyright © 2026 - GRANDMAIRE Nicolas</div>
    </div>
    <AppModal v-if="modalPassword" :closeModal="showModalPassword">
      <template #title>
        <div class="flex flex-col items-center gap-3 px-8 pt-2">
          <div class="relative w-18 h-18 flex justify-center items-center">
            <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 rotate-45 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
            <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 opacity-25 scale-110 rotate-60 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
            <span class="absolute top-0 left-0 w-full h-full bg-linear-to-br from-slate-700 to-slate-500 opacity-50 scale-110 rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
            <span class="absolute top-0 left-0 w-full h-full border rounded-[38%_62%_63%_37%/41%_44%_56%_59%]"></span>
            <div class="uppercase font-bold text-lg z-10 text-white text-center flex flex-col leading-none">
              <div class="font-traverse">résa</div>
              <div class="ml-auto text-[9px] bg-white px-1.5 text-slate-700 rounded w-fit -mt-0.5">pro</div>
            </div>
          </div>
          <div class="text-center">
            <p class="text-lg font-semibold text-gray-800">Mot de passe oublié ?</p>
            <p class="text-sm text-gray-500 mt-1">Renseignez votre adresse mail professionnelle pour recevoir un lien de réinitialisation.</p>
          </div>
        </div>
      </template>
      <template #default>
        <div class="w-full px-8 pb-2">
          <AppInput name="email" type="email" title="Email : " placeholder="prenom.nom@reseau.sncf.fr" v-model="emailResetPassword" />
        </div>
      </template>
      <template #footer>
        <div class="w-full flex justify-end gap-3 px-8 pb-6">
          <AppButtonValidated class="w-32" theme="cancel" @click="showModalPassword()"> <template #default> Annuler </template> </AppButtonValidated>
          <AppButtonValidated class="w-32" theme="" :validated="validatedEmail" @click="sendResetMdp()"> <template #default> Envoyer </template> </AppButtonValidated>
        </div>
      </template>
    </AppModal>
  </section>
</template>

<style></style>
