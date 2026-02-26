import { Outlet } from "react-router-dom";

export default function ShopLayout() {
  return (
    <div className="my-10">
      <Outlet />
    </div>
  );
}
