# Documentazione Pannello di Amministrazione

## Indice

1. [Panoramica](#panoramica)
2. [Routing e Protezione Route](#routing-e-protezione-route)
3. [Pagine Admin](#pagine-admin)
   - [AdminPanel — Lista eventi](#adminpanel--lista-eventi)
   - [CreateEvent — Gestione evento](#createevent--gestione-evento)
4. [Tab della pagina Gestione Evento](#tab-della-pagina-gestione-evento)
   - [Tab 1: Info evento](#tab-1-info-evento)
   - [Tab 2: Listini prezzi](#tab-2-listini-prezzi)
   - [Tab 3: Partecipanti](#tab-3-partecipanti)
   - [Tab 4: Pagamenti in sospeso](#tab-4-pagamenti-in-sospeso)
5. [Hooks personalizzati](#hooks-personalizzati)
6. [Utilities](#utilities)
7. [State Management (Redux)](#state-management-redux)
8. [Azioni API](#azioni-api)
9. [Componenti Shared utilizzati](#componenti-shared-utilizzati)
10. [Stili Admin](#stili-admin)
11. [Flussi operativi](#flussi-operativi)

---

## Panoramica

Il pannello di amministrazione permette agli utenti con ruolo admin di gestire eventi (competizioni), listini prezzi, partecipanti e pagamenti in sospeso. L'accesso è protetto da un route guard che verifica il ruolo tramite `isAdmin()`.

**File chiave:**

| File | Scopo |
|------|-------|
| `src/routes.js` | Definizione route admin |
| `src/pages/AdminPanel.jsx` | Home admin — lista eventi |
| `src/pages/AdminPanel.loader.js` | Protezione route (redirect se non admin) |
| `src/pages/CreateEvent/index.jsx` | Pagina CRUD evento con tabs |
| `src/pages/CreateEvent/components/` | Componenti form evento |
| `src/pages/CreateEvent/hooks/` | Hook personalizzati |
| `src/pages/CreateEvent/utils/eventFormHelpers.js` | Helper per preparazione dati |
| `src/repositories/admin-competitions/admin-competitions-actions.js` | Thunk actions (chiamate API) |
| `src/repositories/admin-competitions/admin-competitions-slice.js` | Redux slice |
| `src/Admin.css` | Stili specifici per le pagine admin |

---

## Routing e Protezione Route

I route sono definiti in `src/routes.js`:

```
/admin                     → AdminPanel (lista eventi)
/admin/create-event        → CreateEvent (creazione nuovo evento)
/admin/event/:eventId      → CreateEvent (modifica evento esistente)
```

**Protezione:** Il loader `src/pages/AdminPanel.loader.js` verifica `isAdmin()` prima di ogni accesso. Se l'utente non è admin, viene reindirizzato a `/`.

**Modalità read-only:** All'interno di `/admin/event/:eventId`, se `canManage === false` per quell'evento, la pagina entra in modalità read-only: vengono nascosti i tab di modifica e rimane visibile solo il tab "Pagamenti in sospeso".

---

## Pagine Admin

### AdminPanel — Lista eventi

**Percorso:** `src/pages/AdminPanel.jsx`
**Route:** `/admin`

Dashboard principale dell'admin. Mostra una tabella con tutti gli eventi e permette di navigare alla creazione o modifica.

**Colonne della tabella:**
- ID
- Logo
- Nome evento
- Località
- Data evento
- Data inizio registrazione
- Data scadenza registrazione

**Azioni per riga:**
- **Modifica** (icona ingranaggio): naviga a `/admin/event/:eventId` — visibile solo se `canManage !== false`
- **Apri nel sito** (icona link esterno): apre la pagina pubblica dell'evento in una nuova scheda

**Azioni globali:**
- **Nuovo evento**: naviga a `/admin/create-event`
- **Logout**: disconnette l'utente

**State Redux:** `state.adminCompetitions.competitions` — popolato da `fetchCompetitions()` al mount.

---

### CreateEvent — Gestione evento

**Percorso:** `src/pages/CreateEvent/index.jsx`
**Route:** `/admin/create-event` (creazione) e `/admin/event/:eventId` (modifica)

Pagina multi-tab per la gestione completa di un evento. Le tab disponibili variano in base allo stato dell'evento e ai permessi dell'utente.

**Tab disponibili (condizionali):**

| Tab | Condizione di visibilità |
|-----|--------------------------|
| Info evento | Solo se NON read-only |
| Listini prezzi | Solo se NON read-only E evento già salvato (ha un `id`) |
| Partecipanti | Solo se evento salvato E `verifiedAttendanceEvent === true` |
| Pagamenti in sospeso | Solo se `externalPayment !== null` E evento salvato (o read-only) |

**Azioni form (in alto a destra):**
- **Elimina evento** (icona cestino, rosso): elimina l'evento dopo conferma — visibile solo se NON read-only
- **Vai all'elenco** (icona lista): torna a `/admin`

---

## Tab della pagina Gestione Evento

### Tab 1: Info evento

**Componenti:**
- `EventBasicInfo` — campi principali
- `EventDates` — date evento
- `EventColors` — colori tema
- `EventLogo` — upload logo

**Campi EventBasicInfo (`src/pages/CreateEvent/components/EventBasicInfo.jsx`):**
- **Titolo evento** — genera automaticamente lo slug
- **URL/Slug** — read-only, auto-generato dal titolo tramite `slugify()`
- **Località**
- **Path S3** — percorso di archiviazione media
- **Tipologia evento** — select tra i tag disponibili (da API `/contents/tag`)
- **Valuta** — select tra le valute disponibili (da API `/events/currency`)
- **Emoji attesa** — emoji mostrata durante l'attesa
- **Descrizione** — textarea
- **Partecipanti verificati** — checkbox `verifiedAttendanceEvent`; se attivo, abilita il tab Partecipanti

**Campi EventDates (`src/pages/CreateEvent/components/EventDates.jsx`):**
- Data evento
- Data pubblicazione
- Data scadenza
- Inizio preordini
- Fine preordini

**Campi EventColors (`src/pages/CreateEvent/components/EventColors.jsx`):**
- Background color
- Primary color
- Secondary color

**EventLogo (`src/pages/CreateEvent/components/EventLogo.jsx`):**
- File input per upload immagine (accept `image/*`)
- Anteprima logo corrente o appena selezionato

**Salvataggio:**
Il pulsante **"Salva info evento"** chiama `handleSubmitEventInfo()`:
- Se è un nuovo evento → POST `/events/create` → redirect a `/admin/event/{newId}`
- Se è un evento esistente → PUT `/events/event/{id}`

---

### Tab 2: Listini prezzi

**Componenti:**
- `PriceListSection` (`src/pages/CreateEvent/components/PriceListSection/index.jsx`)
- `PriceListCard` (`src/pages/CreateEvent/components/PriceListSection/PriceListCard.jsx`)
- `PriceListItem` (`src/pages/CreateEvent/components/PriceListSection/PriceListItem.jsx`)

**Struttura dati:**
```
Listino
├── dateStart        — data inizio validità listino
├── dateExpiry       — data fine validità listino
└── items[]          — pacchetti
    ├── labelId          — label selezionata (da API /events/label/list-item)
    ├── bestOffer        — flag "Migliore Offerta" (boolean)
    ├── quantityPhoto    — numero di foto incluse
    ├── quantityClip     — numero di clip incluse
    ├── quantityVideo    — numero di video inclusi
    ├── price            — prezzo base
    └── discount         — sconto percentuale (0–100)
```

**Funzionalità:**
- Aggiunta di nuovi listini (pulsante "Nuovo listino")
- Rimozione di listini esistenti
- Per ogni listino: aggiunta/rimozione di pacchetti
- Selezione label pacchetto con testo in lingue multiple (collapsibile)
- Flag "Migliore offerta" per evidenziare un pacchetto
- Calcolo automatico del prezzo finale con sconto
- Preset prezzi rapidi

**Salvataggio:**
Il pulsante **"Salva listini prezzi"** chiama `handleSubmitPriceLists()`:
- Calcola i listini eliminati confrontando gli ID originali con quelli correnti
- Esegue in parallelo:
  - DELETE per i listini rimossi
  - POST per i nuovi listini (senza `id`)
  - PUT per i listini modificati (con `id`)

---

### Tab 3: Partecipanti

**Componenti:**
- `ParticipantsUpload` (`src/pages/CreateEvent/components/ParticipantsUpload.jsx`)
- `PartecipantsTable` (`src/pages/CreateEvent/components/PartecipantsTable.jsx`)

**ParticipantsUpload — Upload file:**
- Accetta file Excel (`.xlsx`, `.xls`)
- Validazione tipo MIME e dimensione massima (5MB)
- Feedback visivo su file selezionato e stato upload
- Chiamata: POST `/events/{eventId}/upload-attendees` con FormData

**PartecipantsTable — Tabella partecipanti:**
- Colonne: `#`, `Email`
- SearchBar per filtrare per email
- Contatore partecipanti (totale / filtrati)
- Pulsante "Aggiorna" per ricaricare la lista
- Chiamata: GET `/events/{eventId}/attendees`

---

### Tab 4: Pagamenti in sospeso

**Componente:** `PendingPayments` (`src/pages/CreateEvent/components/PendingPayments.jsx`)

**Tabella pagamenti:**

| Colonna | Descrizione |
|---------|-------------|
| # | Numero progressivo |
| Ordine | ID ordine |
| Email | Email del cliente |
| Importo | Importo con simbolo valuta |
| Contenuti | Riepilogo media (N Foto, M Video, X Clip) |
| Azioni | Pulsante "Gestisci" |

**Filtri disponibili:**
- Filtro per email
- Filtro per importo esatto

**Paginazione:**
- Scelta righe per pagina: 5 / 10 / 25 / 50

**Modal di gestione pagamento:**
Cliccando "Gestisci" si apre un modal con:
- Dettagli dell'ordine
- Selezione sconto (preset: 5%, 10%, 15%, 20% — o valore custom 0–100)
- Anteprima importo finale con risparmio calcolato
- **"Pagato cash"**: conferma pagamento → PUT `/orders/order/{idOrdine}/confirm-payment`
- **"Pagato POS"**: disabilitato (funzionalità in arrivo)

**Payload conferma pagamento:**
```json
{
  "amount": <importo originale>,
  "discountPercent": <sconto 0-100>,
  "discountedAmount": <importo calcolato>
}
```

---

## Hooks personalizzati

Tutti gli hook si trovano in `src/pages/CreateEvent/hooks/`.

### `useEventData()`
Carica i dati dell'evento quando si è in modalità modifica (rileva `eventId` dai parametri URL).

**Return:** `{ eventData, externalPayment, loading, error, eventId }`

Determina anche se l'utente è in read-only: `!!eventId && !eventData && !loading && !error`.

---

### `useEventForm(eventData)`
Gestisce lo stato del form per le info evento.

**Return:** `{ formData, handleInputChange, handleTitleChange, handleFileChange }`

- `handleTitleChange`: aggiorna il titolo e ricalcola lo slug automaticamente
- `handleFileChange`: gestisce l'upload del logo

---

### `usePriceLists(initialLists)`
Gestisce lo stato dei listini prezzi e dei pacchetti.

**Return:**
```
{
  priceLists,
  addList,
  removeList,
  updateListDate,
  addItemToList,
  removeItemFromList,
  updateItem,
  updateItemWithLanguage
}
```

---

### `useTags()`
Carica la lista dei tipi evento (tag) da API `/contents/tag`.

**Return:** `{ tagList, loading, error }`

---

### `useCurrencies()`
Carica la lista delle valute disponibili da API `/events/currency`.

**Return:** `{ currencyList, loading, error }`

---

### `useListItemLabels()`
Carica le label disponibili per i pacchetti da API `/events/label/list-item`.

**Return:** `{ labelList, loading, error }`

---

### `useFormValidation()` *(presente ma non attivamente utilizzato)*
Valida i campi obbligatori del form evento.

**Campi validati:** `title`, `pathS3`, `tagId`, `currencyId`, `dateEvent`, `dateStart`, `dateExpiry`

**Return:** `{ errors, validateForm, clearFieldError, clearAllErrors, getErrorMessages }`

---

## Utilities

**File:** `src/pages/CreateEvent/utils/eventFormHelpers.js`

| Funzione | Descrizione |
|----------|-------------|
| `getDefaultFormData()` | Ritorna un oggetto form con valori di default |
| `getInitialFormData(receivedComp)` | Mappa i dati del server nel formato del form |
| `createEmptyPriceItem()` | Crea un pacchetto vuoto |
| `createEmptyPriceList()` | Crea un listino vuoto con un pacchetto di default |
| `getDefaultPriceLists()` | Ritorna un array con un listino di default |
| `buildLanguageObject(formData)` | Costruisce l'oggetto `languages` per il server |
| `prepareEventInfoData(formData)` | Prepara i dati per il salvataggio delle info evento |
| `prepareSubmitData(formData, priceLists)` | Prepara i dati completi inclusi i listini |

---

## State Management (Redux)

**Slice:** `src/repositories/admin-competitions/admin-competitions-slice.js`
**Store path:** `state.adminCompetitions`

**Struttura dello state:**
```javascript
{
  competitions: [
    {
      id: number,
      slug: string,
      logo: string,
      location: string,
      dateEvent: date,
      dateStart: date,
      dateExpiry: date,
      languages: [{ title, location, description, emoji }],
      lists: [ /* listini prezzi */ ],
      canManage: boolean,
      verifiedAttendanceEvent: boolean
    }
  ]
}
```

**Reducers:**
- `setCompetitions` — imposta l'intera lista
- `addCompetition` — aggiunge una nuova competizione
- `editCompetition` — modifica una competizione per ID
- `deleteCompetition` — rimuove una competizione per ID

---

## Azioni API

**File:** `src/repositories/admin-competitions/admin-competitions-actions.js`

### Competizioni

| Action | Metodo | Endpoint | Descrizione |
|--------|--------|----------|-------------|
| `fetchCompetitions()` | GET | `/events/fetch` | Lista tutti gli eventi |
| `fetchCompetitionById(eventId)` | GET | `/events/event/{eventId}` | Dettagli evento (+ externalPayment) |
| `addCompetition(data)` | POST | `/events/create` | Crea nuovo evento (FormData) |
| `editCompetition(data)` | PUT | `/events/event/{id}` | Modifica evento (FormData) |
| `deleteCompetition(data)` | DELETE | `/events/event/{id}` | Elimina evento |

### Listini prezzi

| Action | Metodo | Endpoint | Descrizione |
|--------|--------|----------|-------------|
| `addListToCompetition(eventId, list)` | POST | `/events/event-list/create` | Aggiunge listino |
| `editListForCompetition(listId, eventId, list)` | PUT | `/events/event-list/{listId}` | Modifica listino |
| `deleteListForCompetition(listId)` | DELETE | `/events/event-list/{listId}` | Elimina listino |

### Partecipanti e pagamenti (chiamate dirette, non in Redux)

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/events/{eventId}/upload-attendees` | POST | Upload file partecipanti |
| `/events/{eventId}/attendees` | GET | Lista partecipanti |
| `/events/{eventId}/attendees` | DELETE | Rimuove partecipante |
| `/events/event/{eventId}/payments` | GET | Lista pagamenti (filtri + paginazione) |
| `/orders/order/{orderId}/confirm-payment` | PUT | Conferma pagamento |

---

## Componenti Shared utilizzati

I componenti si trovano in `src/shared/components/`.

| Componente | Utilizzo |
|------------|----------|
| `Button` | Pulsanti standard |
| `ButtonGroup` | Raggruppamento pulsanti |
| `Table` | Tabella dati |
| `Tooltip` | Tooltip informativi |
| `LoadingState` | Stato di caricamento |
| `EmptyState` | Stato tabella vuota |
| `SearchBar` | Barra di ricerca |
| `Spinner` | Indicatore di caricamento inline |
| `Alert` | Messaggi success/error/warning |
| `Modal` | Dialoghi modali |
| `Pagination` | Componente paginazione |
| `FormLabel` | Label per campi form |
| `Collapse` | Sezioni collapsibili |
| `Logo` | Visualizzazione logo evento |

---

## Stili Admin

**File:** `src/Admin.css`

La classe `admin` viene aggiunta al `body` all'ingresso nelle pagine admin e rimossa all'uscita (tramite `useEffect`).

**Override principali:**
- Variabili CSS `--bg-color` e `--primary-color` impostate a colori neutri
- Styling completo per tabelle (header, body, righe alternate)
- Styling per `ButtonGroup`
- `max-width` container aumentato a `1536px`
- Font size aumentato del 12.5%

---

## Flussi operativi

### Creazione di un nuovo evento

1. L'admin naviga a `/admin/create-event`
2. Compila il form nel tab "Info evento"
3. Clicca "Salva info evento"
4. API: POST `/events/create` con FormData
5. In caso di successo: redirect automatico a `/admin/event/{newEventId}`
6. Ora sono disponibili i tab "Listini prezzi" (e condizionatamente gli altri)

---

### Modifica di un evento esistente

1. L'admin clicca l'icona ingranaggio nella lista eventi
2. Naviga a `/admin/event/{eventId}`
3. `useEventData` esegue GET `/events/event/{eventId}`
4. Il form viene pre-popolato con i dati dell'evento
5. L'admin modifica i campi e clicca "Salva info evento"
6. API: PUT `/events/event/{id}`

---

### Gestione listini prezzi

1. L'admin accede al tab "Listini prezzi" (disponibile solo dopo la creazione dell'evento)
2. Aggiunge, modifica o rimuove listini e pacchetti
3. Clicca "Salva listini prezzi"
4. `handleSubmitPriceLists()` esegue in parallelo:
   - DELETE per i listini rimossi
   - POST per i nuovi listini
   - PUT per i listini modificati

---

### Upload partecipanti

1. L'admin accede al tab "Partecipanti" (visibile solo se `verifiedAttendanceEvent === true`)
2. Seleziona un file Excel (`.xlsx` / `.xls`, max 5MB)
3. Clicca "Carica sul server"
4. API: POST `/events/{eventId}/upload-attendees`
5. La tabella `PartecipantsTable` si aggiorna con la lista aggiornata

---

### Gestione pagamenti in sospeso

1. L'admin accede al tab "Pagamenti in sospeso"
2. Filtra i pagamenti per email o importo, naviga le pagine
3. Clicca "Gestisci" su un ordine
4. Nel modal: imposta uno sconto (preset o valore custom) e visualizza l'importo finale
5. Clicca "Pagato cash"
6. API: PUT `/orders/order/{orderId}/confirm-payment`
7. Il pagamento viene rimosso dalla tabella

---

### Eliminazione di un evento

1. L'admin clicca "Elimina evento" (in alto a destra nella pagina gestione evento)
2. Appare una finestra di conferma (`window.confirm`)
3. In caso di conferma: API DELETE `/events/event/{id}`
4. Redirect automatico a `/admin`
