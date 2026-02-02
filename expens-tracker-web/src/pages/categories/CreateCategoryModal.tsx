import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Sucesso!", description: "Categoria criada com sucesso" });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description:
          "Falha ao criar categoria. Verifique se já existe uma categoria com esse nome.",
        variant: "destructive",
      });
    },
  });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Nova Categoria</h2>
          <Button variant="ghost" onClick={onClose} size="icon">
            <X size={20} />
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(name);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome da Categoria</Label>
            <Input
              id="category-name"
              placeholder="Ex: Alimentação, Transporte..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Criar Categoria"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
