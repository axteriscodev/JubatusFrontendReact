import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/** Hook tipizzato per il dispatch Redux (evita il cast manuale ad AppDispatch). */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Hook tipizzato per la selezione dallo store Redux con inferenza del tipo di ritorno. */
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
