import ImageGallery from "@common/components/ImageGallery";
import Logo from "@common/components/Logo";
import TotalShopButton from "../components/TotalShopButton";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { cartActions } from "../store/cart-slice";
import { useEffect } from "react";
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
  const hasPhoto = useAppSelector((state) => state.cart.hasPhoto);
  const hasVideo = useAppSelector((state) => state.cart.hasVideo);
  const hasClip = useAppSelector((state) => state.cart.hasClip);
  const pricesList = useAppSelector((state) => state.cart.prices);
  const eventPreset = useAppSelector((state) => state.competition);
  const { t } = useTranslations();

  const numVideo = imagesList?.filter((item) => item.fileTypeId === 2).length;
  const numClips = imagesList?.filter((item) => item.fileTypeId === 3).length;

  const { lightbox, openLightbox, closeLightbox, setIndex } = useLightboxState();

  const photoItems = useAppSelector((state) => state.cart.items);
  const alertPack = useAppSelector((state) => state.cart.alertPack);

  const handleImageClick = (imageKey: string) => {
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
  };

  const handleButtonClick = () => {
    dispatch(cartActions.addAllItems());
  };

  useEffect(() => {
    setUiPreset(eventPreset);
  }, [eventPreset]);

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
        {imagesList?.length > 0 && (
          <>
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
            />
            <TotalShopButton onButtonClick={handleButtonClick} />
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
          onClose={closeLightbox}
          onImageClick={handleImageClick}
          photoItems={photoItems as never}
          shopMode={true}
        />
      )}
    </>
  );
}
