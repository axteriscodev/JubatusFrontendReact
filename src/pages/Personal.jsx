import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Carousel from 'react-bootstrap/Carousel';
import ImageGallery from "../components/ImageGallery";
import CustomLightbox from "../components/CustomLightbox";
import { fetchPurchased } from "../repositories/personal/personal-actions";
import { isAuthenticated } from "../utils/auth";
import { redirect } from "react-router-dom";

import { cartActions } from "../repositories/cart/cart-slice";
import { personalActions } from "../repositories/personal/personal-slice";

export default function Personal() {
  const dispatch = useDispatch();
  const purchasedItems = useSelector((state) => state.personal.purchased) ?? [];

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [personalSlice, setPersonalSlice] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  // recuper dei contenuti
  useEffect(() => {
    dispatch(fetchPurchased())
  }, []);

  const openLightbox = (images, startIndex = 0, select, actions, personalSlice) => {
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
        { purchasedItems?.length > 0 ?
        <>
          <h2 className="my-sm">Ecco i tuoi acquisti!</h2>
          <div className="px-lg">
            <Carousel>
              {purchasedItems.map((image, i) => (
                <Carousel.Item key={image.keyPreview || image.keyThumbnail || i}>
                  <div className="ratio ratio-1-1">
                    <img
                      src={image.urlPreview || image.urlThumbnail}
                      className="d-block w-100 object-fit-cover"
                      alt="..."
                      onClick={() => openLightbox(purchasedItems, i, false, true, true)}
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
        { purchasedItems?.length > 0 &&
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
          if (personalSlice){
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

export function loader() {
  if (!isAuthenticated()) {
    return redirect("/");
  }
  return null;
}
