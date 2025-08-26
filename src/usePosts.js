import { reactive, computed, watch, onMounted } from "vue";
import axios from "axios";

const API_URL = "http://localhost:5001/api";

const state = reactive({
  postsList: [
    { name: "Giappone", category: "gigi", mood: "chill", date: "22/07/2024" },
  ],
  showDetail: false,
  activeFilter: null,
});

const filteredPosts = computed(() => {
  if (state.activeFilter === "special")
    return state.postsList.filter((f) => f.special);
  if (typeof state.activeFilter === "number")
    return state.postsList.filter((f) => f.folderId === state.activeFilter);
  if (state.activeFilter === "current") {
    const currentYear = new Date().getFullYear();
    return state.postsList.filter(
      (f) => new Date(f.date).getFullYear() === currentYear
    );
  }
  console.log(filteredPosts);
  return state.postsList;
});

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
  };
}
