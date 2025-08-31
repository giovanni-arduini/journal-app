# Journal App - Frontend

Un'applicazione Vue.js per la gestione di un diario personale con funzionalità di geolocalizzazione, upload di media e sistema di filtri avanzati.

## 🚀 Quick Start

### Prerequisiti

- Node.js (versione 16 o superiore)
- npm o yarn
- Git

### Installazione

1. **Clona il repository**

   ```bash
   git clone https://github.com/giovanni-arduini/journal-app.git
   cd journal-app
   ```

2. **Installa le dipendenze**

   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**

   Crea un file `.env` nella root del progetto:

   ```bash
   # URL del backend (locale)
   VITE_API_URL=http://localhost:3000/api
   VITE_PORT=3000
   ```

4. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

## 🏗️ Architettura del Progetto

```
src/
├── components/           # Componenti Vue riutilizzabili
│   ├── BasicModal.vue   # Modal base per dialog
│   ├── Dashboard.vue    # Dashboard principale
│   ├── EditPostForm.vue # Form per modificare i post
│   ├── MainList.vue     # Lista principale dei post
│   ├── MapView.vue      # Vista mappa con Leaflet
│   ├── NewPostForm.vue  # Form per creare nuovi post
│   ├── PostCard.vue     # Card singolo post
│   ├── PostDetail.vue   # Vista dettaglio post
│   ├── SideTab.vue      # Tab laterale con filtri
│   └── TagInput.vue     # Input per i tag
├── usePosts.js          # Composable per gestione API e stato
├── tailwind.css         # Stili Tailwind personalizzati
├── App.vue              # Componente root
└── main.js              # Entry point dell'app
```

## 🛠️ Tecnologie Utilizzate

- **Vue.js 3** - Framework frontend con Composition API
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Leaflet** - Libreria per mappe interattive
- **Axios** - Client HTTP per API calls
- **Nominatim API** - Geocoding e autocompletamento indirizzi

## 📱 Funzionalità Principali

### 🎯 Gestione Post

- **Creazione**: Form multi-step con upload media, geolocalizzazione e valutazioni
- **Modifica**: Editing inline dei post esistenti
- **Eliminazione**: Rimozione post con conferma
- **Visualizzazione**: Lista grid responsive e vista dettaglio

### 🗺️ Funzionalità Mappa

- **Visualizzazione**: Mappa interattiva con markers dei post
- **Click-to-place**: Aggiungi location cliccando sulla mappa
- **Autocompletamento**: Ricerca indirizzi con Nominatim API
- **Filtro geografico**: Filtra post per distanza da un punto

### 🔍 Sistema di Filtri

- **Ricerca testuale**: Cerca per nome o descrizione
- **Filtro mood**: Filtra per stato d'animo (emoji)
- **Filtro tag**: Filtra per tag multipli
- **Filtro distanza**: Trova post vicini ad una location
- **Ordinamento**: Per data, distanza o spesa

### 📊 Valutazioni e Metriche

- **Mood**: Sistema di rating con emoji
- **Sforzo fisico**: Scala 1-5 stelle
- **Sforzo economico**: Scala 1-5 stelle
- **Spesa effettiva**: Valore numerico

## 🔌 Integrazione Backend

L'app comunica con un backend tramite API REST. Le chiamate principali sono:

```javascript
// Carica tutti i post
GET /api/posts

// Crea nuovo post
POST /api/posts

// Aggiorna post
PUT /api/posts/:id

// Elimina post
DELETE /api/posts/:id

// Richiedi signed URL per upload
GET /api/posts/signed-url?filename=...&contentType=...
```

## ⚙️ Configurazione Ambiente

### Sviluppo

File `.env`:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_PORT=3000
```

### Produzione

File `.env.production`:

```bash
VITE_API_URL=https://your-backend.onrender.com/api
```

## 🛠️ Comandi Disponibili

```bash
# Sviluppo
npm run dev          # Avvia dev server con hot reload

# Build
npm run build        # Build per produzione
npm run preview      # Preview build locale

# Linting
npm run lint         # Esegue ESLint
```

## 🔧 Composable usePosts

Il cuore della logica di stato è nel file `usePosts.js`:

```javascript
import { usePosts } from "./usePosts.js";

export default {
  setup() {
    const {
      state, // Stato reattivo
      loadPosts, // Carica post dal backend
      addNewPost, // Aggiungi nuovo post
      updatePost, // Aggiorna post esistente
      deletePost, // Elimina post
      processedPosts, // Post filtrati e ordinati
      setFilter, // Imposta filtri
      // ... altre funzioni
    } = usePosts();

    return {
      state,
      loadPosts,
      // ... esporta quello che ti serve
    };
  },
};
```

## 👨‍💻 Autore

**Giovanni Arduini**

- GitHub: [@giovanni-arduini](https://github.com/giovanni-arduini)
