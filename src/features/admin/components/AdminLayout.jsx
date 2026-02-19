import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  useEffect(() => {
    document.body.classList.add("admin");
    return () => {
      document.body.classList.remove("admin");
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto pt-8">
        <Outlet />
      </main>
    </div>
  );
}
