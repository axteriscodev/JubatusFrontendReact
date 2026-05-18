// Loader React Router per l'area personale.
// Reindirizza alla home se l'utente non è autenticato (JWT assente/scaduto).
import { redirect } from "react-router-dom";
import { isAuthenticated } from "@common/utils/auth";
import type { LoaderFunction } from "react-router-dom";

export const loader: LoaderFunction = () => {
  if (!isAuthenticated()) {
    return redirect("/");
  }
  return null;
};
