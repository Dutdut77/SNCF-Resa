<script setup>
import Left from "@/assets/svg/Left.vue";
import Right from "@/assets/svg/Right.vue";

const props = defineProps({
  dayIsReserved: {
    type: Array,
    default: [],
  },

  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const year = ref(props.modelValue.year);
const month = ref(props.modelValue.month);
const day = ref(props.modelValue.day);

const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];

// Change the order of days to start with Monday
const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

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
  if (year.value == props.modelValue.year && month.value == props.modelValue.month && day.value == num) {
    return "bg-sky-500 text-white font-medium  ";
  }
};

const isReserved = (num) => {
  const result = props.dayIsReserved.some((date) => date.year === year.value && date.month === month.value && date.day === num);
  return result;
};
const colorOptionIsReserved = (num) => {
  if (year.value == props.modelValue.year && month.value == props.modelValue.month && day.value == num) {
    return "bg-white ";
  }
};

const selectDay = (selectedDay) => {
  day.value = selectedDay;
  emit("update:modelValue", { year: year.value, month: month.value, day: selectedDay });
};
</script>

<template>
  <div>
    <!-- <div class="flex items-center justify-center gap-4 pb-4 px-4">
      <div class="w-1/2 flex justify-center items-center gap-2 bg-white rounded-lg py-2 px-2 shadow-lg">
        <Left class="mr-auto h-6 w-6 cursor-pointer" @click="year--" />
        <p class="text-center font-medium">{{ year }}</p>
        <Right class="ml-auto h-6 w-6 cursor-pointer" @click="year++" />
      </div>
      <div class="w-1/2 flex justify-center items-center gap-2 bg-white shadow-lg rounded-lg py-2 px-2">
        <Left class="mr-auto h-6 w-6 cursor-pointer" @click="month--" :class="month > 0 ? 'visible' : 'invisible'" />
        <p class="text-center font-medium">{{ months[month] }}</p>
        <Right class="ml-auto h-6 w-6 cursor-pointer" @click="month++" :class="month < 11 ? 'visible' : 'invisible'" />
      </div>
    </div> -->

    <div class="w-full content-center px-4">
      <div class="bg-white rounded-lg shadow-lg">
        <div class="flex items-center justify-center gap-4 pb-4 p-4">
          <div class="w-1/2 flex justify-center items-center gap-2 py-2 px-2">
            <Left class="mr-auto h-6 w-6 cursor-pointer" @click="year--" />
            <p class="text-center font-medium">{{ year }}</p>
            <Right class="ml-auto h-6 w-6 cursor-pointer" @click="year++" />
          </div>
          <div class="w-1/2 flex justify-center items-center gap-2 py-2 px-2">
            <Left class="mr-auto h-6 w-6 cursor-pointer" @click="month--" :class="month > 0 ? 'visible' : 'invisible'" />
            <p class="text-center font-medium">{{ months[month] }}</p>
            <Right class="ml-auto h-6 w-6 cursor-pointer" @click="month++" :class="month < 11 ? 'visible' : 'invisible'" />
          </div>
        </div>

        <div class="w-full grid grid-cols-7 gap-1 px-4 pb-4">
          <div class="text-center font-bold" v-for="day in days" :key="day">{{ day }}</div>
          <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class=""></div>
          <div class="relative w-full h-7 text-sm flex items-center justify-center cursor-pointer duration-300" v-for="date in datesInMonth" :key="date" @click="selectDay(date)">
            <div class="rounded-full w-8 h-8 flex items-center justify-center" :class="colorOption(date)">
              {{ date }}
            </div>

            <div v-if="isReserved(date)" class="absolute bottom-0.5 h-1 w-1 rounded-full bg-sky-500" :class="colorOptionIsReserved(date)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
