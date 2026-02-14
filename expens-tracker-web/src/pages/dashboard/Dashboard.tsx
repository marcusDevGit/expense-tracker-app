import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/layout/PageLayout";
import { statsService } from "@/services/stats.service";
import { useSettingsStore } from "@/stores/settings.store";
import { useAuthStore } from "@/stores/auth.store";
import { walletService } from "@/services/wallet.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormatters } from "@/hooks/use-formatters";
import {
  Wallet,
  TrendingDown,
  Receipt,
  PieChartIcon,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  XAxis,
  Tooltip,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
} from "recharts";

export function Dashboard() {
  const { formatCurrency } = useFormatters();
  const settings = useSettingsStore();
  const { user } = useAuthStore();
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
      const defaultId = user?.defaultWalletId || wallets[0].id;
      setSelectedWalletId(defaultId);
    }
  }, [wallets, user?.defaultWalletId]);

  const { data: stats } = useQuery({
    queryKey: ["stats", selectedWalletId, month, year],
    queryFn: () =>
      statsService.getDashboardStats(selectedWalletId!, month, year),
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
            className="border rounded-md p-2 text-sm bg-background"
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              <Wallet className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${(currentWallet?.currentBalance || 0) < 0 ? "text-red-600" : "text-foreground"}`}
              >
                {settings.hideBalances
                  ? "••••••"
                  : formatCurrency(currentWallet?.currentBalance || 0)}
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
              {stats?.month.daysRemaining && stats.month.daysRemaining > 0 ? (
                <p className="text-[10px] text-blue-600 mt-1 font-medium">
                  Faltam {stats.month.daysRemaining} dias para fechar o mês
                </p>
              ) : (
                stats?.month.predictedTotal &&
                stats.month.predictedTotal >
                  (stats?.month.totalExpense || 0) && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Previsão:{" "}
                    <span className="font-semibold text-foreground/70">
                      {formatCurrency(stats.month.predictedTotal)}
                    </span>
                  </p>
                )
              )}
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
          <Card className="bg-muted/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Próximo Mês</CardTitle>
              <CalendarDays className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground/70">
                {formatCurrency(stats?.month.nextMonthTotal || 0)}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Recorrentes e parcelas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas de Orçamento */}
        {stats?.categoryBreakdown.some(
          (c) => c.budget > 0 && c.total > c.budget,
        ) && (
          <Card className="border-red-100 bg-red-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-600">
                <AlertTriangle size={18} /> Atenção: Orçamentos Estourados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {stats.categoryBreakdown
                  .filter((c) => c.budget > 0 && c.total > c.budget)
                  .map((c) => (
                    <div
                      key={c.name}
                      className="flex flex-col p-3 rounded-lg bg-background border border-red-100 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-foreground">
                          {c.name}
                        </span>
                        <span className="text-red-600 font-bold text-xs">
                          +{formatCurrency(c.total - c.budget)}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mb-2">
                        Limite: {formatCurrency(c.budget)} | Gasto:{" "}
                        {formatCurrency(c.total)}
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gráfico de Pizza */}
          <Card className="p-4 min-w-0">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChartIcon size={20} className="text-indigo-500" />
                Distribuição por Categoria
              </CardTitle>
            </CardHeader>
            <div className="h-[300px] w-full">
              {stats?.categoryBreakdown &&
              stats.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryBreakdown}
                      dataKey="total"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {stats.categoryBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: any) => formatCurrency(Number(v) || 0)}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  Sem dados para o gráfico de pizza
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 ">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown size={20} className="text-indigo-500" />
                Gastos Totais por Categoria
              </CardTitle>
            </CardHeader>
            <div className="h-[300px] w-full">
              {stats?.categoryBreakdown &&
              stats.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.categoryBreakdown}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v: any) => `R$${v}`}
                    />
                    <Tooltip
                      formatter={(v: any) => formatCurrency(Number(v) || 0)}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="total"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  Sem dados para o gráfico de barras
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 space-y-4 lg:col-span-2">
            <CardTitle>Resumo Detalhado</CardTitle>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats?.categoryBreakdown?.map((cat, i) => (
                <div
                  key={cat.name}
                  className="flex justify-between items-center p-3 rounded-lg bg-card border border-slate-100"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    {cat.name}
                  </span>
                  <div className="text-right">
                    <div className="font-bold text-foreground">
                      {formatCurrency(cat.total)}
                    </div>
                    <div className="text-[11px] text-blue-600 font-bold">
                      {cat.suggestedDailyLimit > 0
                        ? `${formatCurrency(cat.suggestedDailyLimit)}/dia`
                        : "Sem saldo"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
