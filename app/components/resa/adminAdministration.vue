<script setup>


const { setLoader } = useLoader();
const userProfil = useState("userProfil");
const { getAllProfiles, addAdmin, deleteAdmin, allProfiles } = useAuth();

const sideModalAdmin = ref(false);
const searchAdmin = ref("");

setLoader(true);
await getAllProfiles();
setLoader(false);

const userAdmin = computed(() => {
  const result = allProfiles.value.filter((user) => user.secteur_admin == userProfil.value.secteur_admin);
  return result;
});

const userNotAdmin = computed(() => {
  const result = allProfiles.value.filter((profile) => !userAdmin.value.some((user) => user.id === profile.id));
  return result;
});

const filteredUserNotAdmin = computed(() => {
  if (!searchAdmin.value) return userNotAdmin.value;
  const q = searchAdmin.value.toLowerCase();
  return userNotAdmin.value.filter((u) => u.nom?.toLowerCase().includes(q) || u.prenom?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
});

// Administrateur
const showSideAdmin = () => {
  sideModalAdmin.value = !sideModalAdmin.value;
};
const addProfilAdmin = async (data) => {
  setLoader(true);
  data.secteur = userProfil.value.secteur_admin;
  await addAdmin(data);
  await getAllProfiles();
  setLoader(false);
};
const deleteProfilAdmin = async (data) => {
  setLoader(true);
  data.secteur = userProfil.value.secteur_admin;
  await deleteAdmin(data);
  await getAllProfiles();
  setLoader(false);
};
</script>

<template>
  <section class="w-full h-full flex flex-col gap-5 lg:overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
        <Icon name="material-symbols:manage-accounts" size="22" class="text-sky-500" />
      </div>
      <div>
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Autorisations</p>
        <p class="text-xl font-bold text-slate-800 leading-tight">Administrateurs</p>
      </div>
    </div>

    <div class="h-full w-full flex flex-col gap-6 lg:overflow-auto">
      <!-- Administrateurs actuels -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <div class="size-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Icon name="material-symbols:shield" size="14" class="text-emerald-600" />
          </div>
          <p class="text-sm font-semibold text-slate-700">Profils administrateurs</p>
          <span class="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">{{ userAdmin.length }}</span>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table v-if="userAdmin.length > 0" class="w-full">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nom</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Prénom</th>
                <th class="hidden lg:table-cell px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="hover:bg-slate-50 transition-colors" v-for="data in userAdmin" :key="data.id">
                <td class="px-5 py-3 text-sm font-medium text-slate-800 uppercase">{{ data.nom }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ data.prenom }}</td>
                <td class="hidden lg:table-cell px-4 py-3 text-xs text-slate-500">{{ data.email }}</td>
                <td class="px-4 py-3 text-center">
                  <button class="size-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors mx-auto" @click="deleteProfilAdmin(data)">
                    <Icon name="material-symbols:delete" size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="px-5 py-6 text-sm text-slate-400 italic text-center">Aucun administrateur configuré.</div>
        </div>
      </div>

      <!-- Ajouter un admin -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <div class="size-6 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
            <Icon name="material-symbols:person-add" size="14" class="text-sky-500" />
          </div>
          <p class="text-sm font-semibold text-slate-700">Ajouter un administrateur</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <!-- Barre de recherche -->
          <div class="px-4 py-3 border-b border-slate-100">
            <div class="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-sky-400 focus-within:bg-white transition-colors">
              <Icon name="material-symbols:search" size="16" class="text-slate-400 shrink-0" />
              <input v-model="searchAdmin" type="text" placeholder="Rechercher un profil..." class="flex-1 text-sm text-slate-700 placeholder-slate-400 bg-transparent outline-none" />
              <button v-if="searchAdmin" class="text-slate-400 hover:text-slate-600 transition-colors" @click="searchAdmin = ''">
                <Icon name="material-symbols:close" size="14" />
              </button>
            </div>
          </div>
          <table v-if="userNotAdmin.length > 0" class="w-full">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nom</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Prénom</th>
                <th class="hidden lg:table-cell px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="hover:bg-sky-50/30 transition-colors" v-for="data in filteredUserNotAdmin" :key="data.id">
                <td class="px-5 py-3 text-sm font-medium text-slate-800 uppercase">{{ data.nom }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ data.prenom }}</td>
                <td class="hidden lg:table-cell px-4 py-3 text-xs text-slate-500">{{ data.email }}</td>
                <td class="px-4 py-3 text-center">
                  <button class="size-7 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 flex items-center justify-center transition-colors mx-auto" @click="addProfilAdmin(data)">
                    <Icon name="material-symbols:add" size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="filteredUserNotAdmin.length === 0">
                <td colspan="4" class="px-5 py-6 text-sm text-slate-400 italic text-center">Aucun résultat pour "{{ searchAdmin }}".</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="px-5 py-6 text-sm text-slate-400 italic text-center">Tous les profils sont déjà administrateurs.</div>
        </div>
      </div>
    </div>

    <AppModalSide :sideModal="sideModalAdmin" :closeSideModal="showSideAdmin">
      <template #default>
        <AppModalSideContent v-if="sideModalAdmin" :closeSideModal="showSideAdmin">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Icon name="material-symbols:manage-accounts" size="20" class="text-white" />
              </div>
              <div>
                <p class="text-[10px] text-white/70 uppercase tracking-wider">Autorisations</p>
                <p class="text-base font-semibold text-white">Administrateurs</p>
              </div>
            </div>
          </template>
          <template #default>
            <div class="flex flex-col gap-5">
              <div>
                <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                  <Icon name="material-symbols:shield" size="14" class="text-emerald-500" />
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Administrateurs</p>
                </div>
                <table class="w-full text-sm">
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="data in userAdmin" :key="data.id" class="flex items-center justify-between py-2">
                      <td class="font-medium text-slate-800 uppercase">{{ data.nom }}</td>
                      <td class="text-slate-600">{{ data.prenom }}</td>
                      <td>
                        <button class="size-6 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center" @click="deleteProfilAdmin(data)">
                          <Icon name="material-symbols:delete" size="14" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                  <Icon name="material-symbols:person-add" size="14" class="text-sky-500" />
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ajouter un administrateur</p>
                </div>
                <table class="w-full text-sm">
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="data in allProfiles" :key="data.id" class="flex items-center justify-between py-2">
                      <td class="font-medium text-slate-800 uppercase">{{ data.nom }}</td>
                      <td class="text-slate-600">{{ data.prenom }}</td>
                      <td>
                        <button class="size-6 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 flex items-center justify-center" @click="addProfilAdmin(data)">
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
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideAdmin()"><template #default>Retour</template></AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>
  </section>
</template>
