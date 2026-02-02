import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Settings,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Carteiras", icon: Wallet, path: "/wallets" },
  { label: "Despesas", icon: Receipt, path: "/expenses" },
  { label: "Categorias", icon: BarChart3, path: "/categories" },
  { label: "Configurações", icon: Settings, path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Expense Tracker
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white",
            )}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-500 uppercase tracking-widest font-semibold">
        Versão 1.0.0
      </div>
    </aside>
  );
}
