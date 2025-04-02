import ImageGallery from "../components/ImageGallery";
import Logo from "../components/Logo";
import TotalShopButton from "../components/TotalShopButton";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useEffect } from "react";
import { setUiPreset } from "../utils/graphics";

/**
 * Pagina di acquisto immagini
 *
 * @returns {React.ReactElement}  Pagina di acquisto immagini
 */
export default function ImageShop() {
  const dispatch = useDispatch();
  const imagesList = [
    { key: 1, url: "/tmp/istockphoto-500645381-1024x1024.jpg", fileTypeId: 1 },
    { key: 2, url: "/tmp/istockphoto-535967907-1024x1024.jpg", fileTypeId: 1 },
    { key: 3, url: "/tmp/istockphoto-636828120-1024x1024.jpg", fileTypeId: 1 },
    { key: 4, url: "/tmp/istockphoto-852157310-1024x1024.jpg", fileTypeId: 1 },
    { key: 5, url: "/tmp/istockphoto-936552298-1024x1024.jpg", fileTypeId: 1 },
    { key: 6, url: "/tmp/istockphoto-961494108-1024x1024.jpg", fileTypeId: 1 },
    { key: 7, url: "/tmp/istockphoto-139877917-1024x1024.jpg", fileTypeId: 1 },
    { key: 8, url: "/tmp/istockphoto-1139730571-1024x1024.jpg", fileTypeId: 1 },
  ];

  //const imagesList = useSelector((state) => state.cart.products);
  const pricesList = useSelector((state) => state.cart.prices);
  const eventPreset = useSelector((state) => state.competition);

  useEffect(() => {
    dispatch(cartActions.updateProducts(imagesList));
   setUiPreset(eventPreset);
  }, []);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div className="text-center text-black fw-bold">
          {pricesList.map((pricePack, i) => (
            <>
              {getPriceListEntry(pricePack)}
              {i < pricesList.length - 1 && <hr />}
            </>
          ))}

          {/* 1 Foto - 9€
          <hr />
          3 Foto - 25€
          <hr />
          <strong>Tutte</strong> le Foto - 25€
          <hr />
          Il <strong>tuo</strong> video personalizzato - 25€
          <hr />
          Il <strong>tuo</strong> video e 10 foto - 35€ */}
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div>
          <Logo
            src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
            size="logo-xs"
          />
        </div>
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
          <img src="/images/icon-info.png" className="logo-xs pointer" />
        </OverlayTrigger>
      </div>
      <div className="my-md text-start">
        <h2>
          Ci siamo <strong>atleta!</strong>
        </h2>
        <p>Ecco le tue foto</p>
      </div>
      <ImageGallery images={imagesList} />
      <TotalShopButton />
    </div>
  );
}

function getPriceListEntry(pricePack) {
  let description = '';

  if (pricePack.quantityFoto === -1) {
    description = `Tutte le foto - ${pricePack.price}€`;
  } else if (pricePack.quantityFoto > 0 && pricePack.quantityVideo === 0) {
    description = `${pricePack.quantityFoto} Foto - ${pricePack.price}€`;
  } else if (pricePack.quantityFoto === 0 && pricePack.quantityVideo > 0) {
    description = `Il tuo video - ${pricePack.price}€`;
  } else if (pricePack.quantityFoto > 0 && pricePack.quantityVideo > 0) {
    description = `Il tuo video e ${pricePack.quantityFoto} foto - ${pricePack.price}€`;
  }

  return description;
}
