<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  images: { type: Array, default: () => [] },
  startIndex: { type: Number, default: 0 },
});

const emit = defineEmits(["update:open"]);

const index = ref(props.startIndex);

const close = () => emit("update:open", false);

const prev = () => {
  if (!props.images.length) return;
  index.value = (index.value - 1 + props.images.length) % props.images.length;
};

const next = () => {
  if (!props.images.length) return;
  index.value = (index.value + 1) % props.images.length;
};

const onKeydown = (e) => {
  if (!props.open) return;
  if (e.key === "Escape") close();
  else if (e.key === "ArrowLeft") prev();
  else if (e.key === "ArrowRight") next();
};

watch(
  () => props.open,
  (val) => {
    if (val) {
      index.value = props.startIndex;
      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
      }
    } else if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  },
);

watch(() => props.startIndex, (val) => {
  if (props.open) index.value = val;
});

onMounted(() => {
  if (typeof window !== "undefined") window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") window.removeEventListener("keydown", onKeydown);
  if (typeof document !== "undefined") document.body.style.overflow = "";
});

const current = computed(() => props.images[index.value]);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center" @click.self="close">
        <!-- Bouton fermer -->
        <button
          type="button"
          class="absolute top-4 right-4 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
          title="Fermer (Esc)"
          @click="close"
        >
          <Icon name="material-symbols:close-rounded" size="24" />
        </button>

        <!-- Compteur -->
        <div v-if="images.length > 1" class="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
          {{ index + 1 }} / {{ images.length }}
        </div>

        <!-- Précédent -->
        <button
          v-if="images.length > 1"
          type="button"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
          title="Précédent (←)"
          @click.stop="prev"
        >
          <Icon name="material-symbols:chevron-left-rounded" size="28" />
        </button>

        <!-- Suivant -->
        <button
          v-if="images.length > 1"
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
          title="Suivant (→)"
          @click.stop="next"
        >
          <Icon name="material-symbols:chevron-right-rounded" size="28" />
        </button>

        <!-- Image -->
        <img
          v-if="current"
          :key="current"
          :src="current"
          class="max-w-[92vw] max-h-[88vh] object-contain select-none"
          @click.stop
        />
      </div>
    </Transition>
  </Teleport>
</template>
