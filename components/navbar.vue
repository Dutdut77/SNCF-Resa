<script setup>
import Right from "@/assets/svg/Right.vue";

const route = useRoute();
const { setLoader } = useLoader();
const { getAll, secteurs } = useSecteurs();
const { addToast } = useToast();
const session = useSupabaseSession();
const supabase = useSupabaseClient();
const userProfil = useState("userProfil");

if (session.value) {
  setLoader(true);
  await getAll();
  setLoader(false);
}

const showSubmenuSecteurs = ref(false);
const viewDropdown = ref(false);
const modalPassword = ref(false);
const newPassword = ref("");
const secteurActive = computed(() => {
  const result = secteurs.value.find((obj) => obj.id == route.params.id);
  return result;
});

const firstLetter = (data) => {
  return data.charAt(0);
};

const showDropdown = () => {
  viewDropdown.value = !viewDropdown.value;
};
const showModalPassword = () => {
  modalPassword.value = !modalPassword.value;
};
const validatedForm = computed(() => {
  return newPassword.value != "" ? true : false;
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
</script>

<template>
  <section class="w-full h-16 flex items-center text-gray-700">
    <div class="h-full w-20 pl-4 uppercase font-bold flex flex-col justify-center -mt-0.5">
      <div class="font-traverse text-xl first-letter:text-sncf-primary text-center tracking-widest">résa</div>
      <div class="text-sm bg-gradient-to-br from-sncf-primary-light to-sncf-primary px-4 text-white rounded w-fit -mt-1">pro</div>
    </div>

    <div class="relative w-full h-full flex flex-col items-center justify-center">
      <div class="relative w-fit h-full flex flex-col items-center justify-center cursor-pointer" @click="showSubmenuSecteurs = !showSubmenuSecteurs">
        <div class="font-bold uppercase text-xl">{{ secteurActive?.name }}</div>
        <Right class="absolute bottom-0 size-6 rotate-90" />

        <div v-if="showSubmenuSecteurs" class="absolute -bottom-44 z-40 p-4 w-72 bg-gradient-to-br from-slate-600 to-slate-900 border rounded-xl grid grid-cols-2 gap-2 shadow-lg">
          <NuxtLink :to="`/calendrier/${secteur.id}`" class="px-2 py-1 border bg-white uppercase font-medium rounded-lg text-center text-sm hover:text-sncf-primary" v-for="(secteur, index) in secteurs" :key="index">
            {{ secteur.name }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="h-full w-20 pr-4 flex items-center justify-end">
      <div class="h-10 w-10 bg-gray-100 border border-gray-700 rounded-full flex justify-center items-center cursor-pointer hover:bg-sky-500 hover:border-sky-500 hover:text-white duration-500" @click="showDropdown()">
        <p class="text-sm font-medium">{{ firstLetter(userProfil.prenom) }}</p>
        <p class="text-sm font-medium">{{ firstLetter(userProfil.nom) }}</p>
      </div>
    </div>

    <div v-if="viewDropdown" class="absolute -bottom-20 right-4 border rounded-lg bg-white p-4 z-50 shadow-lg text-right">
      <p class="cursor-pointer hover:font-medium duration-500" @click="showModalPassword()">Changer de mot de passe</p>
      <p class="cursor-pointer w-fit ml-auto hover:font-medium duration-500" @click="logout()">Se déconnecter</p>
    </div>
    <AppModal v-if="modalPassword" :closeModal="showModalPassword">
      <template #title>
        <span class="text-xl text-gray-700 font-bold uppercase">Modification du mot de passe</span>
      </template>
      <template #default>
        <div class="w-full">
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
  </section>
</template>
