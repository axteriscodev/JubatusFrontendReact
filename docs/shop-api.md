# Shop API — Documentazione per il Client

> **Base path:** `/shop`
> **Autenticazione:** la route contrassegnata con 🔒 richiede un **Shop JWT** nell'header `Authorization: Bearer <token>`. Le altre route non richiedono autenticazione.

---

## Indice

1. [Flusso di acquisto](#1-flusso-di-acquisto)
2. [Crea ordine](#2-crea-ordine)
   - [POST /shop/create-order](#21-post-shopcreate-order)
3. [Sessione di pagamento Stripe](#3-sessione-di-pagamento-stripe)
   - [POST /shop/create-checkout-session](#31-post-shopcreate-checkout-session)
4. [Verifica stato pagamento](#4-verifica-stato-pagamento)
   - [GET /shop/session-status](#41-get-shopsession-status)
5. [Note generali sugli errori](#5-note-generali-sugli-errori)

---

## 1. Flusso di acquisto

```
                    ┌──────────────────────────────────────────┐
                    │  POST /shop/create-order                 │
                    │  → calcola prezzo lato server            │
                    └──────────────────┬───────────────────────┘
                                       │
                    ┌──────────────────▼───────────────────────┐
                    │  Ordine gratuito?  (amount === 0)        │
                    └──────────────────┬───────────────────────┘
                    isFree: true       │                 isFree: false
                         ┌────────────┘            ┌──────────────────────┐
                         ▼                         ▼                      │
              Flusso concluso           POST /shop/create-checkout-session │
              (nessun ulteriore        → sceglie metodo di pagamento       │
               step Stripe)            → riceve clientSecret               │
                                                   │                      │
                                       ┌───────────▼──────────────────┐   │
                                       │  Checkout Stripe embedded    │   │
                                       │  (gestito dal client)        │   │
                                       └───────────┬──────────────────┘   │
                                                   │                      │
                                       ┌───────────▼──────────────────┐   │
                                       │  GET /shop/session-status    │   │
                                       │  → conferma stato ordine     │   │
                                       └──────────────────────────────┘   │
```

### Stati dell'ordine

| `stateId` | Significato |
|---|---|
| Env `DB_VALUE_ORDER_STATE_SEND` | Ordine creato, in attesa di pagamento |
| Env `DB_VALUE_ORDER_STATE_PAYMENT_SUCCESS` | Pagamento riuscito |
| Env `DB_VALUE_ORDER_STATE_PAYMENT_FAILED` | Pagamento fallito / sessione aperta senza completamento |
| Env `DB_VALUE_ORDER_STATE_COMPLETED` | Ordine completato (contenuti consegnati) |
| Env `DB_VALUE_ORDER_STATE_CANCELED` | Ordine annullato (rollback in caso di errore) |

---

## 2. Crea ordine

### 2.1 POST /shop/create-order 🔒

Crea un nuovo ordine. Il prezzo del carrello viene **sempre ricalcolato lato server** — il campo `amount` inviato dal client viene ignorato e sostituito con il valore calcolato.

Se l'importo risultante è `0`, l'ordine viene completato immediatamente senza passare per Stripe (`isFree: true`).

**Request**
```
POST /shop/create-order
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "cart": {
    "searchId": 101,
    "eventId": 42,
    "amount": 2500,
    "allPhotos": false,
    "video": false,
    "items": [
      {
        "fileTypeId": 1,
        "keyOriginal": "events/slug/originals/foto1.jpg",
        "keyThumbnail": "events/slug/thumbnails/foto1.jpg",
        "keyPreview": "events/slug/previews/foto1.jpg",
        "keyPreviewTiny": "events/slug/preview-tiny/foto1.jpg",
        "keyCover": "events/slug/covers/foto1.jpg",
        "keyTiny": "events/slug/tiny/foto1.jpg"
      }
    ]
  },
  "lang": "it",
  "fullname": "Mario Rossi"
}
```

**Campi del body**

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `cart.searchId` | integer | ✅ | ID della ricerca utente (`UserSearch`) |
| `cart.eventId` | integer | ✅ | ID dell'evento |
| `cart.amount` | number | ✅ | Importo inviato dal client (viene ignorato: il server ricalcola) |
| `cart.allPhotos` | boolean | ✅ | `true` se l'acquisto include tutte le foto |
| `cart.video` | boolean | ✅ | `true` se l'acquisto include video |
| `cart.items` | array | ✅ | Contenuti selezionati (minimo 1) |
| `cart.items[].fileTypeId` | integer | ✅ | Tipo file: `1` = foto, `2` = video, `3` = clip |
| `cart.items[].keyOriginal` | string | ✅ | Chiave S3 del file originale |
| `cart.items[].keyThumbnail` | string | ✅ | Chiave S3 della thumbnail |
| `cart.items[].keyPreview` | string | ✅ | Chiave S3 della preview |
| `cart.items[].keyPreviewTiny` | string | ✅ | Chiave S3 della preview tiny |
| `cart.items[].keyCover` | string | ✅ | Chiave S3 della cover |
| `cart.items[].keyTiny` | string | ✅ | Chiave S3 dell'immagine tiny |
| `lang` | string | ✅ | Codice lingua (es. `it`, `en`) |
| `fullname` | string | ❌ | Nome completo dell'acquirente (usato per ordini gratuiti) |

---

**Response 200 — ordine a pagamento**

```json
{
  "status": 200,
  "message": "create-order",
  "data": {
    "orderId": 305,
    "isFree": false,
    "payments": [
      { "id": 1, "payment": "Carta di credito", "active": true },
      { "id": 2, "payment": "Bonifico bancario", "active": true }
    ]
  }
}
```

| Campo | Tipo | Note |
|---|---|---|
| `orderId` | integer | ID dell'ordine creato — conservarlo per il passo successivo |
| `isFree` | boolean | Sempre `false` in questo caso |
| `payments` | array | Metodi di pagamento attivi disponibili. Se l'utente **non è autenticato**, viene restituito solo il primo metodo |

---

**Response 200 — ordine gratuito**

```json
{
  "status": 200,
  "message": "free-order-completed",
  "data": {
    "clientSecret": "",
    "orderId": 306,
    "isFree": true,
    "payments": []
  }
}
```

> Se `isFree: true` il flusso termina qui: l'ordine è già stato completato, i contenuti sono stati processati e l'email di conferma inviata. Non chiamare `create-checkout-session`.

---

**Errori**

| Codice | Causa |
|---|---|
| 401 | Token mancante o non valido |
| 400 | Impossibile calcolare il prezzo del carrello (listino non trovato o dati incoerenti) |
| 404 | `searchId` non trovato |

---

## 3. Sessione di pagamento Stripe

### 3.1 POST /shop/create-checkout-session

Inizializza una sessione di pagamento Stripe Embedded per un ordine già creato. Da chiamare dopo aver ricevuto `orderId` da `create-order` e aver scelto il metodo di pagamento.

**Request**
```
POST /shop/create-checkout-session
Content-Type: application/json
```

```json
{
  "orderId": 305,
  "paymentId": 1,
  "lang": "it",
  "clientUrl": "https://tuodominio.it/checkout"
}
```

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `orderId` | integer | ✅ | ID dell'ordine ricevuto da `create-order` |
| `paymentId` | integer | ✅ | ID del metodo scelto dall'utente (da `payments[]` della risposta precedente) |
| `lang` | string | ✅ | Codice lingua |
| `clientUrl` | string | ✅ | URL del frontend a cui Stripe reindirizza dopo il pagamento (usata come `return_url`) |

---

**Response 200 — pagamento con Stripe (`paymentId: 1`)**

```json
{
  "status": 200,
  "message": "create-checkout-session",
  "data": {
    "clientSecret": "cs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "orderId": 305
  }
}
```

| Campo | Tipo | Note |
|---|---|---|
| `clientSecret` | string | Segreto da passare a `stripe.initEmbeddedCheckout({ clientSecret })` |
| `orderId` | integer | Conferma dell'ID ordine |

---

**Response 200 — metodo esterno (`paymentId !== 1`)**

```json
{
  "status": 200,
  "message": "create-checkout-session",
  "data": {
    "clientSecret": "",
    "orderId": 305
  }
}
```

> Se il metodo di pagamento è esterno (es. bonifico), `clientSecret` è una stringa vuota. Il client deve gestire il proprio flusso di conferma senza Stripe.

---

**Errori**

| Codice | Causa |
|---|---|
| 400 | Errore nell'aggiornamento del metodo di pagamento sull'ordine |
| 404 | `orderId` non trovato |

---

## 4. Verifica stato pagamento

### 4.1 GET /shop/session-status

Verifica l'esito della sessione Stripe e aggiorna lo stato dell'ordine. Va chiamato nella pagina di ritorno indicata come `clientUrl` in `create-checkout-session`.

**Request**
```
GET /shop/session-status?session_id=cs_live_xxx&order_id=305&lang=it
```

**Query params**

| Parametro | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `session_id` | string | ✅ | `session_id` ricevuto da Stripe nel redirect alla `return_url` |
| `order_id` | integer | ✅ | ID dell'ordine (passato nella `return_url` dal client) |
| `lang` | string | ✅ | Codice lingua |

---

**Response 200 — pagamento riuscito (`status: "complete"`)**

```json
{
  "status": 200,
  "message": "",
  "data": {
    "status": "complete",
    "fullname": "Mario Rossi"
  }
}
```

Internamente, il server esegue automaticamente:
- aggiornamento stato ordine a `PAYMENT_SUCCESS`
- attivazione utente se necessario
- invio email di conferma
- spostamento asset da storage temporaneo a permanente su S3

---

**Response 200 — pagamento fallito o sessione ancora aperta (`status: "open"`)**

```json
{
  "status": 200,
  "message": "",
  "data": {
    "status": "open",
    "fullname": null
  }
}
```

> Quando `status` è `"open"`, l'ordine viene marcato come `PAYMENT_FAILED`. Il client deve informare l'utente del fallimento e permettere di riprovare.

**Valori possibili di `status`**

| Valore | Significato |
|---|---|
| `"complete"` | Pagamento andato a buon fine |
| `"open"` | Sessione ancora aperta / pagamento fallito o annullato |
| `"expired"` | Sessione scaduta |

---

**Errori**

| Codice | Causa |
|---|---|
| 500 | Errore nel recupero dello stato da Stripe o nell'aggiornamento dell'ordine |

---

## 5. Note generali sugli errori

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
| 400 | Richiesta malformata o parametri non validi |
| 401 | Token mancante o non valido |
| 404 | Risorsa non trovata |
| 500 | Errore interno del server |

---

> **Endpoint deprecato:** `GET /shop/purchased-contents/:orderId` — rimosso dal luglio 2025. Non utilizzarlo in nuove integrazioni.
