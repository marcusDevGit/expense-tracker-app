import { X, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: "N", description: "Abrir modal de Nova Despesa" },
  { keys: "Alt + 1", description: "Ir para Dashboard" },
  { keys: "Alt + 2", description: "Ir para Carteiras" },
  { keys: "Alt + 3", description: "Ir para Despesas" },
  { keys: "Alt + 4", description: "Ir para Categorias" },
  { keys: "Alt + 5", description: "Ir para Relatórios" },
  { keys: "Alt + 6", description: "Ir para Configurações" },
  { keys: "Shift + ? / AltGr + w", description: "Abrir ou fechar esta ajuda" },
  { keys: "Esc", description: "Fechar modal aberto" },
];

export function ShortcutsHelpModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-2xl p-6 border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Atalhos Rápidos
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <div className="divide-y divide-border">
          {SHORTCUTS.map((item) => (
            <div
              key={item.keys}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              <span className="text-muted-foreground">{item.description}</span>
              <kbd className="rounded border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                {item.keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
