import { useState } from "react";
import { CreateWalletModal } from "./CreateWalletModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageLayout } from "@/components/layout/PageLayout";
import { walletService } from "@/services/wallet.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFormatters } from "@/hooks/use-formatters";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Wallets() {
  const { formatCurrency } = useFormatters();
  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wallets, isLoading } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.list,
  });

  const deleteMutation = useMutation({
    mutationFn: walletService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast({ title: "Sucesso", description: "Carteira removida com sucesso" });
    },
  });

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Minhas Carteiras
          </h1>
          <Button className="gap-2" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Nova Carteira
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wallets?.map((wallet) => (
              <Card key={wallet.id} className="shadow-sm border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: wallet.color }}
                    />
                    <CardTitle className="text-sm font-medium">
                      {wallet.name}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-red-500"
                    onClick={() => deleteMutation.mutate(wallet.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${wallet.currentBalance < 0 ? "text-red-500" : "text-foreground"}`}
                  >
                    {formatCurrency(wallet.currentBalance)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <CreateWalletModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </PageLayout>
  );
}
