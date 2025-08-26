<script setup>
import MainList from "./MainList.vue";

const filesList = [
  { name: "Giappone", category: "gigi", mood: "chill", date: "22/07/2024" },
];
</script>

<template>
  <div class="grid grid-cols-4 gap-0 min-h-screen bg-gray-100">
    <SideTab :folder-list="folderList" />
    <MainList :files="filesList" />
  </div>
</template>

<style scoped></style>
