import { reactive, computed } from "vue";
import axios from "axios";

const API_URL = "http://localhost:5001/api";

export function getTagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue},70%,80%)`;
}
const state = reactive({
  postsList: [
    {
      id: 1,
      name: "Passeggiata a Venezia",
      media: {
        photo: "https://picsum.photos/600/400?random=1",
        video: null,
      },
      location: {
        manual: "Venezia, Italia",
        geo: { lat: 45.4408, lng: 12.3155 },
      },
      description: "Passeggiata serale tra i canali illuminati.",
      mood: "rilassato",
      positiveReflection: "La bellezza della città di notte e la quiete.",
      negativeReflection: "Troppi turisti anche in bassa stagione.",
      physicalEffort: 2,
      economicEffort: 3,
      actualExpense: 45,
      tags: ["canali", "tramonto", "romantico"],
    },
    {
      id: 2,
      name: "Trekking alle Cinque Terre",
      media: {
        photo: null,
        video:
          "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      location: {
        manual: "Sentiero delle Cinque Terre",
        geo: { lat: 44.1194, lng: 9.7092 },
      },
      description: "Escursione tra i borghi con vista mozzafiato.",
      mood: "emozionato",
      positiveReflection: "Paesaggi unici, mare e montagna insieme.",
      negativeReflection: "Il percorso era molto affollato e caldo.",
      physicalEffort: 4,
      economicEffort: 2,
      actualExpense: 20,
      tags: ["trekking", "mare", "paesaggi"],
    },
    {
      id: 3,
      name: "Colazione a Parigi",
      media: {
        photo: "https://picsum.photos/600/400?random=3",
        video: null,
      },
      location: {
        manual: "Parigi, Francia",
        geo: { lat: 48.8566, lng: 2.3522 },
      },
      description: "Colazione vicino alla Torre Eiffel.",
      mood: "felice",
      positiveReflection: "Momento speciale con vista spettacolare.",
      negativeReflection: "Prezzi troppo alti per un semplice caffè.",
      physicalEffort: 1,
      economicEffort: 5,
      actualExpense: 18,
      tags: ["colazione", "torreeiffel", "romantico"],
    },
    {
      id: 4,
      name: "Giro in barca sul Lago di Como",
      media: {
        photo: "https://picsum.photos/600/400?random=4",
        video: null,
      },
      location: {
        manual: "Lago di Como, Italia",
        geo: { lat: 45.99, lng: 9.2572 },
      },
      description: "Giro in barca sul lago.",
      mood: "sereno",
      positiveReflection: "La tranquillità dell’acqua e il paesaggio verde.",
      negativeReflection: "Il tempo era nuvoloso e un po’ freddo.",
      physicalEffort: 1,
      economicEffort: 3,
      actualExpense: 60,
      tags: ["lago", "barca", "natura"],
    },
    {
      id: 5,
      name: "Visita alla Sagrada Família",
      media: {
        photo: null,
        video:
          "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      location: {
        manual: "Barcellona, Spagna",
        geo: { lat: 41.3851, lng: 2.1734 },
      },
      description: "Visita alla Sagrada Família.",
      mood: "stupito",
      positiveReflection: "L’architettura è unica e impressionante.",
      negativeReflection: "La fila per entrare era molto lunga.",
      physicalEffort: 2,
      economicEffort: 4,
      actualExpense: 25,
      tags: ["architettura", "cultura", "arte"],
    },
  ],
  showDetail: false,

  activeFilter: null,
  searchText: "",
  moodFilter: null,
  currentLocation: null, // { lat, lng }

  distanceFilter: null, // { lat, lng, radius }
  tagsFilter: [],
});

// Funzione per calcolare la distanza tra due punti (Haversine)
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

const filteredPosts = computed(() => {
  let posts = state.postsList;

  // Filtro per testo
  if (state.searchText) {
    const txt = state.searchText.toLowerCase();
    posts = posts.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(txt)) ||
        (p.description && p.description.toLowerCase().includes(txt))
    );
  }

  // Filtro per stato d'animo
  if (state.moodFilter) {
    posts = posts.filter((p) => p.mood === state.moodFilter);
  }

  // Filtro per distanza: solo se posizione e raggio sono validi
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
      console.log(`Post: ${p.name}, distanza: ${dist}, raggio: ${df.radius}`);
      return dist <= df.radius;
    });
  }

  console.log(
    "Filtro distanza attivo?",
    hasValidDistance,
    state.distanceFilter
  );

  // Filtro per tags
  if (state.tagsFilter && state.tagsFilter.length > 0) {
    posts = posts.filter(
      (p) => p.tags && p.tags.some((tag) => state.tagsFilter.includes(tag))
    );
  }

  // Filtro per sezione (special, current, folderId)
  if (state.activeFilter === "special") posts = posts.filter((f) => f.special);
  else if (typeof state.activeFilter === "number")
    posts = posts.filter((f) => f.folderId === state.activeFilter);
  else if (state.activeFilter === "current") {
    const currentYear = new Date().getFullYear();
    posts = posts.filter((f) => new Date(f.date).getFullYear() === currentYear);
  }

  console.log("Risultato finale:", posts);
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

const activeSectionName = computed(() => {
  if (state.activeFilter === "special") return "Preferiti";
  if (state.activeFilter === "current") return "Anno corrente";
  if (typeof state.activeFilter === "number") {
    const folder = folderList.value.find((f) => f.id === state.activeFilter);
    return folder ? folder.name : "";
  }
  return "Tutti i file";
});

export function usePosts() {
  function setFilter(filter) {
    state.activeFilter = filter;
  }

  async function loadPosts() {
    try {
      const res = await axios.get(API_URL + "/posts");
      state.filesList = res.data;
    } catch (err) {
      console.error("Errore caricamento post:", err);
    }
  }

  // onMounted(() => {
  //   loadPosts();
  // });

  async function addNewPost(newPost) {
    try {
      const res = await axios.post(API_URL + "/posts", newPost);
      await loadPosts();
      state.postsList.push(res.data);
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

  console.log(filteredPosts.value);

  function toggleSpecial(postId) {
    const post = state.postsList.find((p) => p.id === postId);
    if (post) updateFile(postId, { special: !post.special });
  }

  // watch per osservare ogni cambiamento
  // watch(
  //   () => state.postsList,
  //   ([newPost]) => {
  //     console.log("filesList cambiata:", newPost);
  //   },
  //   { deep: true }
  // );

  return {
    state,
    filteredPosts,
    activeSectionName,

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
  };
}
