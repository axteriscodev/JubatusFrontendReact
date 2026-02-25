import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { setUiPreset } from "@common/utils/graphics";

import Logo from "@common/components/Logo";
import Carousel from "@common/components/ui/Carousel";
import ImageGallery from "@common/components/ImageGallery";
import CustomLightbox from "@common/components/CustomLightbox";

import { cartActions } from "../store/cart-slice";
import { personalActions } from "@features/user/store/personal-slice";
import { useTranslations } from "@common/i18n/TranslationProvider";
import parse from "html-react-parser";
export default function Purchased() {
  const dispatch = useAppDispatch();

  const eventLogo = useAppSelector((state) => state.competition.logo);
  const currentPurchasedItems = useAppSelector((state) => state.cart.purchased);
  const hasPhoto = useAppSelector((state) => state.cart.hasPhoto);
  const hasVideo = useAppSelector((state) => state.cart.hasVideo);
  const numVideo = currentPurchasedItems?.filter(
    (item) => item.fileTypeId === 2 && item.keyOriginal,
  ).length;

  const allPurchasedItems = useAppSelector((state) => state.personal.purchased);
  const eventPreset = useAppSelector((state) => state.competition);

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [personalSlice, setPersonalSlice] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<unknown[]>([]);
  const { t } = useTranslations();

  const openLightbox = (
    images: unknown[],
    startIndex = 0,
    select: boolean,
    actions: boolean,
    personalSlice: boolean,
  ) => {
    setIndex(startIndex);
    setOpen(true);
    setSlides(images);
    setSelect(select);
    setActions(actions);
    setPersonalSlice(personalSlice);
  };

  useEffect(() => {
    setUiPreset(eventPreset);
  }, []);

  return (
    <>
      <div className="container">
        <div className="text-left">
          <Logo
            src={import.meta.env.VITE_API_URL + "/" + eventLogo}
            size="logo-xs"
          />
        </div>
        {hasPhoto && !hasVideo && (
          <div className="my-20 text-left">
            <h2>{parse(t("PURCHASED_PHOTO"))}</h2>
          </div>
        )}
        {!hasPhoto && hasVideo && numVideo == 0 && (
          <div className="my-20">{parse(t("PURCHASED_PREPARE"))}</div>
        )}
        {!hasPhoto && hasVideo && numVideo > 0 && (
          <div className="my-20 text-left">
            <h2>{parse(t("PURCHASED_VIDEO"))}</h2>
          </div>
        )}
        {hasPhoto && hasVideo && numVideo == 0 && (
          <div className="my-20 text-left">
            <h2>{parse(t("PURCHASED_PHOTO"))}</h2>
            <h4>{parse(t("PURCHASED_PREPARE2"))}</h4>
          </div>
        )}
        {hasPhoto && hasVideo && numVideo > 0 && (
          <div className="my-20 text-left">
            <h2>{parse(t("PURCHASED_PHOTOVIDEO"))}</h2>
          </div>
        )}
        {currentPurchasedItems?.length > 0 ? (
          <>
            <div className="px-30">
              <Carousel>
                {currentPurchasedItems.map((image, i) => (
                  <Carousel.Item
                    key={image.keyPreview || image.keyThumbnail || i}
                  >
                    <div
                      className={`carousel-square flex justify-center items-center ${image.fileTypeId == 2 && (image as unknown as { urlCover?: string }).urlCover ? "video" : ""}`}
                      onClick={() =>
                        openLightbox(
                          currentPurchasedItems,
                          i,
                          false,
                          true,
                          false,
                        )
                      }
                    >
                      <img
                        src={
                          !image.fileTypeId || image.fileTypeId == 1
                            ? (image as unknown as { urlPreview?: string; urlThumbnail?: string; url?: string }).urlPreview ||
                              (image as unknown as { urlThumbnail?: string }).urlThumbnail ||
                              (image as unknown as { url?: string }).url
                            : (image as unknown as { urlCover?: string }).urlCover || "/images/play-icon.webp"
                        }
                        className="img-fluid"
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
            {!hasPhoto && !hasVideo && currentPurchasedItems?.length == 0 && (
              <h2 className="my-10">{t("PERSONAL_NOTHING")}</h2>
            )}
          </>
        )}
        {allPurchasedItems?.length > 0 && (
          <>
            <div className="mt-20">
              <ImageGallery
                images={allPurchasedItems}
                select={false}
                actions={true}
                highLightFavourite={true}
                personalSlice={true}
                onOpenLightbox={openLightbox}
                aspectRatio={eventPreset.aspectRatio}
                isShop={false}
              />
            </div>
          </>
        )}
      </div>

      {open && (
        <CustomLightbox
          open={open}
          slides={slides as never}
          index={index}
          setIndex={setIndex}
          select={select}
          actions={actions}
          onClose={() => setOpen(false)}
          onUpdateSlide={(i, updatedSlide) => {
            // Aggiorna Redux
            if (personalSlice) {
              dispatch(personalActions.updatePersonalItem(updatedSlide as Parameters<typeof personalActions.updatePersonalItem>[0]));
            } else {
              dispatch(cartActions.updatePurchasedItem(updatedSlide as Parameters<typeof cartActions.updatePurchasedItem>[0]));
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
