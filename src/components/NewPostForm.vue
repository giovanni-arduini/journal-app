<script setup>
import { ref, watch } from "vue";

const name = ref("");
const description = ref("");
const mood = ref("");
const tags = ref([]);
const tagsInput = ref("");
const file = ref(null);
const location = ref({ manual: "", geo: null });
const uploading = ref(false);
const positive_reflection = ref("");
const negative_reflection = ref("");
const physical_effort = ref(null);
const economic_effort = ref(null);
const actual_expense = ref(null);

const errors = ref({});

const props = defineProps({
  visible: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
const handleFileChange = (e) => {
  file.value = e.target.files[0];
};

function updateTags() {
  tags.value = tagsInput.value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function getGeoLocation() {
  if (!navigator.geolocation) return alert("Geolocalizzazione non supportata!");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      location.value.geo = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
    },
    (err) => {
      alert("Impossibile ottenere la posizione.");
    }
  );
}

function validateForm() {
  errors.value = {};
  if (!name.value.trim()) errors.value.name = "Il titolo è obbligatorio.";
  if (!mood.value.trim()) errors.value.mood = "Il mood è obbligatorio.";
  if (!description.value.trim())
    errors.value.description = "La descrizione è obbligatoria.";
  if (!physical_effort.value)
    errors.value.physical_effort = "Sforzo fisico obbligatorio.";
  if (!economic_effort.value)
    errors.value.economic_effort = "Sforzo economico obbligatorio.";
  if (
    actual_expense.value === null ||
    actual_expense.value === "" ||
    isNaN(actual_expense.value)
  )
    errors.value.actual_expense = "Spesa effettiva obbligatoria.";
  if (!file.value) errors.value.file = "Immagine o video obbligatori.";
  return Object.keys(errors.value).length === 0;
}

watch([name, mood, description, actual_expense, file], () => {
  validateForm();
});

const submitPost = async () => {
  if (!validateForm()) return;

  uploading.value = true;

  // 1. Richiedi signed URL
  const res = await fetch(
    `http://localhost:3000/api/posts/signed-url?filename=${file.value.name}&contentType=${file.value.type}`
  );
  const { uploadUrl, publicUrl } = await res.json();

  // 2. Carica il file su GCS
  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.value.type },
    body: file.value,
  });

  // 3. Prepara i dati del post
  const mediaType = file.value.type.startsWith("image") ? "image" : "video";
  const postData = {
    name: name.value,
    description: description.value,
    mood: mood.value,
    tags: tags.value,
    positive_reflection: positive_reflection.value,
    negative_reflection: negative_reflection.value,
    physical_effort: physical_effort.value,
    economic_effort: economic_effort.value,
    actual_expense: actual_expense.value,
    location: location.value,
    media: [
      {
        type: mediaType,
        url: publicUrl,
      },
    ],
  };

  // 4. Invia il post al backend
  await fetch("http://localhost:3000/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });

  uploading.value = false;
  alert("Post inviato!");
  name.value = "";
  description.value = "";
  file.value = null;
  close(); // <-- chiude il modal
};
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    @click.self="close"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-xl w-full p-4 relative overflow-y-auto"
      style="max-height: 90vh"
    >
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
        @click="close"
      >
        &times;
      </button>
      <form @submit.prevent="submitPost" class="space-y-4">
        <!-- Info principali -->
        <fieldset class="border border-blue-200 rounded-lg p-2 mb-2">
          <legend class="px-2 text-blue-600 font-semibold">
            Info principali
          </legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- Titolo -->
            <label class="block">
              <span class="text-blue-700 font-medium">
                Titolo: <span class="text-red-500">*</span>
              </span>
              <input
                v-model="name"
                :class="['input-field', errors.name ? 'border-red-500' : '']"
              />
            </label>
            <!-- Mood -->
            <label class="block">
              <span class="text-blue-700 font-medium">
                Mood: <span class="text-red-500">*</span>
              </span>
              <input
                v-model="mood"
                :class="['input-field', errors.mood ? 'border-red-500' : '']"
              />
            </label>
            <!-- Descrizione -->
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
                rows="1"
              />
            </label>
            <label class="block md:col-span-2">
              <span class="text-blue-700 font-medium">Tag (virgola):</span>
              <input
                v-model="tagsInput"
                @change="updateTags"
                class="input-field"
              />
            </label>
          </div>
        </fieldset>

        <!-- Riflessioni -->
        <fieldset class="border border-green-200 rounded-lg p-2 mb-2">
          <legend class="px-2 text-green-600 font-semibold">Riflessioni</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label class="block">
              <span class="text-green-700 font-medium">Positiva:</span>
              <input v-model="positive_reflection" class="input-field" />
            </label>
            <label class="block">
              <span class="text-green-700 font-medium">Negativa:</span>
              <input v-model="negative_reflection" class="input-field" />
            </label>
          </div>
        </fieldset>

        <!-- Sforzi & Spese -->
        <fieldset class="border border-yellow-200 rounded-lg p-2 mb-2">
          <legend class="px-2 text-yellow-600 font-semibold">
            Sforzi & Spese
          </legend>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
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
            <!-- Spesa effettiva rimane input numerico -->
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
        <fieldset class="border border-purple-200 rounded-lg p-2 mb-2">
          <legend class="px-2 text-purple-600 font-semibold">Località</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
            <label class="block">
              <span class="text-purple-700 font-medium">Manuale:</span>
              <input v-model="location.manual" class="input-field" />
            </label>
            <label class="block">
              <span class="text-purple-700 font-medium"
                >Geolocalizzazione:</span
              >
              <button
                type="button"
                @click="getGeoLocation"
                class="ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              >
                Usa la mia posizione
              </button>
              <span
                v-if="location.geo"
                class="block mt-2 text-xs text-purple-600"
              >
                Lat: {{ location.geo.lat }}, Lng: {{ location.geo.lng }}
              </span>
            </label>
          </div>
        </fieldset>

        <!-- Media -->
        <fieldset class="border border-pink-200 rounded-lg p-2 mb-2">
          <legend class="px-2 text-pink-600 font-semibold">Media</legend>
          <label class="block">
            <span class="text-pink-700 font-medium">
              Immagine o video: <span class="text-red-500">*</span>
            </span>
            <input
              type="file"
              @change="handleFileChange"
              accept="image/*,video/*"
              :class="['input-field', errors.file ? 'border-red-500' : '']"
            />
          </label>
        </fieldset>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="uploading"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            {{ uploading ? "Caricamento..." : "Invia Post" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.3rem 0.5rem;
  border: 1.5px solid #d1d5db;
  border-radius: 0.5rem;
  margin-top: 0.15rem;
  margin-bottom: 0.3rem;
  background: #f9fafb;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.input-field:focus {
  border-color: #3b82f6;
  outline: none;
  background: #fff;
}
fieldset {
  background: #f6f8fa;
}
legend {
  font-size: 1.05rem;
}
</style>
