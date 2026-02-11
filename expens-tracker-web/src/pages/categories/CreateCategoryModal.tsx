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
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [icon, setIcon] = useState("🏷️");
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

  useEffect(() => {
    if (category) {
      setName(category.name);
      setBudget(category.budget ? String(category.budget) : "");
      setColor(category.color || "#6366f1");
      setIcon(category.icon || "🏷️");
    } else {
      setName("");
      setBudget("");
      setColor("#6366f1");
      setIcon("🏷️");
    }
  }, [category, isOpen]);

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card rounded-xl p-6 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {category ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <Button variant="ghost" onClick={onClose} size="icon">
            <X size={20} />
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate({ name, color, icon, budget: Number(budget) });
          }}
          className="space-y-4"
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
              placeholder="Ex: 500.00"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? "border-slate-900 scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Icone / Emoje</Label>
            <div className="grid grid-cols-5 gap-2 border rounded-md p-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  className={`text-2xl p-2 rounded hover:bg-muted ${icon === e ? "bg-slate-200" : ""}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : category ? (
              "Salva Alterações"
            ) : (
              "Criar Categoria"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
