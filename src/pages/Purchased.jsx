import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUiPreset } from "../utils/graphics";

import Logo from "../components/Logo";
import Carousel from "react-bootstrap/Carousel";
import ImageGallery from "../components/ImageGallery";
import CustomLightbox from "../components/CustomLightbox";

import { cartActions } from "../repositories/cart/cart-slice";
import { personalActions } from "../repositories/personal/personal-slice";
import { useTranslations } from "../features/TranslationProvider";
import parse from 'html-react-parser';

/**
 * Pagina contenente le foto appena acquistate (slider) e galleria con tutte le foto
 * acquistate sulla piattaforma
 * 
 * @returns 
 */
export default function Purchased() {
  const dispatch = useDispatch();

  const eventLogo = useSelector((state) => state.competition.logo);
  const currentPurchasedItems = useSelector((state) => state.cart.purchased);
  const hasPhoto = useSelector((state) => state.cart.hasPhoto);
  const hasVideo = useSelector((state) => state.cart.hasVideo);
  const numVideo = currentPurchasedItems?.filter(item => item.fileTypeId === 2 && item.keyOriginal).length;

  const allPurchasedItems = useSelector((state) => state.personal.purchased);
  const eventPreset = useSelector((state) => state.competition);

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [personalSlice, setPersonalSlice] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const { t } = useTranslations();

  const openLightbox = (images, startIndex = 0, select, actions, personalSlice) => {
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
        <div className="text-start">
          <Logo
            src={import.meta.env.VITE_API_URL + "/" + eventLogo}
            size="logo-xs"
          />
        </div>
        {hasPhoto && !hasVideo &&
        <div className="my-md text-start">
          <h2>
            {parse(t("PURCHASED_PHOTO"))}
          </h2>
        </div>
        }
        {!hasPhoto && hasVideo && numVideo == 0 &&
        <div className="my-md">
          {parse(t("PURCHASED_PREPARE"))}
        </div>
        }
        {!hasPhoto && hasVideo && numVideo > 0 &&
        <div className="my-md text-start">
          <h2>
            {parse(t("PURCHASED_VIDEO"))}
          </h2>
        </div>
        }
        {hasPhoto && hasVideo && numVideo == 0 &&
        <div className="my-md text-start">
          <h2>
           {parse(t("PURCHASED_PHOTO"))}
          </h2>
          <h4>{parse(t("PURCHASED_PREPARE2"))}</h4>
        </div>
        }
        {hasPhoto && hasVideo && numVideo > 0 &&
        <div className="my-md text-start">
          <h2>
            {parse(t("PURCHASED_PHOTOVIDEO"))}
          </h2>
        </div>
        }
        { currentPurchasedItems?.length > 0 ? 
        <>
          <div className="px-lg">
            <Carousel>
              {currentPurchasedItems.map((image, i) => (
                <Carousel.Item key={image.keyPreview || image.keyThumbnail || i}>
                  <div className={`carousel-square d-flex justify-content-center align-items-center ${image.fileTypeId == 2 && image.urlCover ? "video" : ""}`}
                    onClick={() =>
                      openLightbox(currentPurchasedItems, i, false, true, false)
                    }>
                    <img
                      src={
                        !image.fileTypeId || image.fileTypeId == 1
                          ? image.urlPreview ||
                            image.urlThumbnail ||                              
                            image.url
                          : image.urlCover || "/images/play-icon.webp"
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
        :
        <>
        { !hasPhoto && !hasVideo && currentPurchasedItems?.length == 0 && 
          <h2 className="my-sm">{t("PERSONAL_NOTHING")}</h2>
        }
        </>
        }
        { allPurchasedItems?.length > 0 &&
        <>
          <div className="mt-md">
            <ImageGallery
              images={allPurchasedItems}
              select={false}
              actions={true}
              highLightFavourite={true}
              personalSlice={true}
              onOpenLightbox={openLightbox}
            />
          </div>
          </>
        }
      </div>

      { open && <CustomLightbox
        open={open}
        slides={slides}
        index={index}
        setIndex={setIndex}
        select={select}
        actions={actions}
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
      />}
    </>
  );
}
