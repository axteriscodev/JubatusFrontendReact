import { Outlet } from "react-router-dom";

export default function ShopLayout() {
  return (
    <div className="my-10 px-4 md:px-0">
      <Outlet />
    </div>
  );
}
