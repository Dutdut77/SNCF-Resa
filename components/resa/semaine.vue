<script setup>
const props = defineProps(["startDate", "allReservations"]);
const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const hours = [
  "00h00",
  "00h30",
  "01h00",
  "01h30",
  "02h00",
  "02h30",
  "03h00",
  "03h30",
  "04h00",
  "04h30",
  "05h00",
  "05h30",
  "06h00",
  "06h30",
  "07h00",
  "07h30",
  "08h00",
  "08h30",
  "09h00",
  "09h30",
  "10h00",
  "10h30",
  "11h00",
  "11h30",
  "12h00",
  "12h30",
  "13h00",
  "13h30",
  "14h00",
  "14h30",
  "15h00",
  "15h30",
  "16h00",
  "16h30",
  "17h00",
  "17h30",
  "18h00",
  "18h30",
  "19h00",
  "19h30",
  "20h00",
  "20h30",
  "21h00",
  "21h30",
  "22h00",
  "22h30",
  "23h00",
  "23h30",
];

// Exemples de rendez-vous
const rendezVous = ref([
  { id: 1, titre: "Réunion équipe", debut: 1727244000000, fin: 1727267400000 }, // Sur plusieurs jours
  { id: 2, titre: "Appel client", debut: 1727353800000, fin: 1727420400000 }, // 14:30 à 09:00 (Sur deux jours)
  { id: 3, titre: "Autre", debut: 1727244000000, fin: 1727260217000 }, // Sur plusieurs jours
  { id: 4, titre: "Début Journée", debut: 1727226000000, fin: 1727229600000 }, // Sur plusieurs jours
  { id: 5, titre: "3eme rang", debut: 1727253017000, fin: 1727258417000 }, // Sur plusieurs jours
  { id: 6, titre: "2eme rang double", debut: 1727262017000, fin: 1727276417000 }, // Sur plusieurs jours
]);

// Fonction pour obtenir le premier jour de la semaine (lundi)
const getStartOfWeek = (date) => {
  const dayOfWeek = date.getDay(); // Jour actuel (0 = dimanche, 1 = lundi, etc.)
  const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Ajuster si dimanched
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

const getEventStyle = (e, events, j) => {
  const start = new Date(e.debut);
  const end = new Date(e.fin);
  const jourJ = weekDays.value[j].getDate();
  const index = events.findIndex((subArray) => subArray.some((event) => event.id === e.id));

  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();

  // Calcul le top
  let top = 0;
  if (start.getDate() == jourJ) {
    top = (startMinutes / 1440) * 100; // 1440 = 24h * 60min
  } else {
    top = 0;
  }

  // Calcul de la hauteur
  let height = 1;
  if (end.getDate() == start.getDate()) {
    height = ((endMinutes - startMinutes - 1) / 1440) * 100; // En pourcentage le - moins 1 c'est pour l'arorndi en bas qu'il soit visible
  } else if (end.getDate() == jourJ) {
    height = (endMinutes / 1440) * 100; // En pourcentage le - moins 1 c'est pour l'arorndi en bas qu'il soit visible
  } else {
    height = 100 - top;
  }

  // Calcul de la largeur en fonction du nombre d'événements qui se chevauchent
  let width = 100;
  if (e.superpose > 0) {
    width = 100 - (100 / events.length) * index - (100 / events.length) * (e.superpose - index);
  }
  console.log(width);

  // Calcul de left
  const left = (100 / events.length) * index;

  return {
    top: `${top}%`,
    height: `${height}%`,
    width: `${width}%`,
    left: `${left}%`,
  };
};

const estSuperpose = (chantier1, chantier2) => {
  return chantier1.debut <= chantier2.fin && chantier1.fin >= chantier2.debut;
};
// Fonction pour cloner un objet chantier
const cloneChantier = (chantier) => {
  return { ...chantier };
};

const chantiersParJour = computed(() => {
  const result = weekDays.value.map((jour) => {
    const jourTimestamp = jour.getTime();
    const finJour = jourTimestamp + 24 * 60 * 60 * 1000 - 1;

    // Filtrer les chantiers pour cette journée
    const chantiersDuJour = rendezVous.value.filter((chantier) => chantier.debut <= finJour && chantier.fin >= jourTimestamp).map(cloneChantier); // Cloner chaque chantier

    chantiersDuJour.sort((a, b) => a.debut - b.debut);

    if (chantiersDuJour.length === 0) return [];

    const sousSousArrays = []; // Array pour stocker les sous-sous-array

    chantiersDuJour.forEach((chantier) => {
      let placed = false;

      for (let sousArray of sousSousArrays) {
        let superpose = false;

        for (let chantierExist of sousArray) {
          if (estSuperpose(chantier, chantierExist)) {
            superpose = true;
            break;
          }
        }

        if (!superpose) {
          sousArray.push(chantier);
          placed = true;
          break;
        }
      }

      if (!placed) {
        sousSousArrays.push([chantier]);
      }
    });

    return sousSousArrays;
  });

  // Ajout de la clé "superpose" en fonction des sous-sous-arrays pour chaque journée
  result.forEach((sousSousArrays) => {
    sousSousArrays.forEach((sousArray) => {
      sousArray.forEach((chantier) => {
        chantier.superpose = 0; // Initialiser la clé superpose

        // Comparer avec les autres chantiers uniquement dans le même jour
        sousSousArrays.forEach((otherSousArray) => {
          otherSousArray.forEach((otherChantier) => {
            if (chantier !== otherChantier && estSuperpose(chantier, otherChantier)) {
              chantier.superpose++;
            }
          });
        });
      });
    });
  });

  return result;
});
</script>

<template>
  <!-- {{ chantiersParJour[2] }} -->
  <div class="w-full h-full grid" :style="{ gridTemplateColumns: 'auto repeat(7, 1fr)' }">
    <div class=""></div>
    <div v-for="(day, index) in weekDays" :key="index" class="flex flex-col pb-4 border-b border-sncf-primary-light text-center sticky top-0 bg-slate-50 z-40">
      <div class="uppercase text-sm text-gray-400 font-normal">{{ days[index] }}</div>
      <div class="text-xl font-bold text-gray-600">{{ day.getDate() }}</div>
    </div>

    <!-- Colonne des heures -->
    <div class="flex flex-col w-fit px-4">
      <div v-for="hour in hours" :key="hour" class="h-6 border-gray-300 even:invisible">
        <div class="-mt-2.5">{{ hour }}</div>
      </div>
    </div>

    <div v-for="(events, index) in chantiersParJour" :key="index" class="flex flex-col relative border">
      <div v-for="hour in hours" :key="hour" class="h-6 border-b border-gray-300"></div>
      <div v-for="event in events" :key="event">
        <div v-for="e in event" :key="e">
          <div class="absolute pr-1 cursor-pointer top-0" :style="getEventStyle(e, events, index)">
            <div class="bg-sncf-primary-light rounded-r-lg w-full h-full hover:bg-sncf-primary">{{ e.superpose }}<br />{{ e.titre }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
