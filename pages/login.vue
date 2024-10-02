<script setup>
const { addToast } = useToast();
const { setLoader } = useLoader();
const { login, signup } = useAuth();
const supabase = useSupabaseClient();
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

const validatedSignin = computed(() => {
  return email.value != "" && password.value != "" ? true : false;
});

const validatedSignup = computed(() => {
  return formValue.value.nom != "" && formValue.value.prenom != "" && formValue.value.email != "" && formValue.value.password != "" ? true : false;
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
  console.log(route);
  if (formValue.value.password.length < 8) {
    addToast({ type: "Error", title: "Mot de passe non conforme", message: "Votre mot de passe doit contenir au minimum 8 charactères" });
  } else if (!isEmailValid(formValue.value.email)) {
    addToast({ type: "Error", title: "Email non conforme", message: "Votre adresse doit contenir un @ et se terminer par reseau.sncf.fr" });
  } else {
    setLoader(true);
    await signup(formValue.value);
    if (route.query.redirect) {
      await navigateTo(route.query.redirect);
    } else {
      await navigateTo("/");
    }
    setLoader(false);
  }
};
const showSignup = () => {
  viewSignup.value = !viewSignup.value;
};
</script>

<template>
  <section class="relative h-dvh w-dvw overflow-hidden flex">
    <div v-if="viewSignup" class="relative w-full lg:w-1/2 h-full flex flex-col bg-slate-50">
      <div class="absolute top-6 right-6">
        <img class="h-12" src="@/assets/img/logo.png" alt="Logo SNCF" />
      </div>

      <form class="h-full px-6 pt-4 flex flex-col justify-center items-center text-gray-700 gap-4" @submit.prevent="register()">
        <div class="text-2xl font-Medium w-full xl:w-1/2 cursor-default">
          <p>Enregistrement Résa Pro</p>
          <p class="text-sm italic text-gray-500">Votre solution de réservation en ligne pour véhicules et salles</p>
        </div>

        <div class="w-full xl:w-1/2 flex flex-col gap-4 pt-4">
          <AppInput name="nom" type="text" title="Nom : " placeholder="Entrez votre nom" v-model="formValue.nom" />
          <AppInput name="prenom" type="text" title="Prénom : " placeholder="Entrez votre prénom" v-model="formValue.prenom" />
          <AppInput name="email" type="text" title="Email : " placeholder="Entrez votre email professionnel" v-model="formValue.email" />
          <div class="flex flex-col">
            <AppInput name="password" type="password" title="Mot de passe : " placeholder="Minimun 8 charactères" v-model="formValue.password" />
          </div>

          <AppButtonCarre class="ml-auto my-4" direction="" :validated="validatedSignup"> <template #default> Se connecter </template> </AppButtonCarre>
        </div>
        <div class="w-full xl:w-1/2">
          <p class="text-center text-gray-500 text-sm cursor-pointer w-fit mx-auto hover:font-medium hover:text-gray-800 duration-300" @click="showSignup()">Déjà un compte ? Par ici</p>
        </div>
      </form>

      <div class="text-xs text-gray-600 cursor-default text-center p-4">Copyright © 2024 - GRANDMAIRE Nicolas</div>
    </div>

    <div class="hidden lg:block absolute top-0 bottom-0 w-1/2 z-40 transition-all duration-500" :class="viewSignup ? ' translate-x-full ' : ' translate-x-0 '">
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
          Simplifiez vos réservations grâce à Resa Pro, une plateforme dédiée aux professionnels pour gérer vos réservations de véhicules et de salles en toute simplicité. Que vous ayez besoin d'une salle pour une réunion importante ou d'un véhicule pour vos déplacements, Resa Pro vous permet de réserver rapidement, suivre vos réservations en temps réel et optimiser la gestion de vos ressources.
        </div>
      </div>
    </div>

    <div v-if="!viewSignup" class="relative w-full lg:w-1/2 h-full flex flex-col ml-auto bg-slate-50">
      <div class="absolute top-6 right-6">
        <img class="h-12" src="@/assets/img/logo.png" alt="Logo SNCF" />
      </div>

      <form class="h-full px-6 pt-4 flex flex-col justify-center items-center text-gray-700 gap-4" @submit.prevent="signIn()">
        <div class="text-2xl font-Medium w-full xl:w-1/2 cursor-default">
          <p>Bienvenue sur Résa Pro</p>
          <p class="text-sm italic text-gray-500">Votre solution de réservation en ligne pour véhicules et salles</p>
        </div>

        <div class="w-full xl:w-1/2 flex flex-col gap-4 pt-2">
          <AppInput class="" name="Email" type="text" title="Email professionnel : " placeholder="Entrez votre email SNCF" v-model="email" />
          <AppInput name="password" type="password" title="Mot de passe : " placeholder="Entrez votre mot de passe" v-model="password" />
        </div>

        <div class="w-full xl:w-1/2 flex gap-4">
          <AppButtonCarre class="ml-auto" theme="primary" :validated="validatedSignin"> <template #default> Se connecter </template> </AppButtonCarre>
        </div>
        <div class="w-full xl:w-1/2">
          <div class="text-end text-gray-500 text-sm cursor-pointer w-fit ml-auto hover:font-medium hover:text-gray-800 duration-300"><p @click="showModalPassword()">Mot de passe oublié ?</p></div>
          <div class="text-end text-gray-500 text-sm cursor-pointer w-fit ml-auto hover:font-medium hover:text-gray-800 duration-300"><p @click="showSignup()">Pas de compte ? Inscription par ici !</p></div>
        </div>
      </form>

      <div class="text-xs text-gray-600 cursor-default text-center p-4">Copyright © 2024 - GRANDMAIRE Nicolas</div>
    </div>
  </section>
</template>

<style></style>
