<script setup>
definePageMeta({
  requiresAuth: true,
  isAdmin: false,
});
useHead({
  title: "Profil - Résa Pro",
  description: "Profil utilisateur",
});

const { setLoader } = useLoader();
const { addAnomalieSalle, addAnomalieVehicule } = useAnomalies();

const formValue = ref({
  secteur: "",
  type: "",
  vehicule: "",
  salle: "",
});
const etape = ref(0);
const anomalieSalle = ref("");
const anomalieVehicule = ref("");

const validatedSecteur = computed(() => {
  return formValue.value.secteur != "" ? true : false;
});
const validatedType = computed(() => {
  return formValue.value.type != "" ? true : false;
});
const validatedSalle = computed(() => {
  return formValue.value.salle != "" ? true : false;
});
const validatedVehicule = computed(() => {
  return formValue.value.vehicule != "" ? true : false;
});
const validatedAnomalieSalle = computed(() => {
  return anomalieSalle.value != "" ? true : false;
});

const validatedAnomalieVehicule = computed(() => {
  return anomalieVehicule.value != "" ? true : false;
});

const sendAnomalieSalle = async () => {
  setLoader(true);
  await addAnomalieSalle(formValue.value.salle.id, anomalieSalle.value, formValue.value.secteur.id);
  navigateTo("/home");
  setLoader(false);
};

const sendAnomalieVehicule = async () => {
  setLoader(true);
  await addAnomalieVehicule(formValue.value.vehicule.id, anomalieVehicule.value, formValue.value.secteur.id);
  navigateTo("/home");
  setLoader(false);
};
</script>

<template>
  <ResaPage>
    <template #title>
      <div class="-space-y-1">
        <p class="font-bold text-xl">Anomalie</p>
        <p v-if="etape == 0" class="text-sm italic">Description de cette fonctionnalité</p>
        <p v-if="etape == 1" class="text-sm italic">Choix du secteur</p>
        <p v-if="etape == 2" class="text-sm italic">Salle ou véhicule ?</p>
        <p v-if="etape == 3 && formValue.type == 0" class="text-sm italic">Choisissez une salle</p>
        <p v-if="etape == 3 && formValue.type == 1" class="text-sm italic">Choisissez un véhicule</p>
        <p v-if="etape == 4" class="text-sm italic">Renseigner l'anomalie constatée</p>
      </div>
    </template>
    <template #default>
      <div v-if="etape == 0" class="px-4 text-justify flex flex-col gap-4">
        <p>Vous avez accès ici à une interface vous permettant de signaler une anomalie sur un véhicule ou dans une salle.</p>
        <div class="pl-4">
          <p class="underline underline-offset-2 font-medium">Exemple :</p>
          <p>- Salle 2ème étage : La climatisation ne fonctionne pas.</p>
        </div>
        <p>Votre demande sera envoyé au référent du secteur concerné.</p>
      </div>

      <div v-if="etape == 1" class="w-full h-fit flex flex-col px-4 pb-8 overflow-auto">
        <ResaRadioSecteur v-model="formValue.secteur" @change="etape++" />
      </div>

      <div v-if="etape == 2" class="w-full h-full flex flex-col overflow-auto">
        <ResaType v-model="formValue.type" @change="etape++" />
      </div>

      <div v-if="etape == 3 && formValue.type == 0" class="w-full h-fit flex flex-col justify-center">
        <ResaRadioAllSalles :data="formValue" v-model="formValue.salle" @change="etape++" />
      </div>
      <div v-if="etape == 3 && formValue.type == 1" class="w-full h-fit flex flex-col justify-center">
        <ResaRadioAllVehicules :data="formValue" v-model="formValue.vehicule" @change="etape++" />
      </div>

      <div v-if="etape == 4 && formValue.type == 0" class="w-full h-fit flex flex-col justify-center">
        <div class="text-lg font-medium text-center">
          <p>{{ formValue.secteur.name }}</p>
          <p>Salle {{ formValue.salle.name }}</p>
        </div>

        <div class="px-4 pt-8">
          <textarea class="w-full border rounded-lg p-4 text-sm text-gray-700" name="" id="" cols="30" rows="10" v-model="anomalieSalle"></textarea>
        </div>
      </div>

      <div v-if="etape == 4 && formValue.type == 1" class="w-full h-fit flex flex-col justify-center">
        <div class="text-lg font-medium text-center">
          <p>{{ formValue.secteur.name }}</p>
          <p>{{ formValue.vehicule.immat }} - {{ formValue.vehicule.marque }} {{ formValue.vehicule.model }}</p>
        </div>

        <div class="px-4 pt-8">
          <textarea class="w-full border rounded-lg p-4 text-sm text-gray-700" name="" id="" cols="30" rows="10" v-model="anomalieVehicule"></textarea>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between items-center">
        <AppButtonCarre v-if="etape == 0" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>

        <AppButtonCarre v-if="etape == 1" class="" direction="left" @click="etape--, (formValue.secteur = '')"> </AppButtonCarre>
        <AppButtonCarre v-if="etape == 1" :validated="validatedSecteur" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>

        <AppButtonCarre v-if="etape == 2" class="" direction="left" @click="etape--, (formValue.type = ''), (formValue.secteur = '')"> </AppButtonCarre>
        <AppButtonCarre v-if="etape == 2" :validated="validatedType" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>

        <AppButtonCarre v-if="etape == 3 && formValue.type == 0" class="" direction="left" @click="etape--, (formValue.salle = ''), (formValue.type = '')"> </AppButtonCarre>
        <AppButtonCarre v-if="etape == 3 && formValue.type == 0" :validated="validatedSalle" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>

        <AppButtonCarre v-if="etape == 3 && formValue.type == 1" class="" direction="left" @click="etape--, (formValue.vehicule = ''), (formValue.type = '')"> </AppButtonCarre>
        <AppButtonCarre v-if="etape == 3 && formValue.type == 1" :validated="validatedVehicule" class="ml-auto" direction="right" @click="etape++"> </AppButtonCarre>

        <AppButtonCarre v-if="etape == 4 && formValue.type == 0" class="" direction="left" @click="etape--, (formValue.salle = '')"> </AppButtonCarre>
        <AppButtonCarre v-if="etape == 4 && formValue.type == 1" class="" direction="left" @click="etape--, (formValue.vehicule = '')"> </AppButtonCarre>

        <AppButtonValidated v-if="etape == 4 && formValue.type == 0" :validated="validatedAnomalieSalle" class="w-32 ml-auto" theme="" @click="sendAnomalieSalle()"> <template #default> Envoyer </template> </AppButtonValidated>
        <AppButtonValidated v-if="etape == 4 && formValue.type == 1" :validated="validatedAnomalieVehicule" class="w-32 ml-auto" theme="" @click="sendAnomalieVehicule()"> <template #default> Envoyer </template> </AppButtonValidated>
      </div>
    </template>
    <template #modal></template>
  </ResaPage>
</template>
