import { Outlet } from "react-router-dom";
import { isAdmin, getRole } from "@common/utils/auth";

export default function ShopLayout() {
  // Il banner "NAVIGAZIONE TOTEM" viene mostrato solo agli admin con permesso canViewOriginalContent,
  // per segnalare che si sta visualizzando il contenuto originale (modalità totem/kiosk)
  const showOriginalContentBanner =
    isAdmin() && getRole()?.canViewOriginalContent === true;

  return (
    <>
      {showOriginalContentBanner && (
        <div className="sticky top-0 z-50 bg-yellow-400 py-1 text-center text-sm font-semibold text-yellow-900">
          NAVIGAZIONE TOTEM
        </div>
      )}
      <div className="my-10 px-4 md:px-0">
        <Outlet />
      </div>
    </>
  );
}
