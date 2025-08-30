<script setup>
import { ref, onMounted, computed } from "vue";
import { getTagColor } from "@/usePosts";
import PostDetail from "./PostDetail.vue";

const props = defineProps({
  post: { type: Object, required: true },
});

const decorationType = ref("");
const decorationColor = ref(null);
const rotation = ref(0);
const isFlipped = ref(false);
const showDetailModal = ref(false);

const tags = computed(() => props.post.tags || []);

function showDetail() {
  showDetailModal.value = true;
}
function closeDetail() {
  showDetailModal.value = false;
}

function convertDate(date) {
  return new Date(date).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

onMounted(() => {
  decorationType.value = Math.random() < 0.5 ? "scotch" : "pin";
  decorationColor.value = Math.random() < 0.5 ? 1 : 2;
  rotation.value = Math.random() * 15 - 5;
});

function flipCard() {
  isFlipped.value = !isFlipped.value;
}

function getStickerStyle() {
  const angle = (Math.random() - 0.5) * 16;
  return `transform: rotate(${angle}deg);`;
}
</script>

<template>
  <PostDetail
    v-if="showDetailModal"
    :post="props.post"
    :visible="showDetailModal"
    @close="closeDetail"
  />
  <div
    class="relative flex flex-col items-center w-full max-w-sm aspect-[3/4] mx-auto"
    :class="isFlipped ? 'z-40' : 'z-10'"
    @click="flipCard"
    style="perspective: 1200px; cursor: pointer"
  >
    <div
      class="relative w-full h-full transition-transform duration-500"
      :style="{
        transform: `
        rotate(${rotation}deg)
        ${isFlipped ? 'rotateY(180deg) scale(1.2)' : ''}
      `,
      }"
      style="transform-style: preserve-3d"
    >
      <!-- Decorazioni scotch/pin -->
      <Transition name="scotch-move" mode="out-in">
        <div v-if="!isFlipped && decorationType === 'scotch'" key="scotch">
          <div
            class="absolute -left-5 top-2 w-24 h-8 rotate-[-45deg] rounded shadow-md z-10 scotch-left"
            :class="
              decorationColor === 1
                ? 'bg-yellow-200 opacity-80'
                : 'bg-gray-800 opacity-20'
            "
          ></div>
          <div
            class="absolute -right-4 top-2 w-24 h-8 rotate-[45deg] rounded shadow-md z-10 scotch-right"
            :class="
              decorationColor === 1
                ? 'bg-yellow-200 opacity-80'
                : 'bg-gray-800 opacity-20'
            "
          ></div>
        </div>
      </Transition>

      <Transition name="pin-move" mode="out-in">
        <div
          v-if="!isFlipped && decorationType === 'pin'"
          key="pin"
          class="absolute left-1/2 -translate-x-1/2 top-1 z-10 flex flex-col items-center"
        >
          <div
            class="w-7 h-7 rounded-full border-gray-200 border-2 shadow-md"
            :class="decorationColor === 2 ? 'bg-red-600' : 'bg-blue-600'"
          ></div>
        </div>
      </Transition>

      <!-- Card flip container -->
      <div
        class="relative w-full h-full transition-transform duration-500"
        :class="isFlipped ? 'rotate-y-180 scale-bigger' : ''"
        style="transform-style: preserve-3d"
      >
        <!-- Front -->
        <div
          class="absolute inset-0 flex flex-col bg-white rounded-lg shadow-lg mx-auto"
          style="backface-visibility: hidden"
        >
          <figure
            class="flex-1 flex items-center justify-center overflow-hidden rounded-t-lg p-2 min-h-0"
          >
            <template v-if="props.post.media && props.post.media.length">
              <template
                v-for="mediaItem in props.post.media"
                :key="mediaItem._id"
              >
                <img
                  v-if="mediaItem.type === 'image'"
                  :src="mediaItem.url"
                  alt="immagine"
                  class="object-cover w-full h-full"
                />
                <video
                  v-else-if="mediaItem.type === 'video'"
                  :src="mediaItem.url"
                  :poster="mediaItem.videoPreview"
                  controls
                  class="object-cover w-full h-full"
                ></video>
              </template>
            </template>
            <template v-else>
              <div
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                Nessun media disponibile
              </div>
            </template>
          </figure>
          <div
            class="flex-shrink-0 w-full px-2 sm:px-4 pt-2 sm:pt-3 pb-4 sm:pb-6 bg-white rounded-b-lg text-center"
          >
            <h1
              class="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight"
            >
              {{ props.post.name }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 hidden sm:block">
              {{ convertDate(props.post.date) }}
            </p>
          </div>
          <button
            class="absolute bottom-4 right-4 text-2xl rotate-[20deg]"
            style="color: orange"
          >
            {{ props.post.special ? "★" : "☆" }}
          </button>
        </div>

        <!-- Back -->
        <div
          class="absolute inset-0 flex flex-col bg-white rounded-lg shadow-lg pb-4 pt-4 mx-auto rotate-y-180"
          style="backface-visibility: hidden; transform: rotateY(180deg)"
        >
          <!-- Contenuto principale -->
          <div class="flex-1 flex flex-col items-center justify-center px-4">
            <div class="w-full text-center mb-4">
              <h2 class="text-lg font-bold text-gray-800 mb-2 line-clamp-3">
                {{ props.post.description }}
              </h2>
              <p class="text-sm text-gray-600 mb-4">
                Mi sentivo {{ props.post.mood }}
              </p>
              <button
                class="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
                @click.stop="showDetail"
              >
                Vai al ricordo!
              </button>
            </div>
          </div>

          <!-- TAGS: sticker style - area limitata -->
          <div
            class="w-full px-4 pb-2 flex flex-wrap justify-center items-center gap-1 max-h-20 overflow-hidden"
          >
            <div
              v-for="(tag, index) in tags.slice(0, 6)"
              :key="tag"
              class="sticker-tag inline-block px-1 py-0.5 rounded text-xs font-normal shadow"
              :style="`background-color: ${getTagColor(
                tag
              )}; ${getStickerStyle()}`"
            >
              {{ tag }}
            </div>
            <div
              v-if="tags.length > 6"
              class="sticker-tag inline-block px-1 py-0.5 rounded text-xs font-normal shadow bg-gray-200 text-gray-600"
              :style="getStickerStyle()"
            >
              +{{ tags.length - 6 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticker-tag {
  border: 1px solid #fff;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pin-move-enter-from,
.pin-move-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}
.pin-move-enter-to,
.pin-move-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.scotch-move-enter-active,
.scotch-move-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}
.scotch-move-enter-from,
.scotch-move-leave-to {
  opacity: 0;
}
.scotch-left.scotch-move-enter-from,
.scotch-left.scotch-move-leave-to {
  transform: translate(-40px, -40px);
}
.scotch-right.scotch-move-enter-from,
.scotch-right.scotch-move-leave-to {
  transform: translate(40px, -40px);
}
.scotch-left.scotch-move-enter-to,
.scotch-left.scotch-move-leave-from,
.scotch-right.scotch-move-enter-to,
.scotch-right.scotch-move-leave-from {
  transform: translate(0, 0);
  opacity: 1;
}
</style>
