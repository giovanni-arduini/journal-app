<template>
  <!-- Modale di conferma eliminazione -->
  <BasicModal
    v-if="showDeleteModal"
    :open="showDeleteModal"
    title="Conferma eliminazione"
    :fields="[]"
    submitLabel="Conferma"
    @submit="confirmDelete"
    @close="showDeleteModal = false"
    class="fixed inset-0"
  >
    <template #default>
      <div class="text-center py-4">
        <p>Sei sicuro di voler eliminare questo post?</p>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="px-4 py-2 bg-red-500 text-white rounded mr-2"
        @click="confirmDelete"
      >
        Elimina
      </button>
      <button
        type="button"
        class="px-4 py-2 bg-gray-300 rounded"
        @click="showDeleteModal = false"
      >
        Annulla
      </button>
    </template>
  </BasicModal>
  <!-- Modale di modifica -->
  <EditPostForm
    v-else-if="showEditPost"
    :post="post"
    @close="showEditPost = false"
    @updated="handlePostUpdated"
    class="fixed inset-0 z-50"
  />

  <!-- Overlay e dettaglio post -->
  <div
    v-else
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
    @click.self="close"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-5xl w-full h-[90vh] flex relative overflow-hidden"
    >
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl z-10"
        @click="close"
      >
        &times;
      </button>

      <!-- Sezione sinistra - Immagine -->
      <div class="w-3/5 bg-gray-100 h-full flex flex-cols justify-center">
        <div class="grid grid-rows-4 gap-4 p-4">
          <!-- Foto: occupa 3/4 -->
          <div class="row-span-3 flex items-center justify-center">
            <template v-if="post.media && post.media.length">
              <template v-for="mediaItem in post.media" :key="mediaItem._id">
                <img
                  v-if="mediaItem.type === 'image'"
                  :src="mediaItem.url"
                  alt="Foto"
                  class="max-w-full max-h-full object-contain rounded-lg"
                />
                <video
                  v-else-if="mediaItem.type === 'video'"
                  :src="mediaItem.url"
                  :poster="mediaItem.videoPreview"
                  controls
                  class="max-w-full max-h-full object-contain rounded-lg"
                ></video>
              </template>
            </template>
            <template v-else>
              <div
                class="flex items-center justify-center text-gray-400 text-lg h-full w-full"
              >
                Nessun media disponibile
              </div>
            </template>
          </div>
          <!-- Mappa: occupa 1/4 -->
          <div class="row-span-1 h-full rounded-lg overflow-hidden shadow">
            <LMap
              v-if="post.location && post.location.geo"
              :zoom="12"
              :center="[post.location.geo.lat, post.location.geo.lng]"
              style="height: 100%; width: 100%"
              :scrollWheelZoom="false"
              :doubleClickZoom="false"
              :touchZoom="false"
              :dragging="false"
            >
              <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LMarker
                :lat-lng="[post.location.geo.lat, post.location.geo.lng]"
              >
                <LPopup>
                  <strong>{{ post.name }}</strong
                  ><br />
                  {{ post.location.manual }}
                </LPopup>
              </LMarker>
            </LMap>
            <div
              v-else
              class="flex items-center justify-center h-full text-gray-400"
            >
              Nessuna posizione geografica
            </div>
          </div>
        </div>
      </div>

      <!-- Sezione destra - Dettagli -->
      <div class="w-2/5 flex flex-col p-8 overflow-y-auto">
        <h2 class="text-3xl font-bold mb-6 pr-8">{{ post.name }}</h2>

        <div class="flex-1 space-y-4">
          <div class="text-gray-700">
            <strong>Luogo:</strong> {{ post.location.manual }}
          </div>
          <div class="text-gray-700">
            <strong>Descrizione:</strong> {{ post.description }}
          </div>
          <div class="text-gray-700">
            <strong>Stato d'animo:</strong> {{ post.mood }}
          </div>
          <div class="text-gray-700">
            <strong>Riflessione positiva:</strong>
            {{ post.positive_reflection }}
          </div>
          <div class="text-gray-700">
            <strong>Riflessione negativa:</strong>
            {{ post.negative_reflection }}
          </div>
          <div class="text-gray-700">
            <strong>Sforzo fisico:</strong>
            <span v-for="n in post.physical_effort" :key="n">💪</span>
          </div>
          <div class="text-gray-700">
            <strong>Sforzo economico:</strong>
            <span v-for="n in post.economic_effort" :key="n">💸</span>
          </div>
          <div class="text-gray-700">
            <strong>Spesa effettiva:</strong> €{{ post.actual_expense }}
          </div>

          <!-- Tags -->
          <div class="mt-6">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="inline-block px-2 py-1 mr-2 mb-2 rounded text-xs font-semibold shadow"
              :style="{ backgroundColor: getTagColor(tag) }"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Pulsanti in basso a destra -->
        <div class="flex gap-4 mt-6 justify-end">
          <button
            @click="showEditPost = true"
            class="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Modifica
          </button>
          <button
            @click="handleDelete"
            class="btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { getTagColor, usePosts } from "@/usePosts";
import EditPostForm from "./EditPostForm.vue";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

const { updatePost, deletePost } = usePosts();

const props = defineProps({
  post: { type: Object, required: true },
  visible: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);
const showEditPost = ref(false);
const showDeleteModal = ref(false);

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "auto";
});

function close() {
  document.body.style.overflow = "auto";
  emit("close");
}

function handleDelete() {
  showDeleteModal.value = true;
}

function confirmDelete() {
  deletePost(props.post._id);
  showDeleteModal.value = false;
  emit("close");
}

function handlePostUpdated(updatedPost) {
  updatePost(updatedPost._id, updatedPost);
  showEditPost.value = false;
}
</script>
