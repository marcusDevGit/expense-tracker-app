import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  expenseService,
  type Expense,
  type ExpenseSuggestion,
} from "@/services/expense.service";
import { ApiHttpError } from "@/services/api";
import { walletService } from "@/services/wallet.service";
import { categoryService } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { statsService } from "@/services/stats.service";
import { useFormatters } from "@/hooks/use-formatters";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Expense | null;
}

export function CreateExpenseModal({ isOpen, onClose, initialData }: Props) {
  const { formatCurrency } = useFormatters();
  const [isRecurring, setIsRecurring] = useState(
    initialData?.isRecurring ?? false,
  );
  const [recurrenceType, setRecurrenceType] = useState<
    "WEEKLY" | "MONTHLY" | "YEARLY"
  >(initialData?.recurrenceType ?? "MONTHLY");
  const [paymentMethod, setPaymentMethod] = useState<string>(
    initialData?.paymentMethod ?? "CASH",
  );
  const [installments, setInstallments] = useState(1);
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [amount, setAmount] = useState(
    initialData?.amount !== undefined ? String(initialData.amount) : "",
  );
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [walletId, setWalletId] = useState(initialData?.walletId ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.list,
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.list,
  });

  const activeWalletId = walletId || wallets?.[0]?.id || "";

  const { data: suggestions } = useQuery({
    queryKey: ["expense-suggestions", description],
    queryFn: () =>
      expenseService.suggestions({
        q: description.trim() || undefined,
        limit: 5,
      }),
    enabled: isOpen && !initialData,
  });

  const handleApplySuggestion = (suggestion: ExpenseSuggestion) => {
    setDescription(suggestion.description);
    setAmount(String(suggestion.amount));
    if (suggestion.walletId) {
      setWalletId(suggestion.walletId);
    }
    if (suggestion.categoryId) {
      setIsCreatingCategory(false);
      setNewCategoryName("");
      setCategoryId(suggestion.categoryId);
    }
    if (suggestion.paymentMethod) {
      setPaymentMethod(suggestion.paymentMethod);
    }
  };

  const selectedDate = new Date(expenseDate);
  const { data: stats } = useQuery({
    queryKey: [
      "stats",
      "dashboard",
      activeWalletId,
      selectedDate.getMonth() + 1,
      selectedDate.getFullYear(),
    ],
    queryFn: () =>
      statsService.getDashboardStats(
        activeWalletId,
        selectedDate.getMonth() + 1,
        selectedDate.getFullYear(),
      ),
    enabled: !!activeWalletId && !!categoryId && categoryId !== "NEW",
  });

  const selectedCategory = categories?.find((c) => c.id === categoryId);
  const categoryStats = stats?.categoryBreakdown.find(
    (s) => s.categoryId === categoryId,
  );

  const currentSpent = categoryStats?.total || 0;
  const budget = selectedCategory?.budget || 0;
  const newTotal = currentSpent + Number(amount || 0);
  const isOverBudget = budget > 0 && newTotal > budget;

  const mutation = useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast({
        title: "Sucesso",
        description: initialData ? "Despesa duplicada" : "Despesa criada",
      });
      onClose();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiHttpError
          ? error.response.data?.error || error.message
          : "Não foi possível salvar a despesa";
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
    },
  });
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-card border border-border rounded-xl shadow-2xl p-5 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {initialData ? "Duplicar Despesa" : "Nova Despesa"}
          </h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate({
              description,
              amount: Number(amount),
              expenseDate,
              walletId: activeWalletId,
              categoryId: categoryId || undefined,
              newCategoryName: newCategoryName || undefined,
              isRecurring,
              recurrenceType: isRecurring ? recurrenceType : undefined,
              paymentMethod,
              installments: Number(installments),
            });
          }}
          className="space-y-3"
        >
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {!initialData && suggestions && suggestions.length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Sugestões do histórico
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.description}-${suggestion.walletId}`}
                      type="button"
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs text-foreground hover:bg-primary/10 hover:border-primary/40 transition-colors"
                    >
                      <span className="font-medium">
                        {suggestion.description}
                      </span>
                      {suggestion.categoryName && (
                        <span className="text-muted-foreground">
                          · {suggestion.categoryName}
                        </span>
                      )}
                      <span className="text-primary font-semibold">
                        · {formatCurrency(suggestion.amount)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input
                type="number"
                inputMode="decimal"
                step={0.01}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {isOverBudget && (
                <div className="flex items-center gap-1.5 mt-1 text-amber-600 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertTriangle size={14} />
                  <span className="text-[11px] font-medium leading-tight">
                    Esta despesa fará você exceder o orçamento de{" "}
                    {formatCurrency(budget)} para esta categoria.
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Carteira</Label>
            <select
              className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={activeWalletId}
              onChange={(e) => setWalletId(e.target.value)}
              required
            >
              <option value="">Selecione uma carteira</option>
              {wallets?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <select
              className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={categoryId}
              onChange={(e) => {
                if (e.target.value === "NEW") {
                  setIsCreatingCategory(true);
                  setCategoryId("");
                } else {
                  setIsCreatingCategory(false);
                  setCategoryId(e.target.value);
                }
              }}
            >
              <option value="">Sem Categoria</option>
              <option value="NEW">Nova Categoria</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            {isCreatingCategory && (
              <Input
                placeholder="Nome da nova categoria"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="recurring"
              checked={isRecurring}
              onCheckedChange={(checked) => setIsRecurring(checked === true)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="recurring">Recorrente</Label>
          </div>
          {isRecurring && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <Label>Recorrência</Label>
              <select
                className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={recurrenceType}
                onChange={(e) =>
                  setRecurrenceType(
                    e.target.value as "WEEKLY" | "MONTHLY" | "YEARLY",
                  )
                }
              >
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensal</option>
                <option value="YEARLY">Anual</option>
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <select
                className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="CASH">Dinheiro</option>
                <option value="CREDIT_CARD">Cartão de Crédito</option>
                <option value="DEBIT_CARD">Cartão de Débito</option>
                <option value="PIX">Pix</option>
                <option value="BANK_TRANSFER">Transferência</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Parcelas</Label>
              <Input
                type="number"
                min={1}
                max={48}
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                required
              />
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
              disabled={mutation.isPending}
              className="flex-1"
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Salvar Despesa"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
