import { Navigate, Outlet, useLocation } from "react-router-dom";

const RouterWrapper = () => {
  const isWIP = import.meta.env.VITE_WIP_MODE === "true";
  const location = useLocation();

  if (isWIP && location.pathname !== "/work-in-progress") {
    return <Navigate to="/work-in-progress" replace />;
  }

  return <Outlet />;
};

export default RouterWrapper;
