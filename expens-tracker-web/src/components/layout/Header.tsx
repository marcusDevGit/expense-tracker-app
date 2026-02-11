import { useAuthStore } from "@/stores/auth.store";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "../ui/button";

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-slate-700">Minhas Finanças</h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-right">
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">
              Olá, {user?.name}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <UserIcon size={16} className="text-muted-foreground" />
          </div>
        </div>

        <Button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Sair"
        >
          <LogOut size={20} />
        </Button>
      </div>
    </header>
  );
}
