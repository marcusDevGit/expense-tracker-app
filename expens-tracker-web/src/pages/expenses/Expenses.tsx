import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageLayout } from "@/components/layout/PageLayout";
import { CreateExpenseModal } from "./CreateExpenseModal";
import { expenseService } from "@/services/expense.service";
import { walletService } from "@/services/wallet.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Receipt,
  Calendar as CalendarIcon,
  Tag,
  Trash2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.list,
  });

  useEffect(() => {
    if (wallets && wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets, selectedWalletId]);

  const deleteMutation = useMutation({
    mutationFn: expenseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast({ title: "Sucesso", description: "Despesa deletada com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao deletar despesa",
        variant: "destructive",
      });
    },
  });

  const { data: expensesResponse, isLoading } = useQuery({
    queryKey: ["expenses", selectedWalletId, month, year, page],
    queryFn: () =>
      expenseService.list({
        walletId: selectedWalletId!,
        month,
        year,
        page,
        limit: 10,
      }),
    enabled: !!selectedWalletId,
  });

  const expenses = expensesResponse?.data;
  const meta = expensesResponse?.meta;

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const years = [2024, 2025, 2026];

  return (
    <PageLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Despesas
          </h1>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Nova Despesa
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs text-slate-500 mb-1 block">
              Carteira
            </Label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={selectedWalletId}
              onChange={(e) => setSelectedWalletId(e.target.value)}
            >
              {wallets?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-40">
            <Label className="text-xs text-slate-500 mb-1 block">Mês</Label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-28">
            <Label className="text-xs text-slate-500 mb-1 block">Ano</Label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-2">
          {isLoading ? (
            <div className="text-center py-10 text-slate-500">
              Carregando despesas...
            </div>
          ) : expenses?.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Nenhuma despesa encontrada.
            </div>
          ) : (
            <>
              {expenses?.map((expense) => (
                <Card
                  key={expense.id}
                  className="overflow-hidden border-slate-200"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-50 p-2 rounded-lg text-red-600">
                        <Receipt size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {expense.description}
                        </p>
                        <div className="flex gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={12} />
                            {formatDate(expense.expenseDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag size={12} />
                            {expense.category?.name || "Sem Categoria"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      - {formatCurrency(expense.amount)}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-slate-600">
                    Página {page} de {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage((p) => Math.min(meta.totalPages, p + 1))
                    }
                    disabled={page === meta.totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <CreateExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PageLayout>
  );
}
