# Event API — Documentazione per il Client

> **Base path:** `/events`
> **Autenticazione:** le route contrassegnate con 🔒 richiedono un **Admin JWT** nell'header `Authorization: Bearer <token>`.

---

## Indice

1. [Lista eventi](#1-lista-eventi)
2. [Evento singolo](#2-evento-singolo)
3. [Pagamenti evento](#3-pagamenti-evento)
4. [Gestione evento](#4-gestione-evento)
   - [POST /create](#41-post-eventscreate)
   - [PUT /event/:eventId](#42-put-eventseventid)
   - [DELETE /event/:eventId](#43-delete-eventseventid)
5. [Location evento](#5-location-evento)
   - [GET /event/:eventId/locations](#51-get-eventseventidlocations)
6. [Listini evento](#6-listini-evento)
   - [POST /event-list/create](#61-post-eventsevent-listcreate)
   - [PUT /event-list/:eventListId](#62-put-eventsevent-listeventlistid)
   - [DELETE /event-list/:eventListId](#63-delete-eventsevent-listeventlistid)
7. [Valute](#7-valute)
8. [Label](#8-label)

---

## 1. Lista eventi

### GET /events/fetch 🔒

Restituisce la lista degli eventi visibili per l'organizzazione dell'utente autenticato. Include solo i campi base.

**Request**
```
GET /events/fetch
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "status": 200,
  "message": "Elenco eventi",
  "data": [
    {
      "id": 42,
      "slug": "concerto-estate-2025",
      "logo": "public/logos/1234567890_logo.png",
      "dateStart": "2025-07-15T18:00:00.000Z",
      "dateEvent": "2025-07-15T20:00:00.000Z",
      "dateExpiry": "2025-07-15T23:00:00.000Z",
      "canManage": true,
      "languages": [
        {
          "title": "Concerto Estate 2025",
          "location": "Arena di Verona",
          "description": "Gran concerto estivo",
          "emoji": "🎵"
        }
      ]
    }
  ]
}
```

| Campo | Tipo | Note |
|---|---|---|
| `id` | integer | ID evento |
| `slug` | string | Identificatore URL |
| `logo` | string | Percorso relativo del logo (stringa vuota se non presente) |
| `dateStart` | datetime | Inizio vendita |
| `dateEvent` | datetime | Data/ora dell'evento |
| `dateExpiry` | datetime | Fine vendita |
| `canManage` | boolean | `true` se l'utente ha almeno uno dei permessi di gestione |
| `languages[].title` | string | Titolo evento |
| `languages[].location` | string | Luogo evento |
| `languages[].description` | string | Descrizione |
| `languages[].emoji` | string | Emoji associata |

> `canManage` è `true` se l'utente ha `canManageEvents`, `canManageExternalPayments` o `canManagePayments`.

---

## 2. Evento singolo

### GET /events/event/:eventId 🔒

Restituisce i dettagli completi di un evento. La risposta varia in base ai permessi dell'utente:
- `eventData` → restituito se l'utente ha `canManageEvents`
- `externalPayment` → restituito se l'utente ha `canManageExternalPayments`

**Request**
```
GET /events/event/42
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "status": 200,
  "message": "Evento id:42",
  "data": {
    "eventData": {
      "id": 42,
      "slug": "concerto-estate-2025",
      "logo": "public/logos/1234567890_logo.png",
      "backgroundColor": "#1a1a2e",
      "primaryColor": "#e94560",
      "secondaryColor": "#0f3460",
      "verifiedAttendanceEvent": false,
      "dateEvent": "2025-07-15T20:00:00.000Z",
      "datePreorderStart": null,
      "datePreorderExpiry": null,
      "dateStart": "2025-07-15T18:00:00.000Z",
      "dateExpiry": "2025-07-15T23:00:00.000Z",
      "pathS3": "events/concerto-estate-2025",
      "active": true,
      "languages": [
        {
          "title": "Concerto Estate 2025",
          "location": "Arena di Verona",
          "description": "Gran concerto estivo",
          "emoji": "🎵"
        }
      ],
      "tag": {
        "tag": "sport",
        "bibNumber": false
      },
      "currency": {
        "currency": "EUR",
        "symbol": "€"
      },
      "lists": [
        {
          "id": 10,
          "dateStart": "2025-07-01T00:00:00.000Z",
          "dateExpiry": "2025-07-15T23:59:00.000Z",
          "active": true,
          "items": [
            {
              "id": 20,
              "quantityPhoto": 10,
              "quantityVideo": 2,
              "quantityClip": 1,
              "price": 2500,
              "discount": 0,
              "bestOffer": false,
              "labelId": 3,
              "title": "Pacchetto Base",
              "subTitle": "10 foto + 2 video"
            }
          ]
        }
      ]
    },
    "externalPayment": {
      "data": [...],
      "pagination": { "total": 5, "page": 1, "limit": 5, "totalPages": 1 }
    }
  }
}
```

> Se l'utente non ha `canManageEvents`, `eventData` è `null`.
> Se l'utente non ha `canManageExternalPayments`, `externalPayment` è `null`.

**Errori**

| Codice | Causa |
|---|---|
| 204 | L'evento non appartiene all'organizzazione dell'utente |

---

## 3. Pagamenti evento

### GET /events/event/:eventId/payments 🔒

Restituisce la lista paginata dei pagamenti/ordini di un evento con filtri opzionali.

Richiede `canManageExternalPayments` **oppure** `canManagePayments`.

**Request**
```
GET /events/event/42/payments?page=1&limit=10&paymentId=2
Authorization: Bearer <token>
```

**Query params**

| Parametro | Tipo | Default | Note |
|---|---|---|---|
| `page` | integer | `1` | Numero di pagina |
| `limit` | integer | `5` | Record per pagina |
| `email` | string | — | Filtra per email utente |
| `amount` | number | — | Filtra per importo esatto |
| `stateId` | integer | — | Filtra per stato ordine |
| `paymentId` | integer | `2` | Filtra per metodo di pagamento |

**Response 200**
```json
{
  "status": 200,
  "message": "Pagamenti evento:42",
  "data": {
    "data": [
      {
        "idOrdine": 101,
        "email": "utente@esempio.it",
        "firstname": null,
        "lastname": null,
        "amount": 2500,
        "currency": { "currency": "EUR", "symbol": "€" },
        "payment": { "payment": "Bonifico" },
        "state": { "state": "Completato" },
        "fileTypeCounts": [
          { "fileTypeId": 1, "fileTypeName": "Foto", "count": 10 },
          { "fileTypeId": 2, "fileTypeName": "Video", "count": 2 }
        ]
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 5,
      "totalPages": 5
    }
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 403 | L'utente non ha né `canManageExternalPayments` né `canManagePayments` |
| 204 | L'evento non appartiene all'organizzazione dell'utente |

---

## 4. Gestione evento

> Tutte le route di questa sezione richiedono il permesso `canManageEvents`.

### 4.1 POST /events/create 🔒

Crea un nuovo evento. La richiesta deve essere inviata come `multipart/form-data` per supportare il caricamento del logo.

**Request**
```
POST /events/create
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `title` | string | ✅ | Titolo evento |
| `location` | string | ✅ | Luogo evento |
| `description` | string | ✅ | Descrizione |
| `emoji` | string | ❌ | Emoji associata |
| `slug` | string | ✅ | Identificatore URL univoco |
| `tagId` | integer | ✅ | ID del tag |
| `currencyId` | integer | ✅ | ID della valuta |
| `backgroundColor` | string | ❌ | Es. `#1a1a2e` |
| `primaryColor` | string | ❌ | Es. `#e94560` |
| `secondaryColor` | string | ❌ | Es. `#0f3460` |
| `logo` | file | ❌ | Immagine `.jpg/.jpeg/.gif/.png` |
| `verifiedAttendanceEvent` | boolean | ❌ | Richiede verifica presenze |
| `dateEvent` | datetime | ✅ | Data/ora evento |
| `datePreorderStart` | string | ❌ | Inizio preordine (formato `DD/MM/YYYY`) |
| `datePreorderExpiry` | string | ❌ | Fine preordine (formato `DD/MM/YYYY`) |
| `dateStart` | datetime | ✅ | Inizio vendita |
| `dateExpiry` | datetime | ✅ | Fine vendita |
| `pathS3` | string | ❌ | Percorso bucket S3 |
| `active` | boolean | ❌ | Evento attivo |

**Response 200**
```json
{
  "status": 200,
  "message": "Elemento inserito:42",
  "data": {
    "id": 42,
    "slug": "concerto-estate-2025",
    "logo": "1234567890_logo.png",
    ...
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 403 | Permesso `canManageEvents` mancante |
| 422 | Esiste già un evento con lo stesso `slug` |

---

### 4.2 PUT /events/event/:eventId 🔒

Aggiorna un evento esistente. Stessa struttura di `/create` come `multipart/form-data`.

**Request**
```
PUT /events/event/42
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

> Stessi campi di [POST /events/create](#41-post-eventscreate).
> Il `logo` è opzionale: se omesso, il logo esistente rimane invariato.

**Response 200**
```json
{
  "status": 200,
  "message": "Elemento aggiornato:42",
  "data": {
    "id": 42,
    "slug": "concerto-estate-2025",
    ...
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 403 | Permesso `canManageEvents` mancante |
| 204 | L'evento non appartiene all'organizzazione dell'utente |

---

### 4.3 DELETE /events/event/:eventId 🔒

Elimina (soft-delete) un evento: imposta `hide: true` e `dateDel`. L'evento non sarà più visibile.

**Request**
```
DELETE /events/event/42
Authorization: Bearer <token>
```

> Nessun body richiesto.

**Response 200**
```json
{
  "status": 200,
  "message": "Elemento eliminato:42",
  "data": { ... }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 403 | Permesso `canManageEvents` mancante |
| 204 | L'evento non appartiene all'organizzazione dell'utente |

---

## 5. Location evento

### 5.1 GET /events/event/:eventId/locations 🔒

Restituisce tutte le location associate all'evento, ciascuna con i propri reader attivi.

**Request**
```
GET /events/event/42/locations
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "status": 200,
  "message": "Location evento:42",
  "data": {
    "locations": [
      {
        "id": 1,
        "stripeLocationId": "tml_xxx",
        "displayName": "Sede Milano",
        "addressLine1": "Via Roma 10",
        "city": "Milano",
        "state": null,
        "country": "IT",
        "postalCode": "20100",
        "hide": false,
        "createdAt": "2025-01-10T10:00:00.000Z",
        "updatedAt": "2025-01-10T10:00:00.000Z",
        "readers": [
          {
            "id": 1,
            "stripeReaderId": "tmr_xxx",
            "label": "Cassa 1",
            "registrationCode": "present-rattle-solve",
            "terminalLocationId": 1,
            "active": true,
            "hide": false,
            "createdAt": "2025-01-10T10:05:00.000Z",
            "updatedAt": "2025-01-10T10:05:00.000Z"
          }
        ]
      }
    ]
  }
}
```

> Se una location non ha reader attivi, `readers` è un array vuoto `[]`.

**Errori**

| Codice | Causa |
|---|---|
| 204 | L'evento non appartiene all'organizzazione dell'utente |

---

## 6. Listini evento

> Tutte le route di questa sezione richiedono il permesso `canManageEvents`.

### 6.1 POST /events/event-list/create 🔒

Crea un nuovo listino per un evento con i relativi item.

**Request**
```
POST /events/event-list/create
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "id": 42,
  "list": [
    {
      "dateStart": "2025-07-01T00:00:00.000Z",
      "dateExpiry": "2025-07-15T23:59:00.000Z",
      "active": true,
      "items": [
        {
          "quantityPhoto": 10,
          "quantityVideo": 2,
          "quantityClip": 1,
          "price": 2500,
          "discount": 0,
          "bestOffer": false,
          "labelId": 3
        }
      ]
    }
  ]
}
```

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `id` | integer | ✅ | ID dell'evento a cui associare il listino |
| `list[0].dateStart` | datetime | ✅ | Inizio validità listino |
| `list[0].dateExpiry` | datetime | ✅ | Fine validità listino |
| `list[0].active` | boolean | ✅ | Listino attivo |
| `list[0].items[].quantityPhoto` | integer | ✅ | Numero di foto incluse |
| `list[0].items[].quantityVideo` | integer | ✅ | Numero di video inclusi |
| `list[0].items[].quantityClip` | integer | ✅ | Numero di clip incluse |
| `list[0].items[].price` | integer | ✅ | Prezzo in centesimi |
| `list[0].items[].discount` | integer | ✅ | Sconto in centesimi (`0` = nessuno) |
| `list[0].items[].bestOffer` | boolean | ✅ | Evidenziato come miglior offerta |
| `list[0].items[].labelId` | integer | ✅ | ID della label descrittiva |

**Response 200**
```json
{
  "status": 200,
  "message": "Elemento inserito:10",
  "data": {
    "id": 10,
    "dateStart": "2025-07-01T00:00:00.000Z",
    "dateExpiry": "2025-07-15T23:59:00.000Z",
    "active": true,
    "eventId": 42
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 403 | Permesso `canManageEvents` mancante |
| 204 | L'evento (`id` nel body) non appartiene all'organizzazione dell'utente |

---

### 6.2 PUT /events/event-list/:eventListId 🔒

Aggiorna un listino esistente. Tutti gli item attuali vengono sostituiti con quelli passati nel body.

**Request**
```
PUT /events/event-list/10
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "list": [
    {
      "dateStart": "2025-07-01T00:00:00.000Z",
      "dateExpiry": "2025-07-20T23:59:00.000Z",
      "active": true,
      "items": [
        {
          "quantityPhoto": 20,
          "quantityVideo": 3,
          "quantityClip": 0,
          "price": 3500,
          "discount": 500,
          "bestOffer": true,
          "labelId": 3
        }
      ]
    }
  ]
}
```

> Stessa struttura di `list` descritta in [6.1](#61-post-eventsevent-listcreate).

**Response 200**
```json
{
  "status": 200,
  "message": "Elemento aggiornato:10",
  "data": {
    "id": 10,
    "dateStart": "2025-07-01T00:00:00.000Z",
    "dateExpiry": "2025-07-20T23:59:00.000Z",
    "active": true,
    "eventId": 42
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 403 | Permesso `canManageEvents` mancante |
| 204 | Il listino non esiste oppure l'evento associato non appartiene all'organizzazione |

---

### 6.3 DELETE /events/event-list/:eventListId 🔒

Elimina (soft-delete) un listino evento: imposta `hide: true`.

**Request**
```
DELETE /events/event-list/10
Authorization: Bearer <token>
```

> Nessun body richiesto.

**Response 200**
```json
{
  "status": 200,
  "message": "Elemento eliminato:10",
  "data": { ... }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 403 | Permesso `canManageEvents` mancante |
| 204 | Il listino non esiste oppure l'evento associato non appartiene all'organizzazione |

---

## 7. Valute

### GET /events/currency

Restituisce tutte le valute disponibili. Non richiede autenticazione.

**Request**
```
GET /events/currency
```

**Response 200**
```json
{
  "status": 200,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "currency": "EUR",
      "symbol": "€",
      "conversion": 1.0
    },
    {
      "id": 2,
      "currency": "USD",
      "symbol": "$",
      "conversion": 1.08
    }
  ]
}
```

---

## 8. Label

### GET /events/label/:type

Restituisce le label di un determinato tipo con le traduzioni. Non richiede autenticazione.

**Request**
```
GET /events/label/package
```

**Path params**

| Parametro | Tipo | Note |
|---|---|---|
| `type` | string | Tipologia di label da filtrare (es. `package`, `ticket`, ...) |

**Response 200**
```json
{
  "status": 200,
  "message": "OK",
  "data": [
    {
      "id": 3,
      "label": "base",
      "type": "package",
      "labelsLanguages": [
        {
          "languageId": 1,
          "title": "Pacchetto Base",
          "subtitle": "Ideale per iniziare"
        },
        {
          "languageId": 2,
          "title": "Basic Package",
          "subtitle": "Perfect to start"
        }
      ]
    }
  ]
}
```

---

## Note generali sugli errori

Tutti gli endpoint restituiscono errori nel formato standard:

```json
{
  "status": <codice_http>,
  "message": "<descrizione errore>"
}
```

| Codice | Significato |
|---|---|
| 200 | Operazione completata con successo |
| 204 | Risorsa non di pertinenza dell'organizzazione |
| 403 | Permesso insufficiente |
| 401 | Token assente o non valido |
| 422 | Validazione fallita (es. slug duplicato) |
| 500 | Errore interno del server |
