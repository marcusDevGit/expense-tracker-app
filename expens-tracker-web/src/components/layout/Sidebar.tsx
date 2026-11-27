import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Settings,
  BarChart3,
  FileChartColumn,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Carteiras", icon: Wallet, path: "/wallets" },
  { label: "Despesas", icon: Receipt, path: "/expenses" },
  { label: "Categorias", icon: BarChart3, path: "/categories" },
  { label: "Relatórios", icon: FileChartColumn, path: "/reports" },
  { label: "Configurações", icon: Settings, path: "/settings" },
];

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex w-64 bg-card text-card-foreground border-r border-border flex-col h-full shrink-0",
        className,
      )}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
          <Wallet size={20} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-foreground text-base font-extrabold leading-tight">
            Expense Tracker
          </h1>
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">
            Gestão Pessoal
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border text-xs text-muted-foreground uppercase tracking-widest font-semibold">
        Versão 0.4.2
      </div>
    </aside>
  );
}
