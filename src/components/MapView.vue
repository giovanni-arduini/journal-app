// filepath: /Users/Gio/dev-projects/journal-app/src/components/MapView.vue
<template>
  <div class="w-full h-[500px] rounded-xl shadow-lg overflow-hidden">
    <l-map :zoom="6" :center="center" style="height: 100%; width: 100%">
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <l-marker
        v-for="post in postsWithGeo"
        :key="post._id"
        :lat-lng="[post.location.geo.lat, post.location.geo.lng]"
      >
        <l-popup>
          <strong>{{ post.name }}</strong
          ><br />
          {{ post.location.manual }}
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { computed } from "vue";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

import { usePosts } from "@/usePosts";

const { processedPosts } = usePosts();

const postsWithGeo = computed(() =>
  processedPosts.value.filter(
    (p) =>
      p.location && p.location.geo && p.location.geo.lat && p.location.geo.lng
  )
);

// DA RIVEDERE! calcolo dinamico
const center = [42.5, 12.5];
</script>
