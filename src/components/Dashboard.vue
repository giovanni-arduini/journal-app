<script setup>
import { computed } from "vue";
import { usePosts } from "@/usePosts";

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // raggio della Terra in km
  const toRad = (deg) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const { processedPosts } = usePosts();

// Ordina i post per data
const sortedPosts = computed(() =>
  processedPosts.value
    .filter(
      (p) =>
        p.location &&
        p.location.geo &&
        p.location.geo.lat &&
        p.location.geo.lng &&
        p.date
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
);

// Calcola i km percorsi tra i punti
const totalKm = computed(() => {
  let km = 0;
  for (let i = 1; i < sortedPosts.value.length; i++) {
    const prev = sortedPosts.value[i - 1].location.geo;
    const curr = sortedPosts.value[i].location.geo;
    km += getDistanceKm(prev.lat, prev.lng, curr.lat, curr.lng);
  }
  return Math.round(km);
});

// Numero di giorni
const totalDays = computed(() => {
  if (sortedPosts.value.length < 2) return sortedPosts.value.length;
  const first = new Date(sortedPosts.value[0].date);
  const last = new Date(sortedPosts.value[sortedPosts.value.length - 1].date);
  return Math.max(1, Math.ceil((last - first) / (1000 * 60 * 60 * 24)) + 1);
});

// Spesa totale
const totalExpense = computed(() =>
  processedPosts.value.reduce(
    (sum, p) => sum + (Number(p.actual_expense) || 0),
    0
  )
);

// Umore più frequente
const mostFrequentMood = computed(() => {
  const moods = processedPosts.value.map((p) => p.mood).filter(Boolean);
  if (!moods.length) return "-";
  const freq = {};
  moods.forEach((m) => (freq[m] = (freq[m] || 0) + 1));
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
});
</script>

<template>
  <div class="bg-white/80 rounded-xl shadow-lg p-8 max-w-2xl mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-6 text-center">Resoconto del viaggio</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
      <div>
        <strong>Giorni in viaggio: </strong>
        <span>{{ totalDays }}</span>
      </div>
      <div>
        <strong>Km percorsi:</strong>
        <span>{{ totalKm }} km</span>
      </div>
      <div>
        <strong>Spesa totale:</strong>
        <span>€ {{ totalExpense }}</span>
      </div>
      <div>
        <strong>Umore più frequente: </strong>
        <span>{{ mostFrequentMood }}</span>
      </div>
    </div>
  </div>
</template>
