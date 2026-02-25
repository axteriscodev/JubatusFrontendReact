import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarDays, CreditCard, MapPin, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/routes";
import { logOut, isOrganizationAdmin } from "@common/utils/auth";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}


const ALL_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: ROUTES.ADMIN, icon: LayoutDashboard, end: true },
  { label: "Elenco eventi", to: ROUTES.ADMIN_EVENTS, icon: CalendarDays },
  { label: "Elenco reader", to: ROUTES.ADMIN_READERS, icon: CreditCard },
  { label: "Elenco location", to: ROUTES.ADMIN_LOCATIONS, icon: MapPin },
];

const RESTRICTED_NAV_ITEMS: NavItem[] = [
  { label: "Elenco eventi", to: ROUTES.ADMIN_EVENTS, icon: CalendarDays },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const navItems = isOrganizationAdmin() ? ALL_NAV_ITEMS : RESTRICTED_NAV_ITEMS;
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("adminSidebarCollapsed") === "true"
  );

  const handleToggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem("adminSidebarCollapsed", String(!prev));
      return !prev;
    });
  };

  const handleLogout = () => {
    logOut();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-gray-800 text-white shrink-0 transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center h-16 px-4 border-b border-gray-700 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {!collapsed && (
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Admin
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-gray-700 text-white border-l-2 border-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white border-l-2 border-transparent"
              }`
            }
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-red-400 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        <button
          type="button"
          onClick={handleToggle}
          title={collapsed ? "Espandi menu" : "Comprimi menu"}
          className={`flex items-center w-full px-4 py-3 text-gray-500 hover:bg-gray-700 hover:text-white transition-colors ${
            collapsed ? "justify-center" : "justify-end"
          }`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
