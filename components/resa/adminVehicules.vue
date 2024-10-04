<script setup>
import Check from "@/assets/svg/Check.vue";
import Close from "@/assets/svg/Close.vue";

const { setLoader } = useLoader();
const userProfil = useState("userProfil");
const { getAllVehiculesBySecteur, addVehicule, updateVehicule, deleteVehicule, allVehiculesSecteur } = useVehicules();

const sideModalVehicules = ref(false);
const vehiculeForm = ref({
  marque: "",
  model: "",
  immat: "",
  capacite: "",
  vitesse: null,
  secteur: userProfil.value.secteur_admin,
  id_carburant: "",
  is_dispo: false,
});

setLoader(true);
await getAllVehiculesBySecteur(userProfil.value.secteur_admin);
setLoader(false);

// Véhicules
const showSideVehicules = (data) => {
  if (data) {
    vehiculeForm.value = data;
    data.is_dispo == 1 ? (vehiculeForm.value.is_dispo = true) : (vehiculeForm.value.is_dispo = false);
  } else {
    vehiculeForm.value = {
      marque: "",
      model: "",
      immat: "",
      capacite: "",
      vitesse: null,
      secteur: userProfil.value.secteur_admin,
      id_carburant: "",
      is_dispo: false,
    };
  }
  sideModalVehicules.value = !sideModalVehicules.value;
};

const validatedFieldsVehicule = computed(() => {
  return vehiculeForm.value.marque != "" && vehiculeForm.value.model != "" && vehiculeForm.value.immat != "" && vehiculeForm.value.capacite != "" && vehiculeForm.value.vitesse != null && vehiculeForm.value.id_carburant != "" ? true : false;
});

const ajouterVehicule = async () => {
  setLoader(true);
  vehiculeForm.value.is_dispo ? (vehiculeForm.value.is_dispo = 1) : (vehiculeForm.value.is_dispo = 0);
  await addVehicule(vehiculeForm.value);
  await getAllVehiculesBySecteur(userProfil.value.secteur_admin);
  showSideVehicules();
  setLoader(false);
};
const modifierVehicule = async () => {
  setLoader(true);
  vehiculeForm.value.is_dispo ? (vehiculeForm.value.is_dispo = 1) : (vehiculeForm.value.is_dispo = 0);
  await updateVehicule(vehiculeForm.value);
  await getAllVehiculesBySecteur(userProfil.value.secteur_admin);
  showSideVehicules();
  setLoader(false);
};
const supprimerVehicule = async () => {
  setLoader(true);
  await deleteVehicule(vehiculeForm.value.id);
  await getAllVehiculesBySecteur(userProfil.value.secteur_admin);
  showSideVehicules();
  setLoader(false);
};
</script>

<template>
  <section class="w-full h-full flex flex-col gap-4">
    <div class="w-full flex">
      <div class="font-bold text-xl flex flex-col lg:flex-row items-center gap-4 pl-2">
        <div class="relative w-fit text-xl -skew-x-[20deg] uppercase rounded-lg border-gray-400 shadow-xl cursor-pointer border bg-gradient-to-br from-slate-600 to-slate-900 px-8 py-2">
          <div class="font-medium text-gray-50">Liste des véhicules</div>
        </div>
      </div>
      <AppButtonValidated class="ml-auto px-4" @click="showSideVehicules()"><p class="font-bold text-base">+</p></AppButtonValidated>
    </div>

    <table v-if="allVehiculesSecteur.length > 0" class="w-full">
      <thead>
        <tr class="font-medium text-base border-b">
          <th class="text-left pb-4">Marque</th>
          <th class="px-4 pb-4">Model</th>
          <th class="w-full pb-4">Immat</th>
          <th class="px-4 pb-4">Dispo</th>
        </tr>
      </thead>
      <tbody>
        <tr class="cursor-pointer h-10 border-b hover:bg-slate-100" v-for="data in allVehiculesSecteur" :key="data.id" @click="showSideVehicules(data)">
          <td>{{ data.marque }}</td>
          <td class="text-center">{{ data.model }}</td>
          <td class="text-center">{{ data.immat }}</td>
          <td class="text-center"><Check v-if="data.is_dispo == 1" class="size-4 mx-auto text-green-500" /><Close v-else class="size-5 mx-auto text-red-500" /></td>
        </tr>
      </tbody>
    </table>
    <div class="italic" v-else>Aucun véhicule d'enregistré !</div>
    <AppModalSide :sideModal="sideModalVehicules" :closeSideModal="showSideVehicules">
      <template #default>
        <AppModalSideContent v-if="sideModalVehicules" :closeSideModal="showSideVehicules">
          <template #header>
            <div v-if="vehiculeForm.id" class="text-center">
              <div class="font-medium text-xl text-gray-700">{{ vehiculeForm.marque }} {{ vehiculeForm.model }}</div>
              <div class="font-medium text-xl text-gray-700">{{ vehiculeForm.immat }}</div>
            </div>
            <p v-else class="font-medium text-xl text-gray-700 uppercase px-4 text-center">Ajouter un nouveau véhicule</p>
          </template>
          <template #default>
            <div class="ml-auto flex items-center">
              <p v-if="vehiculeForm.is_dispo" class="pr-2 text-gray-600 text-sm font-medium">Disponible</p>
              <p v-else class="pr-2 text-gray-600 text-sm font-medium">Indisponible</p>
              <label class="w-8 cursor-pointer">
                <input type="checkbox" class="peer hidden rounded-md" v-model="vehiculeForm.is_dispo" />
                <span class="w-8 h-5 flex items-center flex-shrink-0 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-sky-500 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-2.5"></span>
              </label>
            </div>
            <AppInput class="pt-4" name="marque" type="text" title="Marque : " v-model="vehiculeForm.marque" />
            <AppInput class="pt-4" name="model" type="text" title="Model : " v-model="vehiculeForm.model" />
            <AppInput class="pt-4" name="immat" type="text" title="Immatriculation : " v-model="vehiculeForm.immat" />
            <AppInput class="pt-4" name="capa" type="text" title="Nb de sièges : " v-model="vehiculeForm.capacite" />
            <div class="grid grid-cols-1 gap-8 mt-3 text-sm text-gray-700">
              <AppRadio :name="['auto', 'manuel']" :value="[0, 1]" :radioTitle="['Automatique', 'Manuel']" title="Transmission :" v-model="vehiculeForm.vitesse" />
            </div>
            <div class="grid grid-cols-1 gap-8 mt-3 text-sm text-gray-700">
              <AppRadio :name="['elec', 'gazoil', 'essence']" :value="[1, 2, 3]" :radioTitle="['Electrique', 'Gazoil', 'Essence']" title="Carburant :" v-model="vehiculeForm.id_carburant" />
            </div>
            <div class="pt-4">
              <p class="text-sm font-medium text-gray-700">Divers :</p>
              <textarea class="mt-1 appearance-none border text-sm text-gray-600 border-gray-400 rounded-lg p-4 w-full focus:outline-none focus:border-gray-600 focus:ring-0" name="emplacementba" id="" cols="50" rows="5" v-model="vehiculeForm.autres" placeholder=""></textarea>
            </div>
          </template>
          <template #footer>
            <div v-if="!vehiculeForm.id" class="flex gap-4 w-full justify-end pt-6">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideVehicules()"> <template #default> Annuler </template> </AppButtonValidated>
              <AppButtonValidated :validated="validatedFieldsVehicule" class="md:w-32 w-full text-sm" theme="" @click="ajouterVehicule()"> <template #default> Enregistrer </template> </AppButtonValidated>
            </div>
            <div v-else class="flex gap-2 w-full justify-end pt-6">
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="cancel" @click="showSideVehicules()"> <template #default> Annuler </template> </AppButtonValidated>
              <AppButtonValidated :validated="validatedFieldsVehicule" class="md:w-32 w-full text-sm" theme="" @click="modifierVehicule()"> <template #default> Modifier </template> </AppButtonValidated>
              <AppButtonValidated class="md:w-32 w-full text-sm" theme="delete" @click="supprimerVehicule()"> <template #default> Supprimer </template> </AppButtonValidated>
            </div>
          </template>
        </AppModalSideContent>
      </template>
    </AppModalSide>
  </section>
</template>
