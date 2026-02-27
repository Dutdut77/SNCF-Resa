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

const initials = computed(() => {
  if (!userProfil.value) return "";
  const p = userProfil.value.prenom?.[0] ?? "";
  const n = userProfil.value.nom?.[0] ?? "";
  return `${p}${n}`.toUpperCase();
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
  return userProfil.value?.nom != "" && userProfil.value?.prenom ? true : false;
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
    const { error } = await supabase.auth.updateUser({
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
  <nav class="w-full h-16 flex items-center bg-linear-to-br from-slate-700 to-slate-900 text-white print:hidden shadow-md">
    <div class="flex items-center h-full w-full px-4 gap-3">
      <!-- Logo -->
      <div class="h-full flex flex-col justify-center items-start -mt-0.5 shrink-0 w-20">
        <div class="font-traverse text-xl first-letter:text-sky-400 tracking-widest pl-0.5 text-white">résa</div>
        <div class="text-[10px] bg-white/20 px-2.5 py-0.5 text-white rounded w-14 text-center -mt-1 font-bold uppercase tracking-widest">pro</div>
      </div>

      <!-- Séparateur -->
      <div class="w-px h-6 bg-white/30 shrink-0" />

      <!-- Selector secteur -->
      <div v-if="route.params.id" class="relative h-full flex items-center" @mouseleave="onMouseLeaveSecteur">
        <div class="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-white/15 transition-colors" @mouseenter="isDropdownOpenSecteur = true" @click="isDropdownOpenSecteur = !isDropdownOpenSecteur">
          <Icon name="material-symbols:grid-view-rounded" size="20" class="text-sky-400 shrink-0" />
          <span class="font-semibold uppercase text-sm text-white">{{ secteurActive?.name }}</span>
          <Icon name="material-symbols:chevron-right" size="16" class="text-slate-400 transition-transform duration-200" :class="isDropdownOpenSecteur ? '-rotate-90' : 'rotate-90'" />
        </div>

        <Transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
          <div v-show="isDropdownOpenSecteur" class="absolute top-full left-0 mt-1 z-50 p-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl grid grid-cols-2 gap-1">
            <NuxtLink v-for="(secteur, index) in secteurs" :key="index" :to="`/calendrier/${secteur.id}`" class="px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors" :class="secteur.id == route.params.id ? 'bg-sky-500/20 text-sky-400' : 'text-slate-300 hover:bg-slate-700 hover:text-white'" @click="isDropdownOpenSecteur = false">
              {{ secteur.name }}
            </NuxtLink>
          </div>
        </Transition>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- User menu -->
      <div v-if="userProfil" class="relative h-full flex items-center" @mouseleave="onMouseLeaveProfil">
        <div class="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-white/15 transition-colors" @mouseenter="isDropdownOpenProfil = true" @click="isDropdownOpenProfil = !isDropdownOpenProfil">
          <!-- Avatar initiales -->
          <div class="size-8 rounded-full bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {{ initials }}
          </div>
          <!-- Nom (lg+) -->
          <span class="hidden lg:block text-sm font-medium text-white">{{ userProfil.prenom }} {{ userProfil.nom }}</span>
          <!-- Chevron -->
          <Icon name="material-symbols:chevron-right" size="16" class="text-slate-400 transition-transform duration-200" :class="isDropdownOpenProfil ? '-rotate-90' : 'rotate-90'" />
        </div>

        <Transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
          <div v-show="isDropdownOpenProfil" class="absolute top-full right-0 mt-1 z-50 w-60 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
            <!-- Header -->
            <div class="px-4 py-3 border-b border-slate-700">
              <p class="text-sm font-medium text-white">{{ userProfil.prenom }} {{ userProfil.nom }}</p>
              <p class="text-xs text-slate-400 truncate">{{ session?.user?.email }}</p>
            </div>
            <!-- Actions profil -->
            <div class="py-1">
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                @click="
                  showModalProfil();
                  isDropdownOpenProfil = false;
                "
              >
                <Icon name="material-symbols:person-outline-rounded" size="16" class="shrink-0" />
                Mon profil
              </button>
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                @click="
                  showModalPassword();
                  isDropdownOpenProfil = false;
                "
              >
                <Icon name="si:lock-line" size="16" class="shrink-0" />
                Changer le mot de passe
              </button>
            </div>
            <!-- Déconnexion -->
            <div class="border-t border-slate-700 py-1">
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                @click="
                  logout();
                  isDropdownOpenProfil = false;
                "
              >
                <Icon name="material-symbols:logout-rounded" size="16" class="shrink-0" />
                Se déconnecter
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Modal changement de mot de passe -->
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
          <AppButtonValidated class="w-32" theme="cancel" @click="showModalPassword()"><template #default>Annuler</template></AppButtonValidated>
          <AppButtonValidated class="w-32" theme="" :validated="validatedForm" @click="changeMdp()"><template #default>Enregistrer</template></AppButtonValidated>
        </div>
      </template>
    </AppModal>

    <!-- Modal profil -->
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
          <AppButtonValidated class="w-32" theme="cancel" @click="showModalProfil()"><template #default>Annuler</template></AppButtonValidated>
          <AppButtonValidated class="w-32" theme="" :validated="validatedFormProfil" @click="updateProfil()"><template #default>Enregistrer</template></AppButtonValidated>
        </div>
      </template>
    </AppModal>
  </nav>
</template>
