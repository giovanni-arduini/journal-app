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
  <div class="flex flex-col">
    <h1 class="text-center">Le mie tappe</h1>
    <div class="flex grid grid-cols-4 gap-2 col-start-2 col-end-5">
      <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
    </div>
  </div>

  <!-- <div
    v-if="state.showDetail"
    class="row-start-3 col-start-2 row-end-6 col-end-6 bg-white"
  >
    <FileDetail :file="fileDetails" :hide-detail="hideDetail" />
  </div> -->

  <div>
    <!-- <div>
      <h2 class="mt-4">{{ activeSectionName }}</h2>
    </div> -->
    <div
      class="flex items-start justify-center text-center bg-white rounded-xl mb-10"
    >
      <table
        v-if="filteredPosts.length > 0"
        class="m-3 w-4/5 table-auto border-separate border-spacing-2 border-gray-400 dark:border-gray-500"
      >
        <thead>
          <tr class="bg-green-200">
            <th>Nome</th>
            <th>Data</th>
            <th>Categoria</th>
            <th>Mood</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="bg-gray-100 odd:bg-gray-200"
            v-for="file in filteredPosts"
            :key="file.id"
          >
            <td>
              {{ file.name }}
            </td>
            <td>
              {{ file.date }}
            </td>
            <td>
              {{ file.category }}
            </td>
            <td>
              {{ file.mood }}
            </td>
            <td>
              <button>Sposta</button>
            </td>
            <td>
              <button style="color: orange">
                {{ file.special ? "★" : "☆" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>Ancora nessuna tappa del tuo viaggio...</div>
    </div>
  </div>
</template>

<style scoped></style>
