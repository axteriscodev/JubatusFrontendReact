import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUiPreset } from "../utils/graphics";

import Logo from "../components/Logo";
import Carousel from "react-bootstrap/Carousel";
import ImageGallery from "../components/ImageGallery";
import CustomLightbox from "../components/CustomLightbox";

import { cartActions } from "../repositories/cart/cart-slice";
import { personalActions } from "../repositories/personal/personal-slice";

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
  const allPurchasedItems = useSelector((state) => state.personal.purchased);
  const eventPreset = useSelector((state) => state.competition);

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [personalSlice, setPersonalSlice] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);

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
        { currentPurchasedItems?.length > 0 ? 
        <>
          <h2 className="my-sm">Ecco i tuoi acquisti!</h2>
          <div className="px-lg">
            <Carousel>
              {currentPurchasedItems.map((image, i) => (
                <Carousel.Item key={image.keyPreview || image.keyThumbnail || i}>
                  <div className="carousel-square d-flex justify-content-center align-items-center">
                    <img
                      src={image.urlPreview || image.urlThumbnail}
                      className="img-fluid"
                      alt="..."
                      onClick={() => openLightbox(currentPurchasedItems, i, false, true, false)}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
          </>
        :
        <>
          <h2 className="my-sm">Non hai effettuato acquisti</h2>
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
