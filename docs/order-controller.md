# Order Controller — Specifiche API

Tutte le rotte hanno base path `/order`.

---

## 1. Conferma pagamento esterno

**`PUT /order/:orderId/confirm-payment`**

Conferma un pagamento avvenuto fuori da Stripe (es. contanti, bonifico).
Aggiorna lo stato dell'ordine, sposta gli asset S3 dal bucket temporaneo a quello persistente e invia l'email di conferma all'utente.

**Autenticazione:** `verifyExternalPaymentToken`

### Path params

| Param | Tipo | Descrizione |
|-------|------|-------------|
| `orderId` | string | ID dell'ordine da confermare |

### Body (JSON)

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `amount` | number | Importo lordo |
| `discountPercent` | number | Percentuale di sconto applicata |
| `discountedAmount` | number | Importo dopo lo sconto |

### Risposta (successo)

```json
{
  "orderId": "...",
  "unmovedCount": 0,
  "paymentSaved": true
}
```

| Campo | Descrizione |
|-------|-------------|
| `orderId` | ID dell'ordine completato |
| `unmovedCount` | Numero di item S3 non spostati (0 = tutto ok) |
| `paymentSaved` | `true` se i dati Stripe sono stati salvati |

### Note
- Se Stripe restituisce errore nella creazione della fattura esterna, il flusso **non si blocca**: il pagamento viene comunque registrato come avvenuto.
- L'invio email è **non bloccante**: eventuali errori vengono solo loggati.

---

## 2. Avvia pagamento POS (reader Stripe Terminal)

**`POST /order/:orderId/reader-payment`**

Crea un PaymentIntent Stripe e lo invia al reader fisico indicato.

**Autenticazione:** `verifyOrganizationAdminToken`

### Path params

| Param | Tipo | Descrizione |
|-------|------|-------------|
| `orderId` | string | ID dell'ordine da pagare |

### Body (JSON)

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `amount` | number | Importo lordo |
| `discountPercent` | number | Percentuale di sconto |
| `discountedAmount` | number | Importo dopo lo sconto |
| `readerId` | string | ID del reader (DB interno) |

### Risposta (successo)

```json
{
  "paymentIntentId": "pi_...",
  "readerState": { ... }
}
```

| Campo | Descrizione |
|-------|-------------|
| `paymentIntentId` | ID del PaymentIntent creato su Stripe |
| `readerState` | Stato restituito da Stripe Terminal dopo l'invio al reader |

### Errori
- Reader non trovato nel DB → errore `400/500` con messaggio `"Reader non trovato"`.

---

## 3. Risultato pagamento POS (SSE)

**`POST /order/:orderId/reader-result`**

Apre una connessione **Server-Sent Events (SSE)** in ascolto sul risultato del pagamento POS. Il client resta connesso fino alla ricezione dell'evento relativo all'ordine.

**Autenticazione:** `verifyOrganizationAdminToken`

### Path params

| Param | Tipo | Descrizione |
|-------|------|-------------|
| `orderId` | string | ID dell'ordine in attesa di esito |

### Headers risposta

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

### Evento ricevuto

Quando il pagamento viene processato, il server invia un evento SSE con il payload dell'esito. Il formato dipende dal `responseSSE` configurato nell'applicazione.

### Note
- La connessione si chiude automaticamente se il client si disconnette.
- Il listener sull'EventBus viene rimosso alla disconnessione del client (`req.on('close', ...)`).

---

## 4. Annulla pagamento POS

**`DELETE /order/:orderId/payment/:paymentIntentId`**

Annulla un PaymentIntent su Stripe e aggiorna lo stato dell'ordine a `CANCELED` nel database.

**Autenticazione:** `verifyOrganizationAdminToken`

### Path params

| Param | Tipo | Descrizione |
|-------|------|-------------|
| `orderId` | string | ID dell'ordine da annullare |
| `paymentIntentId` | string | ID del PaymentIntent Stripe da annullare |

### Risposta (successo)

```json
{
  "paymentIntentId": "pi_...",
  "status": "canceled"
}
```

| Campo | Descrizione |
|-------|-------------|
| `paymentIntentId` | ID del PaymentIntent annullato |
| `status` | Stato del PaymentIntent restituito da Stripe (es. `"canceled"`) |
