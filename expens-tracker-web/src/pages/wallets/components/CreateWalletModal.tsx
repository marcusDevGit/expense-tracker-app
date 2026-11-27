import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWalletModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [color, setColor] = useState("#10b981");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: walletService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast({
        title: "Sucesso",
        description: "Carteira criada!",
      });
      setName("");
      setBalance("");
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar carteira",
        variant: "destructive",
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
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-card border border-border rounded-xl p-6 shadow-xl animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Nova Carteira</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate({
              name,
              initialBalance: Number(balance),
              color,
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Carteira</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ex: NuBank"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance">Saldo Inicial</Label>
            <Input
              id="balance"
              type="number"
              inputMode="decimal"
              step={0.01}
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Cor da Carteira</Label>
            <Input
              type="color"
              className="block w-full h-10 rounded-md cursor-pointer"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
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
              className="flex-1"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Criar Carteira"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
