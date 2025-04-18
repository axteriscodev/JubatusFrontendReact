import ImageGallery from "../components/ImageGallery";
import Logo from "../components/Logo";
import TotalShopButton from "../components/TotalShopButton";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import { useEffect, useState } from "react";
import { setUiPreset } from "../utils/graphics";
import CustomLightbox from "../components/CustomLightbox";
import { Link } from "react-router-dom";

export default function ImageShop() {
  const dispatch = useDispatch();
  const imagesList = useSelector((state) => state.cart.products);
  const hasPhoto = useSelector((state) => state.cart.hasPhoto);
  const hasVideo = useSelector((state) => state.cart.hasVideo);
  const pricesList = useSelector((state) => state.cart.prices);
  const eventPreset = useSelector((state) => state.competition);

  //const numPhoto = imagesList?.filter(item => item.fileTypeId === 1).length;
  const numVideo = imagesList?.filter(item => item.fileTypeId === 2).length;

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
      (element) => element?.keyPreview === imageKey
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

  const alertPack = useSelector((state) => state.cart.alertPack);

  return (
    <>
    {alertPack && (
      <div className="shopNotify shadow text-black">
        Metti nel carrello un'altra foto per ottenere il pacchetto completo
      </div>
    )}
      <div className="container">
        <div className="d-flex justify-content-between">
          <div className="text-start">
            <Link to={'/event/' + eventPreset.slug}>
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
                  {getPriceListEntry(pricePack)}
                </div>
              ))}
            </div>
          </div>
        </div>
        {hasPhoto && !hasVideo &&
        <div className="my-md text-start">
          <h2>
            Ci siamo <strong>atleta!</strong>
          </h2>
          <p>Ecco le tue foto</p>
        </div>
        }
        {!hasPhoto && hasVideo && numVideo == 0 &&
        <div className="my-md">
          <h2>
            Ciao <strong>atleta</strong>, il <strong>tuo</strong> video è in preparazione:
          </h2>
          <p>riceverai una mail per vederlo appena pronto, entro 24 ore 🎥🏃‍♂️🔥</p>
        </div>
        }
        {!hasPhoto && hasVideo && numVideo > 0 &&
        <div className="my-md text-start">
          <h2>
          Ci siamo <strong>atleta!</strong>
          </h2>
          <p>Il tuo video è pronto! Sbloccalo in HD e senza filigrana completando il pagamento</p>
        </div>
        }
        {hasPhoto && hasVideo && numVideo == 0 &&
        <div className="my-md text-start">
          <h2>
          Ci siamo <strong>atleta!</strong>
          </h2>
          <p>Ecco le tue foto</p>
          <h4>il <strong>tuo</strong> video è in preparazione: riceverai una mail per vederlo appena pronto, entro 24 ore 🎥🏃‍♂️🔥</h4>
        </div>
        }
        {hasPhoto && hasVideo && numVideo > 0 &&
        <div className="my-md text-start">
          <h2>
          Ci siamo <strong>atleta!</strong>
          </h2>
          <p>Ecco le tue foto e il tuo video</p>
        </div>
        }
        
        {imagesList?.length > 0 &&
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
        }
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
    return (
      <>
        <strong>Tutte</strong> le foto - {pricePack.price}€
      </>);
  if (pricePack.quantityPhoto === -1 && pricePack.quantityVideo === -1)
    return (
      <>
        <strong>Pacchetto completo</strong> - {pricePack.price}€
      </>);
  if (pricePack.quantityPhoto > 0 && pricePack.quantityVideo === 0)
    return (<>{pricePack.quantityPhoto} Foto - {pricePack.price}€</>);
  if (pricePack.quantityPhoto === 0 && pricePack.quantityVideo > 0)
    return (<>Il <strong>tuo</strong> video - {pricePack.price}€</>);
  if (pricePack.quantityPhoto > 0 && pricePack.quantityVideo > 0)
    return (<>Il <strong>tuo</strong> video e {pricePack.quantityPhoto} foto - {pricePack.price}€</>);
  return "";
}
