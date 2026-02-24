import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

export function PageLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted">
          {children}
        </main>
      </div>
    </div>
  );
}
