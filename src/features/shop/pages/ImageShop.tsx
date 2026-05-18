import ImageGallery from "@common/components/ImageGallery";
import ProgressBar from "@common/components/ProgressBar";
import Logo from "@common/components/Logo";
import TotalShopButton from "../components/TotalShopButton";
import VideoPreorderCard from "../components/VideoPreorderCard";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { cartActions } from "../store/cart-slice";
import { useCallback, useEffect } from "react";
import { useRefineSearch } from "@common/hooks/useRefineSearch";
import { errorToast } from "@common/utils/toast-manager";
import { setUiPreset } from "@common/utils/graphics";
import CustomLightbox from "@common/components/CustomLightbox";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { useTranslations } from "@common/i18n/TranslationProvider";
import parse from "html-react-parser";
import { useLightboxState } from "@common/hooks/useLightboxState";
import { formatCurrencyPrice } from "@common/utils/data-formatter";
import { ROUTES } from "@/routes";

interface PricePackLanguage {
  title: string;
}

interface PricePack {
  price: number;
  itemsLanguages: PricePackLanguage[];
}

interface CompetitionPreset {
  slug: string;
  logo: string;
  aspectRatio: string;
  currency: string;
  currencySymbol: string;
}

function getPriceListEntry(
  pricePack: PricePack,
  eventPreset: CompetitionPreset,
) {
  const safeHTML = DOMPurify.sanitize(
    pricePack.itemsLanguages?.[0]?.title ?? "",
  );

  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: safeHTML }} />
      {` - ${formatCurrencyPrice(pricePack.price, eventPreset.currency, eventPreset.currencySymbol)}`}
    </>
  );
}

export default function ImageShop() {
  const dispatch = useAppDispatch();
  const imagesList = useAppSelector((state) => state.cart.products);
  const hasPhoto = imagesList?.some((item) => item.fileTypeId === 1) ?? false;
  const hasVideo = imagesList?.some((item) => item.fileTypeId === 2) ?? false;
  const hasClip = imagesList?.some((item) => item.fileTypeId === 3) ?? false;
  const pricesList = useAppSelector((state) => state.cart.prices);
  const eventPreset = useAppSelector((state) => state.competition);
  const { t } = useTranslations();

  const numVideo = imagesList?.filter((item) => item.fileTypeId === 2).length;
  const numClips = imagesList?.filter((item) => item.fileTypeId === 3).length;

  const { lightbox, openLightbox, closeLightbox, setIndex } =
    useLightboxState();
  const { refine, status: refineStatus } = useRefineSearch();

  const photoItems = useAppSelector((state) => state.cart.items);
  const alertPack = useAppSelector((state) => state.cart.alertPack);
  const hasSelfie = useAppSelector((state) => state.cart.hasSelfie);
  const hasBibNumber = useAppSelector((state) => state.cart.hasBibNumber);
  const isRefined = useAppSelector((state) => state.cart.isRefined);
  //check per mostrare ho meno il bottone per migliorare la ricerca con un contenuto
  const showRefineButton = hasBibNumber && !hasSelfie && !isRefined;
  const selectedVideoPreorders = useAppSelector(
    (state) => state.cart.selectedVideoPreorders,
  );
  // il reel è in preparazione: l'evento lo prevede ma il file non è ancora disponibile
  const reelPending = eventPreset.hasReel && numVideo === 0;

  // priorità: reel-only illimitato → reel illimitato misto → qualsiasi pacchetto con almeno 1 reel
  const videoPreorderPkg =
    pricesList.find(
      (p) =>
        (p.quantityVideo as number) === -1 && (p.quantityPhoto as number) === 0,
    ) ??
    pricesList.find((p) => (p.quantityVideo as number) === -1) ??
    pricesList.find((p) => (p.quantityVideo as number) >= 1) ??
    null;

  // la visibilità dipende solo da hasReel dell'evento, non dalla presenza di un pacchetto
  const showVideoPreorderCard = reelPending;

  // seleziona/deseleziona il pacchetto video preorder nel carrello
  const handleVideoPreorderToggle = useCallback(() => {
    // senza pacchetto la card è solo visiva, il toggle non ha effetto sul carrello
    if (!videoPreorderPkg) return;
    if (selectedVideoPreorders.some((v) => v.id === videoPreorderPkg.id)) {
      dispatch(cartActions.unSelectVideoPreorder(videoPreorderPkg));
    } else {
      dispatch(cartActions.selectVideoPreorder(videoPreorderPkg));
    }
  }, [videoPreorderPkg, selectedVideoPreorders, dispatch]);

  // aggiunge/rimuove una foto dal carrello; chiude il lightbox in caso di aggiunta
  const handleImageClick = useCallback(
    (imageKey: string) => {
      if (!imageKey || !photoItems) return;
      const isInCart = photoItems.some(
        (element) => element?.keyOriginal === imageKey,
      );

      if (isInCart) {
        dispatch(cartActions.removeItemFromCart(imageKey));
      } else {
        dispatch(cartActions.addItemToCart(imageKey));
        closeLightbox();
      }
    },
    [photoItems, dispatch, closeLightbox],
  );

  const handleRefineSearch = useCallback(
    (key: string) => {
      closeLightbox();
      refine(key);
    },
    [refine, closeLightbox],
  );

  useEffect(() => {
    setUiPreset(eventPreset);
  }, [eventPreset]);

  useEffect(() => {
    if (refineStatus === "error")
      errorToast(
        t("REFINE_ERROR") || "Errore durante l'affinamento della ricerca",
      );
  }, [refineStatus, t]);

  return (
    <>
      {alertPack && (
        <div className="shopNotify shadow text-black">{t("CART_ADD")}</div>
      )}
      <div className="container">
        <div className="flex justify-between">
          <div className="text-left">
            <Link to={ROUTES.EVENT(eventPreset.slug)}>
              <Logo
                src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
                size="logo-sm"
              />
            </Link>
          </div>
          <div>
            <div className="price-list-container">
              {pricesList.map((pricePack, i) => (
                <div key={i}>
                  {getPriceListEntry(
                    pricePack as unknown as PricePack,
                    eventPreset as unknown as CompetitionPreset,
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LOGICA MESSAGGI AGGIORNATA */}
        <div className="my-20 text-left">
          <h2>{t("RESULT_TITLE")}</h2>

          {/* Solo Foto */}
          {hasPhoto && !hasVideo && !hasClip && <p>{t("RESULT_PHOTO")}</p>}

          {/* Solo Video (o Video in preparazione) */}
          {!hasPhoto &&
            hasVideo &&
            !hasClip &&
            (numVideo === 0 ? (
              parse(t("RESULT_VIDEO"))
            ) : (
              <p>{t("CART_VIDEO")}</p>
            ))}

          {/* Solo Clips */}
          {!hasPhoto && !hasVideo && hasClip && (
            <p>{numClips > 0 ? t("CART_CLIPS") : t("RESULT_CLIPS")}</p>
          )}

          {/* Nessun contenuto */}
          {!hasPhoto && !hasVideo && !hasClip && <p>{t("WAITING_NOTHING")}</p>}

          {/* Combinazioni Miste */}
          {hasPhoto && hasVideo && (
            <>
              <p>{t("CART_PHOTOVIDEO")}</p>
              {numVideo === 0 && <h4>{parse(t("REEL_RESULT"))}</h4>}
            </>
          )}
        </div>
        {/* nessuna foto trovata: card standalone in griglia */}
        {showVideoPreorderCard && imagesList?.length === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-2">
            <VideoPreorderCard
              isSelected={
                videoPreorderPkg
                  ? selectedVideoPreorders.some(
                      (v) => v.id === videoPreorderPkg.id,
                    )
                  : false
              }
              aspectRatio={eventPreset.aspectRatio}
              onToggle={handleVideoPreorderToggle}
            />
          </div>
        )}
        {/* foto presenti: card come primo slot nella galleria */}
        {imagesList?.length > 0 && (
          <ImageGallery
            images={imagesList}
            select={true}
            actions={false}
            highLightPurchased={true}
            onOpenLightbox={openLightbox}
            onImageClick={handleImageClick}
            photoItems={photoItems}
            aspectRatio={eventPreset.aspectRatio}
            isShop={true}
            leadingSlot={
              showVideoPreorderCard ? (
                <VideoPreorderCard
                  isSelected={
                    videoPreorderPkg
                      ? selectedVideoPreorders.some(
                          (v) => v.id === videoPreorderPkg.id,
                        )
                      : false
                  }
                  aspectRatio={eventPreset.aspectRatio}
                  onToggle={() => {
                    if (!videoPreorderPkg) return;
                    if (
                      selectedVideoPreorders.some(
                        (v) => v.id === videoPreorderPkg.id,
                      )
                    ) {
                      dispatch(
                        cartActions.unSelectVideoPreorder(videoPreorderPkg),
                      );
                    } else {
                      dispatch(
                        cartActions.selectVideoPreorder(videoPreorderPkg),
                      );
                    }
                  }}
                />
              ) : undefined
            }
          />
        )}
        {(imagesList?.length > 0 || selectedVideoPreorders.length > 0) && (
          <div className="container fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            <TotalShopButton
              videoPreorderPkg={showVideoPreorderCard ? videoPreorderPkg : null}
            />
          </div>
        )}
      </div>

      {refineStatus === "loading" && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 z-50 px-8">
          <p className="text-white mb-2 text-center">
            {t("REFINE_PROCESSING") || "Affinamento ricerca in corso..."}
          </p>
          <div className="w-full max-w-lg">
            <ProgressBar
              duration={
                Number(import.meta.env.VITE_PROCESSING_SELFIE_LOADING) || 10000
              }
            />
          </div>
        </div>
      )}

      {lightbox.open && (
        <CustomLightbox
          open={lightbox.open}
          slides={lightbox.slides as never}
          index={lightbox.index}
          setIndex={setIndex}
          select={lightbox.select}
          actions={lightbox.actions}
          onClose={closeLightbox}
          onImageClick={handleImageClick}
          photoItems={photoItems as never}
          shopMode={true}
          onRefineSearch={showRefineButton ? handleRefineSearch : null}
        />
      )}
    </>
  );
}
