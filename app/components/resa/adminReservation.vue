<script setup>


const { setLoader } = useLoader();
const userProfil = useState("userProfil");
const { getAllProfiles, addValideur, deleteValideur, allProfiles } = useAuth();

const sideModalValideurs = ref(false);
const searchValideur = ref("");

setLoader(true);
await getAllProfiles();
setLoader(false);

const userAuth = computed(() => {
  const result = allProfiles.value.filter((user) => user.secteur_auth.split(",").includes(String(userProfil.value.secteur_admin)));
  return result;
});

const userNotAuth = computed(() => {
  const result = allProfiles.value.filter((profile) => !userAuth.value.some((user) => user.id === profile.id));
  return result;
});

const filteredUserNotAuth = computed(() => {
  if (!searchValideur.value) return userNotAuth.value;
  const q = searchValideur.value.toLowerCase();
  return userNotAuth.value.filter((u) => u.nom?.toLowerCase().includes(q) || u.prenom?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
});

// Valideurs
const showSideValideurs = () => {
  sideModalValideurs.value = !sideModalValideurs.value;
};
const addProfilValideur = async (data) => {
  setLoader(true);
  data.secteur = userProfil.value.secteur_admin;
  await addValideur(data);
  await getAllProfiles();
  setLoader(false);
};
const deleteProfilValideur = async (data) => {
  setLoader(true);
  data.secteur = userProfil.value.secteur_admin;
  await deleteValideur(data);
  await getAllProfiles();
  setLoader(false);
};
</script>

<template>
  <section class="w-full h-full flex flex-col gap-5 lg:overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
        <Icon name="material-symbols:verified-user" size="22" class="text-sky-500" />
      </div>
      <div>
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Autorisations</p>
        <p class="text-xl font-bold text-slate-800 leading-tight">Auto-validation</p>
      </div>
    </div>

    <div class="h-full w-full flex flex-col gap-6 lg:overflow-auto">
      <!-- Profils autorisés -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <div class="size-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Icon name="material-symbols:check-circle" size="14" class="text-emerald-600" />
          </div>
          <p class="text-sm font-semibold text-slate-700">Profils autorisés</p>
          <span class="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">{{ userAuth.length }}</span>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table v-if="userAuth.length > 0" class="w-full">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nom</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Prénom</th>
                <th class="hidden lg:table-cell px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="hover:bg-slate-50 transition-colors" v-for="data in userAuth" :key="data.id">
                <td class="px-5 py-3 text-sm font-medium text-slate-800 uppercase">{{ data.nom }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ data.prenom }}</td>
                <td class="hidden lg:table-cell px-4 py-3 text-xs text-slate-500">{{ data.email }}</td>
                <td class="px-4 py-3 text-center">
                  <button class="size-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors mx-auto" @click="deleteProfilValideur(data)">
                    <Icon name="material-symbols:delete" size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="px-5 py-6 text-sm text-slate-400 italic text-center">Aucun profil autorisé.</div>
        </div>
      </div>

      <!-- Ajouter un profil -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <div class="size-6 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
            <Icon name="material-symbols:person-add" size="14" class="text-sky-500" />
          </div>
          <p class="text-sm font-semibold text-slate-700">Ajouter un profil</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <!-- Barre de recherche -->
          <div class="px-4 py-3 border-b border-slate-100">
            <div class="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-sky-400 focus-within:bg-white transition-colors">
              <Icon name="material-symbols:search" size="16" class="text-slate-400 shrink-0" />
              <input v-model="searchValideur" type="text" placeholder="Rechercher un profil..." class="flex-1 text-sm text-slate-700 placeholder-slate-400 bg-transparent outline-none" />
              <button v-if="searchValideur" class="text-slate-400 hover:text-slate-600 transition-colors" @click="searchValideur = ''">
                <Icon name="material-symbols:close" size="14" />
              </button>
            </div>
          </div>
          <table v-if="userNotAuth.length > 0" class="w-full">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nom</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Prénom</th>
                <th class="hidden lg:table-cell px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="hover:bg-sky-50/30 transition-colors" v-for="data in filteredUserNotAuth" :key="data.id">
                <td class="px-5 py-3 text-sm font-medium text-slate-800 uppercase">{{ data.nom }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ data.prenom }}</td>
                <td class="hidden lg:table-cell px-4 py-3 text-xs text-slate-500">{{ data.email }}</td>
                <td class="px-4 py-3 text-center">
                  <button class="size-7 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 flex items-center justify-center transition-colors mx-auto" @click="addProfilValideur(data)">
                    <Icon name="material-symbols:add" size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="filteredUserNotAuth.length === 0">
                <td colspan="4" class="px-5 py-6 text-sm text-slate-400 italic text-center">Aucun résultat pour "{{ searchValideur }}".</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="px-5 py-6 text-sm text-slate-400 italic text-center">Tous les profils sont déjà autorisés.</div>
        </div>
      </div>
    </div>

    <AppModalSide :sideModal="sideModalValideurs" :closeSideModal="showSideValideurs">
      <template #default>
        <AppModalSideContent v-if="sideModalValideurs" :closeSideModal="showSideValideurs">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Icon name="material-symbols:verified-user" size="20" class="text-white" />
              </div>
              <div>
                <p class="text-[10px] text-white/70 uppercase tracking-wider">Autorisations</p>
                <p class="text-base font-semibold text-white">Auto-validation</p>
              </div>
            </div>
          </template>
          <template #default>
            <div class="flex flex-col gap-5">
              <div>
                <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                  <Icon name="material-symbols:check-circle" size="14" class="text-emerald-500" />
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Profils autorisés</p>
                </div>
                <table v-if="userAuth.length > 0" class="w-full text-sm">
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="data in userAuth" :key="data.id" class="flex items-center justify-between py-2">
                      <td class="font-medium text-slate-800 uppercase">{{ data.nom }}</td>
                      <td class="text-slate-600">{{ data.prenom }}</td>
                      <td>
                        <button class="size-6 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center" @click="deleteProfilValideur(data)">
                          <Icon name="material-symbols:delete" size="14" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p v-else class="text-sm text-slate-400 italic">Aucun profil autorisé.</p>
              </div>
              <div>
                <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                  <Icon name="material-symbols:person-add" size="14" class="text-sky-500" />
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ajouter un profil</p>
                </div>
                <table class="w-full text-sm">
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="data in allProfiles" :key="data.id" class="flex items-center justify-between py-2">
                      <td class="font-medium text-slate-800 uppercase">{{ data.nom }}</td>
                      <td class="text-slate-600">{{ data.prenom }}</td>
                      <td>
                        <button class="size-6 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 flex items-center justify-center" @click="addProfilValideur(data)">
                          <Icon name="material-symbols:add" size="14" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-end">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideValideurs()"><template #default>Retour</template></AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>
  </section>
</template>
