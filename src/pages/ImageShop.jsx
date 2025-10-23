import ImageGallery from "../components/ImageGallery";
import Logo from "../components/Logo";
import TotalShopButton from "../components/TotalShopButton";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import { useEffect, useState } from "react";
import { setUiPreset } from "../utils/graphics";
import CustomLightbox from "../components/CustomLightbox";
import { Link } from "react-router-dom";
import DOMPurify from 'dompurify';
import { useTranslations } from "../features/TranslationProvider";
import parse from 'html-react-parser';

export default function ImageShop() {
  const dispatch = useDispatch();
  const imagesList = useSelector((state) => state.cart.products);
  const hasPhoto = useSelector((state) => state.cart.hasPhoto);
  const hasVideo = useSelector((state) => state.cart.hasVideo);
  const pricesList = useSelector((state) => state.cart.prices);
  const eventPreset = useSelector((state) => state.competition);
  const { t } = useTranslations();

  //const numPhoto = imagesList?.filter(item => item.fileTypeId === 1).length;
  const numVideo = imagesList?.filter((item) => item.fileTypeId === 2).length;

  //console.log("numPhoto", numPhoto);
  //console.log("numVideo", numVideo);
  //console.log("hasPhoto", hasPhoto);
  //console.log("hasVideo", hasVideo);

  //console.log("imagesList", JSON.stringify(imagesList));

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  const photoItems = useSelector((state) => state.cart.items);

  const handleImageClick = (imageKey) => {
    if (!imageKey || !photoItems) return;

    const isInCart = photoItems.some(
      (element) => element?.keyOriginal === imageKey
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

  const openLightbox = (images, startIndex = 0, select, actions) => {
    setIndex(startIndex);
    setOpen(true);
    setSlides(images);
    setSelect(select);
    setActions(actions);
  };

  useEffect(() => {
    setUiPreset(eventPreset);
  }, []);

  const alertPack = useSelector((state) => state.cart.alertPack);

  return (
    <>
      {alertPack && (
        <div className="shopNotify shadow text-black">
          {t("CART_ADD")}
        </div>
      )}
      <div className="container"> 
        <div className="d-flex justify-content-between">
          <div className="text-start">
            <Link to={"/event/" + eventPreset.slug}>
              <Logo
                src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
                size="logo-sm"
              />
            </Link>
          </div>
          <div>
            <div className="price-list-container">
              {pricesList.map((pricePack, i) => (
                <div key={i}>{getPriceListEntry(pricePack)}</div>
              ))}
            </div>
          </div>
        </div>
        {hasPhoto && !hasVideo && (
          <div className="my-md text-start">
            <h2>{t("RESULT_TITLE")}</h2>
            <p>{t("RESULT_PHOTO")}</p>
          </div>
        )}
        {!hasPhoto && hasVideo && numVideo == 0 && (
          <div className="my-md">
            {parse(t("RESULT_VIDEO"))}
          </div>
        )}
        {!hasPhoto && hasVideo && numVideo > 0 && (
          <div className="my-md text-start">
            <h2>{t("RESULT_TITLE")}</h2>
            <p>
              {t("CART_VIDEO")}
            </p>
          </div>
        )}
        {hasPhoto && hasVideo && numVideo == 0 && (
          <div className="my-md text-start">
            <h2>{t("RESULT_TITLE")}</h2>
            <p>{t("RESULT_PHOTO")}</p>
            <h4>
              il <strong>tuo</strong> video è in preparazione: riceverai una
              mail per vederlo appena pronto, entro 24 ore 🎥🏃‍♂️🔥
            </h4>
          </div>
        )}
        {hasPhoto && hasVideo && numVideo > 0 && (
          <div className="my-md text-start">
            <h2>{t("RESULT_TITLE")}</h2>
            <p>{t("CART_PHOTOVIDEO")}</p>
          </div>
        )}

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
            />
            <TotalShopButton onButtonClick={handleButtonClick} />
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
          onClose={() => setOpen(false)}
          onImageClick={handleImageClick}
          photoItems={photoItems}
          shopMode={true}
        />
      )}
    </>
  );
}

function getPriceListEntry(pricePack) {
  const safeHTML = DOMPurify.sanitize(pricePack.itemsLanguages[0].title);

  return (
    <>
      <span
        dangerouslySetInnerHTML={{ __html: safeHTML }}
      />
      - {pricePack.price}€
    </>
  );
}
