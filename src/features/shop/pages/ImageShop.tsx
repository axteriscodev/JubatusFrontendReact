import ImageGallery from "@common/components/ImageGallery";
import Logo from "@common/components/Logo";
import TotalShopButton from "../components/TotalShopButton";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { cartActions } from "../store/cart-slice";
import { useEffect, useState } from "react";
import { setUiPreset } from "@common/utils/graphics";
import CustomLightbox from "@common/components/CustomLightbox";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { useTranslations } from "@common/i18n/TranslationProvider";
import parse from "html-react-parser";
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

function getPriceListEntry(pricePack: PricePack, eventPreset: CompetitionPreset) {
  const safeHTML = DOMPurify.sanitize(pricePack.itemsLanguages[0].title);

  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: safeHTML }} />
      {eventPreset.currency === "EUR"
        ? ` - ${pricePack.price}${eventPreset.currencySymbol}`
        : ` - ${eventPreset.currencySymbol}${pricePack.price}`}
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

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<unknown[]>([]);

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
      setOpen(false);
    }
  };

  const handleButtonClick = () => {
    dispatch(cartActions.addAllItems());
  };

  const openLightbox = (images: unknown[], startIndex = 0, select: boolean, actions: boolean, _personalSlice?: boolean) => {
    setIndex(startIndex);
    setOpen(true);
    setSlides(images);
    setSelect(select);
    setActions(actions);
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
                <div key={i}>{getPriceListEntry(pricePack as unknown as PricePack, eventPreset as unknown as CompetitionPreset)}</div>
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

          {/* Combinazioni Miste */}
          {hasPhoto && (hasVideo || hasClip) && (
            <>
              <p>{t("CART_PHOTOVIDEO")}</p>
              {(numVideo === 0 || numClips === 0) && (
                <h4>
                  i tuoi <strong>video/clips</strong> sono in preparazione:
                  riceverai una mail per vederli appena pronti 🎥🏃‍♂️🔥
                </h4>
              )}
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

      {open && (
        <CustomLightbox
          open={open}
          slides={slides as never}
          index={index}
          setIndex={setIndex}
          select={select}
          actions={actions}
          onClose={() => setOpen(false)}
          onImageClick={handleImageClick}
          photoItems={photoItems as never}
          shopMode={true}
        />
      )}
    </>
  );
}
