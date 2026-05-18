import { useState, useEffect, type MouseEvent } from "react";
import { LoaderCircle, SquareCheckBig } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@common/store/hooks";
import CustomLightbox from "@common/components/CustomLightbox";
import Logo from "@common/components/Logo";
import { useTranslations } from "@common/i18n/TranslationProvider";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import styles from "@features/shop/pages/PreOrder.module.css";
import { formatCurrencyPrice } from "@common/utils/data-formatter";
import { API } from "@common/services/api-endpoints";
import { ROUTES } from "@/routes";
import type { PreorderPack } from "@/types/cart";

interface PresaleImage {
  url?: string;
}

interface PresaleVideo {
  url: string;
  cover: string;
}

interface PresaleMedia {
  images?: PresaleImage[];
  video?: PresaleVideo;
}

interface PriceListItem {
  id?: number;
  price: number;
  discount?: number | null;
  bestOffer: boolean;
  itemsLanguages?: Array<{ title: string; subTitle: string }>;
}

interface PreOrderFormProps {
  eventId: number;
  onContinue: (pkg: PreorderPack) => void;
}

export default function PreOrderForm({ eventId, onContinue }: PreOrderFormProps) {
  const eventPreset = useAppSelector((state) => state.competition);
  const pricelist = useAppSelector((state) => state.cart.prices);
  const { t } = useTranslations();

  const [selectedPackage, setSelectedPackage] = useState<PriceListItem | null>(null);
  const [presaleMedia, setPresaleMedia] = useState<PresaleMedia>({});
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(API.PRESALE_ASSETS(eventId), { method: "GET" });
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
  }, [eventId]);

  // I titoli dei pacchetti arrivano dall'API come HTML: DOMPurify previene XSS prima del render
  function getPriceListEntry(text: string) {
    return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />;
  }

  // Applica la percentuale di sconto: price * (1 - discount/100)
  const getFinalPrice = (price: number, discount?: number | null) =>
    ((price * (100 - (discount ?? 0))) / 100).toFixed(2);

  // Clic sullo stesso pacchetto già selezionato lo deseleziona (toggle)
  function handleSelection(_event: MouseEvent, list: PriceListItem) {
    setSelectedPackage((prev) => (prev?.id === list.id ? null : list));
  }

  function handleContinue() {
    if (!selectedPackage) return;
    onContinue(selectedPackage as unknown as PreorderPack);
  }

  const numPhoto = presaleMedia?.images?.length ?? 0;
  const hasVideo = presaleMedia?.video?.url ?? false;
  const bestOfferLabel = t("BEST_OFFER");

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
                <SquareCheckBig size={16} className="inline text-success mr-2" />
                {t("PREORDER_BULLET1")}
                <br />
                <SquareCheckBig size={16} className="inline text-success mr-2" />
                {t("PREORDER_BULLET2")}
                <br />
                <SquareCheckBig size={16} className="inline text-success mr-2" />
                {t("PREORDER_BULLET3")}
              </p>
            </div>
          </div>
          <div className="my-20">
            {loadingGallery ? (
              <div className="flex justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-secondary" aria-label="Loading" />
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div
                // Layout a 12 colonne solo se coesistono foto e video (7+5); altrimenti full-width
                className={`grid grid-cols-1 gap-2 ${numPhoto > 0 && hasVideo ? "md:grid-cols-12" : ""} ${styles.mediaContainer}`}
              >
                {numPhoto > 0 && (
                  <div className={hasVideo ? "md:col-span-7" : "w-full"}>
                    <div className={`grid grid-cols-2 gap-2 ${styles.imageContainer}`}>
                      {presaleMedia.images!.map((img, i) => (
                        <div key={i}>
                          {/* L'API può restituire l'immagine come stringa URL o come oggetto { url } */}
                          <img src={typeof img === "string" ? img : img.url} alt={`preview ${i}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {hasVideo && presaleMedia.video && (
                  <div className={numPhoto > 0 ? "md:col-span-5" : "w-full"}>
                    {/* Cover statica cliccabile che apre il video nel lightbox */}
                    <img
                      src={presaleMedia.video.cover}
                      className={styles.videoCover}
                      alt="Cover"
                      title="Clicca per vedere un video di esempio"
                      onClick={() => {
                        setSlide(presaleMedia.video!.url);
                        setOpen(true);
                      }}
                      role="button"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-left">
          <h2 className="text-center text-30">⏱️ {parse(t("PREORDER_READY"))}</h2>
          <p className="mt-20">{parse(t("PREORDER_ORIGINAL"))}</p>
          <p className="mt-20">&#128576; {t("PREORDER_DISCOUNT")}</p>
        </div>
        <div className="text-left mt-20">
          <h3 className="text-24">{t("PREORDER_CHOOSE")}:</h3>
          {(pricelist as unknown as PriceListItem[]).map((list, i) => (
            <div
              key={i}
              onClick={(event) => handleSelection(event, list)}
              className={`mt-5 ${styles.pack} ${list.bestOffer ? styles.bestOffer : ""} ${list.id === selectedPackage?.id ? styles.selected : ""}`}
              data-best-offer-label={list.bestOffer ? bestOfferLabel : undefined}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-22">
                    {getPriceListEntry(list.itemsLanguages?.[0]?.title ?? "")}
                  </div>
                  <span className="text-13 opacity">
                    {getPriceListEntry(list.itemsLanguages?.[0]?.subTitle ?? "")}
                  </span>
                </div>
                <div className="text-right leading-tight">
                  <div className="line-through">
                    {formatCurrencyPrice(list.price, eventPreset.currency, eventPreset.currencySymbol)}
                  </div>
                  <div className="text-30 font-bold">
                    {formatCurrencyPrice(
                      getFinalPrice(list.price, list.discount),
                      eventPreset.currency,
                      eventPreset.currencySymbol,
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleContinue}
          className="my-button w-full mt-10"
          disabled={!selectedPackage}
        >
          {t("PREORDER_CONTINUE") || "Continua"}
        </button>
      </div>
      {open && (
        <CustomLightbox open={open} slide={slide} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
