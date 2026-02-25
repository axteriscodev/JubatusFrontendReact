# Manuale Utente — Pannello Amministratore

**Piattaforma:** MyMemories
**Sezione:** Area Admin
**Versione:** 2.0 — Febbraio 2026

---

## Indice

1. [Accesso e navigazione](#1-accesso-e-navigazione)
2. [Dashboard](#2-dashboard)
3. [Elenco eventi](#3-elenco-eventi)
4. [Creazione e modifica di un evento](#4-creazione-e-modifica-di-un-evento)
   - 4.1 [Info evento](#41-info-evento)
   - 4.2 [Listini prezzi](#42-listini-prezzi)
   - 4.3 [Location e POS](#43-location-e-pos)
   - 4.4 [Partecipanti](#44-partecipanti)
   - 4.5 [Pagamenti in sospeso](#45-pagamenti-in-sospeso)
   - 4.6 [Eliminazione evento](#46-eliminazione-evento)
5. [Elenco Reader (POS)](#5-elenco-reader-pos)
6. [Dettaglio Reader](#6-dettaglio-reader)
7. [Elenco Location](#7-elenco-location)
8. [Livelli di accesso](#8-livelli-di-accesso)
9. [Note operative e comportamenti generali](#9-note-operative-e-comportamenti-generali)

---

## 1. Accesso e navigazione

### Come accedere

L'area admin è accessibile all'URL `/admin`. Solo gli utenti con ruolo amministratore possono accedere: qualsiasi tentativo da parte di utenti non autorizzati viene automaticamente reindirizzato alla home pubblica.

Gli utenti con ruolo admin vengono reindirizzati automaticamente al pannello al momento del login.

### Struttura dell'interfaccia

L'interfaccia è divisa in due aree:

- **Sidebar di navigazione** — colonna sinistra, collassabile
- **Area principale** — contenuto della pagina corrente

La sidebar può essere espansa o ridotta con il pulsante toggle presente al suo interno. Lo stato (espansa/ridotta) viene memorizzato nel browser e mantenuto anche alla riapertura.

### Menu di navigazione

| Voce di menu    | Destinazione              | Visibile a           |
|-----------------|---------------------------|----------------------|
| Dashboard       | `/admin`                  | Admin organizzazione |
| Elenco eventi   | `/admin/events`           | Tutti gli admin      |
| Elenco Reader   | `/admin/readers`          | Admin organizzazione |
| Elenco Location | `/admin/locations`        | Admin organizzazione |
| Logout          | Disconnessione e redirect | Tutti gli admin      |

> **Nota:** Gli admin con accesso limitato (livello 3) vedono solo la voce "Elenco eventi".

---

## 2. Dashboard

**URL:** `/admin`

Pagina di benvenuto del pannello admin. Mostra un testo introduttivo sulla piattaforma MyMemories. Non sono presenti azioni operative.

---

## 3. Elenco eventi

**URL:** `/admin/events`

Mostra la lista di tutti gli eventi configurati sulla piattaforma.

### Colonne della tabella

| Colonna       | Descrizione                                                         |
|---------------|---------------------------------------------------------------------|
| #             | Identificatore numerico interno dell'evento                         |
| Logo          | Immagine logo caricata per l'evento                                 |
| Nome          | Titolo dell'evento (dalla prima traduzione disponibile)             |
| Località      | Luogo dove si svolge l'evento                                       |
| Data evento   | Data dell'evento formattata in italiano                             |
| Data inizio   | Data di apertura delle vendite                                      |
| Data scadenza | Data di chiusura delle vendite                                      |
| Azioni        | Pulsanti accesso rapido                                             |

### Azioni per ogni riga

- **Icona impostazioni (⚙)** — apre la schermata di modifica dell'evento. Visibile solo se l'utente ha i permessi di gestione (`canManage !== false`).
- **Icona link esterno (↗)** — apre la pagina pubblica dell'evento in una nuova scheda del browser.

### Creare un nuovo evento

Cliccare il pulsante **"+ nuovo evento"** in alto a destra. Verrà aperta la schermata di creazione.

---

## 4. Creazione e modifica di un evento

**URL creazione:** `/admin/create-event`
**URL modifica:** `/admin/event/{eventId}`

È la schermata più articolata del pannello admin. Permette di configurare tutti gli aspetti di un evento tramite tab (schede). Alcune tab sono disponibili solo dopo il primo salvataggio.

### Tab disponibili e condizioni di visibilità

| Tab                  | Visibile quando                                                     |
|----------------------|---------------------------------------------------------------------|
| Info evento          | Sempre, anche per un evento nuovo                                   |
| Listini prezzi       | Solo dopo il primo salvataggio (evento ha un ID)                    |
| Location / POS       | Solo dopo il primo salvataggio (evento ha un ID)                    |
| Partecipanti         | Solo se l'evento ha "Accesso verificato" abilitato                  |
| Pagamenti in sospeso | Solo se l'evento ha pagamenti esterni configurati                   |

> Se l'evento viene caricato in modalità **sola lettura** (read-only), viene mostrata automaticamente solo la tab "Pagamenti in sospeso".

---

### 4.1 Info evento

Raccoglie i dati principali dell'evento ed è suddivisa in quattro sezioni.

#### Sezione: Dati generali

| Campo                     | Obbligatorio | Descrizione                                                                  |
|---------------------------|:------------:|------------------------------------------------------------------------------|
| Titolo evento             | Sì           | Nome dell'evento. Genera automaticamente lo slug/URL                        |
| URL (slug)                | —            | Calcolato dal titolo, non modificabile manualmente. Mostrato in grigio       |
| Località                  | No           | Indirizzo o città (es. "Milano, Via Roma 123")                               |
| Path S3                   | No           | Percorso cartella S3 per le immagini (es. "eventi/2026/gara1")               |
| Tipologia evento (Tag)    | No           | Categoria del contenuto (es. podio, arrivo, gara). Caricato da API           |
| Valuta                    | No           | Valuta usata nei listini prezzi. Caricata da API                             |
| Emoji attesa              | No           | Emoji decorativa associata all'evento (es. 🚴 🏃 ⚽)                         |
| Descrizione               | No           | Testo descrittivo lungo. Campo textarea con ridimensionamento verticale      |
| Accesso verificato        | No           | Checkbox. Se attivo, abilita la tab "Partecipanti" e la gestione numero chiuso |

> **Nota:** Lo slug viene generato automaticamente alla digitazione del titolo e non è modificabile in seguito.

#### Sezione: Date

| Campo                 | Descrizione                                                        |
|-----------------------|--------------------------------------------------------------------|
| Data evento           | Giorno in cui si svolge fisicamente l'evento                       |
| Data pubblicazione    | Data di apertura del negozio online (inizio vendite)               |
| Data scadenza         | Data di chiusura del negozio online (fine vendite)                 |
| Inizio preordini      | Data apertura anticipata per pre-ordini                            |
| Fine preordini        | Data chiusura pre-ordini                                           |

Le date principali (evento, pubblicazione, scadenza) sono evidenziate in blu, verde e rosso. Le date pre-ordini sono in giallo. Tutti i campi sono di tipo data (`YYYY-MM-DD`).

#### Sezione: Colori

Permette di personalizzare la palette cromatica della pagina pubblica dell'evento.

| Colore       | Icona          | Descrizione                                    |
|--------------|----------------|------------------------------------------------|
| Background   | Secchio vernice | Colore di sfondo della pagina evento           |
| Primario     | Stella          | Colore principale di pulsanti e accenti        |
| Secondario   | Goccia          | Colore complementare                           |

Ogni scheda mostra il valore esadecimale corrente. In fondo è presente una **anteprima palette** con i tre quadrati colorati affiancati. I colori si aggiornano in tempo reale al cambio.

#### Sezione: Logo

- Mostra l'anteprima del logo attuale (se presente).
- Se non è stato caricato alcun logo, viene mostrata un'immagine segnaposto.
- Il campo file accetta solo immagini (`image/*`).
- Quando si seleziona un nuovo file, l'anteprima si aggiorna immediatamente prima di salvare.

#### Salvare le info evento

Cliccare il pulsante **"Salva info evento"** in basso a destra.

- Se è un **nuovo evento**: viene creato e la pagina si aggiorna all'URL `/admin/event/{id}`. Si sbloccano le tab successive.
- Se è una **modifica**: i dati vengono aggiornati e viene mostrato un toast di conferma.

**Messaggi possibili:**

| Esito   | Messaggio                                             |
|---------|-------------------------------------------------------|
| Successo | "Info evento salvate con successo!"                  |
| Errore   | "Si è verificato un errore durante il salvataggio"   |

---

### 4.2 Listini prezzi

Disponibile dopo il primo salvataggio. Permette di definire le tipologie di prodotto acquistabili per l'evento (foto digitali, stampe, pacchetti, ecc.).

#### Struttura

Un evento può avere **più listini**, ciascuno valido per un periodo di tempo definito. Ogni listino contiene **uno o più pacchetti**.

```
Evento
 └── Listino 1 (es. "Early Bird", dal 01/03 al 31/03)
      ├── Pacchetto A: 5 foto → €15,00
      └── Pacchetto B: 10 foto + 1 video → €25,00 (-10%)
 └── Listino 2 (es. "Standard", dal 01/04 al 30/04)
      └── ...
```

#### Gestione dei listini

| Azione              | Comportamento                                                    |
|---------------------|------------------------------------------------------------------|
| **+ Nuovo listino** | Aggiunge un listino vuoto con un pacchetto vuoto già incluso     |
| **Elimina listino** | Rimuove l'intero listino. Disabilitato se è l'unico listino presente |

Ogni listino ha un **periodo di validità** con due campi data:
- **Data Inizio** — data di attivazione del listino
- **Data Fine** — data di scadenza del listino

#### Gestione dei pacchetti

Ogni pacchetto è composto da:

| Campo               | Tipo    | Descrizione                                                      |
|---------------------|---------|------------------------------------------------------------------|
| Label pacchetto     | Select  | Tipologia di prodotto (caricata da sistema). Mostra titolo e sottotitolo nella lingua configurata |
| Migliore offerta    | Checkbox | Se attivo, mostra il badge "Migliore Offerta" sul pacchetto     |
| Foto                | Numero  | Quantità di foto incluse nel pacchetto                           |
| Clip                | Numero  | Quantità di clip incluse                                         |
| Video               | Numero  | Quantità di video inclusi                                        |
| Prezzo              | Decimale| Prezzo base del pacchetto (es. `25.00`). Con simbolo valuta      |
| Sconto              | Numero  | Percentuale di sconto da applicare (0–100)                       |

**Anteprima prezzo finale** — Visibile se il prezzo è maggiore di 0:
- Mostra il prezzo originale barrato (se c'è uno sconto)
- Mostra il **prezzo finale** in grassetto verde
- Mostra il tag con la percentuale di sconto

> **Nota:** La valuta mostrata è quella selezionata nella tab "Info evento" e non può essere cambiata da questa schermata.

> **Nota:** Il pulsante "Elimina pacchetto" è disabilitato se il listino ha un solo pacchetto (obbligatorio mantenerne almeno uno).

#### Testi multi-lingua delle label

Se la label selezionata ha traduzioni configurate, è disponibile il pulsante **"Mostra testi"** che espande un pannello con il titolo e il sottotitolo nella lingua configurata per ogni paese.

#### Salvare i listini

Cliccare **"Salva listini prezzi"** in basso a destra. Il sistema sincronizza automaticamente le modifiche (crea i nuovi, aggiorna quelli modificati, elimina quelli rimossi).

| Esito   | Messaggio                                                    |
|---------|--------------------------------------------------------------|
| Successo | "Listini salvati con successo!"                             |
| Errore  | "Si è verificato un errore durante il salvataggio dei listini" |
| Anomalia | "Salva prima le info evento prima di poter gestire i listini" |

---

### 4.3 Location e POS

Disponibile dopo il primo salvataggio. Permette di associare le location fisiche e i reader POS Stripe all'evento, rendendoli operativi per raccogliere pagamenti.

#### Visualizzazione delle location associate

Per ogni location associata all'evento viene mostrata la lista dei reader POS collegati. Se non ci sono reader per una location, compare il testo "Nessun POS associato a questa location".

Se nessuna location è ancora associata all'evento, compare il messaggio "Nessuna location associata all'evento".

#### Aggiungere un reader POS a una location

1. Selezionare un reader dal dropdown (mostra solo i reader non ancora assegnati ad altri eventi).
2. Cliccare **"Aggiungi POS"**.
3. Il reader viene associato alla location selezionata per questo evento.

> Se non ci sono reader disponibili, il dropdown riporta "Nessun POS disponibile" ed è disabilitato.

#### Rimuovere un reader POS

Cliccare **"Rimuovi"** accanto al reader desiderato. L'associazione viene eliminata.

#### Creare e associare una nuova location

Se sono già presenti location, il form di creazione è collassato e si espande cliccando **"Crea nuova location"**. Se non ci sono location, il form è sempre visibile.

Campi del form:

| Campo              | Obbligatorio | Placeholder          | Default |
|--------------------|:------------:|----------------------|---------|
| Nome visualizzato  | Sì           | "Es. Sede Milano"    | —       |
| Indirizzo (line1)  | Sì           | "Es. Via Roma 10"    | —       |
| Città              | Sì           | "Es. Milano"         | —       |
| CAP                | Sì           | "Es. 20100"          | —       |
| Paese              | Sì           | "Es. IT" (max 2 car.)| IT      |
| Provincia / Stato  | No           | "Es. MI"             | —       |

Cliccare **"Crea e associa"** per creare la location e associarla immediatamente all'evento. Se i campi obbligatori non sono compilati, compare un avviso "Compila tutti i campi obbligatori".

**Messaggi possibili:**

| Operazione         | Esito    | Messaggio                                          |
|--------------------|----------|----------------------------------------------------|
| Aggiungi POS       | Successo | "POS associato all'evento"                         |
| Aggiungi POS       | Errore   | "Errore nel riassegnamento del POS alla location"  |
| Rimuovi POS        | Successo | "POS eliminato dall'evento"                        |
| Rimuovi POS        | Errore   | "Errore nella cancellazione del pos alla location" |
| Crea location      | Successo | "Location creata e associata all'evento"           |
| Crea location      | Errore   | "Errore nella creazione della location"            |

---

### 4.4 Partecipanti

Disponibile solo se l'evento ha la modalità **"Accesso verificato"** attiva (checkbox in Info evento). Serve per caricare la lista delle email dei partecipanti autorizzati ad acquistare.

#### Upload lista partecipanti

1. Cliccare il campo file.
2. Selezionare un file Excel (`.xlsx` o `.xls`).
3. Se il file è valido, il nome appare evidenziato in verde.
4. Cliccare **"Carica sul server"**.

**Validazioni client-side prima dell'invio:**

| Validazione       | Messaggio di errore                                              |
|-------------------|------------------------------------------------------------------|
| Formato non valido | "Formato file non valido. Seleziona un file Excel (.xlsx o .xls)" |
| File troppo grande | "Il file è troppo grande. Dimensione massima: 5MB"               |

**Messaggi di esito:**

| Esito   | Messaggio                              |
|---------|----------------------------------------|
| Successo | "File caricato con successo!"         |
| Errore  | "Errore durante il caricamento: {dettaglio}" |

Gli alert possono essere chiusi con il pulsante X.

#### Tabella partecipanti

Dopo il caricamento, la lista email viene mostrata in tabella con le seguenti funzionalità:

| Funzionalità    | Descrizione                                                     |
|-----------------|-----------------------------------------------------------------|
| Ricerca         | Barra di ricerca per filtrare le email (filtro locale istantaneo) |
| Contatore       | Mostra "X/Y partecipanti" (trovati / totale)                    |
| Pulisci         | Pulsante per svuotare la ricerca                                |
| Aggiorna        | Ricarica la lista dal server                                    |

**Stati della tabella:**

| Condizione                         | Visualizzato                                                         |
|------------------------------------|----------------------------------------------------------------------|
| Nessun partecipante caricato       | "Nessun partecipante caricato — Carica un file Excel per visualizzare i partecipanti" |
| Ricerca senza risultati            | "Nessun risultato trovato per \"{termine ricercato}\""              |
| Lista presente                     | Tabella con colonne # ed Email                                       |

---

### 4.5 Pagamenti in sospeso

Disponibile solo se l'evento ha pagamenti esterni configurati. Permette di visualizzare e gestire gli ordini il cui pagamento non è ancora stato completato.

#### Tabella ordini

La tabella mostra gli ordini in attesa con le seguenti colonne:

| Colonna    | Descrizione                                                 |
|------------|-------------------------------------------------------------|
| #          | Numero di riga (relativo alla pagina corrente)              |
| Ordine     | ID ordine                                                   |
| Email      | Email del cliente                                           |
| Importo    | Importo con simbolo della valuta                            |
| Contenuti  | Elenco dei file inclusi nell'ordine (es. "2 foto, 1 video") |
| Azioni     | Pulsante "Gestisci"                                         |

#### Filtri

| Filtro  | Tipo   | Descrizione                        |
|---------|--------|------------------------------------|
| Email   | Testo  | Filtra per indirizzo email         |
| Importo | Numero | Filtra per importo esatto (€0.01)  |

Cliccare **"Applica"** per attivare i filtri (la lista riparte da pagina 1). Cliccare **"Reset"** per rimuovere i filtri e ricaricare.

#### Paginazione

- Dropdown **"Righe per pagina"** con opzioni: 5, 10, 25, 50.
- Navigazione pagine tramite pulsanti.
- Paginazione e dropdown disabilitati durante il caricamento.

#### Aggiornamento in tempo reale

La tabella si aggiorna automaticamente tramite una connessione **SSE (Server-Sent Events)** quando un pagamento POS viene completato sul terminale fisico. Non è necessario ricaricare manualmente.

Il pulsante **"Aggiorna"** permette comunque di forzare un ricaricamento manuale.

#### Gestire un pagamento ("Gestisci")

Cliccando **"Gestisci"** su un ordine si apre la **modale di conferma pagamento**.

#### Modale di conferma pagamento

Mostra il riepilogo dell'ordine:

- Numero ordine
- Email cliente
- Importo totale
- Contenuti dell'ordine (file types e quantità)

**Sezione sconto (opzionale):**

È possibile applicare uno sconto prima di confermare il pagamento:

- **Preset rapidi:** 4 pulsanti con percentuali predefinite (5%, 10%, 15%, 20%). Cliccando di nuovo lo stesso pulsante, lo sconto viene rimosso.
- **Campo libero:** Input numerico da 0 a 100.

Se lo sconto è maggiore di 0, vengono mostrati in tempo reale:
- **Importo finale** (in verde, grassetto)
- **Risparmio** (in verde)

**Azioni nella modale:**

| Pulsante      | Condizione di visibilità        | Comportamento                                              |
|---------------|---------------------------------|------------------------------------------------------------|
| **Annulla**   | Sempre                          | Chiude la modale senza modifiche                           |
| **Paga POS**  | Solo se l'evento ha reader POS  | Apre la modale POS per pagamento tramite terminale fisico  |
| **Pagato cash** | Sempre                        | Conferma il pagamento manuale con eventuale sconto         |

#### Pagamento tramite POS (POSModal)

Si apre dopo aver cliccato "Paga POS". Il flusso si svolge in tre passi:

**Passo 1 — Selezione reader:**

Viene mostrata la lista dei reader disponibili per l'evento. Per ogni reader:
- Label (es. "Cassa 1")
- Location associata
- Importo da addebitare (con eventuale sconto applicato)

Cliccare sul reader desiderato per procedere.

> Se non ci sono reader attivi, compare "Nessun reader disponibile".

**Passo 2 — Invio in corso:**

Spinner + messaggio "Invio pagamento al reader {label}...". Non è possibile interagire.

**Passo 3 — Attesa conferma:**

Il terminale fisico mostra la richiesta di pagamento al cliente. La modale mostra:

- Spinner di attesa
- "In attesa di conferma dal reader {label}. Il cliente può presentare la carta."
- Pulsante **"Annulla pagamento"** (cancella l'intent e torna al Passo 1)

**Passo 3 — Esiti:**

| Esito   | Icona           | Messaggio           | Azioni disponibili       |
|---------|-----------------|---------------------|--------------------------|
| Successo | ✓ verde (48px) | "Pagamento riuscito!" | "Chiudi"                |
| Errore  | ✗ rosso (48px)  | Testo errore dinamico | "Annulla" + "Riprova"   |

Il pulsante "Riprova" riporta al Passo 1 per selezionare di nuovo il reader.

**Titoli dinamici della modale POS:**

| Passo        | Titolo modale                     |
|--------------|-----------------------------------|
| Selezione    | "Pagamento POS — Seleziona reader" |
| Invio        | "Pagamento POS — Invio in corso"  |
| Attesa       | "Pagamento POS — In attesa..."    |
| Completato   | "Pagamento POS — Completato"      |
| Errore       | "Pagamento POS — Errore"          |

**Messaggio in caso di errore di salvataggio:**

"Impossibile salvare il pagamento. Riprova più tardi."

**Stato della tabella quando vuota:**

"Nessun pagamento in sospeso — Tutti i pagamenti sono stati confermati"

---

### 4.6 Eliminazione evento

In fondo alla schermata di modifica è presente il pulsante **"Elimina evento"**.

- Viene richiesta una **conferma** tramite dialogo di sistema prima di procedere.
- L'operazione è **irreversibile**: l'evento viene eliminato definitivamente insieme ai suoi dati.
- Dopo l'eliminazione si viene reindirizzati alla lista eventi.

---

## 5. Elenco Reader (POS)

**URL:** `/admin/readers`

Gestisce i terminali di pagamento fisici Stripe Terminal Reader.

### Colonne della tabella

| Colonna         | Descrizione                                              |
|-----------------|----------------------------------------------------------|
| #               | Identificatore interno del reader                        |
| Label           | Nome personalizzato (es. "Cassa 1")                      |
| Stripe ID       | Identificatore Stripe del reader (es. `tmr_xxx`)         |
| Location        | Location fisica associata al reader                      |
| Evento corrente | Evento attualmente collegato al reader, o "-"            |
| Stato           | Badge **Attivo** (verde) / **Disattivo** (grigio)        |
| Azioni          | Pulsante impostazioni per accedere al dettaglio          |

### Azioni disponibili

- **Icona impostazioni (⚙)** — apre il dettaglio del reader
- **"+ nuovo reader"** — apre la modale di registrazione/importazione
- **"+ nuova location"** — apre la modale di creazione location

### Aggiungere un reader

Cliccando **"+ nuovo reader"** si apre una modale con due schede.

#### Scheda "Registrazione Reader" — per reader nuovi

Per registrare un terminale fisico non ancora configurato su Stripe:

| Campo                   | Obbligatorio | Placeholder              | Descrizione                                   |
|-------------------------|:------------:|--------------------------|-----------------------------------------------|
| Label                   | Sì           | "Es. Cassa 1"            | Nome personalizzato del reader                |
| Codice di registrazione | Sì           | "Es. present-rattle-solve" | Codice visualizzato sul display del reader  |
| Location                | Sì           | "Seleziona una location..." | Location a cui associare il reader. Formato: "{Nome} — {Città}" |

Cliccare **"Salva"**. Durante il salvataggio il pulsante mostra "Salvataggio...".

> Durante il caricamento delle location viene mostrato uno spinner "Caricamento location...".

#### Scheda "Reader già registrato" — importazione

Per importare un reader già presente su Stripe Dashboard:

| Campo                   | Obbligatorio | Placeholder              |
|-------------------------|:------------:|--------------------------|
| Stripe Reader ID        | Sì           | "Es. tmr_xxx"            |
| Codice di registrazione | Sì           | "Es. simulated-wpe"      |
| Label                   | No           | "Es. Cassa 1"            |

Cliccare **"Importa"**. Durante l'operazione il pulsante mostra "Importazione...".

In entrambi i casi, al completamento la modale si chiude e la lista reader si aggiorna automaticamente.

---

## 6. Dettaglio Reader

**URL:** `/admin/readers/{readerId}`

Mostra e permette di modificare le informazioni di un singolo reader POS.

### Informazioni visualizzate

| Informazione       | Modificabile | Note                                               |
|--------------------|--------------|----------------------------------------------------|
| ID reader          | No           | Identificatore interno                             |
| Stato              | Sì           | Badge + pulsante toggle                            |
| Label              | Sì           | Modificabile inline                                |
| Stripe ID          | No           | In formato monospazio                              |
| Evento corrente    | No           | Titolo evento associato, o "-" se non assegnato    |
| Nome location      | No           | Nome visualizzato della location associata         |
| Stripe Location ID | No           | ID Stripe della location, in formato monospazio    |
| Stato location     | No           | "Attiva" o "Disattiva"                             |
| Indirizzo          | No           | Via della location                                 |
| Città              | No           | Città della location                               |
| CAP / Provincia    | No           | CAP e sigla provincia (separati da " - ")          |

### Modificare la label

1. Cliccare l'icona **matita (✏)** accanto al campo Label.
2. Il campo diventa un input editabile.
3. Modificare il testo.
4. Cliccare l'**icona di conferma (✓)** per salvare oppure l'**icona X** per annullare.
5. In alternativa: premere **Invio** per salvare, **Esc** per annullare.

Il pulsante di salvataggio non viene attivato se il campo è vuoto o se il testo è identico a quello corrente.

### Attivare / Disattivare un reader

Il pulsante in alto nella schermata cambia in base allo stato attuale:

| Stato attuale | Testo pulsante     | Colore bordo |
|---------------|--------------------|--------------|
| Attivo        | "Disattiva reader" | Rosso        |
| Disattivo     | "Riattiva reader"  | Verde        |

Durante l'operazione il pulsante mostra "Aggiornamento..." ed è disabilitato. Un reader disattivato non può elaborare pagamenti, ma rimane visibile nella lista. L'operazione è reversibile.

### Tornare alla lista

Cliccare il link **"← Readers"** in alto a sinistra (breadcrumb).

---

## 7. Elenco Location

**URL:** `/admin/locations`

Gestisce le location Stripe Terminal, ovvero i punti vendita fisici dove operano i reader POS.

### Colonne della tabella

| Colonna         | Descrizione                                               |
|-----------------|-----------------------------------------------------------|
| #               | Identificatore interno della location                     |
| Stripe ID       | Identificatore location su Stripe                         |
| Nome            | Nome visualizzato della location                          |
| Indirizzo       | Via e numero civico                                       |
| Città           | Città della location                                      |
| Paese           | Codice paese (es. IT)                                     |
| Evento associato | Evento collegato alla location, o "-"                    |
| Default         | Indica se è la location predefinita ("Si" / "No")         |
| N° Reader       | Numero di reader POS registrati in questa location        |

### Creare una nuova location

Cliccare **"+ nuova location"** in alto a destra per aprire la modale.

| Campo              | Obbligatorio | Placeholder       | Default | Note              |
|--------------------|:------------:|-------------------|---------|-------------------|
| Nome visualizzato  | Sì           | "Es. Sede Milano" | —       | —                 |
| Indirizzo          | Sì           | "Es. Via Roma 10" | —       | —                 |
| Città              | Sì           | "Es. Milano"      | —       | —                 |
| CAP                | Sì           | "Es. 20100"       | —       | —                 |
| Paese              | Sì           | "Es. IT"          | IT      | Massimo 2 caratteri |
| Provincia / Stato  | No           | "Es. MI"          | —       | Opzionale         |

Cliccare **"Salva"** per creare la location. La lista si aggiorna automaticamente.

---

## 8. Livelli di accesso

Il pannello admin supporta due livelli di accesso.

### Admin organizzazione (livello 1 o 2)

Accesso completo a tutte le funzionalità:

- Dashboard
- Creazione, modifica ed eliminazione di eventi
- Gestione listini prezzi
- Gestione partecipanti (numero chiuso)
- Gestione reader POS e location
- Gestione pagamenti in sospeso
- Pagamento tramite POS fisico

### Admin limitato (livello 3)

Accesso ristretto:

- Solo **Elenco eventi**: visualizzazione e modifica degli eventi assegnati
- Nessun accesso a reader, location e dashboard

---

## 9. Note operative e comportamenti generali

| Argomento               | Dettaglio                                                                                                      |
|-------------------------|----------------------------------------------------------------------------------------------------------------|
| **Slug evento**         | Generato automaticamente dal titolo al momento della creazione. Non modificabile in seguito.                   |
| **Valuta evento**       | Selezionata in fase di creazione. Non modificabile dalla schermata listini.                                    |
| **Colori evento**       | Si aggiornano in anteprima in tempo reale durante la selezione, prima di salvare.                             |
| **Persistenza sessione**| Il token di autenticazione è memorizzato nel browser. Usare sempre **Logout** per disconnettersi in modo sicuro.|
| **Aggiornamenti SSE**   | La schermata "Pagamenti in sospeso" si aggiorna in tempo reale. Non è necessario ricaricare la pagina.         |
| **Eliminazioni**        | Sono permanenti e richiedono conferma. Valgono per: eventi, partecipanti, listini, pacchetti, reader POS da un evento. |
| **Reader disattivati**  | Rimangono visibili nella lista ma non possono elaborare pagamenti fino alla riattivazione.                     |
| **Sidebar collassata**  | Lo stato (espansa/ridotta) viene memorizzato in `localStorage` e ripristinato alla riapertura.                 |
| **Modali form**         | Tutte le modali (reader, location) azzerano il form alla riapertura.                                           |
| **Feedback operazioni** | Le operazioni di salvataggio mostrano toast colorati (verde = successo, rosso = errore) nell'angolo dello schermo. |
| **Almeno 1 listino**    | Non è possibile eliminare il listino se è l'unico presente per l'evento.                                       |
| **Almeno 1 pacchetto**  | Non è possibile eliminare il pacchetto se è l'unico presente nel listino.                                      |
