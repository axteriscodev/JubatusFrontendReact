# Terminal API — Documentazione per il Client

> **Base path:** `/terminal`
> **Autenticazione:** tutte le route richiedono un **Admin JWT** nell'header `Authorization: Bearer <token>`.

---

## Indice

1. [Locations](#1-locations)
   - [GET /terminal/locations](#11-get-terminallocations)
   - [POST /terminal/locations](#12-post-terminallocations)
2. [Readers](#2-readers)
   - [GET /terminal/readers](#21-get-terminalreaders)
   - [GET /terminal/readers/with-events](#22-get-terminalreaderswith-events)
   - [POST /terminal/readers](#23-post-terminalreaders)
   - [PUT /terminal/readers/:readerId/location](#24-put-terminalreadersreaderidlocation)
3. [Associazione Evento ↔ Reader](#3-associazione-evento--reader)
   - [GET /terminal/events/:eventId/readers](#31-get-terminaleventseventidreaders)
   - [POST /terminal/events/:eventId/readers/:readerId](#32-post-terminaleventseventidreadersreaderid)
   - [DELETE /terminal/events/:eventId/readers/:readerId](#33-delete-terminaleventseventidreadersreaderid)
4. [Pagamento POS](#4-pagamento-pos)
   - [POST /terminal/payment](#41-post-terminalpayment)
   - [POST /terminal/payment/:paymentIntentId/capture](#42-post-terminalpaymentpaymentintentidcapture)
   - [DELETE /terminal/payment/:paymentIntentId](#43-delete-terminalpaymentpaymentintentid)
5. [Simulazione (solo sviluppo)](#5-simulazione-solo-sviluppo)
   - [POST /terminal/readers/:readerId/simulate-card](#51-post-terminalreadersreaderidsimulate-card)

---

## 1. Locations

### 1.1 GET /terminal/locations

Restituisce tutte le location attive con i rispettivi reader associati.

**Request**
```
GET /terminal/locations
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "status": 200,
  "message": "Lista location",
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
            "hide": false
          }
        ]
      }
    ]
  }
}
```

---

### 1.2 POST /terminal/locations

Crea una nuova location su Stripe e la salva nel database.

**Request**
```
POST /terminal/locations
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "displayName": "Sede Milano",
  "address": {
    "line1": "Via Roma 10",
    "city": "Milano",
    "state": null,
    "country": "IT",
    "postalCode": "20100"
  }
}
```

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `displayName` | string | ✅ | Nome visualizzato della location |
| `address.line1` | string | ✅ | Via e numero civico |
| `address.city` | string | ✅ | Città |
| `address.country` | string | ✅ | Codice paese ISO 3166-1 alpha-2 (es. `IT`) |
| `address.postalCode` | string | ✅ | CAP |
| `address.state` | string | ❌ | Provincia / Stato (opzionale) |

**Response 200**
```json
{
  "status": 200,
  "message": "Location creata",
  "data": {
    "location": {
      "id": 2,
      "stripeLocationId": "tml_yyy",
      "displayName": "Sede Milano",
      "addressLine1": "Via Roma 10",
      "city": "Milano",
      "state": null,
      "country": "IT",
      "postalCode": "20100",
      "hide": false,
      "createdAt": "2025-06-01T09:00:00.000Z",
      "updatedAt": "2025-06-01T09:00:00.000Z"
    }
  }
}
```

---

## 2. Readers

### 2.1 GET /terminal/readers

Restituisce tutti i reader attivi con la location associata.

**Request**
```
GET /terminal/readers
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "status": 200,
  "message": "Lista reader",
  "data": {
    "readers": [
      {
        "id": 1,
        "stripeReaderId": "tmr_xxx",
        "label": "Cassa 1",
        "registrationCode": "present-rattle-solve",
        "terminalLocationId": 1,
        "hide": false,
        "location": {
          "id": 1,
          "displayName": "Sede Milano",
          "city": "Milano",
          "country": "IT"
        }
      }
    ]
  }
}
```

---

### 2.2 GET /terminal/readers/with-events

Restituisce tutti i reader attivi con la location e gli eventuali eventi associati.

**Request**
```
GET /terminal/readers/with-events
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "status": 200,
  "message": "Lista reader con eventi",
  "data": {
    "readers": [
      {
        "id": 1,
        "stripeReaderId": "tmr_xxx",
        "label": "Cassa 1",
        "terminalLocationId": 1,
        "location": {
          "id": 1,
          "displayName": "Sede Milano"
        },
        "events": [
          {
            "id": 42,
            "slug": "concerto-estate-2025",
            "dateEvent": "2025-07-15T20:00:00.000Z",
            "dateStart": "2025-07-15T18:00:00.000Z",
            "dateExpiry": "2025-07-15T23:00:00.000Z"
          }
        ]
      }
    ]
  }
}
```

> Se il reader non è associato a nessun evento, `events` sarà un array vuoto `[]`.

---

### 2.3 POST /terminal/readers

Registra un nuovo reader su Stripe e lo salva nel database, associandolo a una location esistente.

**Request**
```
POST /terminal/readers
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "locationId": 1,
  "label": "Cassa 1",
  "registrationCode": "present-rattle-solve"
}
```

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `locationId` | integer | ✅ | ID della location nel database (non l'ID Stripe) |
| `label` | string | ✅ | Etichetta descrittiva del reader |
| `registrationCode` | string | ✅ | Codice di registrazione mostrato sul display del reader fisico |

**Response 200**
```json
{
  "status": 200,
  "message": "Reader registrato",
  "data": {
    "reader": {
      "id": 3,
      "stripeReaderId": "tmr_zzz",
      "label": "Cassa 1",
      "registrationCode": "present-rattle-solve",
      "terminalLocationId": 1,
      "hide": false,
      "createdAt": "2025-06-01T09:30:00.000Z",
      "updatedAt": "2025-06-01T09:30:00.000Z"
    }
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 404 | `locationId` non trovato nel database |

---

### 2.4 PUT /terminal/readers/:readerId/location

Sposta un reader su una nuova location (aggiornamento sia su Stripe che nel database).

**Request**
```
PUT /terminal/readers/3/location
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "locationId": 2
}
```

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `readerId` (path) | integer | ✅ | ID del reader nel database |
| `locationId` (body) | integer | ✅ | ID della nuova location nel database |

**Response 200**
```json
{
  "status": 200,
  "message": "Location del reader aggiornata",
  "data": {
    "readerId": "3",
    "locationId": 2
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 404 | `readerId` o `locationId` non trovato nel database |

---

## 3. Associazione Evento ↔ Reader

> **Nota:** un reader può essere associato a **un solo evento alla volta**. Assegnare un reader già associato a un nuovo evento rimuove automaticamente l'associazione precedente.

### 3.1 GET /terminal/events/:eventId/readers

Restituisce tutti i reader associati a un determinato evento.

**Request**
```
GET /terminal/events/42/readers
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "status": 200,
  "message": "Reader dell'evento",
  "data": {
    "readers": [
      {
        "id": 1,
        "label": "Cassa 1",
        "stripeReaderId": "tmr_xxx",
        "location": {
          "id": 1,
          "displayName": "Sede Milano"
        }
      }
    ]
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 204 | L'evento non appartiene all'organizzazione dell'utente autenticato |

---

### 3.2 POST /terminal/events/:eventId/readers/:readerId

Associa un reader a un evento. Se il reader era già associato a un altro evento, quella associazione viene rimossa.

**Request**
```
POST /terminal/events/42/readers/1
Authorization: Bearer <token>
```

> Nessun body richiesto.

**Response 200**
```json
{
  "status": 200,
  "message": "Reader associato all'evento",
  "data": {
    "eventId": "42",
    "readerId": "1"
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 204 | L'evento non appartiene all'organizzazione dell'utente |
| 404 | `readerId` non trovato nel database |

---

### 3.3 DELETE /terminal/events/:eventId/readers/:readerId

Rimuove l'associazione tra un reader e un evento.

**Request**
```
DELETE /terminal/events/42/readers/1
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "status": 200,
  "message": "Reader rimosso dall'evento",
  "data": {
    "eventId": "42",
    "readerId": "1"
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 204 | L'evento non appartiene all'organizzazione dell'utente |

---

## 4. Pagamento POS

### Flusso tipico

```
1. POST /terminal/payment          → crea PaymentIntent + invia al reader
2. [il cliente presenta la carta sul reader fisico]
3. POST /terminal/payment/:id/capture  → cattura il pagamento autorizzato
```

Per annullare in qualsiasi momento prima della capture: `DELETE /terminal/payment/:id`.

---

### 4.1 POST /terminal/payment

Crea un `PaymentIntent` su Stripe e lo invia al reader specificato. Il reader mostrerà la schermata di pagamento al cliente.

**Request**
```
POST /terminal/payment
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "readerId": 1,
  "amountCents": 1500,
  "currency": "eur"
}
```

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `readerId` | integer | ✅ | ID del reader nel database |
| `amountCents` | integer | ✅ | Importo in centesimi (es. `1500` = €15,00) |
| `currency` | string | ❌ | Codice valuta ISO 4217, default `eur` |

**Response 200**
```json
{
  "status": 200,
  "message": "Pagamento inviato al reader",
  "data": {
    "paymentIntentId": "pi_3ABC123",
    "readerState": {
      "id": "tmr_xxx",
      "status": "online",
      "action": {
        "type": "process_payment_intent",
        "status": "in_progress",
        "process_payment_intent": {
          "payment_intent": "pi_3ABC123"
        }
      }
    }
  }
}
```

> Conservare `paymentIntentId` per le chiamate successive di capture o cancel.

**Errori**

| Codice | Causa |
|---|---|
| 404 | `readerId` non trovato nel database |

---

### 4.2 POST /terminal/payment/:paymentIntentId/capture

Cattura un `PaymentIntent` già autorizzato dal reader (il cliente ha presentato la carta con successo).

**Request**
```
POST /terminal/payment/pi_3ABC123/capture
Authorization: Bearer <token>
```

> Nessun body richiesto.

**Response 200**
```json
{
  "status": 200,
  "message": "Pagamento catturato",
  "data": {
    "paymentIntentId": "pi_3ABC123",
    "status": "succeeded"
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 400/402 | Il PaymentIntent non è in stato `requires_capture` (es. già catturato, annullato, o carta rifiutata) |

---

### 4.3 DELETE /terminal/payment/:paymentIntentId

Annulla un `PaymentIntent`. Può essere chiamato prima della presentazione della carta o dopo una presentazione fallita.

**Request**
```
DELETE /terminal/payment/pi_3ABC123
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "status": 200,
  "message": "Pagamento annullato",
  "data": {
    "paymentIntentId": "pi_3ABC123",
    "status": "canceled"
  }
}
```

---

## 5. Simulazione (solo sviluppo)

> ⚠️ **Questa API funziona esclusivamente in ambiente di test Stripe. Non usarla in produzione.**

### 5.1 POST /terminal/readers/:readerId/simulate-card

Simula la presentazione di una carta al reader (utile per test automatici senza hardware fisico).

**Request**
```
POST /terminal/readers/1/simulate-card
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "cardNumber": "4242424242424242"
}
```

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `readerId` (path) | integer | ✅ | ID del reader nel database |
| `cardNumber` (body) | string | ✅ | Numero carta di test Stripe (es. `4242424242424242` per successo) |

**Carte di test utili**

| Numero | Comportamento |
|---|---|
| `4242424242424242` | Pagamento approvato |
| `4000000000000002` | Carta rifiutata |
| `4000002500003155` | Richiede autenticazione 3DS |

**Response 200**
```json
{
  "status": 200,
  "message": "Carta simulata presentata",
  "data": {
    "result": {
      "id": "tmr_xxx",
      "action": {
        "type": "process_payment_intent",
        "status": "succeeded"
      }
    }
  }
}
```

**Errori**

| Codice | Causa |
|---|---|
| 404 | `readerId` non trovato nel database |

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
| 400 | Richiesta malformata o parametri non validi |
| 401 | Token assente o non valido |
| 404 | Risorsa non trovata |
| 500 | Errore interno del server |
