<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  modelValue: string[]; // array di tag selezionati
  suggestions?: string[]; // lista opzionale di suggerimenti
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const inputValue = ref("");

// suggerimenti filtrati
const filteredSuggestions = computed(() => {
  if (!inputValue.value) return [];
  return (props.suggestions || []).filter(
    (s) =>
      s.toLowerCase().includes(inputValue.value.toLowerCase()) &&
      !props.modelValue.includes(s)
  );
});

function addTag(tag: string) {
  if (tag && !props.modelValue.includes(tag)) {
    emit("update:modelValue", [...props.modelValue, tag]);
  }
  inputValue.value = "";
}

function removeTag(tag: string) {
  emit(
    "update:modelValue",
    props.modelValue.filter((t) => t !== tag)
  );
}

function onEnter(e: KeyboardEvent) {
  e.preventDefault();
  if (inputValue.value.trim()) {
    addTag(inputValue.value.trim());
  }
}
</script>

<template>
  <div>
    <!-- Lista dei tag -->
    <div class="flex flex-wrap gap-2 mb-2">
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="bg-blue-200 text-blue-900 px-2 py-1 rounded-full flex items-center"
      >
        {{ tag }}
        <button
          type="button"
          class="ml-2 text-sm text-red-500 hover:text-red-700"
          @click="removeTag(tag)"
        >
          ✕
        </button>
      </span>
    </div>

    <!-- Input -->
    <input
      v-model="inputValue"
      @keydown.enter="onEnter"
      type="text"
      placeholder="Che includa tag..."
      class="border p-2 rounded w-full"
    />

    <!-- Suggerimenti -->
    <ul
      v-if="filteredSuggestions.length"
      class="border rounded mt-1 bg-white shadow"
    >
      <li
        v-for="s in filteredSuggestions"
        :key="s"
        @click="addTag(s)"
        class="px-2 py-1 cursor-pointer hover:bg-blue-100"
      >
        {{ s }}
      </li>
    </ul>
  </div>
</template>
