<script setup>
import MainList from "./components/MainList.vue";
import SideTab from "./components/SideTab.vue";
import MapView from "./components/MapView.vue";
import Dashboard from "./components/Dashboard.vue";
</script>

<template>
  <div
    class="grid grid-cols-12 bg-gray-100"
    style="background-image: url(/public/images/wall.png)"
  >
    <div class="col-span-3">
      <SideTab :folder-list="folderList" />
    </div>
    <div class="col-span-8 m-2">
      <div>
        <div class="shadow-2xl">
          <MainList />
        </div>
        <div class="flex grid grid-cols-2 items-start mb-4 gap-4">
          <div class="col-span-1">
            <MapView class="col-span-1 shadow" />
          </div>

          <div class="relative col-span-1">
            <div
              class="absolute top-10 left-5 w-6 h-6 bg-yellow-500 rounded-full border-2 border-gray-200 shadow-md z-10"
            ></div>
            <div
              class="absolute top-10 right-5 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-200 shadow-md z-10"
            ></div>
            <Dashboard class="col-span-1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
