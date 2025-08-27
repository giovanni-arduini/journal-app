<script setup>
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

const props = defineProps({
  posts: {
    type: Array,
    required: false,
  },
});

const filteredPosts = props.posts;
console.log(filteredPosts);
</script>

<template>
  <div class="py-8 px-4">
    <h1 class="text-2xl font-bold text-center mb-8">Le mie tappe</h1>
    <div
      :class="[
        'grid gap-8',
        filteredPosts.length === 1
          ? 'grid-cols-1'
          : filteredPosts.length === 2
          ? 'grid-cols-2'
          : filteredPosts.length === 3
          ? 'grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      ]"
    >
      <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
    </div>
    <div
      v-if="filteredPosts.length === 0"
      class="text-center mt-12 text-gray-500"
    >
      Ancora nessuna tappa del tuo viaggio...
    </div>
  </div>
</template>

<style scoped></style>
