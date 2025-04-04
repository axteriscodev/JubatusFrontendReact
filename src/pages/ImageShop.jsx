import ImageGallery from "../components/ImageGallery";
import Logo from "../components/Logo";
import TotalShopButton from "../components/TotalShopButton";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useEffect, useState } from "react";
import { setUiPreset } from "../utils/graphics";
import Lightbox from "yet-another-react-lightbox";

export default function ImageShop() {
  //const dispatch = useDispatch();
  // const imagesList = [
  //   { key: 1, url: "/tmp/istockphoto-500645381-1024x1024.jpg", fileTypeId: 1 },
  //   { key: 2, url: "/tmp/istockphoto-535967907-1024x1024.jpg", fileTypeId: 1 },
  //   { key: 3, url: "/tmp/istockphoto-636828120-1024x1024.jpg", fileTypeId: 1 },
  //   { key: 4, url: "/tmp/istockphoto-852157310-1024x1024.jpg", fileTypeId: 1 },
  //   { key: 5, url: "/tmp/istockphoto-936552298-1024x1024.jpg", fileTypeId: 1 },
  //   { key: 6, url: "/tmp/istockphoto-961494108-1024x1024.jpg", fileTypeId: 1 },
  //   { key: 7, url: "/tmp/istockphoto-139877917-1024x1024.jpg", fileTypeId: 1 },
  //   { key: 8, url: "/tmp/istockphoto-1139730571-1024x1024.jpg", fileTypeId: 1 },
  // ];

  const dispatch = useDispatch();
  const imagesList = useSelector((state) => state.cart.products);
  const pricesList = useSelector((state) => state.cart.prices);
  const eventPreset = useSelector((state) => state.competition);

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  const handleImageClick = (imageKey) => {
    if (photoItems.some((element) => element.keyPreview === imageKey)) {
      dispatch(cartActions.removeItemFromCart(imageKey));
    } else {
      dispatch(cartActions.addItemToCart(imageKey));
    }
    setOpen(false);
  };

  const photoItems = useSelector((state) => state.cart.items);

  const handleFavouriteClick = (image) => {
    alert(`Favourite: ${image.url}`);
  }

  const handleDownloadClick = (image) => {
    alert(`Download: ${image.url}`);
  }

  const handleShareClick = (image) => {
    alert(`Share: ${image.url}`);
  }

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
            <>
              {getPriceListEntry(pricePack)}
              {i < pricesList.length - 1 && <hr />}
            </>
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
            <Logo
              src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
              size="logo-xs"
            />
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
        <ImageGallery images={imagesList} select={true} actions={false} onOpenLightbox={openLightbox} onImageClick={handleImageClick} photoItems={photoItems} />
        <TotalShopButton />
      </div>

      {open && (
        <Lightbox
          styles={{ container: { backgroundColor: "var(--overlay)" } }}
          open={open}
          close={() => setOpen(false)}
          index={index}
          on={{
            view: ({ index: newIndex }) => setIndex(newIndex),
          }}
          slides={slides.map((image) => ({
            src: image.url,
            id: image.keyOriginal,
          }))}
          render={{
            slideHeader: () => {
              if (!select) return null;

              const image = slides[index];
              const isSelected = photoItems.some((el) => el.keyPreview === image.keyPreview);
        
              return (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "80px",
                    zIndex: 1000,
                  }}
                >
                  <button
                    onClick={() => handleImageClick(image.keyPreview)}
                    className={`my-button ${isSelected ? "remove" : "add"}`}
                  >
                    <i className='bi bi-cart'></i> {isSelected ? "Rimuovi" : "Seleziona"}
                  </button>
                </div>
              );
            },
            slideFooter: () => {
              if (!actions) return null;

              const image = slides[index];

              return (
                <div className="text-50 d-flex gap-3 justify-content-between position-absolute bottom-0 start-50 translate-middle-x">
                  <a
                    onClick={() => handleFavouriteClick(image)}
                    aria-label="Favourite image"
                  >
                    <i className="bi bi-heart-fill text-danger"></i>
                  </a>
                  <a
                    onClick={() => handleDownloadClick(image)}
                    aria-label="Download image"
                  >
                    <i className="bi bi-arrow-up"></i>
                  </a>
                  <a
                    onClick={() => handleShareClick(image)}
                    aria-label="Share image"
                  >
                    <i className="bi bi-arrow-up-right"></i>
                  </a>
                </div>
              );
            }
          }}
        />         
      )}
    </>
  );
}

function getPriceListEntry(pricePack) {
  let description = '';

  if (pricePack.quantityPhoto === -1) {
    description = `Tutte le foto - ${pricePack.price}€`;
  } else if (pricePack.quantityPhoto > 0 && pricePack.quantityVideo === 0) {
    description = `${pricePack.quantityPhoto} Foto - ${pricePack.price}€`;
  } else if (pricePack.quantityPhoto === 0 && pricePack.quantityVideo > 0) {
    description = `Il tuo video - ${pricePack.price}€`;
  } else if (pricePack.quantityPhoto > 0 && pricePack.quantityVideo > 0) {
    description = `Il tuo video e ${pricePack.quantityPhoto} foto - ${pricePack.price}€`;
  }

  return description;
}
