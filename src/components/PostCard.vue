<script setup>
import { ref, onMounted } from "vue";
import { usePosts, getTagColor } from "@/usePosts";
import PostDetail from "./PostDetail.vue";

const props = defineProps({ post: { type: Object, required: true } });
const post = props.post;

const decorationType = ref("");
const decorationColor = ref(null);
const rotation = ref(0);
const isFlipped = ref(false);
const tags = post.tags;
const showDetailModal = ref(false);

function showDetail() {
  showDetailModal.value = true;
}
function closeDetail() {
  showDetailModal.value = false;
}

onMounted(() => {
  decorationType.value = Math.random() < 0.5 ? "scotch" : "pin";
  decorationColor.value = Math.random() < 0.5 ? 1 : 2;

  rotation.value = Math.random() * 15 - 5;
});

function flipCard() {
  isFlipped.value = !isFlipped.value;
}

function getStickerStyle(index) {
  // Rotazione tra -8 e +8 gradi, alternata
  const angle = (Math.random() - 0.5) * 16;
  return `transform: rotate(${angle}deg);`;
}
</script>

<template>
  <PostDetail
    v-if="showDetailModal"
    :post="post"
    :visible="showDetailModal"
    @close="closeDetail"
  />
  <div
    class="relative flex flex-col items-center w-full max-w-xs aspect-[3/4] mx-auto"
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
      <!-- Unica Transition per decorazione -->
      <Transition name="scotch-move" mode="out-in">
        <div v-if="!isFlipped && decorationType === 'scotch'" key="scotch">
          <div
            class="absolute -left-5 top-2 w-24 h-8 rotate-[-45deg] rounded opacity-80 shadow-md z-10 scotch-left"
            :class="
              decorationColor === 1
                ? 'bg-yellow-200'
                : 'bg-yellow-800 opacity-10'
            "
          ></div>
          <div
            class="absolute -right-4 top-2 w-24 h-8 rotate-[45deg] rounded opacity-80 shadow-md z-10 scotch-right"
            :class="
              decorationColor === 1
                ? 'bg-yellow-200'
                : 'bg-yellow-800 opacity-10'
            "
          ></div>
        </div>
      </Transition>
      <!-- Puntina -->
      <Transition name="pin-move" mode="out-in">
        <div
          v-if="!isFlipped && decorationType === 'pin'"
          key="pin"
          class="absolute left-1/2 -translate-x-1/2 top-1 z-10 flex flex-col items-center"
        >
          <div
            class="w-7 h-7 bg-red-600 rounded-full border-gray-200 border-2 shadow-md"
            :class="decorationColor === 1 ? 'bg-red-600' : 'bg-blue-600'"
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
          class="absolute inset-0 flex flex-col items-center bg-white rounded-lg shadow-lg pb-6 pt-4 mx-auto"
          style="backface-visibility: hidden"
        >
          <figure
            class="w-full h-64 flex items-center justify-center overflow-hidden rounded-t-lg p-2"
          >
            <template v-if="post.media && post.media.length">
              <template v-for="mediaItem in post.media" :key="mediaItem._id">
                <img
                  v-if="mediaItem.type === 'photo'"
                  :src="mediaItem.url"
                  alt="immagine"
                  class="object-cover w-full h-full mb-2"
                />
                <video
                  v-else-if="mediaItem.type === 'video'"
                  :src="mediaItem.url"
                  :poster="mediaItem.videoPreview"
                  controls
                  class="object-cover w-full h-full mb-2"
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
          <div class="w-full px-4 pt-3 pb-2 bg-white rounded-b-lg text-center">
            <h1 class="text-lg font-bold text-gray-800">{{ post.name }}</h1>
            <p class="text-sm text-gray-500">{{ post.date }}</p>
          </div>
          <button
            class="absolute bottom-4 right-4 text-2xl rotate-[20deg]"
            style="color: orange"
          >
            {{ post.special ? "★" : "☆" }}
          </button>
        </div>
        <!-- Back -->
        <div
          class="absolute inset-0 flex flex-col items-center bg-white rounded-lg shadow-lg pb-6 pt-4 mx-auto rotate-y-180"
          style="backface-visibility: hidden; transform: rotateY(180deg)"
        >
          <!-- Cornice interna che ricalca la img del fronte -->
          <div
            class="w-full h-64 flex items-center justify-center overflow-hidden rounded-t-lg p-2"
          >
            <div
              class="w-full h-full"
              style="
                border: 1px dashed #bbb;
                box-sizing: border-box;
                pointer-events: none;
              "
            >
              <div
                class="w-full px-4 pt-3 pb-2 text-center"
                style="position: relative; z-index: 2"
              >
                <h2 class="text-lg font-bold text-gray-800">La mia tappa</h2>
                <p class="text-sm text-gray-600">
                  {{ post.description }}
                </p>
                <div v-if="isFlipped" class="...">
                  <!-- ...altri dettagli... -->
                  <button
                    class="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow"
                    @click.stop="showDetail"
                  >
                    Vai al ricordo!
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- TAGS: ora sono fuori dalla cornice, in basso -->
          <div
            class="w-full px-4 pt-2 pb-2 text-center flex flex-wrap justify-center items-center"
          >
            <div
              v-for="(tag, idx) in tags"
              :key="tag"
              class="sticker-tag inline-block px-2 py-1 mr-2 mb-2 rounded text-xs font-semibold shadow"
              :style="`${getStickerStyle(idx)} background-color: ${getTagColor(
                tag
              )};`"
            >
              {{ tag }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticker-tag {
  border: 2px solid #fff;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.12);
}
/* Puntina: movimento verso l'alto + fade */
.pin-move-enter-active,
.pin-move-leave-active {
  transition: opacity 0.4s, transform 0.4s;
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

/* Scotch: movimento diagonale + fade */
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
