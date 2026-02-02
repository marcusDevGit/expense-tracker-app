import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/layout/PageLayout";
import { statsService } from "@/services/stats.service";
import { walletService } from "@/services/wallet.service";
import { expenseService } from "@/services/expense.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Wallet, TrendingDown, Receipt, PieChartIcon } from "lucide-react";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function Dashboard() {
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.list,
  });

  useEffect(() => {
    if (wallets?.length && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [selectedWalletId, wallets]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats", selectedWalletId, month, year],
    queryFn: () => statsService.getDashboard(selectedWalletId!, month, year),
    enabled: !!selectedWalletId,
  });

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A020F0",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFFFFF",
  ];

  const currentWallet = wallets?.find((w) => w.id === selectedWalletId);

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <select
            className="border rounded-md p-2 tex-sm bg-white"
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

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              <Wallet className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(currentWallet?.currentBalance || 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Despesas (Mês)
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
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-4">
            <CardTitle className="mb-4 flex items-center gap-2">
              <PieChartIcon size={20} /> Gasto por Categoria
            </CardTitle>
            <div className="h-[300px]">
              {stats?.categoryBreakdown?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryBreakdown}
                      dataKey="total"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {stats.categoryBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  Sem dados este mês
                </div>
              )}
            </div>
          </Card>
          <Card className="p-6 space-y-4">
            <CardTitle>Resumo Detalhado</CardTitle>
            {stats?.categoryBreakdown?.map((cat, i) => (
              <div
                key={cat.name}
                className="flex justify-between items-center text-sm"
              >
                <span className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {cat.name}
                </span>
                <span className="font-bold">
                  {formatCurrency(cat.total)}({cat.percentage}%)
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
