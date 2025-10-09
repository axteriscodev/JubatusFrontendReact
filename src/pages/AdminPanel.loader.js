import { redirect } from "react-router-dom";
import { isAdmin } from "../utils/auth";


export function loader() {
  if (!isAdmin()) {
    return redirect("/");
  }
  return null;
}
