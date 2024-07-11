<script setup>
import Group from "@/assets/svg/Group.vue";
import Electric from "@/assets/svg/Electric.vue";
import Fuel from "@/assets/svg/Fuel.vue";
import Manuel from "@/assets/svg/Manuel.vue";
import ArrowRight from "@/assets/svg/ArrowRight.vue";

const finalReservation = useState("finalReservation");
const formatedDate = (timestamp) => {
  const result = {};
  // Créer une nouvelle date à partir du timestamp
  let date = new Date(timestamp);

  // Obtenir les différentes parties de la date et de l'heure
  let day = date.getDate();
  let month = date.getMonth() + 1; // Les mois commencent à 0, donc nous ajoutons 1
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let dayOfWeek = date.getDay();

  // Formater les parties de la date pour ajouter des zéros si nécessaire
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Tableau des noms des jours et mois en français
  const dayNames = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  result.jourName = dayNames[dayOfWeek];
  result.jour = day;
  result.mois = monthNames[date.getMonth()];
  result.annee = year;
  result.heure = hours;
  result.minute = minutes;

  return result;
};
</script>

<template>
  <div class="flex flex-col gap-4 px-4">
    <p class="text-xl font-bold">{{ finalReservation.secteur }}</p>

    <div class="w-full flex bg-white rounded-lg overflow-hidden shadow-lg border">
      <div class="w-2/5 border-r text-xl p-2 flex items-center justify-center">{{ finalReservation.vehicule.immat }}</div>
      <div class="w-3/5 flex flex-col gap-3 p-2">
        <p class="text-center font-medium text-lg">{{ finalReservation.vehicule.marque }} {{ finalReservation.vehicule.model }}</p>
        <div class="flex justify-center gap-4">
          <div class="flex gap-1 items-center text-sm"><Group class="w-4 h-4" />{{ finalReservation.vehicule.capacite }}</div>
          <div v-if="finalReservation.vehicule.id_carburant == 1" class="flex gap-1 items-center text-sm">
            <Electric class="w-4 h-4" />
            <p class="first-letter:uppercase">électrique</p>
          </div>

          <div v-if="finalReservation.vehicule.id_carburant == 2" class="flex gap-1 items-center text-sm"><Fuel class="w-4 h-4" />Diesel</div>
          <div v-if="finalReservation.vehicule.id_carburant == 3" class="flex gap-1 items-center text-sm"><Fuel class="w-4 h-4" />Essence</div>

          <div v-if="finalReservation.vehicule.vitesse == 0" class="flex gap-1 items-center text-sm">
            <div class="w-4 h-4 border rounded flex items-center justify-center">A</div>
            Auto
          </div>

          <div v-if="finalReservation.vehicule.vitesse == 1" class="flex gap-1 items-center text-sm"><Manuel class="w-4 h-4" />Manuel</div>
        </div>
      </div>
    </div>

    <p class="text-xl font-bold pt-4">Période :</p>

    <div class="w-full flex justify-between items-center gap-4">
      <div class="w-full h-28 border border-slate-300 cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-lg">
        <div class="h-full w-full bg-gradient-to-br from-sky-700 to-sky-500 text-white flex items-center justify-center gap-2 px-2 pb-1 pt-2">
          <div class="w-1/3 h-full text-5xl font-traverse flex items-center justify-end pt-2">{{ formatedDate(finalReservation.dateDebut).jour }}</div>
          <div class="w-2/3 h-full flex flex-col items-start justify-center">
            <div class="text-base uppercase">{{ formatedDate(finalReservation.dateDebut).mois }}</div>
            <div class="text-base uppercase">{{ formatedDate(finalReservation.dateDebut).annee }}</div>
          </div>
        </div>
        <div class="h-full w-full bg-slate-700 flex justify-center items-center p-2">
          <p class="text-white text-xl font-bold">{{ formatedDate(finalReservation.dateDebut).heure }}</p>
          <p class="text-white text-xl font-bold">h</p>
          <p class="text-white text-xl font-bold">{{ formatedDate(finalReservation.dateDebut).minute }}</p>
        </div>
      </div>
      <ArrowRight class="w-14 h-14" />
      <div class="w-full h-28 border border-slate-300 cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-lg">
        <div class="h-full w-full bg-gradient-to-br from-sky-700 to-sky-500 text-white flex items-center justify-center gap-2 px-2 pb-1 pt-2">
          <div class="w-1/3 h-full text-5xl font-traverse flex items-center justify-end pt-2">{{ formatedDate(finalReservation.dateFin).jour }}</div>
          <div class="w-2/3 h-full flex flex-col items-start justify-center">
            <div class="text-base uppercase">{{ formatedDate(finalReservation.dateFin).mois }}</div>
            <div class="text-base uppercase">{{ formatedDate(finalReservation.dateFin).annee }}</div>
          </div>
        </div>
        <div class="h-full w-full bg-slate-700 flex justify-center items-center p-2">
          <p class="text-white text-xl font-bold">{{ formatedDate(finalReservation.dateFin).heure }}</p>
          <p class="text-white text-xl font-bold">h</p>
          <p class="text-white text-xl font-bold">{{ formatedDate(finalReservation.dateFin).minute }}</p>
        </div>
      </div>
    </div>

    <div>
      <p class="text-xl font-bold pt-4">Divers :</p>
      <p class="italic text-sm">Néant</p>
    </div>
  </div>
</template>
