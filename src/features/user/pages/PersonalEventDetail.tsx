import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, LogOut, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";

import Carousel from "@common/components/ui/Carousel";
import ImageGallery from "@common/components/ImageGallery";
import CustomLightbox from "@common/components/CustomLightbox";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@common/components/ui";
import { logOut } from "@common/utils/auth";

import { cartActions } from "@features/shop/store/cart-slice";
import { personalActions } from "../store/personal-slice";
import { resetHeaderData } from "@common/utils/graphics";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { useFetchData } from "@common/hooks/useFetchData";
import { useLightboxState } from "@common/hooks/useLightboxState";
import { API } from "@common/services/api-endpoints";
import { ROUTES } from "@/routes";

interface EventItem {
  id: number;
  isPurchased: boolean;
  fileTypeId?: number;
  urlThumbnail?: string;
  url?: string;
  urlCover?: string;
  keyThumbnail?: string;
}

interface EventData {
  slug: string;
  hashId: string;
  aspectRatio?: string;
  status: string;
  items: EventItem[];
  preOrder?: boolean;
  allPhotos?: boolean;
}

export default function PersonalEventDetail() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const purchasedItems =
    useAppSelector((state) => state.personal.purchased) ?? [];
  const { slug } = useParams<{ slug: string }>();

  const { lightbox, openLightbox, closeLightbox, setIndex, updateSlide } =
    useLightboxState();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const { t } = useTranslations();

  const { data: fetchedEvents, loading } = useFetchData<EventData[]>(
    API.LIBRARY_EVENT(slug ?? ""),
    { needAuth: true },
  );

  useEffect(() => {
    if (!fetchedEvents || fetchedEvents.length === 0) return;
    const event = fetchedEvents[0];
    setEventData(event);
    // Carica nello slice personal solo gli item già acquistati per mostrarli nel carousel e nella gallery
    dispatch(
      personalActions.updatePurchased(
        event.items.filter((item: EventItem) => item.isPurchased),
      ),
    );
  }, [fetchedEvents, dispatch]);

  useEffect(() => {
    resetHeaderData();
  }, []);

  // Calcola gli item non acquistati solo quando eventData cambia.
  // Se lo stato è "onlyPurchased" non ci sono item da mostrare come disponibili.
  const unpurchasedItems = useMemo(() => {
    if (!eventData || eventData.status === "onlyPurchased") {
      return [];
    }

    return eventData.items.filter((item) => item.isPurchased === false) || [];
  }, [eventData]);

  const handleLogout = () => {
    logOut();
    navigate(ROUTES.HOME, { replace: true });
  };

  const handleBack = () => {
    navigate(ROUTES.PERSONAL);
  };

  const handleGoToShop = () => {
    if (!eventData) return;
    const { slug, hashId } = eventData;
    navigate(ROUTES.EVENT_WITH_HASH(slug, hashId));
  };

  return (
    <>
      <div className="container">
        <div className="flex justify-between my-10">
          <Button onClick={handleBack} variant="outline" size="sm">
            <ArrowLeft size={16} />
          </Button>
          <Button onClick={handleLogout} variant="danger">
            <LogOut size={16} className="inline" /> Logout
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center my-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
          </div>
        ) : purchasedItems?.length > 0 ? (
          <>
            <h2 className="my-10">{t("PERSONAL_PURCHASE")}</h2>
            <div className="px-30">
              <Carousel>
                {purchasedItems.map((img, i) => {
                  const image = img as {
                    fileTypeId?: number;
                    urlCover?: string;
                    urlThumbnail?: string;
                    url?: string;
                    keyThumbnail?: string;
                  };
                  return (
                    <Carousel.Item
                      key={`carousel_${Date.now()}_${
                        image.keyThumbnail || i
                      }_${i}`}
                    >
                      <div
                        className={`carousel-square flex justify-center items-center ${
                          image.fileTypeId == 2 && image.urlCover ? "video" : ""
                        }`}
                        onClick={() =>
                          openLightbox(purchasedItems, i, false, true, true)
                        }
                      >
                        <img
                          src={
                            !image.fileTypeId || image.fileTypeId == 1
                              ? image.urlThumbnail || image.url
                              : image.urlThumbnail ||
                                image.urlCover ||
                                "/images/play-icon.webp"
                          }
                          className="img-fluid"
                          loading="lazy"
                          alt="..."
                        />
                      </div>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            </div>
          </>
        ) : (
          <>
            {eventData?.preOrder && eventData?.allPhotos ? (
              <>
                <h2 className="my-10">{t("PERSONAL_SOON_TITLE")}</h2>
                <p className="text-white">{t("PERSONAL_SOON_BODY")}</p>
              </>
            ) : (
              <h2 className="my-10">{t("PERSONAL_NOTHING")}</h2>
            )}
          </>
        )}
        {purchasedItems?.length > 0 && (
          <>
            <div className="mt-20">
              <ImageGallery
                images={purchasedItems}
                select={false}
                actions={true}
                highLightFavourite={true}
                highLightPurchased={true}
                personalSlice={true}
                onOpenLightbox={openLightbox}
                aspectRatio={eventData?.aspectRatio}
                isShop={false}
              />
            </div>
          </>
        )}

        {/* Nuova gallery per items NON acquistati (solo se status === "mixed") */}
        {unpurchasedItems.length > 0 && (
          <>
            <div className="flex justify-center mb-1">
              <div className="flex items-center">
                <h2 className="my-10 mt-30">{t("PERSONAL_AVAILABLE")}</h2>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex items-center gap-3">
                <Button
                  variant="link"
                  className="text-white text-decoration-none p-0 ml-auto"
                  onClick={() => handleGoToShop()}
                >
                  <ShoppingCart size={28} className="inline mr-2" />
                  {t("PERSONAL_SHOP")}
                </Button>
              </div>
            </div>
            <div className="mt-20">
              <ImageGallery
                images={unpurchasedItems}
                select={false}
                actions={false}
                highLightFavourite={false}
                highLightPurchased={false}
                personalSlice={false}
                onOpenLightbox={openLightbox}
                applyRedFilter={true}
                aspectRatio={eventData?.aspectRatio}
              />
            </div>
          </>
        )}
      </div>

      {lightbox.open && (
        <CustomLightbox
          open={lightbox.open}
          slides={lightbox.slides as never}
          index={lightbox.index}
          setIndex={setIndex}
          select={lightbox.select}
          actions={lightbox.actions}
          addToCart={false}
          isPersonalArea={true}
          onClose={closeLightbox}
          // personalSlice=true → item dall'area personale, false → item appena acquistati (cart)
          onUpdateSlide={(i, updatedSlide) => {
            if (lightbox.personalSlice) {
              dispatch(
                personalActions.updatePersonalItem(
                  updatedSlide as Parameters<
                    typeof personalActions.updatePersonalItem
                  >[0],
                ),
              );
            } else {
              dispatch(
                cartActions.updatePurchasedItem(
                  updatedSlide as Parameters<
                    typeof cartActions.updatePurchasedItem
                  >[0],
                ),
              );
            }
            updateSlide(i, updatedSlide);
          }}
        />
      )}
    </>
  );
}
