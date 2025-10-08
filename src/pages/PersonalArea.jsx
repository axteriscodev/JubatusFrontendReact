import { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslations } from "../features/TranslationProvider";
import { isAuthenticated } from "../utils/auth";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import GalleryCard from "../components/GalleryCard";
import { logOut } from "../utils/auth";
import { Button } from "react-bootstrap";
import { apiRequest } from "../services/api-services";

export default function PersonalArea() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await apiRequest({
          api: import.meta.env.VITE_API_URL + "/library/fetch",
          method: "GET",
          needAuth: true,
        });

        if (!response.ok) {
          throw new Error("Errore nel caricamento degli eventi");
        }

        const eventsData = await response.json();
        console.log("Dati ricevuti:", eventsData); // Debug
        prepareContent(eventsData.data);
        setError(null);
      } catch (err) {
        console.error("Errore nel caricamento:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const prepareContent = (data) => {
    // Verifica che data sia un array
    if (!Array.isArray(data)) {
      console.error("I dati non sono un array:", data);
      setError("Formato dati non valido");
      return;
    }

    // Mappa i dati assicurandoti che ogni gallery abbia le proprietà necessarie
    const formattedGalleries = data.map((event) => ({
      id: event.id || event.eventId,
      slug: event.slug,
      hasId: event.hashId,
      title: event.title || "",
      logo: event.logo || "",
      status: event.status,
      images:
        event.items.map((item) => ({
          src: item.isPurchased ? item.urlThumbnail : item.urlPreview,
          isVideo: item.fileTypeId === 2,
        })) || [],
      totalImages: event.totalItems || 0,
    }));

    console.log("Galleries formattate:", formattedGalleries); // Debug
    setGalleries(formattedGalleries);
  };

  const handleLogout = () => {
    logOut();
    navigate("/", { replace: true });
  };

  const navigateToDetail = (eventId) => {
    const event = galleries.find((item) => item.id == eventId);
    if (event) {
      switch (event.status) {
        case "onlyPurchased":
        case "mixed":
          navigate(`/personal/${event.slug}`);
          break;
        case "onlySearched":
          navigate(`/event/${event.slug}/${event.hasId}`);
          break;
        default:
          break;
      }
    }
  };

  // Stato di loading
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <Spinner animation="border" variant="light" />
        <p className="text-white mt-3">Caricamento eventi...</p>
      </div>
    );
  }

  // Stato di errore
  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">
          <Alert.Heading>Errore</Alert.Heading>
          <p>{error}</p>
          <Button
            variant="outline-danger"
            onClick={() => window.location.reload()}
          >
            Riprova
          </Button>
        </Alert>
      </div>
    );
  }

  // Nessun evento
  if (galleries.length === 0) {
    return (
      <div className="container">
        <div className="d-flex justify-content-end my-sm">
          <Button onClick={handleLogout} variant="outline-danger">
            <i className="bi bi-box-arrow-right"></i> Logout
          </Button>
        </div>
        <div className="text-center mt-5">
          <p className="text-white">Nessun evento trovato nella tua libreria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-end my-sm">
        <Button onClick={handleLogout} variant="outline-danger">
          <i className="bi bi-box-arrow-right"></i> Logout
        </Button>
      </div>

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
              onPhotoClick={navigateToDetail}
            />
          ))}
        </Col>
      </Row>
    </div>
  );
}
