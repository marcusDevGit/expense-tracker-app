import { useAuthStore } from "@/stores/auth.store";
import { LogOut, User as UserIcon, Menu, Plus, Keyboard } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderProps {
  onMenuClick?: () => void;
  onNewExpenseClick?: () => void;
  onShortcutsClick?: () => void;
}

export function Header({
  onMenuClick,
  onNewExpenseClick,
  onShortcutsClick,
}: HeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          Minhas Finanças
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {onNewExpenseClick && (
          <Button
            size="sm"
            onClick={onNewExpenseClick}
            className="gap-1.5 hidden sm:inline-flex"
            title="Nova Despesa (Atalho: N)"
          >
            <Plus size={16} />
            <span>Despesa</span>
            <kbd className="ml-1 rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-semibold">
              N
            </kbd>
          </Button>
        )}

        {onShortcutsClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onShortcutsClick}
            className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
            title="Atalhos rápidos (?)"
          >
            <Keyboard size={18} />
          </Button>
        )}

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
          variant="ghost"
          size="icon"
          onClick={logout}
          className="text-muted-foreground hover:text-destructive transition-colors"
          title="Sair"
        >
          <LogOut size={20} />
        </Button>
      </div>
    </header>
  );
}
