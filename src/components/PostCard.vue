<script setup>
const props = defineProps({ post: { type: Object, required: true } });
const post = props.post;
</script>

<template>
  <!-- Contenitore esterno più grande -->
  <div class="relative flex flex-col items-center w-72 h-96 mx-auto">
    <!-- Scotch angolo sinistro -->
    <div
      class="absolute -left-5 top-2 w-24 h-8 bg-yellow-200 rotate-[-45deg] rounded opacity-80 shadow-md z-10"
    ></div>
    <!-- Scotch angolo destro -->
    <div
      class="absolute -right-4 top-2 w-24 h-8 bg-yellow-200 rotate-[45deg] rounded opacity-80 shadow-md z-10"
    ></div>

    <!-- Card polaroid più piccola, centrata -->
    <div
      class="flex flex-col items-center w-64 bg-white rounded-lg shadow-lg pb-6 pt-4 mx-auto z-0"
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
