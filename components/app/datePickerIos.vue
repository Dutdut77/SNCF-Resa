<template>
  <div class="relative w-48 mx-auto">
    <ul class="overflow-y-auto h-48 snap-y snap-mandatory" ref="list" @scroll="onScroll">
      <!-- Empty items at the top -->
      <li v-for="index in paddingItems" :key="'top-' + index" class="h-12 flex items-center justify-center"></li>

      <!-- Actual items -->
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="{
          'snap-center text-lg font-bold text-gray-100 drop-shadow-xl': index === activeIndex,
          'snap-center': true,
          'text-gray-200 opacity-40  ': Math.abs(index - activeIndex) === 1,
          'text-gray-300 opacity-10 ': Math.abs(index - activeIndex) === 2,
        }"
        class="h-12 flex items-center justify-center"
      >
        {{ item }}
      </li>

      <!-- Empty items at the bottom -->
      <li v-for="index in paddingItems" :key="'bottom-' + index" class="h-12 flex items-center justify-center"></li>
    </ul>
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="border-t border-b border-gray-300 h-12 w-full"></div>
    </div>
  </div>
</template>

<script setup>
// import { ref, onMounted, nextTick } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["input"]);
const list = ref(null);
const activeIndex = ref(1); // Set to 1 to start at index 1
const paddingItems = ref(0);

const calculatePaddingItems = () => {
  const listHeight = list.value.clientHeight;
  const itemHeight = list.value.querySelector("li").offsetHeight;
  paddingItems.value = Math.floor(listHeight / itemHeight / 2);
};

const scrollToIndex = (index) => {
  const itemHeight = list.value.querySelector("li").offsetHeight;
  const offset = (index + paddingItems.value) * itemHeight - list.value.clientHeight / 2 + itemHeight / 2;
  list.value.scrollTop = offset;
  activeIndex.value = index;
  emit("input", props.items[index]);
};

const onScroll = () => {
  const itemHeight = list.value.querySelector("li").offsetHeight;
  const index = Math.round((list.value.scrollTop + list.value.clientHeight / 2 - itemHeight / 2) / itemHeight) - paddingItems.value;
  if (index >= 0 && index < props.items.length) {
    activeIndex.value = index;
    emit("input", props.items[index]);
  }
};

onMounted(() => {
  calculatePaddingItems();
  nextTick(() => {
    scrollToIndex(activeIndex.value);
  });

  // Add a resize event listener to recalculate padding items on window resize
  window.addEventListener("resize", calculatePaddingItems);
});

// Cleanup event listener on unmount
onUnmounted(() => {
  window.removeEventListener("resize", calculatePaddingItems);
});
</script>

<style scoped>
.snap-y {
  scroll-snap-type: y mandatory;
}
.snap-center {
  scroll-snap-align: center;
}

/* Cacher la barre de défilement */
::-webkit-scrollbar {
  display: none;
}
</style>
