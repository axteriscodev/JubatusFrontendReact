import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  EventStatus,
  getPersonalEventGalleries,
} from "@common/utils/contents-utils";
import Spinner from "@common/components/ui/Spinner";
import Alert from "@common/components/ui/Alert";
import Button from "@common/components/ui/Button";
import GalleryCard from "@common/components/GalleryCard";
import { logOut } from "@common/utils/auth";
import { apiRequest } from "@common/services/api-services";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { ROUTES } from "@/routes";

interface GalleryItem {
  id: number;
  title: string;
  logo: string;
  images: unknown[];
  totalImages: number;
  status: string;
  slug: string;
  hashId: string;
  preOrder: boolean;
  allPhotos: boolean;
}

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => (
  <div className="flex justify-end my-10">
    <Button onClick={onLogout} variant="outline" size="sm">
      <LogOut size={16} className="inline" /> Logout
    </Button>
  </div>
);

export default function PersonalArea() {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/library/fetch",
        method: "GET",
        needAuth: true,
      });

      if (!response.ok) {
        throw new Error("Errore nel caricamento degli eventi");
      }

      const eventsData = await response.json();
      prepareContent(eventsData.data);
    } catch (err) {
      console.error("Errore nel caricamento:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const prepareContent = (data: unknown) => {
    if (!Array.isArray(data)) {
      console.error("I dati non sono un array:", data);
      setError("Formato dati non valido");
      return;
    }

    const formattedGalleries = getPersonalEventGalleries(data) as GalleryItem[];
    setGalleries(formattedGalleries);
  };

  const handleLogout = () => {
    logOut();
    navigate(ROUTES.HOME, { replace: true });
  };

  const navigateToDetail = (eventId: number | string) => {
    const id = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
    const event = galleries.find((item) => item.id === id);

    if (event) {
      if (event.preOrder && event.allPhotos) {
        navigate(ROUTES.PERSONAL_EVENT(event.slug));
        return;
      }
      switch (event.status) {
        case EventStatus.ONLY_PURCHASED:
        case EventStatus.MIXED:
          navigate(ROUTES.PERSONAL_EVENT(event.slug));
          break;
        case EventStatus.ONLY_SEARCHED:
          navigate(ROUTES.EVENT_WITH_HASH(event.slug, event.hashId));
          break;
        default:
          break;
      }
    }
  };

  const navigateToNewSearch = (eventId: number | string) => {
    const id = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
    const event = galleries.find((item) => item.id === id);
    if (event) navigate(ROUTES.EVENT(event.slug));
  };

  if (loading) {
    return (
      <>
        <div className="text-center mt-5">
          <h1>{t("PERSONAL_TITLE")}</h1>
          <Spinner />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="mt-5">
        <h1>{t("PERSONAL_TITLE")}</h1>
        <Alert variant="danger">
          <p><strong>Errore</strong></p>
          <p>{error}</p>
          <Button
            variant="danger"
            onClick={loadEvents}
          >
            Riprova
          </Button>
        </Alert>
      </div>
    );
  }

  if (galleries.length === 0) {
    return (
      <div className="container">
        <h1 className="my-10 mt-30">{t("PERSONAL_TITLE")}</h1>
        <LogoutButton onLogout={handleLogout} />
        <div className="text-center mt-5">
          <p className="text-white">Nessun evento trovato nella tua libreria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <LogoutButton onLogout={handleLogout} />
      <h1 className="my-10 mt-30">{t("PERSONAL_TITLE")}</h1>

      <div className="container">
        <div className="max-w-4xl mx-auto">
          {galleries.map((gallery) => (
            <GalleryCard
              key={gallery.id}
              title={gallery.title}
              logo={gallery.logo}
              images={gallery.images as never}
              totalImages={gallery.totalImages}
              eventId={gallery.id}
              onPhotoClick={navigateToDetail}
              onNewSearchClick={navigateToNewSearch}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
