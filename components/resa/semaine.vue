<script setup>
// Date de départ
const props = defineProps(["startDate"]);
const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Fonction pour obtenir le premier jour de la semaine (lundi)
const getStartOfWeek = (date) => {
  const dayOfWeek = date.getDay(); // Jour actuel (0 = dimanche, 1 = lundi, etc.)
  const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Ajuster si dimanche
  return new Date(date.setDate(diff));
};

// Obtenir les jours de la semaine
const getWeekDays = (start) => {
  const startOfTheWeek = getStartOfWeek(start);
  return Array.from({ length: 7 }, (_, i) => {
    const nextDay = new Date(startOfTheWeek);
    nextDay.setDate(startOfTheWeek.getDate() + i);
    return nextDay;
  });
};

const weekDays = ref(getWeekDays(props.startDate));

// Heures de la journée
const hours = ref([...Array(25).keys()]); // Tableau de 0 à 24
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: 'auto repeat(7, 1fr)' }">
    <!-- En-tête des jours -->
    <div class=""></div>
    <!-- Colonne vide pour les heures -->
    <div v-for="(day, index) in weekDays" :key="index" class="border-r text-center font-bold p-2">
      <div class="uppercase text-sm text-gray-400 font-normal">{{ days[index] }}</div>
      <div class="text-xl font-bold text-gray-600">{{ day.getDate() }}</div>
    </div>

    <!-- Corps du calendrier : affichage des heures et cellules pour chaque jour -->
    <div v-for="hour in hours" :key="hour" class="contents first:h-6">
      <!-- Colonne des heures avec bordure droite alignée en haut -->
      <div class="text-center px-2 flex items-end -mb-2">{{ hour }}:00</div>
      <!-- Colonnes des jours de la semaine -->
      <div v-for="(day, index) in weekDays" :key="index" class="border-b border-r p-2 min-h-[50px]">
        <!-- Contenu cellulaire -->
      </div>
    </div>
  </div>
</template>
