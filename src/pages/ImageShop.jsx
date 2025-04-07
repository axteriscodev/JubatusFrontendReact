import ImageGallery from "../components/ImageGallery";
import Logo from "../components/Logo";
import TotalShopButton from "../components/TotalShopButton";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useEffect, useState } from "react";
import { setUiPreset } from "../utils/graphics";
import CustomLightbox from "../components/CustomLightbox";
import { Link } from "react-router-dom";

export default function ImageShop() {
  const dispatch = useDispatch();
  const imagesList = useSelector((state) => state.cart.products);
  const pricesList = useSelector((state) => state.cart.prices);
  const eventPreset = useSelector((state) => state.competition);

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  const photoItems = useSelector((state) => state.cart.items);

  const handleImageClick = (imageKey) => {
    if (!imageKey || !photoItems) return;

    const isInCart = photoItems.some(
      (element) => element?.keyPreview === imageKey
    );

    if (isInCart) {
      dispatch(cartActions.removeItemFromCart(imageKey));
    } else {
      dispatch(cartActions.addItemToCart(imageKey));
      setOpen(false);
    }
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

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div className="text-center text-black fw-bold">
          {pricesList.map((pricePack, i) => (
            <div key={i}>
              {getPriceListEntry(pricePack)}
              {i < pricesList.length - 1 && <hr />}
            </div>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between">
          <div>
            <Link to={'/event/' + eventPreset.slug}>
              <Logo
                src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
                size="logo-xs"
              />
            </Link>
          </div>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <i className="bi bi-info-circle text-60 pointer"></i>
          </OverlayTrigger>
        </div>
        <div className="my-md text-start">
          <h2>
            Ci siamo <strong>atleta!</strong>
          </h2>
          <p>Ecco le tue foto</p>
        </div>
        <ImageGallery
          images={imagesList}
          select={true}
          actions={false}
          onOpenLightbox={openLightbox}
          onImageClick={handleImageClick}
          photoItems={photoItems}
        />
        <TotalShopButton />
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
        />
      )}
    </>
  );
}

function getPriceListEntry(pricePack) {
  if (pricePack.quantityPhoto === -1)
    return `Tutte le foto - ${pricePack.price}€`;
  if (pricePack.quantityPhoto > 0 && pricePack.quantityVideo === 0)
    return `${pricePack.quantityPhoto} Foto - ${pricePack.price}€`;
  if (pricePack.quantityPhoto === 0 && pricePack.quantityVideo > 0)
    return `Il tuo video - ${pricePack.price}€`;
  if (pricePack.quantityPhoto > 0 && pricePack.quantityVideo > 0)
    return `Il tuo video e ${pricePack.quantityPhoto} foto - ${pricePack.price}€`;
  return "";
}
