<script setup>
import MainList from "./components/MainList.vue";
import { usePosts } from "./usePosts";

const { state } = usePosts();
const postsList = state.postsList;

const folderList = ["2", "3"];
</script>

<template>
  <div class="grid grid-cols-4 gap-0 min-h-screen bg-gray-100">
    <SideTab :folder-list="folderList" />
    <MainList :posts="postsList" />
  </div>
</template>

<style scoped></style>
