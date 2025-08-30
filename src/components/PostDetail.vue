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
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 relative">
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        @click="close"
      >
        &times;
      </button>
      <h2 class="text-3xl font-bold mb-4">{{ post.name }}</h2>
      <div class="mb-4">
        <template v-if="post.media && post.media.length">
          <template v-for="mediaItem in post.media" :key="mediaItem._id">
            <div class="w-full flex justify-center items-center">
              <div style="height: 50vh; aspect-ratio: 4/3; overflow: hidden">
                <img
                  v-if="mediaItem.type === 'image'"
                  :src="mediaItem.url"
                  alt="Foto"
                  class="w-full object-cover rounded-lg"
                  style="aspect-ratio: 4/3"
                />
                <video
                  v-else-if="mediaItem.type === 'video'"
                  :src="mediaItem.url"
                  :poster="mediaItem.videoPreview"
                  controls
                  class="w-full object-cover rounded-lg"
                  style="aspect-ratio: 16/9"
                ></video>
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <div class="w-full flex items-center justify-center text-gray-400">
            Nessun media disponibile
          </div>
        </template>
      </div>
      <div class="mb-2 text-gray-700">
        <strong>Luogo:</strong> {{ post.location.manual }}
      </div>
      <div class="mb-2 text-gray-700">
        <strong>Descrizione:</strong> {{ post.description }}
      </div>
      <div class="mb-2 text-gray-700">
        <strong>Stato d'animo:</strong> {{ post.mood }}
      </div>
      <div class="mb-2 text-gray-700">
        <strong>Riflessione positiva:</strong> {{ post.positive_reflection }}
      </div>
      <div class="mb-2 text-gray-700">
        <strong>Riflessione negativa:</strong> {{ post.negative_reflection }}
      </div>
      <div class="mb-2 text-gray-700">
        <strong>Sforzo fisico:</strong>
        <span v-for="n in post.physical_effort" :key="n">💪</span>
      </div>
      <div class="mb-2 text-gray-700">
        <strong>Sforzo economico:</strong>
        <span v-for="n in post.economic_effort" :key="n">💸</span>
      </div>
      <div class="mb-2 text-gray-700">
        <strong>Spesa effettiva:</strong> €{{ post.actual_expense }}
      </div>
      <div class="mt-4">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="inline-block px-2 py-1 mr-2 mb-2 rounded text-xs font-semibold shadow"
          :style="{ backgroundColor: getTagColor(tag) }"
        >
          {{ tag }}
        </span>
      </div>
      <div class="flex gap-4 mt-6 justify-end">
        <button @click="showEditPost = true" class="btn bg-blue-500 text-white">
          Modifica
        </button>
        <button @click="handleDelete" class="btn bg-red-500 text-white">
          Elimina
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getTagColor, usePosts } from "@/usePosts";
import EditPostForm from "./EditPostForm.vue";

const { updatePost, deletePost } = usePosts();

const props = defineProps({
  post: { type: Object, required: true },
  visible: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);
const showEditPost = ref(false);
const showDeleteModal = ref(false);

function close() {
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
