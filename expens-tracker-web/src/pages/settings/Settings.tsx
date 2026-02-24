import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSettingsStore } from "@/stores/settings.store";
import {
  Coins,
  Calendar,
  Bell,
  Moon,
  Languages,
  Clock,
  User,
  Mail,
  Database,
  Download,
  Upload,
  Trash2,
  EyeOff,
  Shield,
  Layers,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { PageLayout } from "@/components/layout/PageLayout";
import { walletService } from "@/services/wallet.service";
import { categoryService } from "@/services/category.service";
import { userService, type UserProfile } from "@/services/user.service";
import { dataService } from "@/services/data.service";
import { PasswordForm } from "./components/PasswordForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export function Settings() {
  const { user: authUser, updateUser } = useAuthStore();
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [defaultWalletId, setDefaultWalletId] = useState(
    authUser?.defaultWalletId || "",
  );
  const settings = useSettingsStore();
  const { toast } = useToast();

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: userService.getProfile,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setDefaultWalletId(profile.defaultWalletId || "");
    }
  }, [profile]);

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.list,
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.list,
  });
  const updateProfileMutation = useMutation<
    UserProfile,
    Error,
    Partial<UserProfile>
  >({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      updateUser(data);
      toast({ title: "Sucesso", description: "Perfil atualizado com sucesso" });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => {
      toast({
        title: "Erro",
        description: err.response?.data?.error || "Erro ao atualizar perfil",
        variant: "destructive",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: dataService.resetData,
    onSuccess: () => {
      toast({
        title: "Dados resetados",
        description: "Todas as suas transações foram apagadas.",
      });
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao resetar dados",
        variant: "destructive",
      });
    },
  });

  const handleExport = async () => {
    try {
      toast({
        title: "Iniciando exportação",
        description: "Seu arquivo CSV está sendo gerado...",
      });
      await dataService.exportCSV();
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };
  const handleReset = () => {
    if (
      window.confirm(
        "VOCẼ TEM CERTEZA? Isso apagará todas as suas transações permanetemente!",
      )
    ) {
      resetMutation.mutate();
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Atenção",
        description: "Nome e E-mail são obrigatórios!",
        variant: "destructive",
      });
      return;
    }
    try {
      await updateProfileMutation.mutateAsync({
        name,
        email,
        defaultWalletId,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Configurações
        </h1>
        <Card className="border-none shadow-md overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/50">
            <div className=" flex items-center gap-2">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <User size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">Perfil do Usuário</CardTitle>
                <CardDescription>
                  Gerencie suas informações de acesso
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User size={14} />
                  Nome
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu Nome"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail size={14} />
                  Email
                </Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div className="pt-2">
              <PasswordForm />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Coins size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Preferência de Orçamento
                </CardTitle>
                <CardDescription>
                  Ajuste como o app calcula seu ciclo financeiro
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <Calendar size={16} />
                  Dia de Inicio do Mês
                </Label>
                <select
                  value={settings.startDay}
                  onChange={(e) =>
                    settings.updateSetting({ startDay: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Define o dia em que seu orçamento reinicia.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <Bell size={16} />
                  Alerta de Limite (%)
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.alertThreshold}
                    onChange={(e) =>
                      settings.updateSetting({
                        alertThreshold: parseFloat(e.target.value),
                      })
                    }
                    className="w-24"
                  />
                  <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-300 space-x-6"
                      style={{ width: `${settings.alertThreshold}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Notificar ao atingir este percentual do orçamento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Layers size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Categorias e Carteiras
                </CardTitle>
                <CardDescription>
                  Gerencie seus métodos e classificações
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Carteira Padrão */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Carteira Padrão para Novos Gastos
                </Label>
                <select
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={defaultWalletId}
                  onChange={(e) => setDefaultWalletId(e.target.value)}
                >
                  <option value="">Selecione uma carteira principal...</option>
                  {wallets?.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground italic">
                  Esta carteira será pré-selecionada ao criar uma nova
                  transação.
                </p>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-bold">
                    Resumo de Categorias
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {categories?.length || 0} categorias ativas
                  </p>
                </div>

                {/* Listagem Real de Categorias */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {categories?.slice(0, 6).map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg border border-transparent"
                    >
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs shadow-sm"
                        style={{ backgroundColor: cat.color || "#6366f1" }}
                      >
                        {cat.icon || "•"}
                      </div>
                      <span className="text-xs font-medium truncate">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Languages size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Personalização e Localização
                </CardTitle>
                <CardDescription>
                  Ajuste a moeda e o formato de data
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">
                  Moeda Principal
                </Label>
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    settings.updateSetting({ currency: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="BRL">Real Brasileiro (R$)</option>
                  <option value="USD">Dólar Americano (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">Libra Esterlina (GBP)</option>
                </select>
              </div>
              <div className="p-1 space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <Clock size={16} />
                  Formato da Data
                </Label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) =>
                    settings.updateSetting({ dateFormat: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="DD/MM/YYYY">Dia/Mês/Ano</option>
                  <option value="MM/DD/YYYY">Mês/Dia/Ano</option>
                  <option value="YYYY/MM/DD">Ano/Mês/Dia</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Shield size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Privacidade e Interface
                </CardTitle>
                <CardDescription>
                  Controle como suas informações são exibidas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background text-foreground/80 rounded-lg border">
                    <EyeOff size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibld">Modo Discreto</p>
                    <p className="text-xs text-muted-foreground">
                      Ocultar saldos na tela inicial
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    settings.updateSetting({
                      hideBalances: !settings.hideBalances,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.hideBalances ? "bg-indigo-600" : "bg-slate-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background transition-all ${settings.hideBalances ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background text-foreground/80 rounded-lg border">
                    <Moon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Modo Escuro (Dark Mode)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Altera a aparência do aplicativo
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    settings.updateSetting({ darkMode: !settings.darkMode })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.darkMode ? "bg-indigo-600" : "bg-slate-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background transition-all ${settings.darkMode ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <Database size={18} />
              </div>
              <div>
                <CardTitle className="text-lg">Gestão de Dados</CardTitle>
                <CardDescription>
                  Exportação, importação e backup de dados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2 border-dashed border-2 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all"
              >
                <Download className="text-indigo-600" size={24} />
                <span className="text-xs font-semibold">Exportar CSV</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2 border-dashed border-2 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all"
              >
                <Upload className="text-indigo-600" size={24} />
                <span className="text-xs font-semibold">Importar OFX/CSV</span>
              </Button>

              <Button
                onClick={handleReset}
                disabled={resetMutation.isPending}
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2 border-dashed border-2 border-red-200 hover:bg-red-50 hover:border-red-500 transition-all group"
              >
                <Trash2
                  className="text-red-400 group-hover:text-red-600"
                  size={24}
                />
                <span className="text-xs font-semibold text-red-500">
                  {resetMutation.isPending ? "Limpando..." : "Resetar Dados"}
                </span>
              </Button>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-3">
              <Shield className="text-amber-600 shrink-0" size={18} />
              <p className="text-xs text-amber-800">
                O reset de dados apagará todas as suas transações e carteiras
                permanentemente. Suas categorias personalizadas serão mantidas.
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            {updateProfileMutation.isPending
              ? "Salvando..."
              : "Salvar Configurações"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
