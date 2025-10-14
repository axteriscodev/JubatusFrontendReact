import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Carousel from "react-bootstrap/Carousel";
import ImageGallery from "../components/ImageGallery";
import CustomLightbox from "../components/CustomLightbox";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { logOut } from "../utils/auth";

import { cartActions } from "../repositories/cart/cart-slice";
import { personalActions } from "../repositories/personal/personal-slice";
import { resetHeaderData } from "../utils/graphics";
import { useTranslations } from "../features/TranslationProvider";
import { apiRequest } from "../services/api-services";

export default function PersonalEventDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const purchasedItems = useSelector((state) => state.personal.purchased) ?? [];
  const { slug } = useParams();

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [personalSlice, setPersonalSlice] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [eventData, setEventData] = useState(null);
  const { t } = useTranslations();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        //setLoading(true);
        const response = await apiRequest({
          api: import.meta.env.VITE_API_URL + `/library/fetch/${slug}`,
          method: "GET",
          needAuth: true,
        });

        if (!response.ok) {
          throw new Error("Errore nel caricamento degli eventi");
        }

        const eventsData = await response.json();
        console.log("Dati ricevuti:", eventsData); // Debug
        if(eventsData.data.length > 0){
          const event = eventsData.data[0];
        //setError(null);
        setEventData(event);
        dispatch(
          personalActions.updatePurchased(
            event.items.filter((item) => item.isPurchased) || []
          )
        );
        }
      } catch (err) {
        console.error("Errore nel caricamento:", err);
        //setError(err.message);
      } finally {
        //setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // recuper dei contenuti
  useEffect(() => {
    resetHeaderData();
    //dispatch(fetchPurchased());
  }, []);

  // Calcola gli item non acquistati solo quando eventsData cambia
  const unpurchasedItems = useMemo(() => {
    if (!eventData || eventData.status === "onlyPurchased") {
      return [];
    }

    return (
      eventData.items.filter(
        (item) => item.isPurchased === false
      ) || []
    );
  }, [eventData]);

  const handleLogout = () => {
    logOut();
    navigate("/", { replace: true });
  };

  const handleBack = () => {
    navigate("/personal");
  };

  const handleGoToShop = () => {
    const slug = eventData.slug;
    const hashId = eventData.hashId;
    navigate(`/event/${slug}/${hashId}`);
  };

  const openLightbox = (
    images,
    startIndex = 0,
    select,
    actions,
    personalSlice
  ) => {
    setIndex(startIndex);
    setOpen(true);
    setSlides(images);
    setSelect(select);
    setActions(actions);
    setPersonalSlice(personalSlice);
  };

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between my-sm">
          <Button onClick={handleBack} variant="outline-light" size="sm">
            <i className="bi bi-arrow-left"></i>
          </Button>
          <Button onClick={handleLogout} variant="outline-danger">
            <i className="bi bi-box-arrow-right"></i> Logout
          </Button>
        </div>
        {purchasedItems?.length > 0 ? (
          <>
            <h2 className="my-sm">{t("PERSONAL_PURCHASE")}</h2>
            <div className="px-lg">
              <Carousel>
                {purchasedItems.map((image, i) => (
                  <Carousel.Item
                    key={`carousel_${Date.now()}_${
                      image.KeyTiny || image.keyThumbnail || i
                    }_${i}`}
                  >
                    <div
                      className={`carousel-square d-flex justify-content-center align-items-center ${
                        image.fileTypeId == 2 && image.urlCover ? "video" : ""
                      }`}
                      onClick={() =>
                        openLightbox(purchasedItems, i, false, true, true)
                      }
                    >
                      <img
                        src={
                          !image.fileTypeId || image.fileTypeId == 1
                            ? image.urlTiny || image.urlThumbnail || image.url
                            : image.urlCover || "/images/play-icon.webp"
                        }
                        className="img-fluid"
                        loading="lazy"
                        alt="..."
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </>
        ) : (
          <>
            <h2 className="my-sm">{t("PERSONAL_NOTHING")}</h2>
          </>
        )}
        {purchasedItems?.length > 0 && (
          <>
            <div className="mt-md">
              <ImageGallery
                images={purchasedItems}
                select={false}
                actions={true}
                highLightFavourite={true}
                highLightPurchased={true}
                personalSlice={true}
                onOpenLightbox={openLightbox}
              />
            </div>
          </>
        )}

        {/* Nuova gallery per items NON acquistati (solo se status === "mixed") */}
        {unpurchasedItems.length > 0 && (
          <>
<div className="d-flex justify-content-center mb-4">
  <div className="d-flex align-items-center gap-3">
    <h2 className="my-sm mt-lg">{t("PERSONAL_AVAILABLE")}</h2>
    <Button
      variant="link"
      className="text-white text-decoration-none p-0 ms-auto"
      onClick={() => handleGoToShop()}
    >
      <i className="bi bi-cart me-2 fs-3"></i>
    </Button>
  </div>
</div>
            <div className="mt-md">
              <ImageGallery
                images={unpurchasedItems}
                select={false}
                actions={true}
                highLightFavourite={false}
                highLightPurchased={false}
                personalSlice={false}
                onOpenLightbox={openLightbox}
                applyRedFilter={true}
              />
            </div>
          </>
        )}
      </div>

      {open && (
        <CustomLightbox
          open={open}
          slides={slides}
          index={index}
          setIndex={setIndex}
          select={select}
          actions={actions}
          addToCart={false}
          onClose={() => setOpen(false)}
          onUpdateSlide={(i, updatedSlide) => {
            // Aggiorna Redux
            if (personalSlice) {
              dispatch(personalActions.updatePersonalItem(updatedSlide));
            } else {
              dispatch(cartActions.updatePurchasedItem(updatedSlide));
            }
            // Aggiorna anche lo state interno del Lightbox (per riflettere subito il cambiamento)
            setSlides((prev) => {
              const copy = [...prev];
              copy[i] = updatedSlide;
              return copy;
            });
          }}
        />
      )}
    </>
  );
}
