<script setup>
import { ref, watch, computed, reactive } from "vue";
import TagInput from "@/components/TagInput.vue";
import { usePosts } from "@/usePosts";
import NewPostForm from "./NewPostForm.vue";
import MapView from "./MapView.vue";

defineProps({
  folderList: Array, // oppure il tipo corretto
});

const {
  setFilter,
  state,
  processedPosts,
  setSearchText,
  setMoodFilter,
  setDistanceFilter,
  setTagsFilter,
} = usePosts();

const tagsFilter = ref([]);
console.log(processedPosts);
const showCreationModal = ref(false);

watch(tagsFilter, (newTags) => {
  setTagsFilter(newTags);
});

const allTags = computed(() => {
  const all = state.postsList.flatMap((p) => p.tags || []);
  return Array.from(new Set(all));
});

const allMoods = computed(() => {
  const all = state.postsList.flatMap((p) => p.mood || []);
  return Array.from(new Set(all));
});

const radius = ref(100); // default raggio in km
function setCurrentLocation() {
  if (state.currentLocation) {
    // Disattiva solo la posizione e il filtro distanza
    state.currentLocation = null;
    setDistanceFilter(null);
    return;
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      state.currentLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setDistanceFilter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        radius: radius.value,
      });
    });
  } else {
    alert("Geolocalizzazione non supportata");
  }
}

function updateRadius() {
  if (state.currentLocation) {
    setDistanceFilter({
      lat: state.currentLocation.lat,
      lng: state.currentLocation.lng,
      radius: radius.value,
    });
  }
}
</script>

<template>
  <NewPostForm
    :visible="showCreationModal"
    @close="showCreationModal = false"
  />
  <div class="row-start-1 col-start-1 row-end-6 col-end-2 px-10">
    <div class="flex justify-center">
      <button
        class="my-10 bg-green-200 p-5 rounded-xl hover:bg-green-300 shadow"
        @click="showCreationModal = true"
      >
        Aggiungi una tappa!
      </button>
    </div>
    <form class="mb-8 space-y-4" @submit.prevent>
      <!-- Testo -->
      <div>
        <label class="block mb-1 font-semibold">Testo</label>
        <input
          type="text"
          class="w-full p-2 rounded border"
          placeholder="Cerca per nome o descrizione"
          @input="(e) => setSearchText(e.target.value)"
        />
      </div>
      <!-- Stato d'animo -->
      <div>
        <label class="block mb-1 font-semibold">Stato d'animo</label>
        <select
          class="w-full p-2 rounded border"
          @change="(e) => setMoodFilter(e.target.value)"
        >
          <option value="">Tutti</option>
          <option v-for="tag in allMoods" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>
      </div>
      <!-- Tag -->
      <div>
        <label class="block mb-1 font-semibold">Tag</label>
        <TagInput v-model="tagsFilter" :suggestions="allTags" />
      </div>

      <!-- Distanza -->
      <div>
        <label class="block mb-1 font-semibold"
          >Distanza da punto attuale (km)</label
        >
        <input
          type="number"
          min="10"
          class="w-full p-2 rounded border mb-2"
          placeholder="Raggio in km"
          v-model.number="radius"
          @input="updateRadius"
          :disabled="!state.currentLocation"
        />
        <button
          type="button"
          class="bg-blue-500 text-white px-3 py-1 rounded"
          @click="setCurrentLocation"
        >
          {{
            !state.currentLocation
              ? "Usa posizione attuale"
              : "Disattiva filtro distanza"
          }}
        </button>
      </div>
    </form>

    <!-- <MapView /> -->

    <div class="mt-10">
      <div class="mb-8">
        <label class="block mb-1 font-semibold">Ordina</label>
        <select class="w-full p-2 rounded border" v-model="state.sortBy">
          <option value="date-asc">Dal meno recente</option>
          <option value="date-desc">Dal più recente</option>
          <option value="distance-asc" :disabled="!state.currentLocation">
            Dal più vicino
          </option>
          <option value="distance-desc" :disabled="!state.currentLocation">
            Dal più distante
          </option>
          <option value="expense-asc">Dal più economico</option>
          <option value="expense-desc">Dal più costoso</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style focused></style>
