import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/layout/PageLayout";
import { statsService } from "@/services/stats.service";
import { walletService } from "@/services/wallet.service";
import { expenseService } from "@/services/expense.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Wallet, TrendingDown, Receipt } from "lucide-react";
import { useState } from "react";

export function Dashboard() {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.list,
  });

  if (!selectedWalletId && wallets?.length) {
    setSelectedWalletId(wallets[0].id);
  }

  const { data: stats } = useQuery({
    queryKey: ["stats", selectedWalletId],
    queryFn: () => statsService.getDashboard(selectedWalletId!, month, year),
    enabled: !!selectedWalletId,
  });

  return (
    <PageLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium>">Saldo</CardTitle>
              <Wallet className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  wallets?.find((w) => w.id === selectedWalletId)?.balance || 0,
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Gastos no Mês
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.month.totalExpense || 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transações</CardTitle>
              <Receipt className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.month.count || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
