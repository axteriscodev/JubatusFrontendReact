import { redirect } from "react-router-dom";
import { isAdmin } from "../../utils/auth";

/**
 * Loader per verificare i permessi admin
 */
export function loader() {
  if (!isAdmin()) {
    return redirect("/");
  }
  return null;
}