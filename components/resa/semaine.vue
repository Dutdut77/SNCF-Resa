<script setup>
// Date de départ
const props = defineProps(["startDate", "allReservations"]);
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

const weekDays = computed(() => {
  const result = getWeekDays(props.startDate);
  return result;
});

// Heures de la journée
const hours = ref([...Array(24).keys()]); // Tableau de 0 à 24

// Fonction pour vérifier si une réservation est dans une cellule donnée (jour/heure)
const isReservationInCell = (day, hour, reservation) => {
  const debutDate = new Date(parseInt(reservation.debut)); // Convertir le timestamp en Date
  const finDate = new Date(parseInt(reservation.fin));

  const isSameDayAsDebut = day.getDate() === debutDate.getDate() && day.getMonth() === debutDate.getMonth() && day.getFullYear() === debutDate.getFullYear();
  const isSameDayAsFin = day.getDate() === finDate.getDate() && day.getMonth() === finDate.getMonth() && day.getFullYear() === finDate.getFullYear();
  const isBetweenDays = day > debutDate && day < finDate;

  // La réservation doit apparaître sur la cellule entière ou partiellement
  if (isSameDayAsDebut && isSameDayAsFin) {
    return hour >= debutDate.getHours() && hour <= finDate.getHours();
  } else if (isSameDayAsDebut) {
    return hour >= debutDate.getHours();
  } else if (isSameDayAsFin) {
    return hour <= finDate.getHours();
  } else if (isBetweenDays) {
    return true;
  }

  return false;
};

// Vérifie si la réservation commence à la demi-heure
const startsAtHalfHour = (reservation) => {
  const debutDate = new Date(parseInt(reservation.debut));
  return debutDate.getMinutes() === 30;
};

// Vérifie si la réservation finit à la demi-heure
const endsAtHalfHour = (reservation) => {
  const finDate = new Date(parseInt(reservation.fin));
  return finDate.getMinutes() === 30;
};
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: 'auto repeat(7, 1fr)' }">
    <!-- En-tête des jours -->
    <div class="sticky top-0 bg-slate-50 z-30"></div>
    <!-- Colonne vide pour les heures -->
    <div v-for="(day, index) in weekDays" :key="index" class="border-r text-center font-bold sticky top-0 bg-slate-50 z-30 p-2">
      <div class="uppercase text-sm text-gray-400 font-normal">{{ days[index] }}</div>
      <div class="text-xl font-bold text-gray-600">{{ day.getDate() }}</div>
    </div>

    <div class="h-4"></div>
    <div class="h-4 border-b"></div>
    <div class="h-4 border-b"></div>
    <div class="h-4 border-b"></div>
    <div class="h-4 border-b"></div>
    <div class="h-4 border-b"></div>
    <div class="h-4 border-b"></div>
    <div class="h-4 border-b"></div>

    <!-- Corps du calendrier : affichage des heures et cellules pour chaque jour -->
    <div v-for="hour in hours" :key="hour" class="contents">
      <!-- Colonne des heures avec bordure droite alignée en haut -->
      <div class="text-center px-2 flex items-start -mt-2.5">{{ hour }}:00</div>
      <!-- Colonnes des jours de la semaine -->
      <div v-for="(day, index) in weekDays" :key="index" class="border-b border-r min-h-[50px] px-1 relative">
        <!-- Contenu cellulaire -->

        <div v-for="reservation in props.allReservations" :key="reservation.id" class="h-full">
          <template v-if="isReservationInCell(day, hour, reservation)">
            <!-- Cas de la cellule de début -->
            <template v-if="day.getDate() === new Date(parseInt(reservation.debut)).getDate() && hour === new Date(parseInt(reservation.debut)).getHours()">
              <div
                :class="{
                  'bg-blue-500 text-white p-2 rounded absolute inset-0': true,
                  'h-1/2 top-1/2': startsAtHalfHour(reservation),
                }"
              >
                {{ reservation.vehicules.model }} - {{ reservation.profiles.prenom }} {{ reservation.profiles.nom }}
              </div>
            </template>

            <!-- Cas de la cellule de fin -->
            <template v-else-if="day.getDate() === new Date(parseInt(reservation.fin)).getDate() && hour === new Date(parseInt(reservation.fin)).getHours()">
              <div
                :class="{
                  'bg-red-500 text-white p-2 rounded absolute inset-0': true,
                  'h-1/2 bottom-1/2': endsAtHalfHour(reservation),
                }"
              >
                {{ reservation.vehicules.model }} - {{ reservation.profiles.prenom }} {{ reservation.profiles.nom }}
              </div>
            </template>

            <!-- Cas des cellules intermédiaires -->
            <template v-else-if="(day > new Date(parseInt(reservation.debut)) || (day.getDate() === new Date(parseInt(reservation.debut)).getDate() && hour > new Date(parseInt(reservation.debut)).getHours())) && (day < new Date(parseInt(reservation.fin)) || (day.getDate() === new Date(parseInt(reservation.fin)).getDate() && hour < new Date(parseInt(reservation.fin)).getHours()))">
              <div class="bg-blue-500 text-white p-2 rounded absolute inset-0">x</div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
