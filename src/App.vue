<script setup>
import MainList from "./components/MainList.vue";
import SideTab from "./components/SideTab.vue";
</script>

<template>
  <div class="grid grid-cols-5 min-h-screen bg-gray-100">
    <div class="col-span-1">
      <SideTab :folder-list="folderList" />
    </div>
    <div class="col-span-4">
      <MainList />
    </div>
  </div>
</template>

<style scoped></style>
