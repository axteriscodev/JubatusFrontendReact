import { redirect } from "react-router-dom";
import { isAuthenticated } from "@common/utils/auth";

export function loader() {
  if (!isAuthenticated()) {
    return redirect("/");
  }
  return null;
}
