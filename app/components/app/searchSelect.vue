<script setup>
const props = defineProps({
  modelValue: { default: "" },
  groups: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  placeholder: { type: String, default: "Sélectionnez…" },
  searchPlaceholder: { type: String, default: "Rechercher…" },
  searchKeys: { type: Array, default: () => [] },
  triggerIcon: { type: String, default: "" },
  triggerIconClass: { type: String, default: "text-slate-400" },
  triggerIconActiveClass: { type: String, default: "text-sky-500" },
  disabled: { type: Boolean, default: false },
  emptyText: { type: String, default: "Aucun résultat." },
  label: { type: String, default: "" },
  clearable: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const search = ref("");
const searchInput = ref(null);
const root = ref(null);

const isGrouped = computed(() => Array.isArray(props.groups) && props.groups.length > 0);

const allItems = computed(() => {
  if (isGrouped.value) return props.groups.flatMap((g) => g.items || []);
  return props.items || [];
});

const selectedItem = computed(() => allItems.value.find((it) => it.id == props.modelValue));

const normalize = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const matches = (item) => {
  const q = normalize(search.value.trim());
  if (!q) return true;
  if (!props.searchKeys.length) return true;
  return props.searchKeys.some((k) => normalize(item[k]).includes(q));
};

const filteredGroups = computed(() => {
  if (isGrouped.value) {
    return props.groups
      .map((g) => ({ ...g, items: (g.items || []).filter(matches) }))
      .filter((g) => g.items.length > 0);
  }
  return [{ label: "", items: (props.items || []).filter(matches) }];
});

const totalFiltered = computed(() => filteredGroups.value.reduce((acc, g) => acc + g.items.length, 0));

const toggle = () => {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) {
    nextTick(() => searchInput.value?.focus());
  } else {
    search.value = "";
  }
};

const close = () => {
  open.value = false;
  search.value = "";
};

const onSelect = (item) => {
  emit("update:modelValue", item.id);
  close();
};

const onClear = () => {
  emit("update:modelValue", "");
  close();
};

const onDocClick = (e) => {
  if (!open.value) return;
  if (root.value?.contains(e.target)) return;
  close();
};

const onKeydown = (e) => {
  if (e.key === "Escape" && open.value) close();
};

onMounted(() => {
  document.addEventListener("mousedown", onDocClick);
  document.addEventListener("keydown", onKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onDocClick);
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div ref="root" class="relative w-full">
    <label v-if="label" class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{{ label }}</label>

    <div
      role="button"
      :tabindex="disabled ? -1 : 0"
      class="w-full flex items-center gap-3 pl-3 pr-2 py-2.5 rounded-xl border bg-white text-left transition select-none outline-none"
      :class="[
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        open ? 'border-sky-400 ring-2 ring-sky-100' : disabled ? 'border-slate-200' : 'border-slate-200 hover:border-sky-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100',
      ]"
      :aria-expanded="open"
      :aria-disabled="disabled"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <Icon v-if="triggerIcon" :name="triggerIcon" size="18" class="shrink-0 transition-colors" :class="open ? triggerIconActiveClass : triggerIconClass" />

      <div class="flex-1 min-w-0">
        <slot v-if="selectedItem" name="selected" :item="selectedItem">
          <span class="text-sm font-medium text-slate-700 truncate block">{{ selectedItem.id }}</span>
        </slot>
        <span v-else class="text-sm text-slate-400">{{ placeholder }}</span>
      </div>

      <button
        v-if="selectedItem && clearable && !disabled"
        type="button"
        class="shrink-0 size-6 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
        title="Effacer"
        @click.stop="onClear"
        @keydown.enter.stop
        @keydown.space.stop
      >
        <Icon name="material-symbols:close-rounded" size="16" />
      </button>

      <span class="size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors" :class="open ? 'bg-sky-50 text-sky-500' : 'text-slate-400'">
        <Icon name="material-symbols:expand-more-rounded" size="20" class="transition-transform duration-200" :class="open ? 'rotate-180' : ''" />
      </span>
    </div>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="open" class="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[min(22rem,60vh)]">
        <!-- Recherche -->
        <div class="relative border-b border-slate-100 shrink-0">
          <Icon name="material-symbols:search-rounded" size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            ref="searchInput"
            v-model="search"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full pl-9 pr-9 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none"
          />
          <button
            v-if="search"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 size-6 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
            title="Effacer la recherche"
            @click="search = ''"
          >
            <Icon name="material-symbols:close-rounded" size="14" />
          </button>
        </div>

        <!-- Liste -->
        <div class="flex-1 min-h-0 overflow-auto overscroll-contain py-1">
          <div v-if="totalFiltered === 0" class="px-4 py-8 flex flex-col items-center gap-2 text-slate-400">
            <Icon name="material-symbols:search-off-rounded" size="22" />
            <span class="text-sm italic">{{ emptyText }}</span>
          </div>

          <template v-else>
            <div v-for="(g, gi) in filteredGroups" :key="g.label || `__group_${gi}`">
              <p v-if="g.label" class="sticky top-0 z-10 px-3 pt-2 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-white/95 backdrop-blur-sm border-b border-slate-100">
                {{ g.label }}
              </p>
              <button
                v-for="item in g.items"
                :key="item.id"
                type="button"
                class="w-full text-left px-3 py-2 flex items-center gap-3 transition cursor-pointer"
                :class="item.id == modelValue ? 'bg-sky-50 hover:bg-sky-100' : 'hover:bg-slate-50'"
                @click="onSelect(item)"
              >
                <div class="flex-1 min-w-0">
                  <slot name="option" :item="item" :selected="item.id == modelValue">
                    <span class="text-sm text-slate-700">{{ item.id }}</span>
                  </slot>
                </div>
                <Icon
                  v-if="item.id == modelValue"
                  name="material-symbols:check-circle-rounded"
                  size="18"
                  class="text-sky-500 shrink-0"
                />
              </button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>
