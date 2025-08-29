<script setup>
import { ref, watch } from "vue";
import { usePosts } from "@/usePosts";

const props = defineProps({
  post: Object,
  visible: Boolean,
});
const emit = defineEmits(["close", "updated"]);

// Inizializza i campi con i dati del post
const name = ref(props.post?.name || "");
const description = ref(props.post?.description || "");
const mood = ref(props.post?.mood || "");
const tags = ref(props.post?.tags ? [...props.post.tags] : []);
const date = ref(new Date().toISOString().slice(0, 10));
const positive_reflection = ref(props.post?.positive_reflection || "");
const negative_reflection = ref(props.post?.negative_reflection || "");
const physical_effort = ref(props.post?.physical_effort || null);
const economic_effort = ref(props.post?.economic_effort || null);
const actual_expense = ref(props.post?.actual_expense || null);
const location = ref(props.post?.location || { manual: "", geo: null });

const errors = ref({});
const generalError = ref("");

function validateForm() {
  errors.value = {};
  generalError.value = "";
  if (!name.value.trim()) errors.value.name = true;
  if (!mood.value.trim()) errors.value.mood = true;
  if (!description.value.trim()) errors.value.description = true;
  if (!physical_effort.value) errors.value.physical_effort = true;
  if (!economic_effort.value) errors.value.economic_effort = true;
  if (
    actual_expense.value === null ||
    actual_expense.value === "" ||
    isNaN(actual_expense.value)
  )
    errors.value.actual_expense = true;
  if (Object.keys(errors.value).length > 0) {
    generalError.value = "Riempire tutti gli spazi contrassegnati da asterisco";
    return false;
  }
  return true;
}

const { updatePost } = usePosts();

async function submitEdit() {
  if (!validateForm()) return;
  const updatedPost = {
    ...props.post,
    name: name.value,
    description: description.value,
    mood: mood.value,
    tags: tags.value,
    date: date.value,
    positive_reflection: positive_reflection.value,
    negative_reflection: negative_reflection.value,
    physical_effort: physical_effort.value,
    economic_effort: economic_effort.value,
    actual_expense: actual_expense.value,
    location: location.value,
  };
  await updatePost(updatedPost);
  emit("updated", updatedPost);
  emit("close");
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-xl w-full p-4 relative overflow-y-auto"
      style="max-width: 900px; max-height: 90vh"
    >
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
        @click="emit('close')"
      >
        &times;
      </button>
      <form @submit.prevent="submitEdit" class="space-y-8">
        <div
          v-if="generalError"
          class="mb-4 text-red-600 font-semibold text-center"
        >
          {{ generalError }}
        </div>
        <!-- Campi principali, come nel form di creazione -->
        <label>
          Titolo: <span class="text-red-500">*</span>
          <input
            v-model="name"
            :class="['input-field', errors.name ? 'border-red-500' : '']"
          />
        </label>
        <label>
          Mood: <span class="text-red-500">*</span>
          <input
            v-model="mood"
            :class="['input-field', errors.mood ? 'border-red-500' : '']"
          />
        </label>
        <label>
          Descrizione: <span class="text-red-500">*</span>
          <textarea
            v-model="description"
            :class="['input-field', errors.description ? 'border-red-500' : '']"
          />
        </label>
        <label>
          Tag:
          <input v-model="tags" class="input-field" />
        </label>
        <label>
          Riflessione positiva:
          <textarea v-model="positive_reflection" class="input-field" />
        </label>
        <label>
          Data: <span class="text-red-500">*</span>
          <input type="date" v-model="date" class="input-field" />
        </label>
        <label>
          Riflessione negativa:
          <textarea v-model="negative_reflection" class="input-field" />
        </label>
        <label>
          Sforzo fisico: <span class="text-red-500">*</span>
          <input
            type="number"
            v-model="physical_effort"
            :class="[
              'input-field',
              errors.physical_effort ? 'border-red-500' : '',
            ]"
            min="1"
            max="5"
          />
        </label>
        <label>
          Sforzo economico: <span class="text-red-500">*</span>
          <input
            type="number"
            v-model="economic_effort"
            :class="[
              'input-field',
              errors.economic_effort ? 'border-red-500' : '',
            ]"
            min="1"
            max="5"
          />
        </label>
        <label>
          Spesa effettiva: <span class="text-red-500">*</span>
          <input
            type="number"
            v-model="actual_expense"
            :class="[
              'input-field',
              errors.actual_expense ? 'border-red-500' : '',
            ]"
          />
        </label>
        <label>
          Località manuale:
          <input v-model="location.manual" class="input-field" />
        </label>
        <div class="flex justify-end mt-4">
          <button
            type="submit"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Salva modifiche
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
