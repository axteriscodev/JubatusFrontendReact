# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite, localhost:5173)
npm run build      # Production build
npm run lint       # ESLint check
npm run preview    # Preview production build
```

No test suite is configured.

## Environment Variables

Required in `.env`:
- `VITE_API_URL` — backend base URL (e.g. `http://localhost:8080`)
- `VITE_APP_DOMAIN` — frontend domain
- `VITE_STRIPE_PUBLIC_KEY` — Stripe publishable key
- `VITE_EVENT_ENDPOINT` — event API endpoint segment
- `VITE_WIP_MODE` — set to `"true"` to redirect all traffic to `/work-in-progress`
- `VITE_DEBUG` — debug flag

## Architecture

Feature-based structure under `src/`:

```
src/
├── App.jsx          # Router definition (createBrowserRouter)
├── routes.js        # ROUTES constants (all paths in one place)
├── main.jsx         # Entry: Redux Provider + PersistGate + ToastContainer
├── features/
│   ├── admin/       # Admin pages, store slices, Admin.css
│   ├── shop/        # Shop/checkout pages, cart store, TotalShopButton
│   └── user/        # Auth pages, personal area, selfie upload, user store
└── common/
    ├── components/  # Shared UI components (ui/, Logo, ImageGallery, MailForm, etc.)
    ├── i18n/        # LanguageContext + TranslationProvider
    ├── models/      # form-errors.js
    ├── pages/       # Shared pages (ErrorPage, ContentError, WorkInProgress, etc.)
    ├── services/    # api-services.js (apiRequest, listenSSE, deprecated sendRequest)
    ├── store/       # store.js (Redux root store + redux-persist)
    └── utils/       # auth, data-formatter, language-utils, toast-manager, etc.
```

### Vite Path Aliases

- `@` → `src/`
- `@common` → `src/common/`
- `@features` → `src/features/`

Use aliases for cross-feature/cross-layer imports; use relative imports within the same feature.

### Routing

All route paths are defined in `src/routes.js` as `ROUTES` constants. Dynamic routes are functions (e.g. `ROUTES.EVENT(":eventSlug")`). The router is in `App.jsx`, wrapped by `RouterWrapper` which enforces WIP mode.

### State Management

Redux Toolkit with redux-persist. Root store in `@common/store/store.js`. Slices:
- `user` — auth/user state (`@features/user/store/`)
- `cart` — shopping cart (`@features/shop/store/`)
- `personal` — personal area data (`@features/user/store/`)
- `competition` — competition/event state (`@features/user/store/`) ← **persisted**
- `adminCompetitions` — admin event list (`@features/admin/store/`)
- `adminReaders` — admin readers (`@features/admin/store/`)

Only `cart` and `competition` slices are persisted to localStorage.

### API Layer

`@common/services/api-services.js` exports:
- `apiRequest({ api, method, body, needAuth, contentType })` — standard fetch wrapper; omit `Content-Type` automatically for `FormData`
- `listenSSE(api, callbackMessage, callbackError)` — SSE via `@microsoft/fetch-event-source`
- `sendRequest` — **deprecated**, use `apiRequest`

Auth token stored in `localStorage` as `"jwt"`. User level stored as `"level"`. Admin = valid JWT + level !== 3.

### i18n

Two-layer system:
1. `LanguageProvider` (`@common/i18n/LanguageContext`) — fetches available languages from API, detects browser language, persists choice in `localStorage` as `preferred_lang`
2. `TranslationProvider` (`@common/i18n/TranslationProvider`) — fetches translation strings for current language; `t(key)` looks up by key, with tag-specific overrides (`${key}_${tagId}`)

Both providers wrap the entire app in `App.jsx`.
