<template>
  <div class="relative w-48 mx-auto">
    <ul class="overflow-y-auto h-48 snap-y snap-mandatory" ref="list" @scroll="onScroll">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="{
          'snap-center text-lg font-bold': index === activeIndex,
          'snap-center': true,
        }"
        class="h-12 flex items-center justify-center"
      >
        {{ item }}
      </li>
    </ul>
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="border-t border-b border-gray-300 h-12 w-full"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
  mounted() {
    this.scrollToMiddle();
  },
  methods: {
    scrollToMiddle() {
      const list = this.$refs.list;
      // Calculer l'index de l'élément central
      const middleIndex = Math.floor(this.items.length / 2);
      // Définir la position de défilement pour que l'élément central soit visible
      list.scrollTop = middleIndex * 48;
      this.activeIndex = middleIndex;
    },
    onScroll() {
      const list = this.$refs.list;
      // Calculer l'index de l'élément actuellement centré
      const index = Math.round(list.scrollTop / 48);
      this.activeIndex = index;
    },
  },
};
</script>

<style scoped>
.snap-y {
  scroll-snap-type: y mandatory;
}
.snap-center {
  scroll-snap-align: center;
}
</style>
