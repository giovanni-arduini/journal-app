<template>
  <div class="row-start-1 col-start-1 row-end-6 col-end-2 px-10">
    <!-- <BasicModal
      :open="showFolderModal"
      :title="`Crea cartella`"
      :submitLabel="`Crea`"
      :fields="formFields"
      :initialValues="{ name: '', category: 'Ricetta', date: getToday() }"
      :previousList="folderList.map((f) => f.name)"
      @submit="handleAddFolder"
      @close="showFolderModal = false"
    />

    <BasicModal -->
    <!-- :open="showDeleteFolderModal"
      :title="`Elimina cartella`"
      :submitLabel="`Elimina`"
      @submit="confirmDelete"
      @close="cancelDelete"
    /> -->
    <div class="mt-10">
      <div
        id="quick-add"
        class="mb-5 cursor-pointer bg-white p-2 rounded-lg hover:bg-blue-100 hover:opacity-0 hover:opacity-100 duration-300 shadow-lg"
        @click="toggleNewFolderModal"
      >
        <button>Nuova cartella</button>
      </div>

      <!-- ordinamento cartelle -->
      <div id="folder-list-container ">
        <form action="" class="mb-8">
          <div>
            <label for="">Ordina per </label>
            <select name="" id="">
              <option value="date">data</option>
              <option value="type">tipologia</option>
              <option value="date">nome</option>
            </select>
          </div>
        </form>
      </div>

      <!-- lista delle cartelle -->
      <!-- <div class="mb-8">
        <div v-if="folderList.length < 1"></div>
        <h1 v-else class="mb-4">Le mie cartelle</h1>
        <ul>
          <li v-for="folder in folderList" :key="folder.id">
            <div
              class="opacity-0 opacity-100 duration-300 transition group flex justify-between cursor-pointer hover:bg-gray-200 px-2 rounded-md w-full mb-1"
            >
              <div @click="showFolderContent(folder.id)">
                {{ folder.name }}
              </div>

              <button
                class="opacity-0 group-hover:opacity-100 transition"
                @click="handleDeleteRequest(folder.id)"
              >
                <font-awesome-icon icon="trash-can" class="text-gray-500" />
              </button>
            </div>
          </li>
        </ul>
      </div> -->

      <!-- etichette e sezioni -->
      <div class="flex flex-col w-full">
        <button
          class="hover:bg-gray-200 px-2 text-left rounded-md mb-1 opacity-0 opacity-100 duration-300"
          @click="showFolderContent(`current`)"
        >
          Anno corrente
        </button>
        <button
          class="hover:bg-gray-200 px-2 text-left rounded-md mb-1 opacity-0 opacity-100 duration-300"
          @click="showFolderContent(`special`)"
        >
          Speciali
        </button>
        <button
          class="hover:bg-gray-200 px-2 text-left rounded-md mb-1 opacity-0 opacity-100 duration-300"
          @click="showFolderContent(null)"
        >
          Mostra tutte
        </button>
        <!-- <button @click="showDeleted">Cestino</button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
// import { ref } from "vue";
// import BasicModal from "./BasicModal.vue";

import { usePosts } from "@/usePosts";

const { setFilter, state } = usePosts();
const postsList = state.postsList;

// const formFields = [
//   {
//     name: "name",
//     label: "Nome cartella",
//     type: "text",
//     placeholder: "Inserisci il nome",
//     required: true,
//   },
//   {
//     name: "category",
//     label: "Categoria",
//     type: "select",
//     options: ["Mare", "Montagna", "Città", "Campagna"],
//   },
//   {
//     name: "date",
//     label: "Data della tappa",
//     type: "date",
//   },
// ];

function showFolderContent(folderIdOrTag) {
  state.showDetail = false;
  console.log(state.showDetail);
  setFilter(folderIdOrTag);
}

// const showFolderModal = ref(false);
// const showDeleteFolderModal = ref(false);
// const folderToDelete = ref(null); // 👈 id cartella selezionata

// function handleDeleteRequest(id) {
//   folderToDelete.value = id; // salvo id da cancellare
//   showDeleteFolderModal.value = true; // apro il modale
// }

// function confirmDelete() {
//   if (folderToDelete.value !== null) {
//     deleteFolder(folderToDelete.value); // cancello solo alla conferma
//     folderToDelete.value = null; // reset
//     showDeleteFolderModal.value = false; // chiudo il modale
//     loadFolders();
//   }
// }

// function cancelDelete() {
//   folderToDelete.value = null; // reset
//   showDeleteFolderModal.value = false; // chiudo senza cancellare
// }

// function toggleShowDeleteFolderModal() {
//   showDeleteFolderModal.value = !showDeleteFolderModal.value;
// }

// function handleDeleteFolder(id) {
//   toggleShowDeleteFolderModal();

//   deleteFolder(id);
// }

// function getToday() {
//   return new Date().toISOString().split("T")[0];
// }

// function handleAddFolder(data) {
//   if (data.name.trim() === "") {
//     alert("Inserire un nome ");
//   }
//   try {
//     addNewFolder({
//       name: data.name,
//       date: new Date(data.date),
//       category: data.category,
//     });
//     loadFolders();
//   } catch (err) {
//     console.error(err);
//   }
// }

// function toggleNewFolderModal() {
//   showFolderModal.value = !showFolderModal.value;
// }

// function closeModal() {
//   showFolderModal.value = false;
// }
</script>

<style focused></style>
