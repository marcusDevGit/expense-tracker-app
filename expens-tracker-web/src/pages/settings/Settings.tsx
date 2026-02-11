import { useState } from "react";
import { useSettingsStore } from "@/stores/settings.store";
import { Coins, Calendar, Bell, Moon, Languages, Clock } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
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

export function Settings() {
  const settings = useSettingsStore();

  const handleSave = () => {
    console.log("Salvo", {
      startDay: settings.startDay,
      alertThreshold: settings.alertThreshold,
      currency: settings.currency,
      dateFormat: settings.dateFormat,
      darkMode: settings.darkMode,
    });
    alert("Configurações salvas com sucesso!");
  };

  return (
    <PageLayout>
      <div className="max-w-4xl space-y-6 pb-10">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Configurações
        </h1>
        <Card className="border-none shadow-md overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-600 roundedo-lg">
                <Coins size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Preferencia de Orçamento
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
                <div className="flex items-centergap-3">
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
                      className="bg-blue-500 h-full transition-all duration-300"
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
              <div className="space-y-2">
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
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted text-foreground/80 rounded-lg">
                    <Moon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Modo Escuro (Dark Mode)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    settings.updateSetting({ darkMode: !settings.darkMode })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.darkMode ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background transition-all ${settings.darkMode ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            Salvar Configurações
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
