import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ShortcutsHelpModal } from "./ShortcutsHelpModal";
import { CreateExpenseModal } from "@/pages/expenses/components/CreateExpenseModal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";

const QUICK_ROUTES = [
  "/",
  "/wallets",
  "/expenses",
  "/categories",
  "/reports",
  "/settings",
];

export function PageLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useKeyboardShortcuts({
    onNewExpense: () => {
      setIsShortcutsOpen(false);
      setIsQuickExpenseOpen(true);
    },
    onToggleHelp: () => {
      setIsQuickExpenseOpen(false);
      setIsShortcutsOpen((prev) => !prev);
    },
    onEscape: () => {
      setIsQuickExpenseOpen(false);
      setIsShortcutsOpen(false);
      setIsMobileMenuOpen(false);
    },
    onNavigate: (index) => {
      const target = QUICK_ROUTES[index];
      if (target) navigate(target);
    },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden lg:flex" />

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <Sidebar
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform flex lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <Header
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onNewExpenseClick={() => setIsQuickExpenseOpen(true)}
          onShortcutsClick={() => setIsShortcutsOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
          {children}
        </main>
      </div>

      <CreateExpenseModal
        key={isQuickExpenseOpen ? "quick-open" : "quick-closed"}
        isOpen={isQuickExpenseOpen}
        onClose={() => setIsQuickExpenseOpen(false)}
      />
      <ShortcutsHelpModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
