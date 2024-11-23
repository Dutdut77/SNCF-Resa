<script setup>
import Trash from "@/assets/svg/Trash.vue";
import Add from "@/assets/svg/Add.vue";
import Edit from "@/assets/svg/Edit.vue";

const { setLoader } = useLoader();
const userProfil = useState("userProfil");
const { getAllProfiles, addAdmin, deleteAdmin, allProfiles } = useAuth();

const sideModalAdmin = ref(false);

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
  <section class="w-full h-full flex flex-col gap-4 lg:overflow-hidden">
    <div class="w-full flex">
      <div class="w-full font-bold text-xl flex flex-col lg:flex-row items-center gap-4 pl-2">
        <div class="relative w-full lg:w-fit text-center lg:text-left text-xl -skew-x-[20deg] uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-gradient-to-br from-slate-600 to-slate-900 px-8 py-2">
          <div class="font-medium text-gray-50">Administrateurs</div>
        </div>
      </div>
      <!-- <AppButtonValidated class="ml-auto px-4" @click="showSideAdmin()"
        ><p class="font-bold text-base"><Edit class="size-5" /></p
      ></AppButtonValidated> -->
    </div>

    <div class="h-full w-full flex flex-col gap-4 lg:overflow-auto pr-4">
      <div class="w-full flex flex-col gap-4">
        <div class="pt-4 uppercase text-lg text-gray-600 font-medium text-left">Profil Administrateur :</div>

        <table class="w-full">
          <thead>
            <tr class="font-medium text-base border-b">
              <th class="text-left pb-4">Nom</th>
              <th class="text-left pb-4">Prénom</th>
              <th class="hidden lg:block">Email</th>
              <th class="w-12">#</th>
            </tr>
          </thead>
          <tbody>
            <tr class="cursor-default h-10 border-b hover:bg-slate-10" v-for="data in userAdmin" :key="data.id">
              <td>{{ data.nom }}</td>
              <td class="text-left">{{ data.prenom }}</td>
              <td class="text-center hidden lg:block">{{ data.email }}</td>
              <td class="cursor-pointer" @click="deleteProfilAdmin(data)">
                <Trash class="size-5 mx-auto text-red-500" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="w-full flex flex-col gap-4">
        <div class="pt-4 uppercase text-lg text-gray-600 font-medium text-left">Ajouter un profil :</div>

        <table class="w-full">
          <thead>
            <tr class="font-medium text-base border-b">
              <th class="text-left pb-4">Nom</th>
              <th class="text-left pb-4">Prénom</th>
              <th class="hidden lg:block">Email</th>
              <th class="w-12">#</th>
            </tr>
          </thead>
          <tbody>
            <tr class="cursor-default h-10 border-b hover:bg-slate-10" v-for="data in userNotAdmin" :key="data.id">
              <td>{{ data.nom }}</td>
              <td class="text-left">{{ data.prenom }}</td>
              <td class="text-center hidden lg:block">{{ data.email }}</td>
              <td class="cursor-pointer" @click="addProfilAdmin(data)">
                <Add class="size-5 mx-auto text-green-500" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppModalSide :sideModal="sideModalAdmin" :closeSideModal="showSideAdmin">
      <template #default>
        <AppModalSideContent v-if="sideModalAdmin" :closeSideModal="showSideAdmin">
          <template #header>
            <div class="text-center">
              <div class="font-medium text-xl text-gray-700">Profil Administrateur</div>
            </div>
          </template>
          <template #default>
            <div class="w-full">
              <div class="pt-4 uppercase text-sm text-gray-600 font-medium py-2 border-b text-left">Profils Administrateurs :</div>
              <div class="mt-3 text-sm text-gray-700 w-full">
                <table class="w-full bg-white">
                  <thead>
                    <tr>
                      <th class="text-left">Nom</th>
                      <th class="px-6">Prénom</th>
                      <th class="px-6 w-full">Mail</th>
                      <th class="text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="cursor-default hover:bg-slate-100" v-for="data in userAdmin" :key="data.id">
                      <td>{{ data.nom }}</td>
                      <td class="text-center">{{ data.prenom }}</td>
                      <td class="text-center">{{ data.email }}</td>
                      <td class="cursor-pointer" @click="deleteProfilAdmin(data)">
                        <Trash class="w-4 h-4 text-red-500" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="w-full pt-8">
              <div class="pt-4 uppercase text-sm text-gray-600 font-medium py-2 border-b text-left">Ajouter un profil :</div>
              <div class="mt-3 text-sm text-gray-700 w-full">
                <table class="w-full bg-white">
                  <thead>
                    <tr class="">
                      <th class="text-left">Nom</th>
                      <th class="px-6">Prénom</th>
                      <th class="px-6 w-full">Mail</th>
                      <th class="text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="cursor-default hover:bg-slate-100" v-for="data in allProfiles" :key="data.id">
                      <td>{{ data.nom }}</td>
                      <td class="text-center">{{ data.prenom }}</td>
                      <td class="text-center">{{ data.email }}</td>
                      <td class="cursor-pointer" @click="addProfilAdmin(data)">
                        <Add class="w-4 h-4 text-sky-500" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex gap-2 w-full justify-end pt-6">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideAdmin()"> <template #default> Retour </template> </AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>
  </section>
</template>
