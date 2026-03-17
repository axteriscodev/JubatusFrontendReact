import { useState, useEffect, useRef, useMemo } from "react";
import { Save, Inbox, ChevronDown, ChevronUp, AlertTriangle, Plus } from "lucide-react";
import DOMPurify from "dompurify";
import { apiRequest, listenSSE } from "@common/services/api-services";
import { getPreferredLanguage } from "@common/utils/language-utils";
import { calculatePrice } from "@common/utils/best-price-calculator";
import Modal from "@common/components/ui/Modal";
import Spinner from "@common/components/ui/Spinner";
import Alert from "@common/components/ui/Alert";
import LoadingState from "@common/components/ui/LoadingState";
import EmptyState from "@common/components/ui/EmptyState";
import ImageGallery from "@common/components/ImageGallery";
import CustomLightbox from "@common/components/CustomLightbox";
import type { CartProduct, PriceItem } from "@/types/cart";

interface PriceItemWithLabel extends PriceItem {
  itemsLanguages?: Array<{ title?: string; subTitle?: string }>;
}

interface Payment {
  idOrdine: number;
  email?: string;
  amount: number;
  currency?: { currency: string; symbol: string } | string;
  state?: { id: number; value: string };
  parentOrderId?: number | null;
  parentOrderAmount?: number | null;
}

export interface OrderContentsModalProps {
  payment: Payment | null;
  eventId: string | number;
  onHide: () => void;
  onSaved: () => void;
  onSavedAndPay?: (deltaPayment: Payment) => void;
}

type LoadPhase = "idle" | "loading" | "ready" | "error";

function getCurrencySymbol(currency?: Payment["currency"]): string {
  if (!currency) return "€";
  if (typeof currency === "string") return currency;
  return currency.symbol;
}

function getCurrencyCode(currency?: Payment["currency"]): string {
  if (!currency || typeof currency === "string") return "EUR";
  return currency.currency;
}

function formatPrice(price: PriceItem["price"], symbol: string, code: string): string {
  const num = Number(price);
  if (isNaN(num)) return "—";
  return code === "EUR" ? `${num}${symbol}` : `${symbol}${num}`;
}

export default function OrderContentsModal({
  payment,
  eventId,
  onHide,
  onSaved,
  onSavedAndPay,
}: OrderContentsModalProps) {
  const [phase, setPhase] = useState<LoadPhase>("idle");
  const [phaseError, setPhaseError] = useState<string | null>(null);
  const [allContents, setAllContents] = useState<CartProduct[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [originalKeys, setOriginalKeys] = useState<Set<string>>(new Set());
  const [pricePackages, setPricePackages] = useState<PriceItemWithLabel[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [orderFlags, setOrderFlags] = useState({
    allPhotos: false,
    allVideos: false,
    allClips: false,
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [newContentKeys, setNewContentKeys] = useState<Set<string>>(new Set());
  const [retryCount, setRetryCount] = useState(0);
  const [showPriceList, setShowPriceList] = useState(false);
  const [parentOrderAmount, setParentOrderAmount] = useState<number>(0);

  const sseCleanupRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!payment) {
      sseCleanupRef.current?.();
      sseCleanupRef.current = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setPhase("idle");
      setAllContents([]);
      setSelectedKeys(new Set());
      setOriginalKeys(new Set());
      setNewContentKeys(new Set());
      setPricePackages([]);
      setSaveError(null);
      setOrderFlags({ allPhotos: false, allVideos: false, allClips: false });
      setParentOrderAmount(0);
      setRetryCount(0);
      return;
    }

    setPhase("loading");
    setPhaseError(null);
    setAllContents([]);
    setSelectedKeys(new Set());
    setOriginalKeys(new Set());

    const orderId = payment.idOrdine;
    const currentLanguage = getPreferredLanguage();

    let cancelled = false;

    async function loadContents() {
      try {
        const [searchInfoRes, priceRes] = await Promise.all([
          apiRequest({
            api: `${import.meta.env.VITE_API_URL}/orders/order/${orderId}/search-info`,
            method: "GET",
            needAuth: true,
          }),
          fetch(
            `${import.meta.env.VITE_API_URL}/contents/event-list/${eventId}/${currentLanguage.acronym}`,
          ),
        ]);

        if (priceRes.ok) {
          const priceJson = (await priceRes.json()) as {
            data: { items: PriceItem[] };
          };
          if (!cancelled) setPricePackages(priceJson.data?.items || []);
        }

        const searchInfoData = (await searchInfoRes.json()) as {
          message?: string;
          data?: {
            searchHash?: string;
            orderItemKeys?: string[];
            allPhotos?: number;
            allVideos?: number;
            allClips?: number;
            parentOrderId?: number | null;
            parentOrderAmount?: number;
          };
        };

        if (!searchInfoRes.ok) {
          throw new Error(
            searchInfoData.message ||
              "Errore nel caricamento delle informazioni dell'ordine",
          );
        }

        const {
          searchHash,
          orderItemKeys = [],
          allPhotos: orderAllPhotos = false,
          allVideos: orderAllVideos = false,
          allClips: orderAllClips = false,
          parentOrderAmount: fetchedParentOrderAmount = 0,
        } = searchInfoData.data ?? {};

        if (!cancelled) setParentOrderAmount(fetchedParentOrderAmount);

        if (!cancelled) {
          setOrderFlags({
            allPhotos: Boolean(orderAllPhotos),
            allVideos: Boolean(orderAllVideos),
            allClips: Boolean(orderAllClips),
          });
        }

        if (!searchHash) {
          throw new Error(
            "Nessuna ricerca associata a questo ordine. Impossibile caricare i contenuti.",
          );
        }

        const hashRes = await apiRequest({
          api: `${import.meta.env.VITE_API_URL}/contents/fetch-hash`,
          method: "POST",
          needAuth: true,
          body: JSON.stringify({ hashId: searchHash }),
        });

        const hashData = (await hashRes.json()) as {
          message?: string;
          data?: number;
        };

        if (!hashRes.ok) {
          throw new Error(
            hashData.message || "Errore nel caricamento della ricerca",
          );
        }

        const searchId = hashData.data;

        if (cancelled) return;

        timeoutRef.current = setTimeout(() => {
          sseCleanupRef.current?.();
          sseCleanupRef.current = null;
          if (!cancelled) {
            setPhase("error");
            setPhaseError(
              "Timeout nel caricamento dei contenuti. Riprova.",
            );
          }
        }, 15000);

        const cleanup = listenSSE(
          `${import.meta.env.VITE_API_URL}/contents/sse/${searchId}`,
          (data: string) => {
            try {
              const jsonData = JSON.parse(data) as {
                contents?: CartProduct[];
              };
              const contents = jsonData.contents || [];

              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }

              if (!cancelled) {
                const keys = new Set(orderItemKeys);
                const newKeys = new Set(
                  contents
                    .filter(
                      (c) =>
                        !keys.has(c.keyOriginal) &&
                        ((c.fileTypeId === 1 && orderAllPhotos) ||
                          (c.fileTypeId === 2 && orderAllVideos) ||
                          (c.fileTypeId === 3 && orderAllClips)),
                    )
                    .map((c) => c.keyOriginal),
                );
                setAllContents(contents);
                setSelectedKeys(new Set(keys));
                setOriginalKeys(new Set(keys));
                setNewContentKeys(newKeys);
                setPhase("ready");
              }
            } catch {
              /* ignore parse errors */
            }
          },
          () => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            if (!cancelled) {
              setPhase("error");
              setPhaseError(
                "Errore nel caricamento dei contenuti. Riprova.",
              );
            }
          },
        );

        sseCleanupRef.current = cleanup;
      } catch (err) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (!cancelled) {
          setPhase("error");
          setPhaseError(
            err instanceof Error ? err.message : "Errore nel caricamento",
          );
        }
      }
    }

    loadContents();

    return () => {
      cancelled = true;
      sseCleanupRef.current?.();
      sseCleanupRef.current = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment, retryCount]);

  const handleToggleItem = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedKeys(new Set(allContents.map((c) => c.keyOriginal)));
  };

  const handleDeselectAll = () => {
    setSelectedKeys(new Set());
  };

  const hasChanges = useMemo(() => {
    if (selectedKeys.size !== originalKeys.size) return true;
    for (const key of selectedKeys) {
      if (!originalKeys.has(key)) return true;
    }
    return false;
  }, [selectedKeys, originalKeys]);

  const priceResult = useMemo(() => {
    if (!pricePackages.length || !selectedKeys.size) return null;
    const selected = allContents.filter((c) => selectedKeys.has(c.keyOriginal));
    const photos = selected.filter((c) => c.fileTypeId === 1).length;
    const videos = selected.filter((c) => c.fileTypeId === 2).length;
    const clips = selected.filter((c) => c.fileTypeId === 3).length;

    const packages = pricePackages
      .filter(
        (p) =>
          p.price !== "" &&
          p.quantityPhoto !== "" &&
          p.quantityVideo !== "" &&
          p.quantityClip !== "",
      )
      .map((p) => ({
        quantityPhoto: p.quantityPhoto as number,
        quantityVideo: p.quantityVideo as number,
        quantityClip: p.quantityClip as number,
        price: p.price as number,
      }));

    if (!packages.length) return null;
    const result = calculatePrice(packages, photos, videos, clips);
    if (result.price === -1) return null;

    return {
      price: result.price,
      allPhotos: result.usedPackages.some((p) => p.quantityPhoto === -1),
      allVideos: result.usedPackages.some((p) => p.quantityVideo === -1),
      allClips: result.usedPackages.some((p) => p.quantityClip === -1),
    };
  }, [selectedKeys, allContents, pricePackages]);

  const addedCount = useMemo(() => {
    let count = 0;
    for (const key of selectedKeys) {
      if (!originalKeys.has(key)) count++;
    }
    return count;
  }, [selectedKeys, originalKeys]);

  const removedCount = useMemo(() => {
    let count = 0;
    for (const key of originalKeys) {
      if (!selectedKeys.has(key)) count++;
    }
    return count;
  }, [selectedKeys, originalKeys]);

  const isPaid = useMemo(() => {
    const successId = Number(import.meta.env.VITE_ORDER_STATE_PAYMENT_SUCCESS);
    const completedId = Number(import.meta.env.VITE_ORDER_STATE_COMPLETED);
    return (
      payment?.state?.id === successId || payment?.state?.id === completedId
    );
  }, [payment]);

  const hasAllFlags =
    orderFlags.allPhotos || orderFlags.allVideos || orderFlags.allClips;

  // Items not yet selected that would be covered by the current "-1" package.
  // Shown in a banner so the admin can opt in explicitly.
  const pendingAutoSelects = useMemo(() => {
    if (!priceResult || isPaid) return null;
    const photos = priceResult.allPhotos
      ? allContents.filter((c) => c.fileTypeId === 1 && !selectedKeys.has(c.keyOriginal)).length
      : 0;
    const videos = priceResult.allVideos
      ? allContents.filter((c) => c.fileTypeId === 2 && !selectedKeys.has(c.keyOriginal)).length
      : 0;
    const clips = priceResult.allClips
      ? allContents.filter((c) => c.fileTypeId === 3 && !selectedKeys.has(c.keyOriginal)).length
      : 0;
    const total = photos + videos + clips;
    return total > 0 ? { total, photos, videos, clips } : null;
  }, [priceResult, allContents, selectedKeys, isPaid]);

  const handleAddPendingAutoSelects = () => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (priceResult?.allPhotos)
        allContents.filter((c) => c.fileTypeId === 1).forEach((c) => next.add(c.keyOriginal));
      if (priceResult?.allVideos)
        allContents.filter((c) => c.fileTypeId === 2).forEach((c) => next.add(c.keyOriginal));
      if (priceResult?.allClips)
        allContents.filter((c) => c.fileTypeId === 3).forEach((c) => next.add(c.keyOriginal));
      return next;
    });
  };

  const addedKeys = useMemo(() => {
    const added = new Set<string>();
    for (const key of selectedKeys) {
      if (!originalKeys.has(key)) added.add(key);
    }
    return added;
  }, [selectedKeys, originalKeys]);

  // Prezzo netto da addebitare per questo ordine: sottraiamo quanto già pagato nel padre.
  // Per ordini standalone parentOrderAmount = 0, quindi il comportamento è invariato.
  const priceAfterParentDiscount = useMemo(() => {
    if (!priceResult) return null;
    return Math.max(0, priceResult.price - parentOrderAmount);
  }, [priceResult, parentOrderAmount]);

  const deltaPrice = useMemo(() => {
    if (!priceAfterParentDiscount || !payment) return null;
    const delta = priceAfterParentDiscount - payment.amount;
    return delta > 0 ? delta : null;
  }, [priceAfterParentDiscount, payment]);

  const newContentCounts = useMemo(() => {
    if (!newContentKeys.size) return null;
    const items = allContents.filter((c) => newContentKeys.has(c.keyOriginal));
    return {
      total: items.length,
      photos: items.filter((c) => c.fileTypeId === 1).length,
      videos: items.filter((c) => c.fileTypeId === 2).length,
      clips: items.filter((c) => c.fileTypeId === 3).length,
    };
  }, [newContentKeys, allContents]);

  const handleAddNewContents = () => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      for (const key of newContentKeys) next.add(key);
      return next;
    });
  };

  // Map CartProduct → RawContentItem shape expected by ImageGallery / getEventContents
  const imagesForGallery = useMemo(
    () =>
      allContents.map((c) => ({
        id: 0,
        fileTypeId: c.fileTypeId,
        keyOriginal: c.keyOriginal,
        isPurchased: isPaid && originalKeys.has(c.keyOriginal),
        urlPreview: c.urlPreview ?? c.keyPreview,
        urlThumbnail: c.urlThumbnail ?? c.keyThumbnail,
        urlCover: c.urlCover ?? c.keyCover ?? c.keyThumbnail,
      })),
    [allContents, isPaid, originalKeys],
  );

  const photoItemsForGallery = useMemo(
    () =>
      allContents
        .filter((c) => selectedKeys.has(c.keyOriginal))
        .map((c) => ({
          id: 0,
          fileTypeId: c.fileTypeId,
          keyOriginal: c.keyOriginal,
          isPurchased: false,
          urlPreview: c.urlPreview ?? c.keyPreview,
          urlThumbnail: c.urlThumbnail ?? c.keyThumbnail,
          urlCover: c.urlCover ?? c.keyCover ?? c.keyThumbnail,
        })),
    [allContents, selectedKeys],
  );

  const handleOpenLightbox = (
    _images: unknown[],
    index: number,
  ) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // For not-paid orders OR paid orders with -1 flags: update existing order
  const handleSave = async () => {
    if (!payment) return;
    setSaving(true);
    setSaveError(null);

    try {
      const flags = isPaid
        ? orderFlags
        : {
            allPhotos:
              (priceResult?.allPhotos ?? false) &&
              allContents.filter((c) => c.fileTypeId === 1).every((c) => selectedKeys.has(c.keyOriginal)),
            allVideos:
              (priceResult?.allVideos ?? false) &&
              allContents.filter((c) => c.fileTypeId === 2).every((c) => selectedKeys.has(c.keyOriginal)),
            allClips:
              (priceResult?.allClips ?? false) &&
              allContents.filter((c) => c.fileTypeId === 3).every((c) => selectedKeys.has(c.keyOriginal)),
          };

      // For paid orders, selectedKeys may not include all items of flagged types
      // (flags come from the original order, not from user interaction),
      // so we expand manually here.
      const effectiveKeys = new Set(selectedKeys);
      if (isPaid) {
        if (flags.allPhotos)
          allContents.filter((c) => c.fileTypeId === 1).forEach((c) => effectiveKeys.add(c.keyOriginal));
        if (flags.allVideos)
          allContents.filter((c) => c.fileTypeId === 2).forEach((c) => effectiveKeys.add(c.keyOriginal));
        if (flags.allClips)
          allContents.filter((c) => c.fileTypeId === 3).forEach((c) => effectiveKeys.add(c.keyOriginal));
      }

      const newAmount = isPaid
        ? payment.amount
        : (priceAfterParentDiscount ?? payment.amount);

      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/orders/order/${payment.idOrdine}/items`,
        method: "PUT",
        needAuth: true,
        body: JSON.stringify({
          selectedKeys: Array.from(effectiveKeys),
          newAmount,
          allPhotos: flags.allPhotos,
          allVideos: flags.allVideos,
          allClips: flags.allClips,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        data?: { success: boolean };
      };

      if (!response.ok) {
        throw new Error(data.message || "Errore durante il salvataggio");
      }

      onSaved();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Errore durante il salvataggio",
      );
    } finally {
      setSaving(false);
    }
  };

  // For paid orders without -1 flags: create a new supplemental order for added contents
  const handleCreateAdditionalOrder = async () => {
    if (!payment || !deltaPrice) return;
    setSaving(true);
    setSaveError(null);

    try {
      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/orders/admin/create`,
        method: "POST",
        needAuth: true,
        body: JSON.stringify({
          originalOrderId: payment.idOrdine,
          selectedKeys: Array.from(addedKeys),
          amount: deltaPrice,
          allPhotos: priceResult?.allPhotos ?? false,
          allVideos: priceResult?.allVideos ?? false,
          allClips: priceResult?.allClips ?? false,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        data?: { orderId: number };
      };

      if (!response.ok) {
        throw new Error(
          data.message || "Errore durante la creazione dell'ordine",
        );
      }

      const newOrderId = data.data!.orderId;
      onSavedAndPay?.({
        idOrdine: newOrderId,
        amount: deltaPrice,
        email: payment.email,
        currency: payment.currency,
      });
      onSaved();
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Errore durante la creazione dell'ordine",
      );
    } finally {
      setSaving(false);
    }
  };

  const currencySymbol = payment ? getCurrencySymbol(payment.currency) : "€";
  const currencyCode = payment ? getCurrencyCode(payment.currency) : "EUR";

  return (
    <>
      <Modal
        show={!!payment}
        onHide={onHide}
        centered
        size="xl"
        className="!max-w-5xl flex flex-col max-h-[90vh]"
      >
        <Modal.Header closeButton onHide={onHide}>
          <Modal.Title>
            Contenuti ordine #{payment?.idOrdine}
            {payment?.email && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                — {payment.email}
              </span>
            )}
          </Modal.Title>
        </Modal.Header>

        {isPaid && (
          <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2 text-sm text-amber-800">
            <AlertTriangle size={14} className="shrink-0" />
            {hasAllFlags
              ? "Ordine già pagato — i nuovi contenuti verranno aggiunti all'ordine esistente."
              : "Ordine già pagato — per aggiungere contenuti verrà creato un nuovo ordine aggiuntivo."}
          </div>
        )}

        {phase === "ready" && allContents.length > 0 && (
          <>
            {/* Summary bar — outside scroll area */}
            <div className="border-b border-gray-200 px-6 py-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-gray-600">
                <span className="font-semibold">{selectedKeys.size}</span>{" "}
                selezionati
                <span className="text-gray-400 ml-1">
                  / {allContents.length} totali
                </span>
              </span>
              {addedCount > 0 && (
                <span className="text-green-600 font-medium">
                  +{addedCount} aggiunti
                </span>
              )}
              {removedCount > 0 && (
                <span className="text-red-600 font-medium">
                  -{removedCount} rimossi
                </span>
              )}
              <div className="flex gap-2 ml-auto">
                {pricePackages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPriceList((v) => !v)}
                    className="px-2 py-1 text-xs border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition-colors flex items-center gap-1"
                  >
                    Listino
                    {showPriceList ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                >
                  Seleziona tutti
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                >
                  Deseleziona tutti
                </button>
              </div>
            </div>

            {showPriceList && (
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                <ul className="flex flex-wrap gap-2">
                  {pricePackages.map((p, i) => {
                    const safeTitle = DOMPurify.sanitize(
                      p.itemsLanguages?.[0]?.title ?? "",
                    );
                    const priceStr = formatPrice(
                      p.price,
                      currencySymbol,
                      currencyCode,
                    );
                    return (
                      <li
                        key={i}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${
                          p.bestOffer
                            ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                      >
                        {safeTitle && (
                          <span dangerouslySetInnerHTML={{ __html: safeTitle }} />
                        )}
                        <span className="font-medium">{priceStr}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {saveError && (
              <div className="px-6 pt-3">
                <Alert variant="danger" onDismiss={() => setSaveError(null)}>
                  {saveError}
                </Alert>
              </div>
            )}

            {pendingAutoSelects && (
              <div className="px-6 pt-3">
                <Alert variant="info">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      Il pacchetto selezionato include{" "}
                      {pendingAutoSelects.photos > 0 && "tutte le foto"}
                      {pendingAutoSelects.videos > 0 &&
                        `${pendingAutoSelects.photos > 0 ? " e " : ""}tutti i video`}
                      {pendingAutoSelects.clips > 0 &&
                        `${pendingAutoSelects.photos + pendingAutoSelects.videos > 0 ? " e " : ""}tutte le clip`}
                      {" "}—{" "}
                      <strong>+{pendingAutoSelects.total} non ancora selezionati</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddPendingAutoSelects}
                      className="shrink-0 px-3 py-1 text-xs font-medium bg-blue-100 border border-blue-400 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      Aggiungi tutti
                    </button>
                  </div>
                </Alert>
              </div>
            )}

            {newContentCounts && (
              <div className="px-6 pt-3">
                <Alert variant="warning">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      <strong>{newContentCounts.total} nuovi contenuti</strong>{" "}
                      disponibili dalla ricerca ma non nell&apos;ordine
                      {newContentCounts.photos > 0 &&
                        ` · ${newContentCounts.photos} foto`}
                      {newContentCounts.videos > 0 &&
                        ` · ${newContentCounts.videos} video`}
                      {newContentCounts.clips > 0 &&
                        ` · ${newContentCounts.clips} clip`}
                    </span>
                    <button
                      type="button"
                      onClick={handleAddNewContents}
                      className="shrink-0 px-3 py-1 text-xs font-medium bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                    >
                      Aggiungi tutti
                    </button>
                  </div>
                </Alert>
              </div>
            )}
          </>
        )}

        <Modal.Body className="p-0 overflow-y-auto flex-1 min-h-0">
          {phase === "loading" && (
            <div className="px-6 py-4">
              <LoadingState message="Caricamento contenuti..." />
            </div>
          )}

          {phase === "error" && (
            <div className="px-6 py-4 space-y-3">
              <Alert variant="danger">{phaseError}</Alert>
              <button
                type="button"
                onClick={() => setRetryCount((c) => c + 1)}
                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Riprova
              </button>
            </div>
          )}

          {phase === "ready" && allContents.length === 0 && (
            <div className="px-6 py-4">
              <EmptyState
                icon={Inbox}
                title="Nessun contenuto trovato"
                subtitle="La ricerca associata a questo ordine non ha prodotto risultati"
              />
            </div>
          )}

          {phase === "ready" && allContents.length > 0 && (
            <div className="px-6 py-4">
              <ImageGallery
                images={imagesForGallery}
                select={true}
                actions={false}
                highLightPurchased={true}
                onOpenLightbox={handleOpenLightbox}
                onImageClick={handleToggleItem}
                photoItems={photoItemsForGallery}
                aspectRatio="1:1"
                isShop={isPaid}
                dimSelected={false}
                newItemKeys={newContentKeys}
              />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <div className="text-sm text-gray-600">
            {phase === "ready" && (
              <>
                {isPaid && !hasAllFlags ? (
                  addedKeys.size > 0 && deltaPrice ? (
                    <span>
                      Importo aggiuntivo:{" "}
                      <strong>
                        {currencySymbol}
                        {deltaPrice.toFixed(2)}
                      </strong>
                      <span className="text-gray-400 ml-1">
                        (+{addedKeys.size} contenuti)
                      </span>
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      Seleziona nuovi contenuti per creare un ordine aggiuntivo
                    </span>
                  )
                ) : priceAfterParentDiscount !== null ? (
                  <>
                    Importo stimato:{" "}
                    <strong>
                      {currencySymbol}
                      {priceAfterParentDiscount.toFixed(2)}
                    </strong>
                    {payment && priceAfterParentDiscount !== payment.amount && (
                      <span className="text-xs text-gray-400 ml-2">
                        (originale: {currencySymbol}
                        {payment.amount.toFixed(2)})
                      </span>
                    )}
                  </>
                ) : (
                  <span>{selectedKeys.size} elementi selezionati</span>
                )}
              </>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onHide}
              disabled={saving}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Annulla
            </button>
            {isPaid && !hasAllFlags ? (
              <button
                type="button"
                onClick={handleCreateAdditionalOrder}
                disabled={
                  saving ||
                  addedKeys.size === 0 ||
                  !deltaPrice ||
                  phase !== "ready"
                }
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="inline mr-1" />
                    Creazione...
                  </>
                ) : (
                  <>
                    <Plus size={14} className="inline mr-1" />
                    Crea ordine aggiuntivo
                    {deltaPrice
                      ? ` (${currencySymbol}${deltaPrice.toFixed(2)})`
                      : ""}
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  !hasChanges ||
                  phase !== "ready" ||
                  selectedKeys.size === 0
                }
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="inline mr-1" />
                    Salvataggio...
                  </>
                ) : (
                  <>
                    <Save size={14} className="inline mr-1" />
                    Salva modifiche
                  </>
                )}
              </button>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      {lightboxOpen && (
        <CustomLightbox
          open={lightboxOpen}
          slides={imagesForGallery as never}
          index={lightboxIndex}
          setIndex={setLightboxIndex}
          select={true}
          actions={false}
          addToCart={true}
          onClose={() => setLightboxOpen(false)}
          onImageClick={(key) => { handleToggleItem(key); setLightboxOpen(false); }}
          photoItems={photoItemsForGallery as never}
          shopMode={isPaid}
        />
      )}
    </>
  );
}
