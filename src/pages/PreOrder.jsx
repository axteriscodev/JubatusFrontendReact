import { useState, useEffect } from "react";
import { SquareCheckBig } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import CustomLightbox from "../components/CustomLightbox";
import { setUiPreset } from "../utils/graphics";
import { Link } from "react-router-dom";
import styles from "./PreOrder.module.css";
import { cartActions } from "../repositories/cart/cart-slice";
import { useTranslations } from "../features/TranslationProvider";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { ROUTES } from "../routes";

export default function PreOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const eventPreset = useSelector((state) => state.competition);
  const pricelist = useSelector((state) => state.cart.prices);
  const selectedPreorder = useSelector((state) => state.cart.selectedPreorder);
  const { t } = useTranslations();

  const [presaleMedia, setPresaleMedia] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [error, setError] = useState(null);

  //carico tema evento
  useEffect(() => {
    setUiPreset(eventPreset);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL +
            "/assets/presale?event_id=" +
            eventPreset.id,
          {
            method: "GET", // se è GET
          },
        );
        if (response.ok) {
          const json = await response.json();
          setPresaleMedia(json.data);
        }
      } catch (err) {
        console.error(err);
        setError("Errore nel caricamento della galleria.");
      } finally {
        setLoadingGallery(false);
      }
    };
    fetchImages();
  }, []);

  function getPriceListEntry(text) {
    const safeHTML = DOMPurify.sanitize(text);

    return (
      <>
        <span dangerouslySetInnerHTML={{ __html: safeHTML }} />
      </>
    );
  }

  //console.log("presaleMedia", presaleMedia);
  //console.log("pricelist", JSON.stringify(pricelist));
  //console.log("selectedPreorder", selectedPreorder);

  const numPhoto = presaleMedia?.images?.length ?? 0;
  const hasVideo = presaleMedia?.video?.url ?? false;

  // prezzo scontato
  const getFinalPrice = (price, discount) => {
    return ((price * (100 - (discount ?? 0))) / 100).toFixed(2);
  };

  // const pricelist = [
  //     { title: "Video personalizzato", subTitle: "30-45 secondi di momenti selezionati", price: 30, discount: 30, bestOffer: false, selected: true },
  //     { title: "Pacchetto foto HD", subTitle: "Tutte le tue foto dell'evento", price: 40, discount: 30, bestOffer: false },
  //     { title: "Combo Video + Foto", subTitle: "Tutti i tuoi contenuti della competizione", price: 50, discount: 30, bestOffer: true }
  // ];

  function handleSelection(event, list) {
    if (list.id === selectedPreorder?.id)
      dispatch(cartActions.unSelectPreorder());
    else dispatch(cartActions.selectPreorder(list));
  }

  function handlePreorderCheckout(event) {
    event.preventDefault();

    if (selectedPreorder) {
      navigate(ROUTES.CHECKOUT);
    }
  }

  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState();

  const openLightbox = (content) => {
    setOpen(true);
    setSlide(content);
  };

  return (
    <>
      <div className="container">
        <div className="flex justify-center">
          <div className="text-left">
            <Link to={ROUTES.EVENT(eventPreset.slug)}>
              <Logo
                src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
                size="logo-sm"
              />
            </Link>
          </div>
        </div>
        <h2 className="text-30">{parse(t("PREORDER_STAR"))}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="text-left">
            {parse(t("PREORDER_TITLE"))}
            <h2 className="mt-20 text-center text-30">
              🎥 {t("PREORDER_CONTENT")}:
            </h2>
            <div className="ml-4 mt-20">
              <p>
                <SquareCheckBig
                  size={16}
                  className="inline text-success mr-2"
                />{" "}
                {t("PREORDER_BULLET1")}
                <br />
                <SquareCheckBig
                  size={16}
                  className="inline text-success mr-2"
                />{" "}
                {t("PREORDER_BULLET2")}
                <br />
                <SquareCheckBig
                  size={16}
                  className="inline text-success mr-2"
                />{" "}
                {t("PREORDER_BULLET3")}
              </p>
            </div>
          </div>
          <div className="my-20">
            {loadingGallery ? (
              <div className="flex justify-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <>
                <div className={`row gap-2 ${styles.mediaContainer}`}>
                  {numPhoto > 0 && (
                    <div className={hasVideo ? "col-7" : "col"}>
                      <div
                        className={`row row-cols-2 gap-2 ${styles.imageContainer}`}
                      >
                        {presaleMedia.images.map((img, i) => (
                          <div key={i}>
                            <img
                              key={i}
                              src={typeof img === "string" ? img : img.url}
                              alt={`preview ${i}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="col">
                    {hasVideo && (
                      <>
                        <img
                          src={presaleMedia.video.cover}
                          className={styles.videoCover}
                          alt="Cover"
                          title="Clicca per vedere un video di esempio"
                          onClick={() =>
                            openLightbox(
                              presaleMedia.video.url,
                              0,
                              false,
                              false,
                            )
                          }
                          role="button"
                        />
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="text-left">
          <h2 className="text-center text-30">
            ⏱️ {parse(t("PREORDER_READY"))}
          </h2>
          <p className="mt-20">{parse(t("PREORDER_ORIGINAL"))}</p>
          <p className="mt-20">&#128576; {t("PREORDER_DISCOUNT")}</p>
        </div>
        <div className="text-left mt-20">
          <h3 className="text-24">{t("PREORDER_CHOOSE")}:</h3>
          {pricelist.map((list, i) => (
            <div
              key={i}
              onClick={(event) => handleSelection(event, list)}
              className={`mt-5 ${styles.pack} ${list.bestOffer ? styles.bestOffer : ""} ${list.id === selectedPreorder?.id ? styles.selected : ""}`}
              style={
                list.bestOffer
                  ? { "--best-offer-label": `'${t("BEST_OFFER")}'` }
                  : undefined
              }
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-22">
                    {getPriceListEntry(list.itemsLanguages?.[0]?.title ?? "")}
                  </div>
                  <span className="text-13 opacity">
                    {getPriceListEntry(
                      list.itemsLanguages?.[0]?.subTitle ?? "",
                    )}
                  </span>
                </div>
                <div className="text-right lh-1">
                  <div className="line-through">
                    {eventPreset.currency === "EUR"
                      ? `${list.price} ${eventPreset.currencySymbol}`
                      : `${eventPreset.currencySymbol} ${list.price}`}
                  </div>
                  <div className="text-30 fw-bold">
                    {eventPreset.currency === "EUR"
                      ? `${getFinalPrice(list.price, list.discount)} ${eventPreset.currencySymbol}`
                      : `${eventPreset.currencySymbol} ${getFinalPrice(list.price, list.discount)}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handlePreorderCheckout}
          className="my-button w-full mt-10"
          disabled={!selectedPreorder}
        >
          Prenota ora
        </button>
      </div>
      {open && (
        <CustomLightbox
          open={open}
          slide={slide}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
