<script setup>
import { watch } from "vue";
// const fileDetails = ref({});

// async function handleShowDetail(id) {
//   const res = await showFile(id);
//   state.showDetail = true;
//   fileDetails.value = res;
// }

// function hideDetail() {
//   state.showDetail = false;
// }

import PostCard from "./PostCard.vue";

// const props = defineProps({
//   posts: {
//     type: Array,
//     required: true,
//   },
// });

import { usePosts } from "@/usePosts";
const { processedPosts, state } = usePosts();
</script>

<template>
  <div class="py-8 px-10">
    <h1 class="text-2xl font-bold text-center mb-8">Il mio viaggio</h1>
    <div
      :class="[
        'grid gap-8',
        processedPosts.length === 1
          ? 'grid-cols-1'
          : processedPosts.length === 2
          ? 'grid-cols-2'
          : processedPosts.length === 3
          ? 'grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      ]"
    >
      <PostCard v-for="post in processedPosts" :key="post.id" :post="post" />
    </div>
    <div
      v-if="processedPosts.length === 0"
      class="text-center mt-12 text-gray-500"
    >
      Ancora nessuna tappa del tuo viaggio...
    </div>
  </div>
</template>

<style scoped></style>
