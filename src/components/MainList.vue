<script setup>
import PostCard from "./PostCard.vue";
import { usePosts } from "@/usePosts";
import { watch } from "vue";

const posts = usePosts();

// Debug: guarda quando cambia
watch(
  () => posts.processedPosts,
  (val) => {
    console.log("processedPosts aggiornati:", val);
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div
    class="py-1 px-10 min-h-screen w-full"
    style="
      background-image: url('/images/board.png');
      background-size: 100% 100%;

      background-position: center;
      background-repeat: no-repeat;
    "
  >
    <div
      class="mb-10 flex justify-center text-center font-bold text-xl relative"
      style="height: 100px"
    >
      <h1
        class="title bg-gray-200 bg-opacity-80 shadow-lg p-6 relative inline-block"
      >
        <!-- Pinhead in alto a sinistra -->
        <div
          class="absolute -top-1 -left-1 w-6 h-6 bg-red-400 rounded-full border-2 border-gray-200 shadow-md"
        ></div>
        <!-- Pinhead in alto a destra -->
        <div
          class="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-gray-200 shadow-md"
        ></div>
        Il mio viaggio
      </h1>
    </div>

    <div
      :class="[
        'grid gap-8 px-5 mb-20',
        posts.processedPosts.value.length === 1
          ? 'grid-cols-1'
          : posts.processedPosts.value.length === 2
          ? 'grid-cols-2'
          : posts.processedPosts.value.length === 3
          ? 'grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      ]"
    >
      <PostCard
        v-for="post in posts.processedPosts.value"
        :key="post.id"
        :post="post"
      />
    </div>
    <div
      v-if="posts.processedPosts.value.length === 0"
      class="text-center mt-12 text-gray-500"
    >
      Ancora nessuna tappa del tuo viaggio...
    </div>
  </div>
</template>

<style scoped>
.title {
  font-family: "Indie Flower", cursive;
  font-size: 50px;
}
</style>
