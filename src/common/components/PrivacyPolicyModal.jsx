import React from 'react';
import Modal from "./ui/Modal";
import Button from "./ui/Button";

const PrivacyPolicyModal = ({ show, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
    >
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>
          <h2 className="text-2xl font-bold">Informativa sulla Policy</h2>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="max-h-[70vh] overflow-y-auto">
        <div className="privacy-policy-content">
          <p className="effective-date">In vigore dal: 15/08/2023</p>

          <div className="intro-section">
            <p>
              Informativa ai sensi e per gli effetti degli artt. 13 del GDPR UE 2016/679 e della normativa 
              nazionale vigente, relativi alla tutela del trattamento dei dati personali.
            </p>
            <p>
              Benvenuto sulla nostra piattaforma per la fruizione di informazioni, servizi ed esperienze video 
              legate al mondo degli sport endurance.
            </p>
            <p>
              La presente Policy è volta ad illustrare le modalità e le finalità dei trattamenti di dati personali 
              effettuati da parte di <strong>Jubatus S.R.L.</strong>, in qualità di titolare del trattamento 
              (di seguito, "Jubatus" o il "Titolare" o "Jubatus S.R.L."), nell'erogazione dei servizi resi attraverso 
              il sito web <a href="https://www.jubatus.it">www.jubatus.it</a> (il "Sito").
            </p>
          </div>

          <section className="policy-section">
            <h3>1. Ambito di Applicazione</h3>
            <p>
              Ciascuna persona ha diritto alla protezione dei propri dati personali.
            </p>
            <p>
              Per tale motivo, Jubatus è da sempre fortemente impegnata a garantire il rispetto della riservatezza 
              degli interessati e del loro diritto ad essere adeguatamente informati in merito alla raccolta e alle 
              modalità di trattamento dei loro dati.
            </p>
            <p>
              I Servizi Jubatus sono stati quindi configurati, in ossequio al principio di necessità e di 
              proporzionalità, in maniera tale da ridurre al minimo la raccolta e l'utilizzo di dati identificativi 
              degli interessati, escludendone il trattamento in tutti i casi in cui gli scopi prefissati possano 
              essere realizzati mediante l'uso di dati anonimi o comunque secondo altre modalità.
            </p>
            <div className="info-box">
              <p>
                <strong>Nota importante:</strong> La presente Privacy Policy deve ritenersi riferita e quindi 
                applicabile unicamente ai Servizi Jubatus offerti dal Titolare, senza estendersi alle pagine o 
                ai siti accessibili mediante link a partire dai Servizi e gestiti da terze parti.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h3>2. Finalità e base giuridica del trattamento</h3>
            <p>
              I dati personali degli interessati sono trattati dal Titolare per le finalità di seguito specificate.
            </p>

            <div className="subsection">
              <h4>a) Per l'esecuzione del contratto</h4>
              <p>
                I dati dell'utente e delle persone da questo indicate saranno trattati da Jubatus per l'esecuzione 
                del rapporto contrattuale e l'erogazione dei Servizi forniti su richieste dell'utente.
              </p>
              <ul>
                <li>Gestire le operazioni di registrazione, autenticazione e accesso alla piattaforma</li>
                <li>Gestire le richieste di acquisto di beni o servizi offerti attraverso la piattaforma</li>
                <li>Gestire le operazioni di pagamento su richiesta dell'utente</li>
                <li>Gestire le interazioni dei Servizi con piattaforme di social network di terze parti</li>
                <li>L'emissione di documenti amministrativi, contabili e fiscali</li>
              </ul>
              <div className="legal-basis">
                <strong>Base giuridica:</strong> Art. 6, comma 1, lett. b) del GDPR - necessario per eseguire 
                un contratto
              </div>
            </div>

            <div className="subsection">
              <h4>b) Per l'adempimento di obblighi di legge</h4>
              <p>
                I dati dell'utente saranno trattati per l'adempimento di obblighi di legge, quali adempimenti 
                di natura fiscale connessi all'esecuzione del contratto.
              </p>
              <div className="legal-basis">
                <strong>Base giuridica:</strong> Art. 6, comma 1, lett. c) del GDPR - adempiere un obbligo legale
              </div>
            </div>

            <div className="subsection">
              <h4>c) Per finalità di marketing</h4>
              <p>
                Jubatus potrà trattare i dati dell'utente per l'invio di comunicazioni di natura commerciale e/o 
                per iniziative promozionali su propri prodotti e servizi.
              </p>
              <p>
                Previo espresso e specifico consenso dell'utente, Jubatus potrà utilizzare canali di comunicazione 
                automatizzati (es. SMS, e-mail, chiamate senza operatore, notifiche sull'App) per:
              </p>
              <ul>
                <li>Invitare a partecipare ad iniziative promozionali</li>
                <li>Programmi di fidelizzazione</li>
                <li>Iniziative con partner terzi</li>
                <li>Indagini di mercato e analisi del livello di soddisfazione</li>
              </ul>
              <div className="legal-basis">
                <strong>Base giuridica:</strong> Art. 6, comma 1, lett. f) (legittimo interesse) e lett. a) (consenso)
              </div>
              <div className="consent-info">
                Il consenso può essere revocato in qualsiasi momento scrivendo a <a href="mailto:info@jubatus.it">info@jubatus.it</a>
              </div>
            </div>

            <div className="subsection">
              <h4>d) Per finalità di profilazione</h4>
              <p>
                Previo espresso consenso, Jubatus potrà trattare i dati dell'utente per meglio comprendere le 
                sue abitudini ed interessi e offrire prodotti e servizi di gradimento. In particolare, in base 
                alla partecipazione a precedenti eventi, alla zona di residenza e alla navigazione, potrebbero 
                essere suggeriti eventi a cui partecipare.
              </p>
              <div className="legal-basis">
                <strong>Base giuridica:</strong> Art. 6, comma 1, lett. a) del GDPR - consenso
              </div>
            </div>

            <div className="subsection">
              <h4>e) Per finalità di comunicazione a terzi a scopo di marketing</h4>
              <p>
                Previo espresso consenso, Jubatus potrà comunicare alcuni dati dell'utente a organizzatori di 
                eventi e società partner per realizzare offerte d'interesse o vantaggiose.
              </p>
              <div className="consent-info">
                Il consenso può essere revocato in qualsiasi momento scrivendo a <a href="mailto:info@jubatus.it">info@jubatus.it</a>
              </div>
            </div>

            <div className="subsection">
              <h4>f) Per operazioni societarie</h4>
              <p>
                Jubatus potrà trasferire i dati degli interessati a soggetti risultanti da operazioni societarie 
                (fusioni, scissioni, incorporazioni, etc.) o a società che acquistano o prendono in affitto l'azienda.
              </p>
              <div className="legal-basis">
                <strong>Base giuridica:</strong> Art. 6, comma 1, lett. f) - legittimo interesse
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h3>3. Tipologia di dati trattati</h3>

            <div className="subsection">
              <h4>a) Dati di navigazione</h4>
              <p>
                I sistemi informatici acquisiscono, nel corso del loro normale esercizio, alcuni dati personali 
                la cui trasmissione è implicita nell'uso dei protocolli di comunicazione Internet:
              </p>
              <ul>
                <li>Indirizzi IP</li>
                <li>Nomi a dominio dei computer</li>
                <li>Indirizzi in notazione URI delle risorse richieste</li>
                <li>Orario della richiesta</li>
                <li>Metodo utilizzato nel sottoporre la richiesta al server</li>
                <li>Dimensione del file ottenuto in risposta</li>
                <li>Codice numerico indicante lo stato della risposta</li>
                <li>Parametri relativi al sistema operativo e all'ambiente informatico</li>
              </ul>
              <p>
                Tali dati vengono utilizzati al solo fine di ricavare informazioni statistiche anonime sull'uso 
                dei siti e per controllarne il corretto funzionamento.
              </p>
            </div>

            <div className="subsection">
              <h4>b) Dati forniti volontariamente dall'utente</h4>
              <p>
                Jubatus tratterà i dati personali forniti dall'utente al momento della registrazione o della 
                richiesta di uno specifico servizio:
              </p>
              <div className="data-list">
                <div><strong>Dati identificativi e di contatto:</strong> Nome, cognome, sesso, data di nascita, indirizzo, recapiti telefonici ed e-mail</div>
                <div><strong>Dati di pagamento e fatturazione:</strong> Dati relativi a carte di credito e altri sistemi di pagamento</div>
                <div><strong>Particolari categorie di dati:</strong> Dati personali relativi ad eventuali disabilità necessari per l'iscrizione in speciali sezioni o categorie</div>
                <div><strong>Informazioni personali pubblicate:</strong> Contenuti condivisi direttamente dall'interessato attraverso i Servizi</div>
              </div>
              <div className="info-box warning">
                <strong>Importante:</strong> Il conferimento dei dati personali rappresenta un requisito necessario 
                per l'erogazione dei Servizi. L'eventuale mancato conferimento potrebbe comportare l'impossibilità 
                di erogare i Servizi richiesti.
              </div>
            </div>

            <div className="subsection">
              <h4>c) Dati pubblici e riprese fotografiche</h4>
              <p>
                Il Sito svolge anche la funzione di aggregatore di riprese di manifestazioni sportive. I partecipanti 
                potrebbero essere ripresi mediante fotografie o video nel corso degli eventi.
              </p>
              <p>Jubatus tratta i dati personali connessi all'immagine dei partecipanti per:</p>
              <ul>
                <li>Documentare la manifestazione sportiva all'interno del Sito e dei Servizi</li>
                <li>Rendere disponibili le foto e i video sulla piattaforma per l'acquisto e la condivisione</li>
              </ul>
              <div className="info-box">
                <p>
                  L'interessato può inviare una richiesta scritta al Titolare per ottenere la rimozione della 
                  propria immagine dal Sito e dai Servizi.
                </p>
              </div>
            </div>

            <div className="subsection">
              <h4>d) Dati trasmessi da fornitori terzi</h4>
              <p>
                Jubatus potrà acquisire e trattare dati trasmessi, previa autorizzazione dell'interessato, 
                da terze parti che forniscono specifici servizi.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h3>4. Condivisione pubblica dei dati, social network e siti di terze parti</h3>
            <p>
              Il Sito e i Servizi Jubatus costituiscono una piattaforma di condivisione delle esperienze sportive.
            </p>
            <p>
              Utilizzando i Servizi nell'ambito di gare e manifestazioni sportive, l'utente sceglie di condividere 
              e rendere pubblica la propria partecipazione all'evento sportivo, consentendo l'accesso ai propri 
              dati di posizione (e ai tempi, velocità e distanze risultanti) a chiunque si colleghi al sito.
            </p>
            <div className="info-box warning">
              <strong>Attenzione:</strong> Valutare con cura i dati che si intende pubblicare e le conseguenze 
              sulla propria vita privata. In caso di dubbi, non pubblicare i dati o chiedere maggiori informazioni 
              a <a href="mailto:info@jubatus.it">info@jubatus.it</a>
            </div>
            <p>
              Ciascun utente può modificare liberamente le proprie preferenze ed impostazioni in tema di condivisione 
              di dati, creando un profilo pubblico, privato o ad accesso limitato.
            </p>
            <p>
              Il Sito offre la possibilità di condividere informazioni con i social network. I gestori di tali 
              servizi agiranno in qualità di autonomi titolari del trattamento.
            </p>
          </section>

          <section className="policy-section">
            <h3>5. Comunicazione dei dati personali a terzi</h3>
            <p>
              Nessun dato sarà oggetto di diffusione o comunicazione a terzi se non su espresso e specifico 
              consenso dell'interessato, fatta eccezione per i dati diffusi o condivisi dallo stesso utente 
              attraverso i Servizi Jubatus.
            </p>
            <p>
              Laddove la comunicazione a terzi fornitori, consulenti o partner dovesse essere necessaria per 
              l'erogazione dei Servizi, Jubatus provvederà alla nomina di questi ultimi quali responsabili 
              del trattamento ex art. 28 del Regolamento.
            </p>
            <div className="subsection">
              <h4>Fornitori di hosting</h4>
              <p>
                Per la conservazione dei dati, Jubatus si avvale dei servizi di hosting forniti da:
              </p>
              <ul>
                <li>AWS Amazon Web Services Inc</li>
                <li>Google Ireland Limited</li>
                <li>Webflow, Inc.</li>
              </ul>
              <p>I server sono localizzati all'interno dell'Unione Europea.</p>
            </div>
            <p>
              Gli interessati possono chiedere la lista completa dei responsabili del trattamento inviando 
              una richiesta a <a href="mailto:info@jubatus.it">info@jubatus.it</a>
            </p>
          </section>

          <section className="policy-section">
            <h3>6. Trasferimento dei dati personali al di fuori dello Spazio Economico Europeo</h3>
            <p>
              Jubatus potrà trasferire i dati anche verso Paesi terzi o organizzazioni internazionali al di 
              fuori dello Spazio Economico Europeo (EEA).
            </p>
            <p>
              Laddove la Commissione europea abbia riconosciuto che un Paese garantisce un adeguato livello 
              di protezione, i dati personali potranno essere trasferiti su tale base.
            </p>
            <p>
              Per i trasferimenti verso Paesi il cui livello di protezione non è stato riconosciuto, Jubatus 
              si baserà su:
            </p>
            <ul>
              <li>Clausole contrattuali standard approvate dalla Commissione europea</li>
              <li>Norme vincolanti di impresa</li>
              <li>Deroghe applicabili alla specifica situazione</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>7. Misure di sicurezza</h3>
            <p>
              Jubatus metterà in atto misure tecniche e organizzative adeguate per garantire un livello di 
              sicurezza adeguato al rischio in conformità agli articoli 32 e seguenti del Regolamento.
            </p>
            <ul>
              <li><strong>Pseudonimizzazione e cifratura:</strong> Protezione dei dati personali attraverso tecniche avanzate</li>
              <li><strong>Riservatezza e integrità:</strong> Capacità di assicurare su base permanente la sicurezza dei sistemi</li>
              <li><strong>Resilienza:</strong> Capacità di ripristinare tempestivamente la disponibilità dei dati</li>
              <li><strong>Test e verifiche:</strong> Procedure per testare e valutare regolarmente l'efficacia delle misure</li>
            </ul>
            <p>
              I servizi sono certificati secondo lo standard <strong>ISO 27001</strong>, garantendo la 
              riservatezza, l'integrità e la disponibilità dei sistemi informatici.
            </p>
          </section>

          <section className="policy-section">
            <h3>8. I diritti dell'interessato</h3>
            <p>
              Ai sensi del Regolamento, gli interessati possono esercitare i seguenti diritti nei confronti 
              di Jubatus:
            </p>
            <ul>
              <li><strong>Diritto di accesso:</strong> Ottenere informazioni sull'esistenza dei propri dati e sui trattamenti effettuati</li>
              <li><strong>Portabilità dei dati:</strong> Ricevere i propri dati in formato strutturato e leggibile</li>
              <li><strong>Rettifica:</strong> Ottenere la modifica e correzione dei dati inaccurati o incompleti</li>
              <li><strong>Cancellazione:</strong> Ottenere la cancellazione dei dati non necessari per le finalità</li>
              <li><strong>Limitazione:</strong> Ottenere la limitazione del trattamento in specifici casi</li>
              <li><strong>Opposizione:</strong> Opporsi all'ulteriore trattamento dei dati</li>
            </ul>
            <div className="contact-box">
              <h4>Come esercitare i tuoi diritti</h4>
              <p>Le richieste possono essere indirizzate a Jubatus attraverso:</p>
              <ul>
                <li>Il sito <a href="https://www.jubatus.it">jubatus.it</a>, sezione Privacy del proprio account</li>
                <li>Email: <a href="mailto:info@jubatus.it">info@jubatus.it</a></li>
              </ul>
              <p className="note">
                Le richieste via email dovranno essere corredate da una copia del documento di identità 
                per verificare l'identità del richiedente.
              </p>
            </div>
            <div className="info-box">
              <strong>Diritto di reclamo:</strong> L'interessato ha il diritto di presentare un reclamo al 
              Garante per la protezione dei dati personali - Piazza di Monte Citorio n. 121, 00186 ROMA - 
              Email: <a href="mailto:garante@gpdp.it">garante@gpdp.it</a>
            </div>
          </section>

          <section className="policy-section">
            <h3>9. Link ad altri siti web</h3>
            <p>
              Il Titolare non controlla né supervisiona il contenuto o le politiche di trattamento dei dati 
              personali dei siti web di terze parti accessibili attraverso i link contenuti nel Sito.
            </p>
            <p>
              Jubatus non potrà essere ritenuta responsabile dei trattamenti effettuati attraverso tali siti terzi.
            </p>
            <div className="info-box warning">
              <strong>Attenzione:</strong> Si invitano gli utenti a prestare la massima attenzione, prendendo 
              visione delle condizioni d'uso e delle privacy policy pubblicate sui portali visitati.
            </div>
            <p>
              Jubatus fornisce link a siti web di terze parti esclusivamente per facilitare la navigazione degli 
              utenti, senza alcuna raccomandazione o garanzia circa i loro contenuti o servizi.
            </p>
          </section>

          <section className="policy-section">
            <h3>10. Cookie</h3>
            <p>
              La normale navigazione all'interno delle pagine del Sito comporta l'installazione di piccole 
              stringhe di testo denominate cookie, il cui utilizzo è volto a:
            </p>
            <ul>
              <li>Garantire la normale funzionalità del Sito</li>
              <li>Offrire una migliore esperienza di navigazione</li>
            </ul>
            <div className="cookie-info">
              <p>
                Per maggiori informazioni, consulta la <strong>Cookie Policy</strong> predisposta dal Titolare.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h3>11. Minori</h3>
            <p>
              L'utilizzo dei Servizi Jubatus è riservato agli <strong>utenti maggiorenni</strong>.
            </p>
            <p>
              In caso di immagini di minori riprese nel corso di un evento sportivo, i diritti relativi 
              all'immagine del minore devono essere esercitati direttamente dal soggetto esercente la 
              potestà genitoriale.
            </p>
            <div className="info-box warning">
              <p>
                <strong>Segnalazione abusi:</strong> Eventuali abusi relativi al trattamento dei dati dei 
                minori possono essere segnalati a <a href="mailto:info@jubatus.it">info@jubatus.it</a> per 
                consentire ad Jubatus di assumere le misure appropriate, incluso il blocco immediato del 
                trattamento.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h3>12. Titolare del trattamento</h3>
            <div className="company-info">
              <p><strong>JUBATUS S.R.L.</strong></p>
              <p>Via Ugo Bassi 3, 47521 Cesena (FC)</p>
              <p>Email: <a href="mailto:info@jubatus.it">info@jubatus.it</a></p>
            </div>
          </section>

          <section className="policy-section">
            <h3>13. Modifiche a questa informativa</h3>
            <p>
              Il Titolare si riserva il diritto di apportare alla presente informativa tutte le modifiche e 
              gli aggiornamenti ritenuti opportuni o resi obbligatori dalle norme vigenti, a propria esclusiva 
              discrezione ed in qualunque momento.
            </p>
            <p>
              In tali occasioni gli Utenti saranno opportunamente informati delle modifiche apportate.
            </p>
          </section>

          <section className="policy-section">
            <h3>14. Riferimenti legali</h3>
            <div className="legal-reference">
              <p>
                <strong>Avviso agli Utenti europei:</strong> la presente informativa privacy è redatta in 
                adempimento degli obblighi previsti dall'art. 13 GDPR.
              </p>
              <p>
                Questa informativa privacy è esclusivamente riferibile al sito{' '}
                <a href="https://www.jubatus.it">www.jubatus.it</a>
              </p>
            </div>
          </section>

          <section className="policy-section highlighted">
            <h3>15. Annesso A</h3>
            <p className="annex-intro">
              Gentile atleta, la presente informativa è resa ai sensi dell'art. 13 del Regolamento UE 2016/679 
              da Jubatus S.R.L., in qualità di Titolare del trattamento, con riferimento ai trattamenti di dati 
              relativi al servizio di fornitura del video personalizzato della gara.
            </p>

            <div className="subsection">
              <h4>Categorie di dati personali trattati</h4>
              <p>
                Jubatus S.R.L. tratterà i dati personali al fine di erogarle il servizio di acquisto delle 
                foto/video della manifestazione sportiva che la ritraggono.
              </p>
              <p>In particolare, tratterà le seguenti tipologie di dati:</p>
              <ul>
                <li>Dati identificativi e di contatto</li>
                <li>Dati personali relativi a immagini e/o video prodotti durante la manifestazione</li>
                <li>Ove necessario, dati relativi al pagamento effettuato</li>
              </ul>
              <div className="info-box warning">
                <p>
                  <strong>Dati biometrici:</strong> Al fine di permettere l'individuazione delle foto, previo 
                  esplicito consenso, il Titolare potrà trattare dati biometrici acquisiti mediante un selfie 
                  fornito nel processo di acquisto.
                </p>
              </div>
            </div>

            <div className="subsection">
              <h4>Minori</h4>
              <p>
                In caso di partecipazione di un minore, i Servizi potranno essere richiesti esclusivamente da 
                un soggetto esercente la responsabilità genitoriale sul minore, il quale dovrà anche prestare 
                il consenso al trattamento dei Dati Particolari per conto del minore.
              </p>
            </div>

            <div className="subsection">
              <h4>Finalità e base giuridica</h4>
              
              <p><strong>a) Fornire il servizio di acquisto</strong></p>
              <p>
                Jubatus S.R.L. tratterà i Dati Personali per erogarle i Servizi e permetterle l'acquisto delle Foto.
              </p>
              <div className="legal-basis">
                <strong>Base giuridica:</strong> Art. 6, par. 1, lett. b) del Regolamento
              </div>
              <p>
                Per l'individuazione delle Foto/Video, previo esplicito consenso, potrà trattare i Dati Particolari 
                (dati biometrici).
              </p>
              <div className="legal-basis">
                <strong>Base giuridica:</strong> Art. 9, par. 2, lett. a) del Regolamento - consenso esplicito
              </div>
              <div className="consent-info">
                Il consenso può essere revocato in qualsiasi momento scrivendo a{' '}
                <a href="mailto:info@jubatus.it">info@jubatus.it</a>
              </div>

              <p><strong>b) Cessione dei dati ai partner per finalità di marketing</strong></p>
              <p>
                In alternativa al pagamento, Jubatus S.R.L. potrà offrire la possibilità di fruire dei Servizi 
                prestando consenso affinché comunichi i dati identificativi e di contatto ai partner per l'invio 
                di comunicazioni di marketing.
              </p>
              <div className="info-box">
                <p>
                  <strong>Nota:</strong> Tale consenso è facoltativo e non è condizione per la fruizione dei 
                  Servizi, sempre acquistabili mediante pagamento in denaro.
                </p>
              </div>
            </div>

            <div className="subsection">
              <h4>Conservazione</h4>
              <p>
                Nel rispetto dei principi di liceità, limitazione delle finalità e minimizzazione dei dati:
              </p>
              <ul>
                <li>
                  Il <strong>selfie</strong> utilizzato per l'individuazione delle Foto/Video sarà conservato 
                  per un massimo di <strong>14 mesi</strong> dalla data dell'evento sportivo
                </li>
                <li>
                  I <strong>dati biometrici</strong> trattati istantaneamente per le operazioni di riconoscimento 
                  <strong> non saranno conservati</strong>
                </li>
              </ul>
            </div>

            <div className="subsection">
              <h4>Diritti dell'interessato</h4>
              <p>
                In ogni momento, Lei potrà esercitare, ai sensi degli artt. 15-22 del Regolamento, i seguenti diritti:
              </p>
              <ul>
                <li>Conferma dell'esistenza e accesso ai dati personali</li>
                <li>Indicazioni su finalità, categorie di dati, destinatari e periodo di conservazione</li>
                <li>Rettifica e cancellazione dei dati</li>
                <li>Revoca del consenso in qualsiasi momento</li>
                <li>Limitazione del trattamento</li>
                <li>Portabilità dei dati</li>
              </ul>
              <div className="info-box">
                <p>
                  È possibile proporre eventuali reclami al <strong>Garante per la protezione dei dati personali</strong>
                </p>
              </div>
            </div>
          </section>

          <style jsx>{`
            .privacy-policy-content {
              font-family: 'Literata', 'Georgia', serif;
              color: #1a1a1a;
              line-height: 1.7;
            }

            .modal-title-custom {
              font-size: 1.8rem;
              font-weight: 800;
              color: #667eea !important;
              font-family: 'Playfair Display', serif;
              margin: 0;
            }

            .effective-date {
              font-size: 0.95rem;
              color: #6b7280;
              font-weight: 500;
              margin-bottom: 1.5rem;
            }

            .intro-section {
              background: #f8f9fa;
              padding: 1.5rem;
              border-radius: 12px;
              margin-bottom: 1.5rem;
              border-left: 4px solid #667eea;
            }

            .intro-section p {
              margin-bottom: 1rem;
              font-size: 0.95rem;
            }

            .intro-section p:last-child {
              margin-bottom: 0;
            }

            .policy-section {
              margin-bottom: 2rem;
            }

            .policy-section h3 {
              font-size: 1.3rem;
              font-weight: 700;
              color: #1f2937 !important;
              margin-bottom: 1rem;
              font-family: 'Work Sans', sans-serif;
              border-bottom: 2px solid #667eea;
              padding-bottom: 0.4rem;
            }

            .policy-section h4 {
              font-size: 1.05rem;
              font-weight: 600;
              color: #374151 !important;
              margin-top: 1.2rem;
              margin-bottom: 0.7rem;
              font-family: 'Work Sans', sans-serif;
            }

            .policy-section p {
              margin-bottom: 0.8rem;
              color: #374151;
              font-size: 0.95rem;
            }

            .policy-section ul {
              margin: 0.8rem 0 0.8rem 1.5rem;
              list-style-type: none;
            }

            .policy-section li {
              margin-bottom: 0.5rem;
              padding-left: 1.2rem;
              position: relative;
              color: #374151;
              font-size: 0.95rem;
            }

            .policy-section li:before {
              content: "→";
              position: absolute;
              left: 0;
              color: #667eea !important;
              font-weight: bold;
            }

            .subsection {
              margin: 1.5rem 0;
              padding: 1.2rem;
              background: #f9fafb;
              border-radius: 10px;
              border-left: 3px solid #10b981;
            }

            .legal-basis {
              background: #eff6ff;
              padding: 0.8rem 1.2rem;
              border-radius: 8px;
              margin: 0.8rem 0;
              border-left: 3px solid #3b82f6;
              font-family: 'Work Sans', sans-serif;
              font-size: 0.9rem;
            }

            .legal-basis strong {
              color: #1e40af;
            }

            .consent-info {
              background: #fef3c7;
              padding: 0.8rem 1.2rem;
              border-radius: 8px;
              margin: 0.8rem 0;
              border-left: 3px solid #f59e0b;
              font-family: 'Work Sans', sans-serif;
              font-size: 0.9rem;
            }

            .info-box {
              background: #e0e7ff;
              padding: 1.2rem;
              border-radius: 10px;
              margin: 1rem 0;
              border-left: 3px solid #667eea;
              font-size: 0.9rem;
            }

            .info-box.warning {
              background: #fee2e2;
              border-left-color: #ef4444;
            }

            .info-box strong {
              color: #4338ca;
              display: block;
              margin-bottom: 0.4rem;
            }

            .info-box.warning strong {
              color: #dc2626;
            }

            .data-list {
              display: flex;
              flex-direction: column;
              gap: 0.8rem;
              margin: 1rem 0;
            }

            .data-list div {
              background: white;
              padding: 1rem;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              font-size: 0.9rem;
            }

            .contact-box {
              background: #f9fafb;
              padding: 1.5rem;
              border-radius: 10px;
              border: 2px solid #e5e7eb;
              margin: 1.5rem 0;
            }

            .contact-box h4 {
              color: #667eea;
              margin-top: 0;
              margin-bottom: 0.8rem;
            }

            .contact-box .note {
              font-size: 0.85rem;
              color: #6b7280;
              font-style: italic;
              margin-top: 0.8rem;
            }

            .company-info {
              background: #f9fafb;
              padding: 1.2rem;
              border-radius: 10px;
              margin: 1rem 0;
              border-left: 3px solid #667eea;
              font-size: 0.95rem;
            }

            .cookie-info {
              background: #fef3c7;
              padding: 1.2rem;
              border-radius: 10px;
              margin: 1rem 0;
              text-align: center;
              border: 2px dashed #f59e0b;
              font-size: 0.9rem;
            }

            .legal-reference {
              background: #e0e7ff;
              padding: 1.5rem;
              border-radius: 10px;
              margin: 1rem 0;
              border: 2px solid #667eea;
              font-size: 0.9rem;
            }

            .policy-section.highlighted {
              border: 2px solid #667eea;
              background: #f8f9ff;
              padding: 1.5rem;
              border-radius: 12px;
            }

            .annex-intro {
              font-size: 1rem;
              font-style: italic;
              color: #4b5563;
              background: #f0f4ff;
              padding: 1.2rem;
              border-radius: 10px;
              margin-bottom: 1.5rem;
            }

            a {
              color: #667eea !important;
              text-decoration: none;
              font-weight: 500;
              transition: color 0.2s ease;
            }

            a:hover {
              color: #764ba2;
              text-decoration: underline;
            }

            strong {
              font-weight: 600;
              color: #1f2937;
            }

            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600&family=Work+Sans:wght@500;600;700&display=swap');
          `}</style>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PrivacyPolicyModal;