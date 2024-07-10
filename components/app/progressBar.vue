<script setup>
const props = defineProps({
  percentage: {
    type: Number,
    required: true,
    default: 0,
  },
});

const circumference = computed(() => {
  return 2 * Math.PI * 48; // 2πr where r is the radius of the circle (48 in this case)
});

const offset = computed(() => {
  return circumference.value - (props.percentage / 100) * circumference.value;
});
</script>

<template>
  <div class="relative flex items-center justify-center w-32 h-32">
    <svg class="absolute w-full h-full">
      <circle class="text-gray-300" stroke-width="4" stroke="currentColor" fill="transparent" r="48" cx="50%" cy="50%" />
      <circle class="text-sky-500" stroke-width="4" :stroke-dasharray="circumference" :stroke-dashoffset="offset" stroke-linecap="round" stroke="currentColor" fill="transparent" r="48" cx="50%" cy="50%" />
    </svg>
    <span class="absolute text-3xl font-semibold text-sky-500">{{ percentage }}%</span>
  </div>
</template>

<style scoped>
circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>
