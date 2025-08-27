<script setup>
import MainList from "./components/MainList.vue";
import { usePosts } from "./usePosts";

const { state } = usePosts();
const postsList = state.postsList;

const folderList = ["2", "3"];
</script>

<template>
  <div class="grid grid-cols-4 min-h-screen bg-gray-100">
    <div class="col-span-1">
      <SideTab :folder-list="folderList" />
    </div>
    <div class="col-span-3">
      <MainList :posts="postsList" />
    </div>
  </div>
</template>

<style scoped></style>
