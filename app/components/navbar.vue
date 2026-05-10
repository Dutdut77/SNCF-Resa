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
const mobileMenuOpen = ref(false);
const mobileSecteursOpen = ref(false);
const mobileProfilOpen = ref(false);

const secteurActive = computed(() => {
  if (route.path.startsWith("/calendrier")) {
    const fromRoute = secteurs.value.find((obj) => obj.id == route.params.id);
    if (fromRoute) return fromRoute;
  }
  const favId = userProfil.value?.favorite_secteur;
  const fav = favId ? secteurs.value.find((obj) => obj.id == favId) : null;
  return fav ?? secteurs.value[0];
});

const isOnCalendrier = computed(() => route.path.startsWith("/calendrier"));
const activeSecteurId = computed(() => (isOnCalendrier.value ? route.params.id : null));
const isOnMesResa = computed(() => route.path.startsWith("/mes-reservations"));
const isOnSignalement = computed(() => route.path.startsWith("/signalement"));
const isOnAdministration = computed(() => route.path.startsWith("/administration"));
const isAdmin = computed(() => !!userProfil.value?.secteur_admin);

const defaultCalendrierPath = computed(() => {
  const fav = userProfil.value?.favorite_secteur;
  if (fav) return `/calendrier/${fav}`;
  if (secteurs.value?.[0]) return `/calendrier/${secteurs.value[0].id}`;
  return "/";
});

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false;
    mobileSecteursOpen.value = false;
    mobileProfilOpen.value = false;
  },
);

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
  <nav class="w-full h-16 flex items-center bg-white text-slate-700 border-b border-slate-200 print:hidden relative">
    <div class="flex items-center h-full w-full px-4 lg:px-6 gap-2">
      <!-- Logo -->
      <NuxtLink :to="defaultCalendrierPath" class="h-full flex flex-col justify-center items-start shrink-0">
        <div class="font-traverse text-xl first-letter:text-sky-600 tracking-widest pl-0.5 text-slate-800 leading-none">résa</div>
        <div class="text-[10px] bg-linear-to-br from-sky-400 to-sky-600 px-2.5 py-0.5 text-white rounded w-14 text-center ml-0.5 font-bold uppercase tracking-widest leading-none">pro</div>
      </NuxtLink>

      <!-- Chip secteur (contexte courant) - desktop -->
      <div v-if="secteurs.length" class="hidden md:block relative ml-3" @mouseleave="onMouseLeaveSecteur">
        <button type="button" class="flex items-center gap-2.5 pl-3 pr-2 h-10 rounded-lg border bg-white transition cursor-pointer" :class="isDropdownOpenSecteur ? 'border-sky-300 ring-2 ring-sky-100 bg-sky-50/60' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'" @mouseenter="isDropdownOpenSecteur = true" @click="isDropdownOpenSecteur = !isDropdownOpenSecteur">
          <Icon name="material-symbols:location-on-outline" size="18" class="shrink-0 text-sncf-primary" />
          <div class="flex flex-col items-start leading-none">
            <span class="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Secteur</span>
            <span class="text-sm font-semibold text-slate-700 truncate max-w-36 mt-0.5">{{ secteurActive?.name ?? "—" }}</span>
          </div>
          <Icon name="material-symbols:expand-more-rounded" size="18" class="shrink-0 text-slate-400 transition-transform duration-200" :class="isDropdownOpenSecteur ? 'rotate-180' : ''" />
        </button>

        <Transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
          <div v-show="isDropdownOpenSecteur" class="absolute top-full left-0 mt-2 z-50 p-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg grid grid-cols-2 gap-1">
            <NuxtLink v-for="(secteur, index) in secteurs" :key="index" :to="`/calendrier/${secteur.id}`" class="px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors" :class="secteur.id == activeSecteurId ? 'bg-sncf-primary/10 text-sncf-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'" @click="isDropdownOpenSecteur = false">
              {{ secteur.name }}
            </NuxtLink>
          </div>
        </Transition>
      </div>

      <!-- Spacer : pousse les onglets de navigation à droite -->
      <div class="flex-1" />

      <!-- Liens desktop -->
      <div class="hidden md:flex items-stretch h-full">
        <!-- Calendrier -->
        <NuxtLink :to="defaultCalendrierPath" class="group h-full flex flex-col items-center justify-center gap-1 px-4 cursor-pointer transition-colors border-b-2 -mb-px" :class="isOnCalendrier ? 'border-sncf-primary bg-sky-50/60' : 'border-transparent hover:bg-slate-50'">
          <Icon name="material-symbols:calendar-month-outline" size="22" class="shrink-0 transition-colors" :class="isOnCalendrier ? 'text-sncf-primary' : 'text-slate-500 group-hover:text-slate-700'" />
          <span class="font-semibold uppercase text-[10px] tracking-wider transition-colors" :class="isOnCalendrier ? 'text-sncf-primary' : 'text-slate-600 group-hover:text-slate-800'">Calendrier</span>
        </NuxtLink>

        <!-- Lien Mes réservations -->
        <NuxtLink to="/mes-reservations" class="group h-full flex flex-col items-center justify-center gap-1 px-4 cursor-pointer transition-colors border-b-2 -mb-px" :class="isOnMesResa ? 'border-sncf-primary bg-sky-50/60' : 'border-transparent hover:bg-slate-50'">
          <Icon name="material-symbols:event-note-outline" size="22" class="shrink-0 transition-colors" :class="isOnMesResa ? 'text-sncf-primary' : 'text-slate-500 group-hover:text-slate-700'" />
          <span class="font-semibold uppercase text-[10px] tracking-wider transition-colors" :class="isOnMesResa ? 'text-sncf-primary' : 'text-slate-600 group-hover:text-slate-800'">Mes résa.</span>
        </NuxtLink>

        <!-- Lien Signalement -->
        <NuxtLink to="/signalement" class="group h-full flex flex-col items-center justify-center gap-1 px-4 cursor-pointer transition-colors border-b-2 -mb-px" :class="isOnSignalement ? 'border-amber-500 bg-amber-50/60' : 'border-transparent hover:bg-amber-50/60'">
          <Icon name="material-symbols:warning-outline" size="22" class="shrink-0 transition-colors" :class="isOnSignalement ? 'text-amber-600' : 'text-amber-500 group-hover:text-amber-600'" />
          <span class="font-semibold uppercase text-[10px] tracking-wider transition-colors" :class="isOnSignalement ? 'text-amber-600' : 'text-amber-600 group-hover:text-amber-700'">Signaler</span>
        </NuxtLink>

        <!-- Lien Administration (admins seulement) -->
        <NuxtLink v-if="isAdmin" to="/administration" class="group h-full flex flex-col items-center justify-center gap-1 px-4 cursor-pointer transition-colors border-b-2 -mb-px" :class="isOnAdministration ? 'border-sncf-primary bg-sky-50/60' : 'border-transparent hover:bg-slate-50'">
          <Icon name="material-symbols:admin-panel-settings-outline" size="22" class="shrink-0 transition-colors" :class="isOnAdministration ? 'text-sncf-primary' : 'text-slate-500 group-hover:text-slate-700'" />
          <span class="font-semibold uppercase text-[10px] tracking-wider transition-colors" :class="isOnAdministration ? 'text-sncf-primary' : 'text-slate-600 group-hover:text-slate-800'">Administration</span>
        </NuxtLink>

        <!-- Profil (même style que les autres liens) -->
        <div v-if="userProfil" class="relative h-full" @mouseleave="onMouseLeaveProfil">
          <div class="group h-full flex flex-col items-center justify-center gap-1 px-4 cursor-pointer transition-colors border-b-2 -mb-px" :class="isDropdownOpenProfil ? 'border-sncf-primary bg-sky-50/60' : 'border-transparent hover:bg-slate-50'" @mouseenter="isDropdownOpenProfil = true" @click="isDropdownOpenProfil = !isDropdownOpenProfil">
            <Icon name="material-symbols:account-circle-outline" size="22" class="shrink-0 transition-colors" :class="isDropdownOpenProfil ? 'text-sncf-primary' : 'text-slate-500 group-hover:text-slate-700'" />
            <span class="font-semibold uppercase text-[10px] tracking-wider transition-colors max-w-22.5 truncate" :class="isDropdownOpenProfil ? 'text-sncf-primary' : 'text-slate-600 group-hover:text-slate-800'">{{ userProfil.prenom || "Profil" }}</span>
          </div>

          <Transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <div v-show="isDropdownOpenProfil" class="absolute top-full right-0 z-50 w-64 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              <!-- Header -->
              <div class="px-4 py-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div class="size-10 rounded-full bg-linear-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {{ initials }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-800 truncate">{{ userProfil.prenom }} {{ userProfil.nom }}</p>
                  <p class="text-xs text-slate-500 truncate">{{ session?.user?.email }}</p>
                </div>
              </div>
              <!-- Actions profil -->
              <div class="py-1">
                <button
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  @click="
                    showModalProfil();
                    isDropdownOpenProfil = false;
                  "
                >
                  <Icon name="material-symbols:person-outline-rounded" size="18" class="shrink-0 text-slate-500" />
                  Mon profil
                </button>
                <button
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  @click="
                    showModalPassword();
                    isDropdownOpenProfil = false;
                  "
                >
                  <Icon name="si:lock-line" size="16" class="shrink-0 text-slate-500" />
                  Changer le mot de passe
                </button>
              </div>
              <!-- Déconnexion -->
              <div class="border-t border-slate-100 py-1">
                <button
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  @click="
                    logout();
                    isDropdownOpenProfil = false;
                  "
                >
                  <Icon name="material-symbols:logout-rounded" size="18" class="shrink-0" />
                  Se déconnecter
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Bouton rapide signaler une anomalie (désactivé temporairement) -->
      <!-- <ResaQuickAnomaly v-if="userProfil" variant="button" /> -->

      <!-- Hamburger (mobile uniquement) -->
      <button type="button" class="md:hidden flex items-center justify-center size-10 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" :aria-expanded="mobileMenuOpen" aria-label="Menu" @click="mobileMenuOpen = !mobileMenuOpen">
        <Icon :name="mobileMenuOpen ? 'material-symbols:close' : 'material-symbols:menu'" size="22" class="text-slate-700" />
      </button>
    </div>

    <!-- Menu mobile (slide-down) -->
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="mobileMenuOpen" class="md:hidden fixed top-16 inset-x-0 bottom-0 z-40 bg-white border-t border-slate-200 shadow-lg overflow-auto">
        <div class="p-2 flex flex-col gap-1">
          <!-- Carte contexte secteur -->
          <div v-if="secteurs.length" class="rounded-xl overflow-hidden border border-slate-200 bg-slate-50/70 mb-2">
            <button type="button" class="w-full flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-slate-100 transition-colors cursor-pointer" @click="mobileSecteursOpen = !mobileSecteursOpen">
              <span class="flex items-center gap-3">
                <Icon name="material-symbols:location-on-outline" size="22" class="shrink-0 text-sncf-primary" />
                <span class="flex flex-col items-start leading-tight text-left">
                  <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Secteur</span>
                  <span class="text-sm font-semibold text-slate-700">{{ secteurActive?.name ?? "—" }}</span>
                </span>
              </span>
              <Icon name="material-symbols:expand-more-rounded" size="18" class="text-slate-400 transition-transform duration-200" :class="mobileSecteursOpen ? 'rotate-180' : ''" />
            </button>
            <div class="grid transition-[grid-template-rows] duration-300 ease-out" :class="mobileSecteursOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
              <div class="overflow-hidden">
                <div class="flex flex-col gap-1 px-2 pt-2 pb-2 border-t border-slate-200/80 bg-white">
                  <NuxtLink v-for="secteur in secteurs" :key="secteur.id" :to="`/calendrier/${secteur.id}`" class="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="secteur.id == activeSecteurId ? 'bg-sncf-primary/10 text-sncf-primary' : 'text-slate-600 hover:bg-slate-100'">
                    {{ secteur.name }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          <!-- Navigation -->
          <NuxtLink :to="defaultCalendrierPath" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors" :class="isOnCalendrier ? 'bg-sncf-primary/10 text-sncf-primary' : 'text-slate-700 hover:bg-slate-100'">
            <Icon name="material-symbols:calendar-month-outline" size="20" class="shrink-0" />
            Calendrier
          </NuxtLink>
          <NuxtLink to="/mes-reservations" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors" :class="isOnMesResa ? 'bg-sncf-primary/10 text-sncf-primary' : 'text-slate-700 hover:bg-slate-100'">
            <Icon name="material-symbols:event-note-outline" size="20" class="shrink-0" />
            Mes réservations
          </NuxtLink>

          <NuxtLink to="/signalement" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors" :class="isOnSignalement ? 'bg-amber-500/10 text-amber-600' : 'text-amber-600 hover:bg-amber-50'">
            <Icon name="material-symbols:warning-outline" size="20" class="shrink-0" />
            Signaler une anomalie
          </NuxtLink>

          <NuxtLink v-if="isAdmin" to="/administration" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors" :class="isOnAdministration ? 'bg-sncf-primary/10 text-sncf-primary' : 'text-slate-700 hover:bg-slate-100'">
            <Icon name="material-symbols:admin-panel-settings-outline" size="20" class="shrink-0" />
            Administration
          </NuxtLink>

          <!-- Section profil (dropdown collapsible) -->
          <div v-if="userProfil" class="rounded-lg overflow-hidden">
            <button type="button" class="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer" @click="mobileProfilOpen = !mobileProfilOpen">
              <span class="flex items-center gap-3">
                <Icon name="material-symbols:account-circle-outline" size="20" class="shrink-0" />
                Profil <span class="text-slate-500 font-normal">· {{ userProfil.prenom }} {{ userProfil.nom }}</span>
              </span>
              <Icon name="material-symbols:expand-more-rounded" size="18" class="text-slate-400 transition-transform duration-200" :class="mobileProfilOpen ? 'rotate-180' : ''" />
            </button>
            <div class="grid transition-[grid-template-rows] duration-300 ease-out" :class="mobileProfilOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
              <div class="overflow-hidden">
                <div class="flex flex-col gap-1 px-2 pb-2">
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    @click="
                      mobileMenuOpen = false;
                      showModalProfil();
                    "
                  >
                    <Icon name="material-symbols:person-outline-rounded" size="18" class="shrink-0 text-slate-500" />
                    Mon profil
                  </button>
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    @click="
                      mobileMenuOpen = false;
                      showModalPassword();
                    "
                  >
                    <Icon name="si:lock-line" size="18" class="shrink-0 text-slate-500" />
                    Changer le mot de passe
                  </button>
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    @click="
                      mobileMenuOpen = false;
                      logout();
                    "
                  >
                    <Icon name="material-symbols:logout-rounded" size="18" class="shrink-0" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backdrop mobile -->
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 top-16 z-30 bg-black/40" @click="mobileMenuOpen = false" />
    </Transition>

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
