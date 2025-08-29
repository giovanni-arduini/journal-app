<template>
  <EditPostForm
    v-if="showEditPost"
    :post="post"
    @close="showEditPost = false"
    @updated="handlePostUpdated"
  />
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
      <div>
        <button @click="showEditPost = true">Modifica</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { getTagColor, usePosts } from "@/usePosts";
import EditPostForm from "./EditPostForm.vue";

const { updatePost } = usePosts();

function handlePostUpdated(updatedPost) {
  updatePost(updatedPost._id, updatedPost);
  showEditPost.value = false;
}

const props = defineProps({
  post: { type: Object, required: true },
  visible: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);
const showEditPost = ref(false);

function close() {
  emit("close");
}
</script>
