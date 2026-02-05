import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { expenseService } from "@/services/expense.service";
import { walletService } from "@/services/wallet.service";
import { categoryService } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { statsService } from "@/services/stats.service";
import { formatCurrency } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateExpenseModal({ isOpen, onClose }: Props) {
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<
    "WEEKLY" | "MONTHLY" | "YEARLY"
  >("MONTHLY");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [installments, setInstallments] = useState(1);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [walletId, setWalletId] = useState("");
  const [categoryId, setCategoryId] = useState("");
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

  useEffect(() => {
    if (wallets && wallets.length > 0 && !walletId) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  const selectedDate = new Date(expenseDate);
  const { data: stats } = useQuery({
    queryKey: [
      "stats",
      "dashboard",
      walletId,
      selectedDate.getMonth() + 1,
      selectedDate.getFullYear(),
    ],
    queryFn: () =>
      statsService.getDashboardStats(
        walletId,
        selectedDate.getMonth() + 1,
        selectedDate.getFullYear(),
      ),
    enabled: !!walletId && !!categoryId && categoryId !== "NEW",
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
      toast({ title: "Sucesso", description: "Despesa criada" });
      onClose();
    },
  });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Nova Despesa</h2>
          <Button variant="ghost" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate({
              description,
              amount: Number(amount),
              expenseDate,
              walletId,
              categoryId: categoryId || undefined,
              newCategoryName: newCategoryName || undefined,
              isRecurring,
              recurrenceType: isRecurring ? recurrenceType : undefined,
              paymentMethod: paymentMethod as any,
              installments: Number(installments),
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input
                type="number"
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
              className="w-full border rounded-md p-2"
              value={walletId}
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
              className="w-full border rounded-md p-2"
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
                className="w-full border rounded-md p-2"
                value={recurrenceType}
                onChange={(e) => setRecurrenceType(e.target.value as any)}
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
                className="w-full border rounded-md p-2 text-sm"
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
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Salvar Despesa"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
