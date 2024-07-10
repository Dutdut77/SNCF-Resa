<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  viewIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:modelValue"]);
const list = ref(null);
const activeIndex = ref(props.viewIndex); // Récupère l'index que l'on souhaite centrer directement.
const paddingItems = ref(0); // Au départ pas items vide au dessus ou en dessous.

// Récupère la hauteur de <ul> total et la hauteur de <li> pour calculer le nombre items en haut et bas qu'il faut pour avoir la première valeur de items au centre.
const calculatePaddingItems = () => {
  const listHeight = list.value.clientHeight;
  const itemHeight = list.value.querySelector("li").offsetHeight;
  paddingItems.value = Math.floor(listHeight / itemHeight / 2);
};

// Permet de calculer le scrollTop qu'il faut pour avec l'index souhaité au centre.
const scrollToIndex = (index) => {
  const itemHeight = list.value.querySelector("li").offsetHeight;
  const offset = (index + paddingItems.value) * itemHeight - list.value.clientHeight / 2 + itemHeight / 2;
  list.value.scrollTop = offset;
  activeIndex.value = index;
  emit("update:modelValue", props.items[index]);
};

// Permet de calculer le nouveau activeIndex et de renvoyer la valeur de l'item au parent.
const onScroll = () => {
  const itemHeight = list.value.querySelector("li").offsetHeight;
  const index = Math.round((list.value.scrollTop + list.value.clientHeight / 2 - itemHeight / 2) / itemHeight) - paddingItems.value;
  if (index >= 0 && index < props.items.length) {
    activeIndex.value = index;
    emit("update:modelValue", props.items[index]);
  }
};

onMounted(() => {
  // Au demarage on calcul le padding qu'il faut.
  calculatePaddingItems();
  // On attend que l'on soit sur que calculatePaddingItems est fini puis on scroll à l'index voulu.
  nextTick(() => {
    scrollToIndex(activeIndex.value);
  });

  window.addEventListener("resize", calculatePaddingItems);
});

onUnmounted(() => {
  window.removeEventListener("resize", calculatePaddingItems);
});

// Permet de selectionner un item et de le mettre au centre directement en cliquant dessus.
const selectItem = (index) => {
  scrollToIndex(index);
};
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <ul class="overflow-y-auto h-48 snap-y snap-mandatory scroll-smooth" ref="list" @scroll="onScroll">
      <!-- Item vide pour gérer le scroll du haut -->
      <li v-for="index in paddingItems" :key="'top-' + index" class="h-12 flex items-center justify-center"></li>

      <!-- Liste des Items (props.items) -->
      <li
        v-for="(item, index) in props.items"
        :key="index"
        :class="{
          'snap-center text-lg font-bold text-gray-100 ': index === activeIndex,
          'snap-center duration-500 ': true,
          'text-gray-200 opacity-60': Math.abs(index - activeIndex) === 1,
          'text-gray-300 opacity-30': Math.abs(index - activeIndex) === 2,
        }"
        class="h-12 flex items-center justify-center cursor-pointer"
        @click="selectItem(index)"
      >
        {{ item }}
      </li>

      <!-- Item vide pour gérer le scroll du bas -->
      <li v-for="index in paddingItems" :key="'bottom-' + index" class="h-12 flex items-center justify-center"></li>
    </ul>
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="border-t border-b border-gray-300 h-12 w-full"></div>
    </div>
  </div>
</template>

<style scoped>
/* Cacher la barre de défilement */
::-webkit-scrollbar {
  display: none;
}
</style>
