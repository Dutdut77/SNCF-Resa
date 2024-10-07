<script setup>
import Left from "@/assets/svg/Left.vue";
import Right from "@/assets/svg/Right.vue";

const formValue = defineModel();
const props = defineProps(["action"]);

const choiceMonth = ref(formValue && formValue.value ? new Date(formValue.value).getMonth() : new Date().getMonth());
const choiceYear = ref(formValue && formValue.value ? new Date(formValue.value).getFullYear() : new Date().getFullYear());
const choiceDay = ref(formValue && formValue.value ? new Date(formValue.value).getDate() : new Date().getDate());
const selectedMonth = ref(choiceMonth.value);
const selectedYear = ref(choiceYear.value);
const selectedDay = ref(choiceDay.value);
const selectedHeure = ref(new Date().getHours());
const selectedMinute = ref("00");

const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
// const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
// const heures = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

// const activeIndexHeure = ref(formValue && formValue.value ? new Date(formValue.value).getHours() : new Date().getHours());

// const searchIndexMinute = (data) => {
//   if (data) {
//     const date = new Date(data);
//     let currentMinutes = date.getMinutes();
//     // Arrondir les minutes à 5 près
//     currentMinutes = Math.ceil(currentMinutes / 5) * 5;
//     // Trouver l'index correspondant dans le tableau 'minutes'
//     const index = minutes.indexOf(currentMinutes.toString().padStart(2, "0"));
//     return index;
//   } else {
//     const date = new Date();
//     let currentMinutes = date.getMinutes();
//     // Arrondir les minutes à 5 près
//     currentMinutes = Math.ceil(currentMinutes / 5) * 5;
//     // Trouver l'index correspondant dans le tableau 'minutes'
//     const index = minutes.indexOf(currentMinutes.toString().padStart(2, "0"));
//     return index;
//   }
// };
// const activeIndexMinute = ref(formValue && formValue.value ? searchIndexMinute(formValue.value) : searchIndexMinute());

const firstDayOfMonth = computed(() => {
  const firstDay = new Date(choiceYear.value, choiceMonth.value, 1).getDay();
  // Adjust for Monday as the first day
  return (firstDay + 6) % 7;
});

const datesInMonth = computed(() => {
  const daysInMonth = new Date(choiceYear.value, choiceMonth.value + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
});

const selectDay = (day) => {
  selectedDay.value = day;
  selectedMonth.value = choiceMonth.value;
  selectedYear.value = choiceYear.value;
};

const colorOption = (num) => {
  if (choiceYear.value == selectedYear.value && choiceMonth.value == selectedMonth.value && selectedDay.value == num) {
    return "bg-sncf-primary-light text-white font-medium  ";
  }
};

const validChoice = () => {
  const date = new Date(selectedYear.value, selectedMonth.value, selectedDay.value, selectedHeure.value, selectedMinute.value).getTime();
  formValue.value = date;
  props.action(date);
};

const addHour = () => {
  if (selectedHeure.value == 23) {
    selectedHeure.value = "00";
  } else {
    selectedHeure.value = (parseInt(selectedHeure.value) + 1).toString().padStart(2, "0");
  }
};
const subHour = () => {
  if (selectedHeure.value == "00") {
    selectedHeure.value = "23";
  } else {
    selectedHeure.value = (parseInt(selectedHeure.value) - 1).toString().padStart(2, "0");
  }
};
const changeMinute = () => {
  if (selectedMinute.value == "00") {
    selectedMinute.value = "30";
  } else {
    selectedMinute.value = "00";
  }
};
</script>

<template>
  <div>
    <div class="w-full h-full flex flex-col text-sm text-gray-700 border rounded-xl border-gray-300 shadow-lg overflow-hidden">
      <div class="p-2 bg-sncf-primary-light font-medium text-white">
        <div>Date sélectionnée :</div>
        <div class="text-lg">{{ selectedDay }} {{ months[selectedMonth] }} {{ selectedYear }} - {{ selectedHeure }} h {{ selectedMinute }}</div>
      </div>
      <div class="h-auto bg-slate-50 flex divide-y-2 md:divide-y-0 md:divide-x-2 pt-4 flex-col md:flex-row items-stretch">
        <div class="w-full h-full px-2">
          <div class="flex items-center justify-center">
            <div class="w-1/2 flex justify-center items-center py-2 px-2">
              <Left class="mr-auto h-6 w-6 cursor-pointer" @click="choiceMonth--" :class="choiceMonth > 0 ? 'visible' : 'invisible'" />
              <p class="text-center font-medium">{{ months[choiceMonth] }}</p>
              <Right class="ml-auto h-6 w-6 cursor-pointer" @click="choiceMonth++" :class="choiceMonth < 11 ? 'visible' : 'invisible'" />
            </div>
            <div class="w-1/2 flex justify-center items-center py-2 px-2">
              <Left class="mr-auto h-6 w-6 cursor-pointer" @click="choiceYear--" />
              <p class="text-center font-medium">{{ choiceYear }}</p>
              <Right class="ml-auto h-6 w-6 cursor-pointer" @click="choiceYear++" />
            </div>
          </div>

          <div class="w-full grid grid-cols-7 gap-1 px-2 pb-2">
            <div class="text-center font-bold w-full p-2" v-for="day in days" :key="day">{{ day }}</div>
            <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class=""></div>
            <div class="relative w-full h-5 text-sm flex items-center justify-center cursor-pointer duration-300" v-for="date in datesInMonth" :key="date" @click="selectDay(date)">
              <div class="rounded-full w-6 h-6 flex items-center justify-center" :class="colorOption(date)">
                {{ date }}
              </div>
            </div>
          </div>
        </div>

        <div class="h-full flex justify-center px-4">
          <div class="p-2 text-center">
            <div class="text-center font-medium">Heures</div>
            <div class="h-full w-16 flex flex-col items-center justify-center pb-8">
              <Left class="size-8 rotate-90 text-gray-600 cursor-pointer hover:text-sky-500" @click="subHour()" />
              <p class="text-lg font-bold text-white bg-sncf-primary-light rounded px-4 py-1 cursor-default">{{ selectedHeure }}</p>
              <Left class="size-8 -rotate-90 text-gray-600 cursor-pointer hover:text-sky-500" @click="addHour()" />
              <!-- <AppDatePickerIos class="w-20" :items="heures" v-model="selectedHeure" :viewIndex="activeIndexHeure" /> -->
            </div>
          </div>
          <div class="h-full flex items-center font-medium pt-2">h</div>
          <div class="p-2 text-center">
            <div class="text-center font-medium">Minutes</div>
            <div class="h-full w-16 flex flex-col items-center justify-center pb-8">
              <Left class="size-8 rotate-90 text-gray-600 cursor-pointer hover:text-sky-500" @click="changeMinute()" />
              <p class="text-lg font-bold text-white bg-sncf-primary-light rounded px-4 py-1 cursor-default">{{ selectedMinute }}</p>
              <Left class="size-8 -rotate-90 text-gray-600 cursor-pointer hover:text-sky-500" @click="changeMinute" />
              <!-- <AppDatePickerIos class="w-20" :items="minutes" v-model="selectedMinute" :viewIndex="activeIndexMinute" /> -->
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-4 px-4 py-2 text-gray-600 text-base bg-slate-50">
        <p class="ml-auto cursor-pointer hover:font-medium duration-300" @click="props.action()">Annuler</p>
        <p class="cursor-pointer hover:font-medium duration-300" @click="validChoice()">Ok</p>
      </div>
    </div>
  </div>
</template>
