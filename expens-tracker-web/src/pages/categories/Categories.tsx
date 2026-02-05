import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { categoryService, type Category } from "@/services/category.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Plus,
  Trash2,
  Loader2,
  Search,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { statsService } from "@/services/stats.service";
import { walletService } from "@/services/wallet.service";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function Categories() {
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.list,
  });

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.list,
  });

  useEffect(() => {
    if (wallets && wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets, selectedWalletId]);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: [
      "stats",
      "dashboard",
      selectedWalletId,
      currentMonth,
      currentYear,
    ],
    queryFn: () =>
      statsService.getDashboardStats(
        selectedWalletId,
        currentMonth,
        currentYear,
      ),
    enabled: !!selectedWalletId,
  });

  const isLoading = isLoadingCategories || isLoadingStats;

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

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Buscar categoria..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories
              ?.filter((c) =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((category) => {
                const isSystem = !category.userId;
                const categoryStats = stats?.categoryBreakdown.find(
                  (s) => s.categoryId === category.id,
                );
                const budgetNum = Number(category.budget?.toString()) || 0;
                const isOverBudget =
                  budgetNum > 0 &&
                  categoryStats &&
                  categoryStats.total > budgetNum;

                return (
                  <Card
                    key={category.id}
                    className={`border-slate-200 hover:border-slate-300 transition-colors shadow-sm overflow-hidden ${
                      isOverBudget ? "border-red-200 bg-red-50/10" : ""
                    }`}
                  >
                    <CardContent className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm"
                            style={{
                              backgroundColor: `${category.color}15`,
                              color: category.color || "#6366f1",
                            }}
                          >
                            {category.icon || "Tag"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 leading-none mb-1">
                              {category.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {isSystem ? "Sistema" : "Personalizada"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                            onClick={() => {
                              handleEdit(category);
                            }}
                          >
                            <Pencil size={15} />
                          </Button>
                          {!isSystem && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-red-600"
                              onClick={() => deleteMutation.mutate(category.id)}
                            >
                              <Trash2 size={15} />
                            </Button>
                          )}
                        </div>
                      </div>

                      {isOverBudget && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                          <AlertTriangle size={12} /> Orçamento estourado
                        </div>
                      )}
                    </CardContent>
                    <CardContent className="px-4 pb-4 pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Orçamento: {formatCurrency(category.budget || 0)}
                          </span>
                          {Number(category.budget) > 0 && (
                            <span>
                              {Math.round(
                                stats?.categoryBreakdown.find(
                                  (s) => s.categoryId === category.id,
                                )?.budgetProgress || 0,
                              )}
                              %
                            </span>
                          )}
                        </div>
                        {Number(category.budget) > 0 && (
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                (stats?.categoryBreakdown.find(
                                  (s) => s.categoryId === category.id,
                                )?.budgetProgress || 0) >= 100
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  categoryStats?.budgetProgress || 0,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                        )}
                        {Number(category.budget) > 0 &&
                          categoryStats?.suggestedDailyLimit !== undefined && (
                            <div className="flex justify-between items-center text-[10px] mt-1">
                              <span className="text-muted-foreground">
                                Limite Sugerido:{" "}
                                <span
                                  className={`font-bold ${categoryStats.suggestedDailyLimit > 0 ? "text-blue-600" : "text-red-500"}`}
                                >
                                  {formatCurrency(
                                    categoryStats.suggestedDailyLimit,
                                  )}
                                  /dia
                                </span>
                              </span>
                              {categoryStats.suggestedDailyLimit <= 0 && (
                                <span className="text-red-500 font-bold uppercase animate-pulse">
                                  Meta Estourada
                                </span>
                              )}
                            </div>
                          )}
                      </div>
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
