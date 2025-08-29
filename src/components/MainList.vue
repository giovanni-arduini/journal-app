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
  <div class="py-8 px-10">
    <h1 class="text-2xl font-bold text-center mb-8">Il mio viaggio</h1>
    <div
      :class="[
        'grid gap-8',
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

<style scoped></style>
