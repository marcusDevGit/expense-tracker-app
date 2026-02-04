import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { categoryService } from "@/services/category.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Tag, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.list,
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Sucesso", description: "Categoria removida!" });
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categorias</h1>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Nova Categoria
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories?.map((category) => {
              const isSystem = !category.userId;
              return (
                <Card
                  key={category.id}
                  className="group hover:border-blue-400 transition-colors"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg">
                        <div
                          className="p-2 rounded-lg flex items-center justify-center text-white"
                          style={{
                            backgroundColor: category.color || "#94a3b8",
                          }}
                        >
                          <span className="text-sm">
                            {category.icon || "🏷️"}
                          </span>
                        </div>
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    {!isSystem && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          className=" hover:text-blue-500"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className=" hover:text-red-500"
                          onClick={() =>
                            confirm(`Excluir ${category.name}?`) &&
                            deleteMutation.mutate(category.id)
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={handleClose}
        category={editingCategory}
      />
    </PageLayout>
  );
}
