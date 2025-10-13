import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  EventStatus,
  getPersonalEventGalleries,
} from "../utils/contents-utils";
import { Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import GalleryCard from "../components/GalleryCard";
import { logOut } from "../utils/auth";
import { apiRequest } from "../services/api-services";
import { useTranslations } from "../features/TranslationProvider";

/**
 * Componente LogoutButton
 *
 * Pulsante riutilizzabile per il logout dell'utente
 * Evita duplicazione del codice tra diversi stati del componente
 *
 * @param {Function} onLogout - Callback da eseguire al click
 */
const LogoutButton = ({ onLogout }) => (
  <div className="d-flex justify-content-end my-sm">
    <Button onClick={onLogout} variant="outline-danger" size="sm">
      <i className="bi bi-box-arrow-right"></i> Logout
    </Button>
  </div>
);

/**
 * Componente PersonalArea
 *
 * Visualizza l'area personale dell'utente autenticato con la lista degli eventi
 * della sua libreria. Gestisce il caricamento, gli errori e la navigazione verso
 * i dettagli degli eventi in base al loro stato.
 *
 * Stati gestiti:
 * - Loading: Mostra uno spinner durante il caricamento
 * - Error: Mostra un messaggio di errore con possibilità di retry
 * - Empty: Nessun evento trovato
 * - Success: Lista di eventi con gallerie
 */
export default function PersonalArea() {
  const navigate = useNavigate();
  const { t } = useTranslations();
  // Stati del componente
  const [galleries, setGalleries] = useState([]); // Array di gallerie eventi
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [error, setError] = useState(null); // Messaggio di errore

  /**
   * Carica gli eventi dalla libreria personale dell'utente
   * Effettua una chiamata API autenticata e formatta i dati ricevuti
   */
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null); // Reset dell'errore precedente

      // Chiamata API autenticata per recuperare gli eventi
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/library/fetch",
        method: "GET",
        needAuth: true, // Richiede autenticazione
      });

      // Verifica la risposta della richiesta
      if (!response.ok) {
        throw new Error("Errore nel caricamento degli eventi");
      }

      const eventsData = await response.json();

      // Formatta e salva i dati nello stato
      prepareContent(eventsData.data);
    } catch (err) {
      console.error("Errore nel caricamento:", err);
      setError(err.message); // Salva il messaggio di errore
    } finally {
      setLoading(false); // Fine del caricamento in ogni caso
    }
  };

  /**
   * Effect per caricare gli eventi all'mount del componente
   */
  useEffect(() => {
    loadEvents();
  }, []); // Dependency array vuoto = esegue solo al mount

  /**
   * Prepara e formatta i dati degli eventi ricevuti dall'API
   * Valida che i dati siano un array e li trasforma nel formato corretto
   *
   * @param {Array} data - Dati grezzi degli eventi dall'API
   */
  const prepareContent = (data) => {
    // Validazione del formato dati
    if (!Array.isArray(data)) {
      console.error("I dati non sono un array:", data);
      setError("Formato dati non valido");
      return;
    }

    // Trasforma i dati usando la utility function
    const formattedGalleries = getPersonalEventGalleries(data);
    setGalleries(formattedGalleries);
  };

  /**
   * Gestisce il logout dell'utente
   * Effettua il logout e reindirizza alla pagina di login
   */
  const handleLogout = () => {
    logOut(); // Rimuove i dati di autenticazione
    navigate("/", { replace: true }); // Reindirizza senza salvare nella history
  };

  /**
   * Gestisce la navigazione verso i dettagli di un evento
   * La route di destinazione dipende dallo stato dell'evento:
   * - "onlyPurchased" / "mixed": Route personale con contenuti acquistati
   * - "onlySearched": Route pubblica dell'evento
   *
   * @param {number} eventId - ID dell'evento da visualizzare
   */
  const navigateToDetail = (eventId) => {
    // Trova l'evento selezionato (usando === per strict equality)
    const event = galleries.find((item) => item.id === eventId);

    if (event) {
      // Naviga verso route diverse in base allo stato dell'evento
      switch (event.status) {
        case EventStatus.ONLY_PURCHASED: // Solo contenuti acquistati
        case EventStatus.MIXED: // Mix di contenuti acquistati e non
          navigate(`/personal/${event.slug}`);
          break;
        case EventStatus.ONLY_SEARCHED: // Solo contenuti cercati/preview
          navigate(`/event/${event.slug}/${event.hashId}`);
          break;
        default:
          break;
      }
    }
  };

  const navigateToNewSearch = (eventId) => {
    // Trova l'evento selezionato (usando === per strict equality)
    const event = galleries.find((item) => item.id === eventId);
    navigate(`/event/${event.slug}`);
  };

  const navigateToShop = (eventId) => {
    // Trova l'evento selezionato (usando === per strict equality)
    const event = galleries.find((item) => item.id === eventId);
    navigate(`/event/${event.slug}/${event.hashId}`);
  };

  // ============================================
  // RENDERING CONDIZIONALE (Multiple Returns)
  // ============================================

  /**
   * STATO DI LOADING
   * Mostra uno spinner centrato mentre i dati vengono caricati
   */
  if (loading) {
    return (
      <>
        <div className="container text-center mt-5">
          <h1 className="my-sm mt-lg">{t("PERSONAL_TITLE")}</h1>
          <Spinner animation="border" variant="light" />
          <p className="text-white mt-3">Caricamento eventi...</p>
        </div>
      </>
    );
  }

  /**
   * STATO DI ERRORE
   * Mostra un alert con il messaggio di errore e un pulsante per riprovare
   */
  if (error) {
    return (
      <div className="container mt-5">
        <h1 className="my-sm mt-lg">{t("PERSONAL_TITLE")}</h1>
        <Alert variant="danger">
          <Alert.Heading>Errore</Alert.Heading>
          <p>{error}</p>
          <Button
            variant="outline-danger"
            onClick={loadEvents} // Riprova la chiamata API senza ricaricare la pagina
          >
            Riprova
          </Button>
        </Alert>
      </div>
    );
  }

  /**
   * STATO EMPTY
   * Nessun evento trovato nella libreria dell'utente
   */
  if (galleries.length === 0) {
    return (
      <div className="container">
        <h1 className="my-sm mt-lg">{t("PERSONAL_TITLE")}</h1>
        <LogoutButton onLogout={handleLogout} />
        <div className="text-center mt-5">
          <p className="text-white">Nessun evento trovato nella tua libreria</p>
        </div>
      </div>
    );
  }

  /**
   * RENDERING PRINCIPALE
   * Mostra la griglia di gallerie eventi
   */
  return (
    <div className="container">
      {/* Header con pulsante logout */}
      <LogoutButton onLogout={handleLogout} />
      <h1 className="my-sm mt-lg">{t("PERSONAL_TITLE")}</h1>

      {/* Griglia di gallerie eventi */}
      <Row>
        <Col lg={8} xl={6} className="mx-auto">
          {galleries.map((gallery) => (
            <GalleryCard
              key={gallery.id}
              title={gallery.title}
              logo={gallery.logo}
              images={gallery.images}
              totalImages={gallery.totalImages}
              eventId={gallery.id}
              eventStatus={gallery.status}
              onPhotoClick={navigateToDetail} // Callback per la navigazione
              onNewSearchClick={navigateToNewSearch}
              onGoToShop={navigateToShop}
            />
          ))}
        </Col>
      </Row>
    </div>
  );
}
