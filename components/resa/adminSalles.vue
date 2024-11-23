<script setup>
import Check from "@/assets/svg/Check.vue";
import Close from "@/assets/svg/Close.vue";

const { setLoader } = useLoader();
const userProfil = useState("userProfil");

const { getAllSallesBySecteur, addSalle, updateSalle, deleteSalle, allSallesSecteur } = useSalles();

const sideModalSalles = ref(false);
const salleForm = ref({
  is_dispo: false,
  name: "",
  id_secteur: userProfil.value.secteur_admin,
  wifi: 0,
  jabra: 0,
  clim: 0,
  white_board: 0,
  pmr: 0,
  adresse: "",
  autres: "",
  capacite: "",
  video_proj: 0,
  webcam: 0,
});

setLoader(true);
await getAllSallesBySecteur(userProfil.value.secteur_admin);
setLoader(false);

const validatedFieldsSalles = computed(() => {
  return salleForm.value.name != "" && salleForm.value.adresse != "" && salleForm.value.capacite != "" ? true : false;
});

// Salles
const showSideSalles = (data) => {
  if (data) {
    salleForm.value = data;
    data.is_dispo == 1 ? (salleForm.value.is_dispo = true) : (salleForm.value.is_dispo = false);
    data.clim == 1 ? (salleForm.value.clim = true) : (salleForm.value.clim = false);
    data.wifi == 1 ? (salleForm.value.wifi = true) : (salleForm.value.wifi = false);
    data.jabra == 1 ? (salleForm.value.jabra = true) : (salleForm.value.jabra = false);
    data.white_board == 1 ? (salleForm.value.white_board = true) : (salleForm.value.white_board = false);
    data.pmr == 1 ? (salleForm.value.pmr = true) : (salleForm.value.pmr = false);
    data.video_proj == 1 ? (salleForm.value.video_proj = true) : (salleForm.value.video_proj = false);
    data.webcam == 1 ? (salleForm.value.webcam = true) : (salleForm.value.webcam = false);
  } else {
    salleForm.value = {
      is_dispo: false,
      name: "",
      id_secteur: userProfil.value.secteur_admin,
      wifi: false,
      jabra: false,
      clim: false,
      white_board: false,
      pmr: false,
      adresse: "",
      autres: "",
      capacite: "",
      video_proj: false,
      webcam: false,
    };
  }
  sideModalSalles.value = !sideModalSalles.value;
};
const ajouterSalle = async () => {
  setLoader(true);
  salleForm.value.is_dispo ? (salleForm.value.is_dispo = 1) : (salleForm.value.is_dispo = 0);
  salleForm.value.clim ? (salleForm.value.clim = 1) : (salleForm.value.clim = 0);
  salleForm.value.wifi ? (salleForm.value.wifi = 1) : (salleForm.value.wifi = 0);
  salleForm.value.jabra ? (salleForm.value.jabra = 1) : (salleForm.value.jabra = 0);
  salleForm.value.white_board ? (salleForm.value.white_board = 1) : (salleForm.value.white_board = 0);
  salleForm.value.pmr ? (salleForm.value.pmr = 1) : (salleForm.value.pmr = 0);
  salleForm.value.video_proj ? (salleForm.value.video_proj = 1) : (salleForm.value.video_proj = 0);
  salleForm.value.webcam ? (salleForm.value.webcam = 1) : (salleForm.value.webcam = 0);
  await addSalle(salleForm.value);
  await getAllSallesBySecteur(userProfil.value.secteur_admin);
  showSideSalles();
  setLoader(false);
};
const modifierSalle = async () => {
  setLoader(true);
  salleForm.value.is_dispo ? (salleForm.value.is_dispo = 1) : (salleForm.value.is_dispo = 0);
  salleForm.value.clim ? (salleForm.value.clim = 1) : (salleForm.value.clim = 0);
  salleForm.value.wifi ? (salleForm.value.wifi = 1) : (salleForm.value.wifi = 0);
  salleForm.value.jabra ? (salleForm.value.jabra = 1) : (salleForm.value.jabra = 0);
  salleForm.value.white_board ? (salleForm.value.white_board = 1) : (salleForm.value.white_board = 0);
  salleForm.value.pmr ? (salleForm.value.pmr = 1) : (salleForm.value.pmr = 0);
  salleForm.value.video_proj ? (salleForm.value.video_proj = 1) : (salleForm.value.video_proj = 0);
  salleForm.value.webcam ? (salleForm.value.webcam = 1) : (salleForm.value.webcam = 0);
  await updateSalle(salleForm.value);
  await getAllSallesBySecteur(userProfil.value.secteur_admin);
  showSideSalles();
  setLoader(false);
};
const supprimerSalle = async () => {
  setLoader(true);
  await deleteSalle(salleForm.value.id);
  await getAllSallesBySecteur(userProfil.value.secteur_admin);
  showSideSalles();
  setLoader(false);
};
</script>

<template>
  <section class="w-full h-full flex flex-col gap-4">
    <div class="w-full flex">
      <div class="font-bold text-xl flex flex-col lg:flex-row items-center gap-4 pl-2">
        <div class="relative w-fit text-xl -skew-x-[20deg] uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-gradient-to-br from-slate-600 to-slate-900 px-8 py-2">
          <div class="font-medium text-gray-50">Liste des salles</div>
        </div>
      </div>
      <AppButtonValidated class="ml-auto px-4" @click="showSideSalles()"><p class="font-bold text-base">+</p></AppButtonValidated>
    </div>

    <div class="bg-slate-50 border rounded-lg p-4 shadow-lg mt-1">
      <table v-if="allSallesSecteur.length > 0" class="w-full">
        <thead>
          <tr class="font-medium text-base border-b">
            <th class="text-left w-full pb-4">Nom</th>
            <th class="px-4 pb-4">Dispo</th>
          </tr>
        </thead>
        <tbody>
          <tr class="cursor-pointer h-10 border-b hover:bg-slate-100" v-for="data in allSallesSecteur" :key="data.id" @click="showSideSalles(data)">
            <td>{{ data.name }}</td>
            <td class="text-center"><Check v-if="data.is_dispo == 1" class="size-4 mx-auto text-green-500" /><Close v-else class="size-5 mx-auto text-red-500" /></td>
          </tr>
        </tbody>
      </table>
      <div class="italic" v-else>Aucune salle d'enregistrée !</div>
    </div>
    <AppModalSide :sideModal="sideModalSalles" :closeSideModal="showSideSalles">
      <template #default>
        <AppModalSideContent v-if="sideModalSalles" :closeSideModal="showSideSalles">
          <template #header>
            <div v-if="salleForm.id" class="text-center">
              <div class="font-medium text-xl text-gray-700">{{ salleForm.name }}</div>
              <div class="font-medium text-sm text-gray-700">{{ salleForm.adresse }}</div>
            </div>
            <p v-else class="font-medium text-xl text-gray-700 uppercase px-4 text-center">Ajouter une nouvelle salle</p>
          </template>
          <template #default>
            <div class="ml-auto flex items-center">
              <p v-if="salleForm.is_dispo" class="pr-2 text-gray-600 text-sm font-medium">Disponible</p>
              <p v-else class="pr-2 text-gray-600 text-sm font-medium">Indisponible</p>
              <label class="w-8 cursor-pointer">
                <input type="checkbox" class="peer hidden rounded-md" v-model="salleForm.is_dispo" />
                <span class="w-8 h-5 flex items-center flex-shrink-0 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-sky-500 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-2.5"></span>
              </label>
            </div>
            <AppInput class="pt-4" name="name" type="text" title="Nom de la salle : " v-model="salleForm.name" />
            <AppInput class="pt-4" name="adresse" type="text" title="Adresse : " v-model="salleForm.adresse" />
            <AppInput class="pt-4" name="capa" type="text" title="Nb de places : " v-model="salleForm.capacite" />
            <div class="w-full">
              <div class="pt-4 uppercase text-sm text-gray-600 font-medium py-2 border-b text-left">Installations :</div>
              <div class="mt-3 text-sm text-gray-700 w-full grid grid-cols-2 gap-2">
                <AppCheckbox v-model="salleForm.clim" label="Climatisation" id="clim" />
                <AppCheckbox v-model="salleForm.wifi" label="Wifi" id="wifi" />
                <AppCheckbox v-model="salleForm.jabra" label="Jabra" id="jabra" />
                <AppCheckbox v-model="salleForm.white_board" label="Tableau blanc" id="white_board" />
                <AppCheckbox v-model="salleForm.pmr" label="PMR" id="pmr" />
                <AppCheckbox v-model="salleForm.video_proj" label="Vidéo-projecteur" id="video_proj" />
                <AppCheckbox v-model="salleForm.webcam" label="Webcam" id="webcam" />
              </div>
            </div>
            <div class="pt-4">
              <p class="text-sm font-medium text-gray-700">Divers :</p>
              <textarea class="mt-1 appearance-none border text-sm text-gray-600 border-gray-400 rounded-lg p-4 w-full focus:outline-none focus:border-gray-600 focus:ring-0" name="emplacementba" id="" cols="50" rows="5" v-model="salleForm.autres" placeholder=""></textarea>
            </div>
          </template>
          <template #footer>
            <div v-if="!salleForm.id" class="flex gap-4 w-full justify-end pt-6">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideSalles()"> <template #default> Annuler </template> </AppButtonValidated>
              <AppButtonValidated :validated="validatedFieldsSalles" class="md:w-32 w-full text-sm" theme="" @click="ajouterSalle()"> <template #default> Enregistrer </template> </AppButtonValidated>
            </div>
            <div v-else class="flex gap-2 w-full justify-end pt-6">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideSalles()"> <template #default> Annuler </template> </AppButtonValidated>
              <AppButtonValidated :validated="validatedFieldsSalles" class="md:w-32 w-full text-sm" theme="" @click="modifierSalle()"> <template #default> Modifier </template> </AppButtonValidated>
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="delete" @click="supprimerSalle()"> <template #default> Supprimer </template> </AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>
  </section>
</template>
