import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import CustomLightbox from "../components/CustomLightbox";
import { setUiPreset } from "../utils/graphics";
import { Link } from "react-router-dom";
import styles from "./PreOrder.module.css";
import { cartActions } from "../repositories/cart/cart-slice";

export default function PreOrder() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const eventPreset = useSelector((state) => state.competition);
    const pricelist = useSelector((state) => state.cart.prices);
    const selectedPreorder = useSelector((state) => state.cart.selectedPreorder);

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
                    import.meta.env.VITE_API_URL + "/assets/presale",
                    {
                        method: "GET", // se è GET
                    }
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

    //console.log("presaleMedia", presaleMedia);
    console.log("pricelist", JSON.stringify(pricelist));
    //console.log("selectedPreorder", selectedPreorder);

    const numPhoto = presaleMedia?.images?.length ?? 0;
    const hasVideo = presaleMedia?.video?.url ?? false;

    // prezzo scontato
    const getFinalPrice = (price, discount) => {
        return (price * (100 - (discount ?? 0)) / 100).toFixed(2);
    };

    // const pricelist = [
    //     { title: "Video personalizzato", subTitle: "30-45 secondi di momenti selezionati", price: 30, discount: 30, bestOffer: false, selected: true },
    //     { title: "Pacchetto foto HD", subTitle: "Tutte le tue foto dell'evento", price: 40, discount: 30, bestOffer: false },
    //     { title: "Combo Video + Foto", subTitle: "Tutti i tuoi contenuti della competizione", price: 50, discount: 30, bestOffer: true }
    // ];

    function handleSelection(event, list) {
        if (list.id === selectedPreorder?.id)
            dispatch(cartActions.unSelectPreorder());
        else
            dispatch(cartActions.selectPreorder(list));
    }

    function handlePreorderCheckout(event) {
        event.preventDefault();

        navigate("/checkout");
    }

    const [open, setOpen] = useState(false);
    const [slide, setSlide] = useState();

    const openLightbox = (slide) => {
        setOpen(true);
        setSlide(slide)
    };

    return (
        <>
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
                </div>
                <h2>Sarai <strong>Protagonista</strong>!</h2>
                <div className="row row-cols-lg-2">
                    <div className="text-start">
                        <p className="mt-sm">Stai per correre uno degli eventi più belli d’Italia</p>
                        <p>Noi saremo lì, al tuo fianco, per catturare <strong className="text-lowercase">ogni passo dall'adrenalina prima della partenza alla gioia del tuo traguardo</strong></p>
                        <h3 className="mt-sm text-24">Il tuo momento va reso immortale:</h3>
                        <div className="ms-4 mt-xs">
                            <p><i className="bi bi-check-square-fill text-success me-2"></i> droni professionali</p>
                            <p><i className="bi bi-check-square-fill text-success me-2"></i> i migliori fotografi sportivi</p>
                            <p><i className="bi bi-check-square-fill text-success me-2"></i> un team di videomakers al tuo servizio</p>
                        </div>
                        <h2 className="mt-sm">Pronto in <strong>24 ore</strong></h2>
                        <p>Subito dopo l'evento troverai foto e video grazie al <strong className="text-lowercase">riconoscimento facciale</strong>.</p>
                        <p><strong>Basta attese</strong>: i tuoi contenuti migliori immediatamente disponibili in qualità originale.</p>
                    </div>
                    <div className="my-sm">
                        {loadingGallery ? (
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <>
                                <div className={`row g-2 ${styles.mediaContainer}`}>
                                    {numPhoto > 0 && (
                                        <div className={hasVideo ? "col-7" : "col"}>
                                            <div className={`row row-cols-2 g-2 ${styles.imageContainer}`}>
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
                                                    onClick={() =>
                                                        openLightbox(presaleMedia.video.url, 0, false, false)
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="text-start">
                    <h3 className="text-24">Scegli tra:</h3>
                    {
                        pricelist.map((list, i) => (
                            <div key={i} onClick={(event) => handleSelection(event, list)}
                                className={`mt-xs ${styles.pack} ${list.bestOffer ? styles.bestOffer : ""} ${list.id === selectedPreorder?.id ? styles.selected : ""}`}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="text-22">{list.itemsLanguages[0]?.title}</div>
                                        <span className="text-13 opacity">{list.itemsLanguages[0]?.subTitle}</span>
                                    </div>
                                    <div className="text-end lh-1">
                                        <div className="text-decoration-line-through">{list.price} €</div>
                                        <strong className="text-30">{getFinalPrice(list.price, list.discount)} €</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <button
                    onClick={handlePreorderCheckout}
                    className="my-button w-100 mt-sm"
                    disabled={!selectedPreorder}>Preordina ORA</button>
            </div>
            {open && <CustomLightbox
                open={open}
                slide={slide}
                onClose={() => setOpen(false)}
            />}
        </>
    );
}