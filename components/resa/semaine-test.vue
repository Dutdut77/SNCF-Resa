<script setup>
// Date de départ
const props = defineProps(["startDate", "allReservations"]);
const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const hours = ref([...Array(24).keys()]); // Tableau de 0 à 24
// Fonction pour cloner un objet chantier
const cloneChantier = (chantier) => {
  return { ...chantier };
};

// Fonction qui vérifie si deux chantiers se superposent
const estSuperpose = (chantier1, chantier2) => {
  return chantier1.debut <= chantier2.fin && chantier1.fin >= chantier2.debut;
};

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
const semaine = computed(() => {
  const result = getWeekDays(props.startDate);
  return result;
});
const chantiersParJour = computed(() => {
  const result = semaine.value.map((jour) => {
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
  console.log(result);
  return result;
});

// Fonction pour vérifier si une réservation est dans une cellule donnée (jour/heure)
const isReservationInCell = (index, hour, reservation) => {
  const day = semaine.value[index];
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
    <div class="sticky top-0 bg-slate-50 z-30"></div>

    <div v-for="(day, index) in semaine" :key="index" class="border-r text-center font-bold sticky top-0 bg-slate-50 z-30 p-2">
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

    <div v-for="hour in hours" :key="hour" class="contents">
      <div class="text-center px-2 flex items-start -mt-2.5">{{ hour }}:00</div>

      <div v-for="(resas, index) in chantiersParJour" :key="index" class="border-b border-r h-[50px] px-1 relative" :class="`grid grid-cols-${resas.length}`">
        <div v-for="resa in resas" :key="resa" class="h-full w-full flex">
          <div v-for="oneResa in resa" :key="oneResa" class="w-full h-full">
            <div v-if="isReservationInCell(index, hour, oneResa)" class="w-full h-full">
              <template id="debut" v-if="semaine[index].getDate() === new Date(parseInt(oneResa.debut)).getDate() && hour === new Date(parseInt(oneResa.debut)).getHours()">
                <div class="flex flex-col justify-end h-full w-full">
                  <div :class="startsAtHalfHour(oneResa) ? 'bg-yellow-300 h-1/2 w-full' : 'bg-yellow-300 w-full h-full'">Début</div>
                </div>
              </template>

              <template id="fin" v-else-if="semaine[index].getDate() === new Date(parseInt(oneResa.fin)).getDate() && hour === new Date(parseInt(oneResa.fin)).getHours()">
                <div :class="endsAtHalfHour(oneResa) ? 'h-1/2 bg-yellow-300' : 'invisible'">FIn</div>
              </template>

              <template
                id="intermediaire"
                v-else-if="(semaine[index] > new Date(parseInt(oneResa.debut)) || (semaine[index].getDate() === new Date(parseInt(oneResa.debut)).getDate() && hour > new Date(parseInt(oneResa.debut)).getHours())) && (semaine[index] < new Date(parseInt(oneResa.fin)) || (semaine[index].getDate() === new Date(parseInt(oneResa.fin)).getDate() && hour < new Date(parseInt(oneResa.fin)).getHours()))"
              >
                <div class="h-full bg-yellow-300">i</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
