<script setup>
const formValue = defineModel();

const { formatedDate } = useFormatDate();

const year = ref(formValue.value.year);
const month = ref(formValue.value.month);

const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];

// Change the order of days to start with Monday
const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

const selectedDateFormat = computed(() => {
  const dateObject = new Date(formValue.value.year, formValue.value.month, formValue.value.day);
  return formatedDate(dateObject.getTime());
});

const firstDayOfMonth = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay();
  // Adjust for Monday as the first day
  return (firstDay + 6) % 7;
});

const datesInMonth = computed(() => {
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
});

const colorOption = (num) => {
  if (year.value == formValue.value.year && month.value == formValue.value.month && formValue.value.day == num) {
    return "bg-sncf-primary text-white font-medium  ";
  }
};

const selectDay = (selectedDay) => {
  formValue.value.day = selectedDay;
  formValue.value.month = month.value;
  formValue.value.year = year.value;
};

watch(formValue.value, async (newValue, oldValue) => {
  month.value = formValue.value.month;
  year.value = formValue.value.year;
});
</script>

<template>
  <div>
    <div class="w-full content-center text-sm text-gray-700">
      <div class="bg-slate-50 border border-gray-200 rounded-xl">
        <!-- <div class="text-center font-medium text-base px-4 pt-4 pb-2 first-letter:uppercase">{{ selectedDateFormat.jourName }} {{ selectedDateFormat.jour }} {{ selectedDateFormat.mois }} {{ selectedDateFormat.annee }}</div> -->

        <div class="flex items-center justify-center pb-2 pt-2">
          <div class="w-1/2 flex justify-center items-center py-2 px-2">
            <Icon name="material-symbols:chevron-left" size="24" class="mr-auto cursor-pointer" @click="month--" :class="month > 0 ? 'visible' : 'invisible'" />
            <p class="text-center font-medium">{{ months[month] }}</p>
            <Icon name="material-symbols:chevron-right" size="24" class="ml-auto cursor-pointer" @click="month++" :class="month < 11 ? 'visible' : 'invisible'" />
          </div>
          <div class="w-1/2 flex justify-center items-center py-2 px-2">
            <Icon name="material-symbols:chevron-left" size="24" class="mr-auto cursor-pointer" @click="year--" />
            <p class="text-center font-medium">{{ year }}</p>
            <Icon name="material-symbols:chevron-right" size="24" class="ml-auto cursor-pointer" @click="year++" />
          </div>
        </div>

        <div class="w-full grid grid-cols-7 gap-1 px-2 pb-2">
          <div class="text-center font-bold" v-for="day in days" :key="day">{{ day }}</div>
          <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class=""></div>
          <div class="relative w-full h-5 text-sm flex items-center justify-center cursor-pointer duration-300" v-for="date in datesInMonth" :key="date" @click="selectDay(date)">
            <div class="rounded-full w-6 h-6 flex items-center justify-center" :class="colorOption(date)">
              {{ date }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
