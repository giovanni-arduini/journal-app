<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({ post: { type: Object, required: true } });
const post = props.post;

// Stato locale per tipo decorazione
const decorationType = ref("scotch");
const rotation = ref(0);

onMounted(() => {
  decorationType.value = Math.random() < 0.5 ? "scotch" : "pin";
  rotation.value = Math.random() * 20 - 10;
});
</script>

<template>
  <div
    class="relative flex flex-col items-center w-72 h-96 mx-auto"
    :style="{ transform: `rotate(${rotation}deg)` }"
  >
    <!-- Scotch -->
    <template v-if="decorationType === 'scotch'">
      <div
        class="absolute -left-5 top-2 w-24 h-8 bg-yellow-200 rotate-[-45deg] rounded opacity-80 shadow-md z-10"
      ></div>
      <div
        class="absolute -right-4 top-2 w-24 h-8 bg-yellow-200 rotate-[45deg] rounded opacity-80 shadow-md z-10"
      ></div>
    </template>
    <!-- Puntina -->
    <template v-else>
      <div
        class="absolute left-1/2 -translate-x-1/2 top-1 z-10 flex flex-col items-center"
      >
        <div
          class="w-7 h-7 bg-red-600 rounded-full border-gray-200 border-2 shadow-md"
        ></div>
        <!-- <div class="w-1 h-5 bg-gray-400 rounded-b-full"></div> -->
      </div>
    </template>

    <div
      class="flex flex-col items-center w-64 bg-white rounded-lg shadow-lg pb-6 pt-4 mx-auto z-0 relative"
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
  </div>
</template>
