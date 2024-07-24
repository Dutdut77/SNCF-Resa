<script setup>
import Save from "@/assets/svg/Save.vue";

definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "Profil - Résa Pro",
  description: "Profil utilisateur",
});

const { addToast } = useToast();
const { setLoader } = useLoader();
const userProfil = useState("userProfil");
const { updateProfiles } = useAuth();
const supabase = useSupabaseClient();
const newPassword = ref("");
const modalPassword = ref(false);
const modalMentions = ref(false);

const updateProfil = async () => {
  setLoader(true);
  await updateProfiles(userProfil.value);
  setLoader(false);
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
  }
  navigateTo({ path: "/login" });
};

const showModalPassword = () => {
  modalPassword.value = !modalPassword.value;
};

const showModalMentions = () => {
  modalMentions.value = !modalMentions.value;
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
  <ResaPage>
    <template #title>
      <div class="-space-y-1">
        <p class="text-xl font-bold">Mon profil</p>
        <p class="text-sm italic">Gestion du profil</p>
      </div>
    </template>

    <template #default>
      <div class="h-full flex flex-col gap-4 px-4">
        <AppInput name="prenom" type="text" title="Prénom : " v-model="userProfil.prenom" />
        <AppInput name="nom" type="text" title="Nom : " v-model="userProfil.nom" />

        <AppButtonValidated class="w-fit px-4 mt-auto ml-auto" theme="" @click="updateProfil()">
          <template #default>
            <div class="flex gap-2">
              <Save class="w-6 h-6 cursor-pointer" />
              <p>Enregistrer</p>
            </div>
          </template>
        </AppButtonValidated>
      </div>
    </template>

    <template #footer>
      <div class="mt-auto">
        <div class="w-full border-t pt-4 text-sm flex justify-between">
          <div>
            <p class="cursor-pointer" @click="showModalPassword()">Changer de mot de passe</p>
            <p class="cursor-pointer" @click="logout()">Se déconnecter</p>
          </div>
          <div>
            <p class="cursor-pointer text-right">Contact</p>
            <p class="cursor-pointer text-right" @click="showModalMentions()">Mentions légales</p>
          </div>
        </div>
      </div>
    </template>
    <template #modal>
      <AppModal v-if="modalPassword" :closeModal="showModalPassword">
        <template #title>
          <span class="text-xl text-gray-700 font-bold uppercase">Modification mot de passe</span>
        </template>
        <template #default>
          <div class="w-full">
            <AppInput name="password" type="password" title="Mot de passe : " v-model="newPassword" />
          </div>

          <span class="text-base text-cyan-700 font-bold"> </span>
        </template>
        <template #footer>
          <div class="flex justify-end gap-4">
            <AppButtonValidated class="w-32" theme="cancel" @click="showModalPassword()"> <template #default> Annuler </template> </AppButtonValidated>
            <AppButtonValidated class="w-32" theme="" @click="changeMdp()"> <template #default> Enregistrer </template> </AppButtonValidated>
          </div>
        </template>
      </AppModal>

      <AppModal v-if="modalMentions" :closeModal="showModalMentions">
        <template #title>
          <span class="text-xl text-gray-700 font-bold uppercase">Mentions Légales</span>
        </template>
        <template #default>
          <div class="w-full">a venir...</div>

          <span class="text-base text-cyan-700 font-bold"> </span>
        </template>
        <template #footer>
          <div class="flex justify-end gap-4">
            <AppButtonValidated class="w-32" theme="cancel" @click="showModalMentions()"> <template #default> Fermer </template> </AppButtonValidated>
          </div>
        </template>
      </AppModal>
    </template>
  </ResaPage>
</template>
