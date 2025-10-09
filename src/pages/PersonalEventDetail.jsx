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
  const [eventsData, setEventsData] = useState(null);
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

        const eventData = await response.json();
        console.log("Dati ricevuti:", eventData); // Debug
        //setError(null);
        setEventsData(eventData);
        dispatch(
          personalActions.updatePurchased(eventData.data[0].items.filter((item) => item.isPurchased) || [])
        );
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
    if (!eventsData || eventsData.status === "onlyPurchased") {
      return [];
    }

    return (
      eventsData.data?.[0]?.items?.filter((item) => item.isPurchased === false) ||
      []
    );
  }, [eventsData]);

  const handleLogout = () => {
    logOut();
    navigate("/", { replace: true });
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
        <div className="d-flex justify-content-end my-sm">
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
                      image.keyPreview || image.keyThumbnail || i
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
                            ? image.urlPreview ||
                              image.urlThumbnail ||
                              image.url
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
            {/* <h2 className="my-sm mt-lg">{t("AVAILABLE_FOR_PURCHASE")}</h2> */}
            <h2 className="my-sm mt-lg">Contenuti acquistabili</h2>
            <div className="mt-md">
              <ImageGallery
                images={unpurchasedItems}
                select={false}
                actions={true}
                highLightFavourite={false}
                highLightPurchased={false}
                personalSlice={false}
                onOpenLightbox={openLightbox}
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
