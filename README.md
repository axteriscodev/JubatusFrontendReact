# Jubatus Frontend React

Frontend React per la piattaforma **MyMemories** — acquisto e gestione foto/video di eventi sportivi con ricerca tramite selfie.

## Stack Tecnico

- **React 19** + **React Router 7** + **Redux Toolkit** + redux-persist
- **Vite 6** + **TailwindCSS 4**
- **Stripe** (`@stripe/react-stripe-js`)
- SSE via `@microsoft/fetch-event-source`

## Prerequisiti

- Node.js >= 18
- npm

## Installazione

```bash
npm install
```

## Comandi

```bash
npm run dev        # Dev server (Vite, http://localhost:5173)
npm run build      # Build di produzione
npm run lint       # ESLint check
npm run preview    # Preview della build di produzione
```

## Variabili d'Ambiente

Creare un file `.env` nella root del progetto (escluso dalla repo). Template:

```env
# --- API ---
VITE_API_URL=http://localhost:8080
# VITE_API_URL=https://api-dev.mymemories.it
# VITE_API_URL=https://api.mymemories.it

# --- App ---
VITE_APP_DOMAIN=http://localhost:5173

# --- Stripe ---
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# --- Feature flags ---
VITE_DEBUG=false
VITE_WIP_MODE=false          # Se "true" redirige tutto il traffico a /work-in-progress

# --- Timeout selfie processing (ms) ---
VITE_PROCESSING_SELFIE_TIMEOUT=60000   # Timeout massimo ricerca contenuti
VITE_PROCESSING_SELFIE_LOADING=30000   # Timeout schermata di caricamento

# --- Totem cash (ms) ---
VITE_THANKYOU_CASH_TIMEOUT=8000        # Attesa prima di tornare al selfie da totem

# --- Stati ordine ---
VITE_ORDER_STATE_SUSPENDED=0
VITE_ORDER_STATE_SEND=1
VITE_ORDER_STATE_PAYMENT_SUCCESS=2
VITE_ORDER_STATE_PAYMENT_FAILED=3
VITE_ORDER_STATE_COMPLETED=4
VITE_ORDER_STATE_CANCELED=5

# --- Video player ---
VITE_VIDEO_AUTOPLAY=true
VITE_VIDEO_MUTED=false
VITE_VIDEO_LOOP=false
```

### Descrizione variabili

| Variabile | Obbligatoria | Descrizione |
|---|---|---|
| `VITE_API_URL` | SI | URL base del backend |
| `VITE_APP_DOMAIN` | SI | Dominio del frontend (usato per redirect/CORS) |
| `VITE_STRIPE_PUBLIC_KEY` | SI | Chiave pubblica Stripe (usa `pk_test_` in sviluppo) |
| `VITE_DEBUG` | no | Abilita log di debug |
| `VITE_WIP_MODE` | no | Mette l'app in modalità manutenzione |
| `VITE_PROCESSING_SELFIE_TIMEOUT` | no | Timeout massimo (ms) per la ricerca contenuti da selfie |
| `VITE_PROCESSING_SELFIE_LOADING` | no | Durata schermata di caricamento selfie (ms) |
| `VITE_THANKYOU_CASH_TIMEOUT` | no | Attesa (ms) prima di tornare al selfie su totem cash |
| `VITE_ORDER_STATE_*` | no | Valori numerici degli stati ordine |
| `VITE_VIDEO_AUTOPLAY` | no | Autoplay video nei player |
| `VITE_VIDEO_MUTED` | no | Video in muto di default |
| `VITE_VIDEO_LOOP` | no | Loop video di default |

## Struttura del Progetto

```
src/
├── App.jsx          # Router (createBrowserRouter) + provider
├── routes.js        # Costanti ROUTES (tutti i path in un posto)
├── main.jsx         # Entry point: Redux Provider + PersistGate + ToastContainer
├── features/
│   ├── admin/       # Pagine admin, store slices (adminCompetitions, adminReaders)
│   ├── shop/        # Shop/checkout, store cart, TotalShopButton
│   └── user/        # Auth, area personale, selfie upload, store user/personal/competition
└── common/
    ├── components/  # Componenti UI condivisi (ui/, Logo, ImageGallery, MailForm, …)
    ├── i18n/        # LanguageContext + TranslationProvider
    ├── models/      # form-errors.js
    ├── pages/       # ErrorPage, ContentError, WorkInProgress, PrivacyPolicy, …
    ├── services/    # api-services.js (apiRequest, listenSSE)
    ├── store/       # store.js (Redux root + redux-persist)
    └── utils/       # auth, data-formatter, language-utils, toast-manager, …
```

### Path Alias Vite

| Alias | Percorso |
|---|---|
| `@` | `src/` |
| `@common` | `src/common/` |
| `@features` | `src/features/` |

Usa gli alias per import cross-feature; usa import relativi all'interno della stessa feature.

## Autenticazione

- JWT salvato in `localStorage` come `"jwt"`
- Livello utente salvato come `"level"` — Admin = JWT valido + level !== 3
- Helper: `@common/utils/auth`

## i18n

Sistema a due livelli:
1. `LanguageProvider` — recupera le lingue disponibili da API, rileva la lingua del browser, persiste la scelta in `localStorage` come `preferred_lang`
2. `TranslationProvider` — recupera le stringhe per la lingua corrente; `t(key)` con override per tag specifici

## Redux Persist

Slices persistite in `localStorage`: **`cart`** e **`competition`**
