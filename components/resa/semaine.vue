<script setup>
const props = defineProps(["startDate", "allReservations"]);
const emits = defineEmits(["selectedResa"]);
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
const hoveredCard = ref(null);

const { formatedDate, getWeek } = useFormatDate();

// Exemples de rendez-vous
// const rendezVous = ref([
//   { id: 1, titre: "Réunion équipe", debut: 1727244000000, fin: 1727267400000 }, // Sur plusieurs jours
//   { id: 2, titre: "Appel client", debut: 1727353800000, fin: 1727420400000 }, // 14:30 à 09:00 (Sur deux jours)
//   { id: 3, titre: "Autre", debut: 1727244000000, fin: 1727260217000 }, // Sur plusieurs jours
//   { id: 4, titre: "Début Journée", debut: 1727226000000, fin: 1727229600000 }, // Sur plusieurs jours
//   { id: 5, titre: "3eme rang", debut: 1727253017000, fin: 1727258417000 }, // Sur plusieurs jours
//   { id: 6, titre: "2eme rang double", debut: 1727262017000, fin: 1727276417000 }, // Sur plusieurs jours
// ]);

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
  const start = new Date(Number(e.debut));
  const end = new Date(Number(e.fin));
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

  const width = calculateWidths(events);

  // Calcul de left
  const left = (100 / events.length) * index;

  return {
    top: `${top}%`,
    height: `${height}%`,
    width: e.width,
    left: `${left}%`,
  };
};

const calculateWidths = (events) => {
  const numberOfSubArrays = events.length;
  const baseWidth = 100 / numberOfSubArrays;
  events.forEach((subArray, subIndex) => {
    subArray.forEach((event) => {
      let width = baseWidth;

      // Vérifier les sous-tableaux suivants
      for (let nextIndex = subIndex + 1; nextIndex < numberOfSubArrays; nextIndex++) {
        const nextSubArray = events[nextIndex];

        // Vérification de superposition avec au moins un événement dans le sous-tableau suivant
        const hasOverlap = nextSubArray.some((nextEvent) => estSuperpose(event, nextEvent));

        // Si aucun chevauchement, on ajoute à la largeur
        if (!hasOverlap) {
          width += baseWidth;
        } else {
          // Si chevauchement, on arrête
          break;
        }
      }

      // Ajouter la propriété largeur à l'objet
      event.width = `${width}%`;
    });
  });
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
    const chantiersDuJour = props.allReservations.filter((chantier) => chantier.debut <= finJour && chantier.fin >= jourTimestamp).map(cloneChantier); // Cloner chaque chantier

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

  return result;
});

const handleMouseEnter = (id) => {
  hoveredCard.value = id;
};

const handleMouseLeave = () => {
  hoveredCard.value = null;
};

const isHovered = (data) => {
  const separate = data.split("-");
  const id = separate[1];
  if (hoveredCard.value == id) {
    return true;
  }
};

const sendResa = (e) => {
  emits("selectedResa", e);
};
</script>

<template>
  <div class="w-full h-full grid" :style="{ gridTemplateColumns: 'auto repeat(7, 1fr)' }">
    <div class="sticky top-0 bg-slate-50 z-40"></div>
    <div v-for="(day, index) in weekDays" :key="index" class="flex flex-col pb-4 border-b border-gray-300 text-center sticky top-0 bg-slate-50 z-40">
      <div class="uppercase text-sm text-gray-400 font-normal">{{ days[index] }}</div>
      <div class="text-xl font-bold text-gray-600">{{ day.getDate() }}</div>
    </div>

    <!-- Colonne des heures -->
    <div class="flex flex-col w-fit px-4">
      <div v-for="hour in hours" :key="hour" class="h-5 border-gray-300 even:invisible">
        <div class="">{{ hour }}</div>
      </div>
    </div>

    <div v-for="(events, index) in chantiersParJour" :key="index" class="flex flex-col relative border">
      <div v-for="hour in hours" :key="hour" class="h-5 border-b border-gray-300 odd:border-dashed odd:border-gray-200"></div>
      <div v-for="event in events" :key="event">
        <div v-for="e in event" :key="e">
          <div class="absolute pr-1 cursor-pointer top-0" :style="getEventStyle(e, events, index)" @mouseenter="handleMouseEnter(e.id)" @mouseleave="handleMouseLeave" @click="sendResa(e)">
            <div :id="`id_${index}-${e.id}`" class="rounded-r-lg w-full text-white h-full p-2 break-words overflow-hidden border-l-4 border-sncf-primary" :class="isHovered(`id_${index}-${e.id}`) ? 'bg-sncf-primary' : 'bg-sncf-primary-light/80'">
              <div class="w-full h-full text-xs flex flex-col">
                <div v-if="e.salles">{{ e.salles.names }}</div>
                <div v-if="e.vehicules.immat">{{ e.vehicules.immat }}</div>
                <div>{{ e.profiles.nom }} {{ e.profiles.prenom }}</div>
                <div class="mt-auto ml-auto">{{ formatedDate(Number(e.debut)).heure }}h{{ formatedDate(Number(e.debut)).minute }} - {{ formatedDate(Number(e.fin)).heure }}h{{ formatedDate(Number(e.fin)).minute }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
