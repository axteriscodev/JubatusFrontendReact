import { useState, useRef, useEffect } from "react";
import { apiRequest, listenSSE } from "@common/services/api-services";
import { API } from "@common/services/api-endpoints";
import { cartActions } from "@features/shop/store/cart-slice";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";

type RefineStatus = "idle" | "loading" | "error";

/**
 * Gestisce il flusso di affinamento ricerca: POST /contents/refine-search
 * seguito da GET /contents/sse-refined/:searchId.
 *
 * Il server copia la foto scelta in posizione selfie e rilancia Jubatus
 * sullo stesso searchId. Quando arrivano i nuovi risultati, aggiorna
 * lo store Redux e svuota il carrello (le selezioni precedenti non sono più valide).
 *
 * Timeout di 30 secondi come da specifica API: se la SSE non risponde
 * entro quel limite, la connessione viene chiusa e lo status passa a 'error'.
 */
export function useRefineSearch() {
  const [status, setStatus] = useState<RefineStatus>("idle");
  const dispatch = useAppDispatch();
  const searchId = useAppSelector((s) => s.cart.searchId);
  // Funzione di abort della SSE, usata sia per il timeout che per il cleanup al dismount
  const abortRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refine = async (keyOriginal: string) => {
    setStatus("loading");

    try {
      const res = await apiRequest({
        api: API.CONTENTS_REFINE_SEARCH,
        method: "POST",
        body: JSON.stringify({ searchId, photoS3Key: keyOriginal }),
        needAuth: true,
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      const json = await res.json();
      const refinedSearchId: number = json.data.searchId;
      const parentSearchId: number = json.data.parentSearchId;
      const isRefined: boolean = json.data.isRefined;

      // La POST è andata a buon fine: aggiorna lo store con i dati della ricerca affinata
      dispatch(cartActions.updateSearchId(refinedSearchId));
      dispatch(cartActions.updateParentSearchId(parentSearchId));
      dispatch(cartActions.updateIsRefined(isRefined));
      dispatch(cartActions.updateHasSelfie(true));

      const revertSearch = () => {
        dispatch(cartActions.updateSearchId(parentSearchId));
        dispatch(cartActions.updateParentSearchId(0));
        dispatch(cartActions.updateIsRefined(false));
      };

      // Apre la SSE refined solo dopo conferma 200 dalla POST
      timeoutRef.current = setTimeout(
        () => {
          abortRef.current?.();
          revertSearch();
          setStatus("error");
        },
        Number(import.meta.env.VITE_PROCESSING_SELFIE_TIMEOUT) || 30000,
      );

      abortRef.current = listenSSE(
        API.CONTENTS_SSE_REFINED(refinedSearchId),
        (data) => {
          console.log(`risposta SSE RIFINED per id: ${refinedSearchId}`);
          console.log(`contenuti arrivati: ${data}`);
          clearTimeout(timeoutRef.current!);
          abortRef.current?.();
          const parsed = JSON.parse(data);
          // removeAllItems prima di updateProducts: evita che i flag hasPhoto/Video/Clip
          // vengano riscritti a false da removeAllItems dopo essere stati già aggiornati
          dispatch(cartActions.removeAllItems());
          dispatch(cartActions.updateProducts(parsed.contents));
          dispatch(cartActions.updateHasPhoto(parsed.hasPhoto ?? false));
          dispatch(cartActions.updateHasVideo(parsed.hasVideo ?? false));
          dispatch(cartActions.updateHasClip(parsed.hasClip ?? false));
          dispatch(cartActions.updateUserId(parsed.userId));
          dispatch(cartActions.updateUserEmail(parsed.userEmail));
          dispatch(
            cartActions.updatePreviousAllPhotosPurchase(
              parsed.previousAllPhotosPurchase ?? false,
            ),
          );
          setStatus("idle");
        },
        () => {
          clearTimeout(timeoutRef.current!);
          revertSearch();
          setStatus("error");
        },
      );
    } catch {
      setStatus("error");
    }
  };

  // Chiude la SSE e annulla il timeout se il componente viene smontato
  // mentre l'affinamento è ancora in corso
  useEffect(() => {
    return () => {
      abortRef.current?.();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { refine, status };
}
