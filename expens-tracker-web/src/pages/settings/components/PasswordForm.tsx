import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { Key } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function PasswordForm() {
  const [showForm, setShowForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: ({ oldPassword, newPassword }: any) =>
      userService.updatePassword({ oldPassword, newPassword }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Senha alterada com sucesso!" });
      setShowForm(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    },
    onError: (err: any) => {
      toast({
        title: "Erro",
        description: err.response?.data?.error || "Erro ao alterar senha",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: "Atenção",
        description: "Preencha todos os campos!",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Erro",
        description: "As senhas novas não coincidem!",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({ oldPassword, newPassword });
  };

  if (!showForm) {
    return (
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setShowForm(true)}
      >
        <Key size={16} /> Alterar Senha
      </Button>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border animate-in fade-in slide-in-from-top-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Senha Atual</Label>
          <Input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Nova Senha</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Confirmar Nova Senha</Label>
          <Input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Alterando..." : "Confirmar Troca"}
        </Button>
      </div>
    </div>
  );
}
