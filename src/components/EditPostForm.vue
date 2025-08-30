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
const date = ref(
  props.post?.date
    ? new Date(props.post.date).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10)
);
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

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

fieldset {
  transition: all 0.2s ease-in-out;
}

fieldset:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scale-110 {
  transform: scale(1.1);
}
</style>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 relative overflow-y-auto"
      style="max-height: 90vh"
    >
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
        @click="emit('close')"
      >
        &times;
      </button>

      <h2 class="text-2xl font-bold text-gray-800 mb-6">Modifica Post</h2>

      <form @submit.prevent="submitEdit" class="space-y-6">
        <div
          v-if="generalError"
          class="mb-4 text-red-600 font-semibold text-center"
        >
          {{ generalError }}
        </div>

        <!-- Info principali -->
        <fieldset class="border border-blue-200 rounded-lg p-4 mb-4">
          <legend class="px-2 text-blue-600 font-semibold">
            Info principali
          </legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="block">
              <span class="text-blue-700 font-medium">
                Titolo: <span class="text-red-500">*</span>
              </span>
              <input
                v-model="name"
                :class="['input-field', errors.name ? 'border-red-500' : '']"
              />
            </label>
            <label class="block">
              <span class="text-blue-700 font-medium">
                Mood: <span class="text-red-500">*</span>
              </span>
              <input
                v-model="mood"
                :class="['input-field', errors.mood ? 'border-red-500' : '']"
              />
            </label>
            <label class="block md:col-span-2">
              <span class="text-blue-700 font-medium">
                Descrizione: <span class="text-red-500">*</span>
              </span>
              <textarea
                v-model="description"
                :class="[
                  'input-field',
                  errors.description ? 'border-red-500' : '',
                ]"
                rows="3"
              />
            </label>
            <label class="block md:col-span-2">
              <span class="text-blue-700 font-medium">Tag:</span>
              <input v-model="tags" class="input-field" />
            </label>
            <label class="block">
              <span class="text-blue-700 font-medium">
                Data: <span class="text-red-500">*</span>
              </span>
              <input type="date" v-model="date" class="input-field" />
            </label>
          </div>
        </fieldset>

        <!-- Riflessioni -->
        <fieldset class="border border-green-200 rounded-lg p-4 mb-4">
          <legend class="px-2 text-green-600 font-semibold">Riflessioni</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="block">
              <span class="text-green-700 font-medium">Positiva:</span>
              <textarea
                v-model="positive_reflection"
                class="input-field"
                rows="3"
              />
            </label>
            <label class="block">
              <span class="text-green-700 font-medium">Negativa:</span>
              <textarea
                v-model="negative_reflection"
                class="input-field"
                rows="3"
              />
            </label>
          </div>
        </fieldset>

        <!-- Sforzi & Spese -->
        <fieldset class="border border-yellow-200 rounded-lg p-4 mb-4">
          <legend class="px-2 text-yellow-600 font-semibold">
            Sforzi & Spese
          </legend>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Sforzo fisico con emoji -->
            <label class="block">
              <span class="text-yellow-700 font-medium">
                Fisico: <span class="text-red-500">*</span>
              </span>
              <div class="flex space-x-1 mt-1">
                <span
                  v-for="n in 5"
                  :key="'fisico-' + n"
                  @click="physical_effort = n"
                  :class="[
                    'cursor-pointer text-2xl transition',
                    physical_effort >= n
                      ? 'opacity-100 scale-110'
                      : 'opacity-40',
                    errors.physical_effort ? 'border-b-2 border-red-500' : '',
                  ]"
                  >💪</span
                >
              </div>
            </label>
            <!-- Sforzo economico con emoji -->
            <label class="block">
              <span class="text-yellow-700 font-medium">
                Economico: <span class="text-red-500">*</span>
              </span>
              <div class="flex space-x-1 mt-1">
                <span
                  v-for="n in 5"
                  :key="'economico-' + n"
                  @click="economic_effort = n"
                  :class="[
                    'cursor-pointer text-2xl transition',
                    economic_effort >= n
                      ? 'opacity-100 scale-110'
                      : 'opacity-40',
                    errors.economic_effort ? 'border-b-2 border-red-500' : '',
                  ]"
                  >💸</span
                >
              </div>
            </label>
            <!-- Spesa effettiva -->
            <label class="block">
              <span class="text-yellow-700 font-medium">
                Spesa effettiva: <span class="text-red-500">*</span>
              </span>
              <input
                type="number"
                v-model="actual_expense"
                :class="[
                  'input-field',
                  errors.actual_expense ? 'border-red-500' : '',
                ]"
              />
            </label>
          </div>
        </fieldset>

        <!-- Località -->
        <fieldset class="border border-purple-200 rounded-lg p-4 mb-4">
          <legend class="px-2 text-purple-600 font-semibold">Località</legend>
          <div class="grid grid-cols-1 gap-4">
            <label class="block">
              <span class="text-purple-700 font-medium">Località manuale:</span>
              <input v-model="location.manual" class="input-field" />
            </label>
          </div>
        </fieldset>

        <div class="flex justify-end mt-6">
          <button
            type="submit"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Salva modifiche
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
