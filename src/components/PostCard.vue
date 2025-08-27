<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({ post: { type: Object, required: true } });
const post = props.post;

const decorationType = ref("scotch");
const rotation = ref(0);
const isFlipped = ref(false);

onMounted(() => {
  decorationType.value = Math.random() < 0.5 ? "scotch" : "pin";
  rotation.value = Math.random() * 20 - 10;
});

function flipCard() {
  isFlipped.value = !isFlipped.value;
}
</script>

<template>
  <div
    class="relative flex flex-col items-center w-full max-w-xs aspect-[3/4] mx-auto"
    :style="{ transform: `rotate(${rotation}deg)` }"
    @click="flipCard"
    style="perspective: 1200px; cursor: pointer"
  >
    <!-- Unica Transition per decorazione -->
    <Transition name="scotch-move" mode="out-in">
      <div v-if="!isFlipped && decorationType === 'scotch'" key="scotch">
        <div
          class="absolute -left-5 top-2 w-24 h-8 bg-yellow-200 rotate-[-45deg] rounded opacity-80 shadow-md z-10 scotch-left"
        ></div>
        <div
          class="absolute -right-4 top-2 w-24 h-8 bg-yellow-200 rotate-[45deg] rounded opacity-80 shadow-md z-10 scotch-right"
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
        ></div>
      </div>
    </Transition>

    <!-- Card flip container -->
    <div
      class="relative w-full h-full transition-transform duration-500"
      :class="isFlipped ? 'rotate-y-180' : ''"
      style="transform-style: preserve-3d"
    >
      <!-- Front -->
      <div
        class="absolute inset-0 flex flex-col items-center bg-white rounded-lg shadow-lg pb-6 pt-4 mx-auto z-0"
        style="backface-visibility: hidden"
      >
        <figure
          class="w-full h-64 flex items-center justify-center overflow-hidden rounded-t-lg p-2"
        >
          <img
            :src="post.imgUrl"
            alt="immagine"
            class="object-cover w-full h-full"
          />
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
        class="absolute inset-0 flex flex-col items-center bg-gray-100 rounded-lg shadow-lg pb-6 pt-4 mx-auto z-0 rotate-y-180"
        style="backface-visibility: hidden; transform: rotateY(180deg)"
      >
        <div class="w-full px-4 pt-3 pb-2 text-center">
          <h2 class="text-lg font-bold text-gray-800">Retro della Polaroid</h2>
          <p class="text-sm text-gray-600">
            Altri dati: {{ post.description }}
          </p>
          <p class="text-xs text-gray-400">ID: {{ post.id }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rotate-y-180 {
  transform: rotateY(180deg);
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
