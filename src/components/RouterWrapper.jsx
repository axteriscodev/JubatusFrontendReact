import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";

const RouterWrapper = () => {
  const isWIP = import.meta.env.VITE_WIP_MODE === "true";
  const location = useLocation();

  if (isWIP && location.pathname !== ROUTES.WORK_IN_PROGRESS) {
    return <Navigate to={ROUTES.WORK_IN_PROGRESS} replace />;
  }

  return <Outlet />;
};

export default RouterWrapper;
