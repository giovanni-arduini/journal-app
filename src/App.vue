<script setup>
import MainList from "./MainList.vue";
import { usePosts } from "./usePosts";

const { state } = usePosts();
const postsList = state.postsList;
</script>

<template>
  <div class="grid grid-cols-4 gap-0 min-h-screen bg-gray-100">
    <SideTab :folder-list="folderList" />
    <MainList :posts="postsList" />
  </div>
</template>

<style scoped></style>
