# Piano di Migrazione a TypeScript

**Versione:** 1.2
**Data:** 2026-02-20
**Stato:** ✅ Completata

| Fase | Descrizione | Stato |
|------|-------------|-------|
| 0 | Tooling e configurazione | ✅ Completata |
| 1 | Utils e services | ✅ Completata |
| 2 | Redux store | ✅ Completata |
| 3 | Context i18n | ✅ Completata |
| 4 | Componenti UI atomici | ✅ Completata |
| 5 | Componenti condivisi e pagine comuni | ✅ Completata |
| 6 | Feature: admin | ✅ Completata |
| 7 | Feature: shop e user | ✅ Completata |
| 8 | Entry point e router | ✅ Completata |

---

## Indice

1. [Panoramica e obiettivi](#1-panoramica-e-obiettivi)
2. [Prerequisiti e setup](#2-prerequisiti-e-setup)
3. [Struttura dei tipi condivisi](#3-struttura-dei-tipi-condivisi)
4. [Convenzioni di nomenclatura](#4-convenzioni-di-nomenclatura)
5. [Ordine di migrazione per fasi](#5-ordine-di-migrazione-per-fasi)
6. [Esempi prima/dopo per ogni pattern](#6-esempi-primadopo-per-ogni-pattern)
7. [Aree di complessità nota](#7-aree-di-complessità-nota)
8. [Checklist di verifica per fase](#8-checklist-di-verifica-per-fase)

---

## 1. Panoramica e obiettivi

Il progetto conta attualmente **132 file sorgente** (90 `.jsx` + 42 `.js`) per circa **14.161 LOC**. La migrazione adotta un approccio **incrementale e compilante**: ogni file migrato deve continuare a compilare con `allowJs: true`, garantendo che il progetto sia sempre in uno stato deployabile.

Gli obiettivi principali sono:

- Eliminare i bug runtime causati da tipi errati (proprietà `undefined` su oggetti API, payload Redux non tipati).
- Rendere il codice auto-documentante riducendo la dipendenza dai commenti JSDoc.
- Abilitare il refactoring sicuro tramite il type-checker.
- Preparare il terreno per future funzionalità con meno rischio di regressione.

**Non-obiettivi della prima migrazione:**

- Riscrivere la logica business — si tipano i pattern esistenti.
- Introdurre nuove librerie o cambiare l'architettura.
- Raggiungere il 100% di copertura di tipo in un'unica iterazione.

---

## 2. Prerequisiti e setup

### 2.1 Pacchetti npm da installare

```bash
npm install --save-dev typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

I pacchetti `@types/react` e `@types/react-dom` sono già presenti in `devDependencies`.

> Nota: `@reduxjs/toolkit`, `react-redux`, `react-router-dom`, `jwt-decode`, `redux-persist`, `react-toastify`, `lucide-react` e `@headlessui/react` includono già i propri tipi — nessun `@types/*` aggiuntivo necessario.

### 2.2 Creazione di `tsconfig.json`

Creare `tsconfig.json` nella radice del progetto:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowJs": true,
    "checkJs": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@common/*": ["src/common/*"],
      "@features/*": ["src/features/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

Punti chiave:

- `allowJs: true` e `checkJs: false` — i file `.js`/`.jsx` rimangono validi senza type-checking durante la migrazione. Ogni file migrato viene rinominato in `.ts`/`.tsx`.
- `strict: true` — abilita `strictNullChecks`, `strictFunctionTypes`, `noImplicitAny` e tutti i controlli severi. Si consiglia di mantenerlo attivo fin dall'inizio.
- `noEmit: true` — Vite gestisce la transpilazione; TypeScript viene usato solo come type-checker.
- `moduleResolution: "bundler"` — compatibile con Vite 6.
- `paths` — replica gli alias definiti in `vite.config.js`.

### 2.3 Aggiornamento di `vite.config.js` → `vite.config.ts`

Rinominare `vite.config.js` in `vite.config.ts` e aggiornare le estensioni risolte:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@common': path.resolve(__dirname, './src/common'),
      '@features': path.resolve(__dirname, './src/features'),
    },
  },
})
```

### 2.4 Aggiornamento di `eslint.config.js`

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  { ignores: ['dist'] },
  // Configurazione per file JS/JSX esistenti (invariata durante la migrazione)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // Configurazione per file TS/TSX migrati
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]
```

### 2.5 Script di type-check

Aggiungere in `package.json`:

```json
"typecheck": "tsc --noEmit"
```

### 2.6 File `src/vite-env.d.ts`

Creare `src/vite-env.d.ts` per tipare le variabili d'ambiente Vite:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_DOMAIN: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_EVENT_ENDPOINT: string;
  readonly VITE_WIP_MODE: string;
  readonly VITE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 3. Struttura dei tipi condivisi

Creare la directory `src/types/` con i seguenti file. Questa directory contiene **solo** dichiarazioni di tipo — nessuna logica eseguibile.

```
src/types/
├── api.ts          # Tipi per le risposte API e i parametri delle request
├── competition.ts  # Tipi per eventi/competizioni (usati da più slice e feature)
├── cart.ts         # Tipi per il carrello e il listino prezzi
├── user.ts         # Tipi per l'utente autenticato e l'area personale
├── admin.ts        # Tipi specifici dell'area admin (Reader, Location)
├── i18n.ts         # Tipi per il sistema i18n
└── index.ts        # Re-export barrel di tutti i tipi pubblici
```

### `src/types/api.ts`

```typescript
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface ApiRequestParams {
  api: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: BodyInit | null;
  needAuth?: boolean;
  contentType?: string;
}

export interface ActionResult<T = null> {
  success: boolean;
  data: T | null;
}
```

### `src/types/competition.ts`

```typescript
import type { PriceList } from './cart';

export interface CompetitionLanguage {
  title: string;
  location: string;
  description: string;
  emoji: string;
}

export interface CompetitionTag {
  tag: string;
  bibNumber: boolean;
}

export interface Currency {
  currency: string;
  symbol: string;
}

export interface Competition {
  id: number;
  slug: string;
  tagId: number;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  preOrder: boolean;
  dateEvent: string;
  dateExpiry: string;
  dateStart: string;
  datePreorderStart?: string;
  datePreorderExpiry?: string;
  pathS3?: string;
  currencyId: number;
  aspectRatio: string;
  verifiedAttendanceEvent: boolean;
  languages: CompetitionLanguage[];
  tag: CompetitionTag;
  currency: Currency;
  lists?: PriceList[];
}
```

### `src/types/cart.ts`

```typescript
export interface PriceItem {
  id?: number;
  labelId: number | null;
  bestOffer: boolean;
  quantityPhoto: number | '';
  quantityClip: number | '';
  quantityVideo: number | '';
  price: number | '';
  discount: number | '';
}

export interface PriceList {
  id?: number;
  dateStart: string;
  dateExpiry: string;
  items: PriceItem[];
}

export interface CartProduct {
  keyPreview: string;
  keyOriginal: string;
  keyThumbnail: string;
  keyCover?: string;
  fileTypeId: 1 | 2 | 3; // 1=foto, 2=video, 3=clip
  purchased?: boolean;
}

export interface CartItem {
  keyPreview: string;
  keyOriginal: string;
  keyThumbnail: string;
  keyCover: string;
  fileTypeId: 1 | 2 | 3;
}

export interface PreorderPack {
  quantityPhoto: number;
  quantityVideo: number;
  quantityClip: number;
  price: number;
  discount?: number | null;
}

export interface CartState {
  id: number;
  userEmail: string;
  fullName: string;
  userId: number;
  eventId: number;
  searchId: number;
  products: CartProduct[];
  items: CartItem[];
  prices: PriceItem[];
  purchased: CartProduct[];
  totalQuantity: number;
  totalPrice: number; // sempre number — usare .toFixed(2) solo alla visualizzazione
  selectedPreorder: PreorderPack | null;
  alertPack: boolean;
  hasPhoto: boolean;
  hasVideo: boolean;
  hasClip: boolean;
  allPhotos: boolean;
  video: boolean;
  previousAllPhotosPurchase: boolean;
}
```

### `src/types/i18n.ts`

```typescript
export interface Language {
  id: string;
  acronym: string;
  language: string;
}

export interface StoredLanguage extends Language {
  version: number;
}

export interface LanguageContextValue {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  availableLanguages: Language[];
  loadingLanguages: boolean;
}

export interface TranslationContextValue {
  translations: Record<string, string>;
  t: (key: string) => string;
  loadingTranslations: boolean;
  currentLanguage: Language | null;
}
```

### `src/types/admin.ts`

```typescript
export interface Reader {
  id: number;
  label: string;
  stripeReaderId: string;
  active: boolean;
  events?: Array<{ id: number; slug: string }>;
}

export interface Location {
  id: number;
  name: string;
}
```

### `src/types/user.ts`

```typescript
export interface User {
  id: number;
  email: string;
  fullName: string;
  level: number;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}
```

---

## 4. Convenzioni di nomenclatura

| Categoria | Convenzione | Esempio |
|-----------|-------------|---------|
| File componente | PascalCase, estensione `.tsx` | `Button.tsx`, `AdminReaderDetail.tsx` |
| File hook | camelCase con prefisso `use`, estensione `.ts` | `useEventForm.ts` |
| File utility puri | kebab-case, estensione `.ts` | `auth.ts`, `data-formatter.ts` |
| File slice Redux | kebab-case con suffisso `-slice`, estensione `.ts` | `cart-slice.ts` |
| File action Redux | kebab-case con suffisso `-actions`, estensione `.ts` | `cart-actions.ts` |
| File loader React Router | kebab-case con suffisso `.loader`, estensione `.ts` | `AdminPanel.loader.ts` |
| File tipi | camelCase, estensione `.ts`, in `src/types/` | `cart.ts`, `competition.ts` |
| Interfacce | PascalCase senza prefisso `I` | `CartState`, `ApiRequestParams` |
| Type alias | PascalCase | `FileTypeId`, `ButtonVariant` |
| Props di componente | `NomeComponenteProps` | `ButtonProps`, `ModalProps` |
| Valore di context | `NomeContextValue` | `LanguageContextValue` |

**Nota sulle Props:** ogni componente esporta la propria interfaccia Props dallo stesso file (non da `src/types/`), tranne quando la stessa interfaccia è condivisa tra più componenti.

**Hook Redux tipati:** dopo la migrazione dello store, usare sempre `useAppDispatch` e `useAppSelector` (da `src/common/store/hooks.ts`) al posto di `useDispatch` e `useSelector`.

---

## 5. Ordine di migrazione per fasi

La migrazione segue un ordine **bottom-up**: si parte dai moduli senza dipendenze interne (utils) e si sale verso i componenti e le pagine. Questo garantisce che, al momento di tipare un componente, tutti i suoi import siano già tipati.

### Fase 0 — Tooling e configurazione ✅ COMPLETATA (2026-02-19)

**Obiettivo:** repository compilante con la nuova configurazione, senza ancora rinominare file.

1. Installare i pacchetti npm (§2.1)
2. Creare `tsconfig.json` (§2.2)
3. Rinominare `vite.config.js` → `vite.config.ts` (§2.3)
4. Aggiornare `eslint.config.js` (§2.4)
5. Aggiungere script `typecheck` al `package.json` (§2.5)
6. Creare `src/vite-env.d.ts` (§2.6)
7. Creare la directory `src/types/` con tutti i file di tipo (§3)
8. Verificare: `npm run dev` e `npm run build` senza errori

---

### Fase 1 — Fondamenta: utils e services (Stimato: 1–2 giorni)

Le utility non hanno dipendenze da componenti React o dallo store Redux. Migrarle prima significa avere tipi precisi disponibili per tutto il resto.

**File da migrare (in ordine):**

```
src/common/utils/data-formatter.js         → .ts
src/common/utils/language-utils.js         → .ts
src/common/utils/auth.js                   → .ts
src/common/utils/toast-manager.js          → .ts
src/common/utils/flag-utils.js             → .ts
src/common/utils/graphics.js               → .ts
src/common/utils/contents-utils.js         → .ts
src/common/utils/best-price-calculator.js  → .ts
src/common/utils/offers.js                 → .ts
src/common/utils/form-data-converters.js   → .ts
src/common/models/form-errors.js           → .ts  (classe → interfaccia, vedi §6.9)
src/common/services/api-services.js        → .ts
src/routes.js                              → .ts
```

---

### Fase 2 — Redux store (Stimato: 1–2 giorni)

Lo store è usato da quasi ogni componente. Tiparlo in blocco consente di avere `RootState` e `AppDispatch` disponibili prima di toccare qualsiasi componente.

**File da migrare (in ordine — `store.ts` per ultimo):**

```
src/features/user/store/user-slice.js              → .ts
src/features/user/store/personal-slice.js          → .ts
src/features/user/store/competitions-slice.js      → .ts
src/features/user/store/competitions-actions.js    → .ts
src/features/user/store/personal-actions.js        → .ts
src/features/user/store/user-actions.js            → .ts  ⚠️ vedi §7.5
src/features/shop/store/cart-slice.js              → .ts  ⚠️ vedi §7.1
src/features/shop/store/cart-actions.js            → .ts
src/features/admin/store/admin-competitions-slice.js    → .ts
src/features/admin/store/admin-competitions-actions.js  → .ts
src/features/admin/store/admin-readers-slice.js         → .ts
src/features/admin/store/admin-readers-actions.js       → .ts
src/common/store/store.js                          → .ts  (ultimo)
```

**Dopo `store.ts`, creare il nuovo file:**

```
src/common/store/hooks.ts  (nuovo — hook tipati useAppDispatch/useAppSelector)
```

---

### Fase 3 — Context i18n ✅ COMPLETATA (2026-02-20)

I due context wrappano l'intera app e sono usati da molti componenti.

```
src/common/i18n/LanguageContext.jsx     → .tsx  ⚠️ vedi §7.2
src/common/i18n/TranslationProvider.jsx → .tsx
```

---

### Fase 4 — Componenti UI atomici ✅ COMPLETATA (2026-02-20)

I componenti UI in `src/common/components/ui/` sono foglie dell'albero di dipendenze. Migrarli crea un effetto a cascata positivo.

```
src/common/components/ui/Button.jsx         → .tsx
src/common/components/ui/Modal.jsx          → .tsx
src/common/components/ui/Input.jsx          → .tsx
src/common/components/ui/Alert.jsx          → .tsx
src/common/components/ui/Badge.jsx          → .tsx
src/common/components/ui/Spinner.jsx        → .tsx
src/common/components/ui/Table.jsx          → .tsx
src/common/components/ui/Tabs.jsx           → .tsx
src/common/components/ui/Dropdown.jsx       → .tsx
src/common/components/ui/ButtonGroup.jsx    → .tsx
src/common/components/ui/Carousel.jsx       → .tsx
src/common/components/ui/Collapse.jsx       → .tsx
src/common/components/ui/Container.jsx      → .tsx
src/common/components/ui/EmptyState.jsx     → .tsx
src/common/components/ui/LoadingState.jsx   → .tsx
src/common/components/ui/Pagination.jsx     → .tsx
src/common/components/ui/SearchBar.jsx      → .tsx
src/common/components/ui/Tooltip.jsx        → .tsx
src/common/components/ui/InputGroup.jsx     → .tsx
src/common/components/ui/Form/FormCheck.jsx    → .tsx
src/common/components/ui/Form/FormControl.jsx  → .tsx
src/common/components/ui/Form/FormError.jsx    → .tsx
src/common/components/ui/Form/FormField.jsx    → .tsx
src/common/components/ui/Form/FormGroup.jsx    → .tsx
src/common/components/ui/Form/FormLabel.jsx    → .tsx
src/common/components/ui/Form/FormSelect.jsx   → .tsx
src/common/components/ui/Form/index.jsx        → .tsx
src/common/components/ui/index.js              → .ts   (barrel re-export)
```

---

### Fase 5 — Componenti condivisi e pagine comuni ✅ COMPLETATA (2026-02-20)

```
src/common/components/RouterWrapper.jsx     → .tsx
src/common/components/LanguageSelect.jsx    → .tsx
src/common/components/Logo.jsx              → .tsx
src/common/components/MailForm.jsx          → .tsx
src/common/components/ProgressBar.jsx       → .tsx
src/common/components/ImageGallery.jsx      → .tsx
src/common/components/ImageItem.jsx         → .tsx
src/common/components/GalleryCard.jsx       → .tsx
src/common/components/CustomLightbox.jsx    → .tsx
src/common/components/PrivacyPolicyModal.jsx → .tsx
src/common/pages/ErrorPage.jsx              → .tsx
src/common/pages/ContentError.jsx           → .tsx
src/common/pages/ContentUnavailable.jsx     → .tsx
src/common/pages/PrivacyPolicy.jsx          → .tsx
src/common/pages/WorkInProgress.jsx         → .tsx
```

---

### Fase 6 — Feature: admin ✅ COMPLETATA (2026-02-20)

La feature admin è la più complessa (7 hook, form di creazione evento, loader). Va migrata con ordine bottom-up rigoroso.

**Ordine:**

1. Utility interna: `CreateEvent/utils/eventFormHelpers.js` → `.ts`
2. Hook (in ordine di dipendenze crescenti):
   - `hooks/useCurrencies.js` → `.ts`
   - `hooks/useTags.js` → `.ts`
   - `hooks/useListItemLabels.js` → `.ts`
   - `hooks/useFormValidation.js` → `.ts`
   - `hooks/useEventForm.js` → `.ts`
   - `hooks/usePriceLists.js` → `.ts`
   - `hooks/useEventData.js` → `.ts`
3. Loader: tutti i file `.loader.js` → `.loader.ts`
4. Componenti interni di CreateEvent (bottom-up):
   - `PriceListSection/PriceListItem.jsx` → `.tsx`
   - `PriceListSection/PriceListCard.jsx` → `.tsx`
   - `PriceListSection/index.jsx` → `.tsx`
   - `EventBasicInfo.jsx` → `.tsx`
   - `EventColors.jsx` → `.tsx`
   - `EventDates.jsx` → `.tsx`
   - `EventLocations.jsx` → `.tsx`
   - `EventLogo.jsx` → `.tsx`
   - `FormActions.jsx` → `.tsx`
   - `PartecipantsTable.jsx` → `.tsx`
   - `ParticipantsUpload.jsx` → `.tsx`
   - `PendingPayments.jsx` → `.tsx` ⚠️ file da 561 righe, alta complessità
5. Pagina principale: `CreateEvent/index.jsx` → `.tsx` (ultima, dipende da tutto)
6. Componenti admin: `AdminLayout.jsx`, `AdminSidebar.jsx`, `LocationFormModal.jsx`, `ReaderFormModal.jsx` → `.tsx`
7. Pagine admin: `AdminDashboard.jsx`, `AdminEvents.jsx`, `AdminLocations.jsx`, `AdminPanel.jsx`, `AdminReaders.jsx`, `AdminReaderDetail.jsx` → `.tsx`

---

### Fase 7 — Feature: shop e user ✅ COMPLETATA (2026-02-20)

**Shop:**
```
src/features/shop/components/TotalShopButton.jsx  → .tsx
src/features/shop/pages/*.jsx                     → .tsx  (11 pagine)
```

**User:**
```
src/features/user/components/PinForm.jsx           → .tsx
src/features/user/components/SelfieUpload.jsx      → .tsx
src/features/user/pages/PersonalArea.loader.js     → .ts
src/features/user/pages/UploadSelfie.loader.js     → .ts
src/features/user/pages/*.jsx                      → .tsx  (10 pagine)
```

---

### Fase 8 — Entry point e router ✅ COMPLETATA (2026-02-20)

```
src/App.jsx   → .tsx
src/main.jsx  → .tsx
```

A questo punto tutti i file in `src/` devono essere `.ts`/`.tsx`. Eseguire `npm run typecheck` per la verifica finale completa.

**Risultato finale:** `npm run typecheck` → 0 errori. `npm run build` → build completato con successo.

---

## 6. Esempi prima/dopo per ogni pattern

### 6.1 Utility pura — `auth.ts`

**Prima:**
```javascript
export function isAdmin() {
  const token = getAuthToken();
  const level = getLevel();
  return isValid(token) && level !== null && parseInt(level) !== 3;
}
```

**Dopo:**
```typescript
export function getAuthToken(): string | null {
  return localStorage.getItem('jwt');
}

export function getLevel(): string | null {
  return localStorage.getItem('level');
}

export function isAdmin(): boolean {
  const token = getAuthToken();
  const level = getLevel();
  return isValid(token) && level !== null && parseInt(level, 10) !== 3;
}
```

---

### 6.2 Redux slice — `cart-slice.ts`

**Prima:**
```javascript
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const product = state.products.find(
        (item) => item.keyOriginal === action.payload,
      );
      // ...
    },
  },
});
```

**Dopo:**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartState } from '@/types/cart';

const initialState: CartState = { /* tutti i campi tipati */ };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<string>) {
      const product = state.products.find(
        (item) => item.keyOriginal === action.payload,
      );
      // ...
    },
    updateOrderId(state, action: PayloadAction<number>) {
      state.id = action.payload;
    },
  },
});
```

**Store con tipi derivati (`store.ts`):**
```typescript
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
```

**Hook tipati (`src/common/store/hooks.ts` — nuovo file):**
```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
```

**Utilizzo nei componenti:**
```typescript
// Prima (non tipato)
const dispatch = useDispatch();
const readers = useSelector((state) => state.adminReaders.readers);

// Dopo (completamente tipato)
const dispatch = useAppDispatch();
const readers = useAppSelector((state) => state.adminReaders.readers);
// readers è ora inferito come Reader[]
```

---

### 6.3 Funzione API — `api-services.ts`

**Prima:**
```javascript
export async function apiRequest({
  api, method = "GET", body, needAuth = false, contentType = "application/json"
}) {
  return response;
}
```

**Dopo:**
```typescript
import type { ApiRequestParams } from '@/types/api';

export async function apiRequest({
  api,
  method = 'GET',
  body,
  needAuth = false,
  contentType = 'application/json',
}: ApiRequestParams): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers();

  if (!(body instanceof FormData)) {
    headers.append('Content-Type', contentType);
  }
  if (needAuth) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  return fetch(api, { method, body, headers });
}

export async function listenSSE(
  api: string,
  callbackMessage: (data: string) => void,
  callbackError: (err: unknown) => void,
): Promise<void> {
  // ... corpo invariato
}
```

---

### 6.4 Componente React — `Button.tsx`

**Prima:**
```javascript
const Button = ({ children, variant = 'primary', size = 'md', disabled = false, onClick, ...props }) => {
  // ...
};
```

**Dopo:**
```typescript
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'link' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  // ... corpo invariato
};

export default Button;
```

> Estendere `React.ButtonHTMLAttributes<HTMLButtonElement>` consente di accettare tutti gli attributi HTML standard (`aria-*`, `data-*`, ecc.) senza dichiararli esplicitamente.

---

### 6.5 Componente con sub-componenti — `Modal.tsx`

```typescript
interface ModalComponent extends React.FC<ModalProps> {
  Header: React.FC<ModalHeaderProps>;
  Title: React.FC<ModalSubComponentProps>;
  Body: React.FC<ModalSubComponentProps>;
  Footer: React.FC<ModalSubComponentProps>;
}

const Modal: ModalComponent = ({ show, onHide, children }) => {
  // ...
};

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
```

---

### 6.6 Context tipato — `LanguageContext.tsx`

**Prima:**
```javascript
const LanguageContext = createContext({
  currentLanguage: defaultLanguage,
  setLanguage: () => {},
  availableLanguages: [],
  loadingLanguages: false,
});
```

**Dopo:**
```typescript
import type { Language, LanguageContextValue } from '@/types/i18n';

const LanguageContext = createContext<LanguageContextValue>({
  currentLanguage: defaultLanguage,
  setLanguage: () => undefined,
  availableLanguages: [],
  loadingLanguages: false,
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  // ... useEffect invariato
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
```

---

### 6.7 Custom hook — `useEventForm.ts`

**Prima:**
```javascript
export function useEventForm(receivedComp) {
  const [formData, setFormData] = useState(getInitialFormData(receivedComp));
  return { formData, handleInputChange, updateField, resetForm };
}
```

**Dopo:**
```typescript
import type { Competition } from '@/types/competition';
import type { EventFormData } from '../utils/eventFormHelpers';

interface UseEventFormReturn {
  formData: EventFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  updateField: (name: keyof EventFormData, value: EventFormData[keyof EventFormData]) => void;
  resetForm: () => void;
}

export function useEventForm(receivedComp: Competition | null): UseEventFormReturn {
  const [formData, setFormData] = useState<EventFormData>(() => getInitialFormData(receivedComp));
  // ... corpo invariato
}
```

---

### 6.8 Loader React Router — `AdminPanel.loader.ts`

**Prima:**
```javascript
export function loader() {
  if (!isAdmin()) return redirect("/");
  return null;
}
```

**Dopo:**
```typescript
import type { LoaderFunction } from 'react-router-dom';

export const loader: LoaderFunction = () => {
  if (!isAdmin()) return redirect('/');
  return null;
};
```

---

### 6.9 Classe → Interfaccia — `form-errors.ts`

**Prima:**
```javascript
export default class FormErrors {
  constructor(imageError = false, emailError = false, emailNotPresent = false, pinError = false, privacyError = false) {
    this.imageError = imageError;
    // ...
  }
}
```

**Dopo:**
```typescript
export interface FormErrors {
  imageError: boolean;
  emailError: boolean;
  emailNotPresent: boolean;
  pinError: boolean;
  privacyError: boolean;
}

export function createFormErrors(overrides: Partial<FormErrors> = {}): FormErrors {
  return {
    imageError: false,
    emailError: false,
    emailNotPresent: false,
    pinError: false,
    privacyError: false,
    ...overrides,
  };
}
```

> Tutti i `new FormErrors(...)` vanno sostituiti con `createFormErrors({ ... })`.

---

## 7. Aree di complessità nota

### 7.1 `cart-slice.ts` — mix `string`/`number` su `totalPrice`

Nel codice attuale `totalPrice` viene impostato sia come `string` (`.toFixed(2)`) sia come `number`. In `CartState` va usato **sempre `number`** — applicare `.toFixed(2)` solo al momento della visualizzazione nel componente.

### 7.2 `LanguageContext` — dati dinamici dall'API

Il tipo `Language` va definito in `src/types/i18n.ts` a partire dalla struttura osservata. Per castare la risposta dell'API:

```typescript
import type { ApiResponse } from '@/types/api';
import type { Language } from '@/types/i18n';

const data = await response.json() as ApiResponse<Language[]>;
setAvailableLanguages(data.data);
```

### 7.3 `best-price-calculator.ts` — algoritmo DP 3D

La migrazione non altera la logica. Tipare i parametri:

```typescript
interface PricePackage {
  quantityPhoto: number;
  quantityVideo: number;
  quantityClip: number;
  price: number;
}

export function calculatePrice(
  packages: PricePackage[],
  reqP: number,
  reqV: number,
  reqC: number,
): number {
  const dp: number[][][] = Array.from({ length: reqP + 1 }, () =>
    Array.from({ length: reqV + 1 }, () => Array(reqC + 1).fill(Infinity)),
  );
  // ... corpo invariato
}
```

### 7.4 `objectToFormData` — oggetti annidati

```typescript
type FormDataValue = string | number | boolean | File | Blob | null | undefined;
type FormDataObject = {
  [key: string]: FormDataValue | FormDataObject | FormDataObject[];
};

export function objectToFormData(
  obj: FormDataObject,
  form: FormData = new FormData(),
  namespace = '',
): FormData {
  // ... corpo invariato
}
```

### 7.5 `user-actions.js` — import erroneo

Il file contiene `import { userActions } from '@features/shop/store/cart-actions'` che è quasi certamente un residuo di refactoring. Va corretto (o il file eliminato) durante la migrazione della Fase 2.

### 7.6 `redux-persist` — tipi incompleti

Se compaiono errori di tipo su `persistReducer`, aggiungere un cast temporaneo:

```typescript
const persistedReducer = persistReducer(persistConfig, rootReducer) as typeof rootReducer;
```

---

## 8. Checklist di verifica per fase

### Checklist Fase 0
- [ ] `npm run dev` avvia il server senza errori
- [ ] `npm run lint` non riporta nuovi errori
- [ ] `npm run build` produce una build funzionante
- [ ] `npm run typecheck` è eseguibile

### Checklist Fasi 1–8 (generica, da ripetere dopo ogni fase)

- [ ] Tutti i file previsti dalla fase sono stati rinominati (`.js`→`.ts`, `.jsx`→`.tsx`)
- [ ] `npm run typecheck` riporta 0 errori sui file migrati in questa fase
- [ ] `npm run lint` non riporta nuovi errori `@typescript-eslint`
- [ ] `npm run dev` avvia l'app senza errori in console
- [ ] `npm run build` produce una build funzionante
- [ ] Nessun `any` esplicito non giustificato (ogni `any` deve avere un commento `// TODO: tipare`)
- [ ] `useAppDispatch`/`useAppSelector` usati al posto di `useDispatch`/`useSelector` (dalla Fase 2 in poi)
- [ ] Le interfacce Props dei componenti sono esportate

### Checklist Fase 8 (finale)

- [ ] Nessun file `.js`/`.jsx` rimane in `src/`
- [ ] `npm run typecheck` riporta 0 errori in tutto il progetto
- [ ] Tutti gli `any` espliciti sono documentati con un issue o un `// TODO` tracciabile
- [ ] `CLAUDE.md` aggiornato con le nuove convenzioni (estensioni file, script typecheck)
