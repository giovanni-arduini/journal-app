<script setup>
import { ref, watch } from "vue";

// sezioni del form
const currentStep = ref(1);

// dati del form
const name = ref("");
const description = ref("");
const mood = ref("");
const tags = ref([]);
const tagsInput = ref("");
const file = ref(null);
const date = ref(new Date().toISOString().slice(0, 10));
const location = ref({ manual: "", geo: null });
const uploading = ref(false);
const positive_reflection = ref("");
const negative_reflection = ref("");
const physical_effort = ref(null);
const economic_effort = ref(null);
const actual_expense = ref(null);

// errori
const generalError = ref("");
const errors = ref({});

const props = defineProps({
  visible: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}

function nextStep() {
  if (validateStep(currentStep.value)) {
    currentStep.value++;
    generalError.value = ""; // reset quando si passa allo step successivo
  }
}
function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
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

function validateStep(step) {
  errors.value = {};
  generalError.value = "";

  if (step === 1) {
    if (!name.value.trim()) errors.value.name = true;
    if (!mood.value.trim()) errors.value.mood = true;
    if (!description.value.trim()) errors.value.description = true;
    if (!date.value) errors.value.date = true;
  }
  if (step === 2) {
    if (!physical_effort.value) errors.value.physical_effort = true;
    if (!economic_effort.value) errors.value.economic_effort = true;
    if (
      actual_expense.value === null ||
      actual_expense.value === "" ||
      isNaN(actual_expense.value)
    )
      errors.value.actual_expense = true;
  }
  if (step === 3) {
    if (!file.value) errors.value.file = true;
    // aggiungi altri campi obbligatori dello step 3 se necessario
  }

  if (Object.keys(errors.value).length > 0) {
    generalError.value = "Riempire tutti gli spazi contrassegnati da asterisco";
    return false;
  }
  return true;
}

function resetForm() {
  name.value = "";
  description.value = "";
  mood.value = "";
  tags.value = [];
  tagsInput.value = "";
  file.value = null;
  location.value = { manual: "", geo: null };
  positive_reflection.value = "";
  negative_reflection.value = "";
  physical_effort.value = null;
  economic_effort.value = null;
  actual_expense.value = null;
  errors.value = {};
  generalError.value = "";
}

// watch([name, mood, description, actual_expense, file], () => {
//   validateForm();
// });

const submitPost = async () => {
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
    date: date.value,
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

function getPreviewUrl(file) {
  if (file && file.type && file.type.startsWith("image")) {
    return URL.createObjectURL(file);
  }
  return "";
}
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    @click.self="close"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-xl w-full p-4 relative overflow-y-auto"
      style="max-width: 900px; max-height: 90vh"
    >
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
        @click="close"
      >
        &times;
      </button>
      <form @submit.prevent="submitPost" class="space-y-8">
        <!-- Sezione 1 -->
        <div v-if="currentStep === 1">
          <div class="space-y-4">
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
                    :class="[
                      'input-field',
                      errors.name ? 'border-red-500' : '',
                    ]"
                  />
                </label>
                <!-- Mood -->
                <label class="block">
                  <span class="text-blue-700 font-medium">
                    Mood: <span class="text-red-500">*</span>
                  </span>
                  <input
                    v-model="mood"
                    :class="[
                      'input-field',
                      errors.mood ? 'border-red-500' : '',
                    ]"
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
                  <span class="text-blue-700 font-medium"
                    >Tag (separati da virgola):</span
                  >
                  <input
                    v-model="tagsInput"
                    @change="updateTags"
                    class="input-field"
                  />
                </label>
              </div>
              <label class="block">
                <span class="text-blue-700 font-medium">
                  Data: <span class="text-red-500">*</span>
                </span>
                <input type="date" v-model="date" class="input-field" />
              </label>
            </fieldset>
          </div>
          <div
            v-if="generalError"
            class="mb-4 text-red-600 font-semibold text-center"
          >
            {{ generalError }}
          </div>
          <button type="button" @click="nextStep" class="btn">Avanti</button>
        </div>

        <div v-if="currentStep === 2">
          <div class="space-y-4">
            <!-- Riflessioni -->
            <fieldset class="border border-green-200 rounded-lg p-2 mb-2">
              <legend class="px-2 text-green-600 font-semibold">
                Riflessioni
              </legend>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <label class="block">
                  <span class="text-green-700 font-medium">Positiva:</span>
                  <textarea v-model="positive_reflection" class="input-field" />
                </label>
                <label class="block">
                  <span class="text-green-700 font-medium">Negativa:</span>
                  <textarea v-model="negative_reflection" class="input-field" />
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
                        errors.physical_effort
                          ? 'border-b-2 border-red-500'
                          : '',
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
                        errors.economic_effort
                          ? 'border-b-2 border-red-500'
                          : '',
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
            <div
              v-if="generalError"
              class="mb-4 text-red-600 font-semibold text-center"
            >
              {{ generalError }}
            </div>
            <button type="button" @click="prevStep" class="btn">
              Indietro
            </button>
            <button type="button" @click="nextStep" class="btn">Avanti</button>
          </div>
        </div>

        <div v-if="currentStep === 3">
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
          <div
            v-if="generalError"
            class="mb-4 text-red-600 font-semibold text-center"
          >
            {{ generalError }}
          </div>
          <button type="button" @click="prevStep" class="btn">Indietro</button>
          <button type="button" @click="nextStep" class="btn">Avanti</button>
        </div>

        <div v-if="currentStep === 4" class="space-y-4">
          <h2 class="text-xl font-bold mb-4">Riepilogo dati inseriti</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Titolo:</strong> {{ name }}</p>
              <p><strong>Mood:</strong> {{ mood }}</p>
              <p><strong>Descrizione:</strong> {{ description }}</p>
              <p><strong>Tag:</strong> {{ tags.join(", ") }}</p>
              <p>
                <strong>Riflessione positiva:</strong> {{ positive_reflection }}
              </p>
              <p>
                <strong>Riflessione negativa:</strong> {{ negative_reflection }}
              </p>
            </div>
            <div>
              <p>
                <strong>Sforzo fisico:</strong>
                <span v-for="n in physical_effort" :key="n">💪</span>
              </p>
              <p>
                <strong>Sforzo economico:</strong>
                <span v-for="n in economic_effort" :key="n">💸</span>
              </p>
              <p><strong>Spesa effettiva:</strong> {{ actual_expense }} €</p>
              <p><strong>Località:</strong> {{ location.manual }}</p>
              <p v-if="location.geo">
                <strong>Geolocalizzazione:</strong>
                Lat: {{ location.geo.lat }}, Lng: {{ location.geo.lng }}
              </p>
              <p v-if="file">
                <strong>Media:</strong>
                <span v-if="file.type.startsWith('image')">Immagine</span>
                <span v-else>Video</span>
                <br />
                <img
                  v-if="getPreviewUrl(file)"
                  :src="getPreviewUrl(file)"
                  alt="Anteprima"
                  class="mt-2 rounded shadow max-w-xs"
                />
              </p>
            </div>
          </div>

          <div
            v-if="generalError"
            class="mb-4 text-red-600 font-semibold text-center"
          >
            {{ generalError }}
          </div>

          <div class="flex justify-between mt-6">
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
            >
              Reset
            </button>
            <button type="button" @click="prevStep" class="btn">
              Indietro
            </button>
            <button type="submit" class="btn">Invia</button>
          </div>
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
