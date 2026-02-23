# API — GET /event/:eventId/readers

Restituisce la lista dei reader associati a un evento, passando per le location collegate a quell'evento.

---

## Endpoint

```
GET /event/:eventId/readers
```

### Autenticazione

Richiede token admin valido nell'header `Authorization`.

---

## Path parameter

| Parametro | Tipo    | Obbligatorio | Descrizione          |
|-----------|---------|:------------:|----------------------|
| `eventId` | integer | si           | ID dell'evento       |

---

## Logica di esecuzione

```
eventId
  └─► checkEventOrganization()   // verifica che l'evento appartenga all'org dell'utente
        └─► getReadersByEvent()  // TerminalReader JOIN TerminalLocation WHERE location.eventId = eventId
              └─► risposta con lista reader (ognuno include la propria location)
```

---

## Risposta — successo `200`

```json
{
  "message": "Reader evento:42",
  "data": {
    "readers": [
      {
        "id": 1,
        "stripeReaderId": "tmr_xxxxxxxxxxxxxxxx",
        "label": "Cassa 1",
        "registrationCode": "simulated-wpe",
        "active": true,
        "hide": false,
        "terminalLocationId": 3,
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-06-01T08:30:00.000Z",
        "location": {
          "id": 3,
          "displayName": "Ingresso Nord"
        }
      },
      {
        "id": 2,
        "stripeReaderId": "tmr_yyyyyyyyyyyyyyyyyy",
        "label": "Cassa 2",
        "registrationCode": null,
        "active": true,
        "hide": false,
        "terminalLocationId": 3,
        "createdAt": "2024-01-15T10:05:00.000Z",
        "updatedAt": "2024-06-01T08:30:00.000Z",
        "location": {
          "id": 3,
          "displayName": "Ingresso Nord"
        }
      }
    ]
  }
}
```

### Campi del singolo reader

| Campo               | Tipo    | Descrizione                                      |
|---------------------|---------|--------------------------------------------------|
| `id`                | integer | ID interno del reader                            |
| `stripeReaderId`    | string  | ID reader su Stripe (es. `tmr_xxx`)              |
| `label`             | string  | Etichetta identificativa del reader              |
| `registrationCode`  | string\|null | Codice di registrazione usato (es. `simulated-wpe`) |
| `active`            | boolean | Se il reader è attivo                            |
| `hide`              | boolean | Sempre `false` (i reader nascosti vengono esclusi) |
| `terminalLocationId`| integer | FK verso la location di appartenenza             |
| `createdAt`         | string  | Timestamp di creazione (ISO 8601)                |
| `updatedAt`         | string  | Timestamp di ultima modifica (ISO 8601)          |
| `location.id`       | integer | ID della location associata                      |
| `location.displayName` | string | Nome visualizzato della location              |

---

## Risposta — nessun reader trovato `200`

Se l'evento non ha location associate, o le location non hanno reader, il campo `readers` è un array vuoto:

```json
{
  "message": "Reader evento:42",
  "data": {
    "readers": []
  }
}
```

---

## Risposte di errore

| Status | Caso                                                                 |
|--------|----------------------------------------------------------------------|
| `204`  | L'evento non esiste o non appartiene all'organizzazione dell'utente  |
| `401`  | Token mancante o non valido                                          |
| `500`  | Errore interno del server                                            |
