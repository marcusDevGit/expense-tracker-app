import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService, type Category } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CreateCategoryModal({ isOpen, onClose, category }: Props) {
  const [name, setName] = useState(category?.name ?? "");
  const [budget, setBudget] = useState(
    category?.budget ? String(category.budget) : "",
  );
  const [color, setColor] = useState(category?.color || "#6366f1");
  const [icon, setIcon] = useState(category?.icon || "🏷️");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const COLORS = [
    "#6366f1",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#3b82f6",
    "#94a3b8",
    "#1e293b",
    "#f5f5f5",
    "#ffffff",
  ];

  const EMOJIS = [
    "🏷️",
    "🍔",
    "🚗",
    "🏠",
    "🎓",
    "💰",
    "✈️",
    "⚽",
    "🎨",
    "💻",
    "💊",
    "🛒",
    "💡",
    "🎮",
    "📚",
    "🏋️",
    "🎭",
    "🎬",
    "🎤",
    "🎸",
    "🎹",
    "🎻",
    "🎺",
    "🎷",
    "🥁",
  ];

  const mutation = useMutation({
    mutationFn: (data: {
      name: string;
      color?: string;
      icon?: string;
      budget?: number;
    }) =>
      category
        ? categoryService.update(
            category.id,
            data.name,
            data.color,
            data.icon,
            data.budget,
          )
        : categoryService.create(data.name, data.color, data.icon, data.budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Sucesso!", description: "Categoria criada com sucesso" });
      onClose();
    },
  });
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-card border border-border rounded-xl p-5 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {category ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <Button type="button" variant="ghost" onClick={onClose} size="icon">
            <X size={18} />
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate({ name, color, icon, budget: Number(budget) });
          }}
          className="space-y-3"
        >
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome da Categoria</Label>
            <Input
              id="category-name"
              placeholder="Ex: Alimentação, Transporte..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-budget">Orçamento Mensal (R$)</Label>
            <Input
              id="category-budget"
              type="number"
              inputMode="decimal"
              step={0.01}
              placeholder="Ex: 500.00"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? "border-primary ring-2 ring-ring scale-110" : "border-border/50"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ícone / Emoji</Label>
            <div className="grid grid-cols-8 gap-1 border border-border rounded-md p-1.5">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  className={`text-lg p-1 rounded hover:bg-muted ${icon === e ? "bg-primary/15 ring-1 ring-primary" : ""}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : category ? (
                "Salvar Alterações"
              ) : (
                "Criar Categoria"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
