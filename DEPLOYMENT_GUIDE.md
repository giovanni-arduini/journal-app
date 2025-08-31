# Journal App Monorepo Structure

```
journal-app-monorepo/
├── frontend/          # La tua app Vue attuale
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/           # Il tuo backend
│   ├── index.js
│   ├── package.json
│   └── routes/
└── render.yaml        # Configurazione per entrambi i servizi
```

## Deploy Steps per Monorepo:

1. **Sposta il frontend in una cartella `frontend/`**
2. **Metti il backend in una cartella `backend/`**
3. **Crea render.yaml nella root:**

```yaml
services:
  # Backend Service
  - type: web
    name: journal-app-backend
    env: node
    region: oregon
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000

  # Frontend Service
  - type: web
    name: journal-app-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    envVars:
      - key: VITE_API_URL
        value: https://journal-app-backend.onrender.com
```
