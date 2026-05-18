import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/routes";

/**
 * Wrapper di routing che intercetta tutte le navigazioni quando VITE_WIP_MODE="true"
 * e reindirizza ogni path verso la pagina Work In Progress.
 */
const RouterWrapper = () => {
  const isWIP = import.meta.env.VITE_WIP_MODE === "true";
  const location = useLocation();

  if (isWIP && location.pathname !== ROUTES.WORK_IN_PROGRESS) {
    return <Navigate to={ROUTES.WORK_IN_PROGRESS} replace />;
  }

  return <Outlet />;
};

export default RouterWrapper;
