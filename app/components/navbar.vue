<script setup>
const route = useRoute();
const { setLoader } = useLoader();
const { getAll, secteurs } = useSecteurs();
const { addToast } = useToast();
const session = useSupabaseSession();
const supabase = useSupabaseClient();
const userProfil = useState("userProfil");
const { updateProfiles } = useAuth();

if (session.value) {
  setLoader(true);
  await getAll();
  setLoader(false);
}

const viewDropdown = ref(false);
const modalPassword = ref(false);
const modalProfil = ref(false);
const newPassword = ref("");
const isDropdownOpenSecteur = ref(false);
const isDropdownOpenProfil = ref(false);

const secteurActive = computed(() => {
  const result = secteurs.value.find((obj) => obj.id == route.params.id);
  return result;
});

const onMouseLeaveSecteur = (event) => {
  if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
    isDropdownOpenSecteur.value = false;
  }
};

const onMouseLeaveProfil = (event) => {
  if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
    isDropdownOpenProfil.value = false;
  }
};

const firstLetter = (data) => {
  return data.charAt(0);
};

const showDropdown = () => {
  viewDropdown.value = !viewDropdown.value;
};
const showModalPassword = () => {
  modalPassword.value = !modalPassword.value;
};

const showModalProfil = () => {
  modalProfil.value = !modalProfil.value;
};
const validatedForm = computed(() => {
  return newPassword.value != "" ? true : false;
});

const validatedFormProfil = computed(() => {
  return userProfil.value.nom != "" && userProfil.value.prenom ? true : false;
});

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
  }
  navigateTo({ path: "/login" });
};

const changeMdp = async () => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword.value,
    });
    modalPassword.value = false;
    if (error) throw error;

    addToast({ type: "Success", title: "Félicitation", message: "Votre nouveau mot de passe à été enregistré." });
  } catch (err) {
    addToast({ type: "Error", title: "Problème lors de la modification du mot de passe.", message: err.message });
  }
};

const updateProfil = async () => {
  setLoader(true);
  await updateProfiles(userProfil.value);
  viewDropdown.value = false;
  showModalProfil();
  setLoader(false);
};
</script>

<template>
  <section class="w-full h-16 flex items-center text-gray-700">
    <div class="h-full w-28 pl-4 uppercase font-bold flex flex-col justify-center items-start -mt-0.5">
      <div class="font-traverse text-xl first-letter:text-sncf-primary text-center tracking-widest pl-0.5 lg:pl-1">résa</div>
      <div class="text-sm bg-gradient-to-br from-sncf-primary-light to-sncf-primary px-4 text-white rounded w-fit -mt-1">pro</div>
    </div>

    <div v-if="route.params.id" class="relative w-full h-full flex flex-col items-center justify-center" @mouseleave="onMouseLeaveSecteur">
      <div class="relative w-fit h-full flex flex-col items-center justify-center cursor-pointer" @mouseenter="isDropdownOpenSecteur = true" @click="isDropdownOpenSecteur = !isDropdownOpenSecteur">
        <div class="font-bold uppercase text-xl">{{ secteurActive?.name }}</div>
        <div class="absolute bottom-0">
          <Icon name="material-symbols:chevron-right" class="size-6 rotate-90" />
        </div>

        <div v-show="isDropdownOpenSecteur" class="absolute -bottom-44 z-40 p-4 w-72 bg-gradient-to-br from-slate-600 to-slate-900 border border-slate-600 rounded-xl grid grid-cols-2 gap-2 shadow-lg" @click="isDropdownOpenSecteur = !isDropdownOpenSecteur">
          <NuxtLink :to="`/calendrier/${secteur.id}`" class="px-2 py-1 border border-gray-200 bg-white uppercase font-medium rounded-lg text-center text-sm hover:text-sncf-primary" v-for="(secteur, index) in secteurs" :key="index" @click="isDropdownOpenSecteur = !isDropdownOpenSecteur">
            {{ secteur.name }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="relative w-28 h-full pr-4 flex items-center justify-end ml-auto" @mouseleave="onMouseLeaveProfil">
      <div class="relative w-fit h-full flex gap-2 justify-center items-center cursor-pointer" @mouseenter="isDropdownOpenProfil = true" @click="isDropdownOpenProfil = !isDropdownOpenProfil">
        <div class="flex flex-row-reverse lg:gap-2 lg:flex-row rounded-full lg:rounded-none lg:border-none border border-gray-600 p-2">
          <p class="text-base font-medium lg:hidden">{{ firstLetter(userProfil.nom) }}</p>
          <p class="text-base font-medium lg:hidden">{{ firstLetter(userProfil.prenom) }}</p>
          <p class="hidden text-base font-medium lg:block">{{ userProfil.nom }}</p>
          <p class="hidden text-base font-medium lg:block">{{ userProfil.prenom }}</p>
        </div>

        <div v-show="isDropdownOpenProfil" class="absolute -bottom-24 right-0 border border-gray-200 rounded-lg bg-white p-4 z-50 shadow-lg text-right w-fit">
          <p class="cursor-pointer hover:font-medium duration-500 whitespace-nowrap" @click="showModalProfil(), (isDropdownOpenProfil = !isDropdownOpenProfil)">Mon profil</p>
          <p class="cursor-pointer hover:font-medium duration-500 whitespace-nowrap" @click="showModalPassword(), (isDropdownOpenProfil = !isDropdownOpenProfil)">Changer de mot de passe</p>
          <p class="cursor-pointer w-fit ml-auto hover:font-medium duration-500 whitespace-nowrap" @click="logout(), (isDropdownOpenProfil = !isDropdownOpenProfil)">Se déconnecter</p>
        </div>
      </div>
    </div>

    <AppModal v-if="modalPassword" :closeModal="showModalPassword">
      <template #title>
        <span class="text-xl text-gray-700 font-bold uppercase">Modification du mot de passe</span>
      </template>
      <template #default>
        <div class="w-full p-4">
          <AppInput name="password" type="password" title="Nouveau mot de passe : " placeholder="*****" v-model="newPassword" />
        </div>

        <span class="text-base text-cyan-700 font-bold"> </span>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4">
          <AppButtonValidated class="w-32" theme="cancel" @click="showModalPassword()"> <template #default> Annuler </template> </AppButtonValidated>
          <AppButtonValidated class="w-32" theme="" :validated="validatedForm" @click="changeMdp()"> <template #default> Enregistrer </template> </AppButtonValidated>
        </div>
      </template>
    </AppModal>
    <!-- Modal Profil -->
    <AppModal v-if="modalProfil" :closeModal="showModalProfil">
      <template #title>
        <span class="text-xl text-gray-700 font-bold uppercase">Mon profil</span>
      </template>
      <template #default>
        <div class="w-full flex flex-col gap-4 p-4">
          <AppInput name="nom" type="text" title="Nom : " placeholder="" v-model="userProfil.nom" />
          <AppInput name="prenom" type="text" title="Prénom : " placeholder="" v-model="userProfil.prenom" />
          <AppSelect name="secteur" title="Secteur Favori: " v-model="userProfil.favorite_secteur">
            <template #options>
              <option class="" value="" disabled hidden>Choisissez votre secteur</option>
              <option v-for="(secteur, index) in secteurs" :key="index" :value="secteur.id" :data="secteur.id">{{ secteur.name }}</option>
            </template>
          </AppSelect>
        </div>

        <span class="text-base text-cyan-700 font-bold"> </span>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4">
          <AppButtonValidated class="w-32" theme="cancel" @click="showModalProfil()"> <template #default> Annuler </template> </AppButtonValidated>
          <AppButtonValidated class="w-32" theme="" :validated="validatedFormProfil" @click="updateProfil()"> <template #default> Enregistrer </template> </AppButtonValidated>
        </div>
      </template>
    </AppModal>
  </section>
</template>
