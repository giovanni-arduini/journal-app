import { reactive, computed, onMounted } from "vue";
import axios from "axios";

const PORT = import.meta.env.VITE_PORT;
const API_URL = `http://localhost:${PORT}/api`;

export function getTagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue},70%,80%)`;
}

const state = reactive({
  postsList: [],
  showDetail: false,

  // Filtri vari
  activeFilter: null,
  searchText: "",
  moodFilter: null,
  currentLocation: null,
  distanceFilter: null,
  tagsFilter: [],
  sortBy: "date",
});

// Calcolo distanze
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const processedPosts = computed(() => {
  let posts = state.postsList.slice();

  // Filtri vari
  if (state.searchText) {
    const txt = state.searchText.toLowerCase();
    posts = posts.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(txt)) ||
        (p.description && p.description.toLowerCase().includes(txt))
    );
  }

  if (state.moodFilter) {
    posts = posts.filter((p) => p.mood === state.moodFilter);
  }

  if (state.tagsFilter && state.tagsFilter.length > 0) {
    posts = posts.filter(
      (p) => p.tags && p.tags.some((tag) => state.tagsFilter.includes(tag))
    );
  }

  // Filtro speciale per distanza
  const df = state.distanceFilter;
  const hasValidDistance =
    df &&
    typeof df.lat === "number" &&
    typeof df.lng === "number" &&
    typeof df.radius === "number" &&
    !isNaN(df.lat) &&
    !isNaN(df.lng) &&
    !isNaN(df.radius);

  if (hasValidDistance) {
    posts = posts.filter((p) => {
      const geo = p.location?.geo;
      if (!geo?.lat || !geo?.lng) return false;
      const dist = getDistance(df.lat, df.lng, geo.lat, geo.lng);
      return dist <= df.radius;
    });
  }

  // Sorting
  if (state.sortBy === "distance" && hasValidDistance) {
    posts.sort((a, b) => {
      const geoA = a.location?.geo;
      const geoB = b.location?.geo;
      const distA = geoA
        ? getDistance(df.lat, df.lng, geoA.lat, geoA.lng)
        : Infinity;
      const distB = geoB
        ? getDistance(df.lat, df.lng, geoB.lat, geoB.lng)
        : Infinity;
      return distA - distB;
    });
  } else if (state.sortBy === "date") {
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (state.sortBy === "expense") {
    posts.sort((a, b) => b.actual_expense - a.actual_expense);
  }

  return posts;
});

// Funzioni per impostare i filtri
function setSearchText(text) {
  state.searchText = text;
}
function setMoodFilter(mood) {
  state.moodFilter = mood;
}
function setDistanceFilter(filter) {
  if (!filter) {
    state.distanceFilter = null;
  } else {
    state.distanceFilter = filter;
  }
}

function setTagsFilter(tags) {
  state.tagsFilter = tags;
}

function setSortBy(value) {
  state.sortBy = value;
}

export function usePosts() {
  function setFilter(filter) {
    state.activeFilter = filter;
  }

  async function loadPosts() {
    try {
      const res = await axios.get(API_URL + "/posts");
      state.postsList = res.data;
    } catch (err) {
      console.error("Errore caricamento post:", err);
    }
  }

  onMounted(() => {
    loadPosts();
  });

  async function addNewPost(newPost) {
    try {
      const res = await axios.post(API_URL + "/posts", newPost);
      await loadPosts();
    } catch (err) {
      console.error("Errore creazione post:", err);
    }
  }

  async function updatePost(id, updatedFields) {
    try {
      const res = await axios.put(`${API_URL}/posts/${id}`, updatedFields);
      const index = state.postsList.findIndex((p) => p.id === id);
      await loadFiles();

      if (index !== -1) state.postsList[index] = res.data;
    } catch (err) {
      console.error("Errore aggiornamento file:", err);
    }
  }

  async function showPost(id) {
    try {
      const res = await axios.get(`${API_URL}/posts/${id}`);
      return res.data;
    } catch (err) {
      console.err("Errore nel caricamento del post", err);
    }
  }

  async function deletePost(id) {
    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      await loadPosts();

      state.postsList = state.postsList.filter((p) => p.id !== id);
    } catch (err) {
      console.error("Errore eliminazione post:", err);
    }
  }

  function toggleSpecial(postId) {
    const post = state.postsList.find((p) => p.id === postId);
    if (post) updateFile(postId, { special: !post.special });
  }

  return {
    state,

    setFilter,
    loadPosts,
    showPost,
    addNewPost,
    updatePost,
    deletePost,
    toggleSpecial,

    getTagColor,

    setDistanceFilter,
    setFilter,
    setMoodFilter,
    setSearchText,
    setTagsFilter,

    processedPosts,
    setSortBy,
  };
}
