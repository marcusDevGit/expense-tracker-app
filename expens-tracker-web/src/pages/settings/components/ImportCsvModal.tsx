import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { dataService } from "@/services/data.service";
import { ApiHttpError } from "@/services/api";
import { useFormatters } from "@/hooks/use-formatters";
import {
  buildMappedItems,
  detectInitialMapping,
  parseCsvContent,
  type ColumnMapping,
} from "@/utils/csv-import";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  wallets: { id: string; name: string }[];
  defaultWalletId?: string;
}

const MAPPING_FIELDS = [
  { key: "description", label: "Descrição *", required: true },
  { key: "amount", label: "Valor *", required: true },
  { key: "expenseDate", label: "Data *", required: true },
  { key: "categoryName", label: "Categoria (opcional)", required: false },
  { key: "paymentMethod", label: "Forma de Pagamento (opcional)", required: false },
] as const;

export function ImportCsvModal({
  isOpen,
  onClose,
  wallets,
  defaultWalletId,
}: Props) {
  const { formatCurrency } = useFormatters();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [walletId, setWalletId] = useState(
    defaultWalletId || wallets[0]?.id || "",
  );
  const [mapping, setMapping] = useState<ColumnMapping>({
    description: "",
    amount: "",
    expenseDate: "",
    categoryName: "",
    paymentMethod: "",
  });

  const activeWalletId = walletId || defaultWalletId || wallets[0]?.id || "";
  const mappedItems = buildMappedItems(headers, rows, mapping);
  const isMappingReady =
    !!mapping.description && !!mapping.amount && !!mapping.expenseDate;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const parsed = parseCsvContent(await file.text());
    if (parsed.headers.length === 0) {
      toast({
        variant: "destructive",
        title: "CSV inválido",
        description: "O arquivo precisa conter cabeçalho e pelo menos uma linha.",
      });
      return;
    }

    setFileName(file.name);
    setHeaders(parsed.headers);
    setRows(parsed.rows);
    setMapping(detectInitialMapping(parsed.headers));
  };

  const mutation = useMutation({
    mutationFn: dataService.importExpenses,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast({
        title: "Importação concluída",
        description: `${res.importedCount} despesas importadas com sucesso.`,
      });
      onClose();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiHttpError
          ? error.response.data?.error || error.message
          : "Falha ao importar despesas.";
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: message,
      });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-card rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5 border border-border">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Importar CSV com Mapeamento de Colunas
            </h2>
            <p className="text-xs text-muted-foreground">
              Selecione um arquivo .csv e associe as colunas aos campos do sistema.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Arquivo CSV</Label>
            <label className="flex items-center gap-2 border border-dashed border-border rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload size={16} className="text-primary shrink-0" />
              <span className="truncate text-muted-foreground">
                {fileName || "Selecionar arquivo .csv..."}
              </span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <Label>Carteira de destino</Label>
            <select
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
              value={activeWalletId}
              onChange={(e) => setWalletId(e.target.value)}
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {headers.length > 0 && (
          <>
            <div className="space-y-3 border border-border rounded-lg p-4 bg-muted/30">
              <p className="text-sm font-semibold text-foreground">
                Mapeamento de Colunas
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MAPPING_FIELDS.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <Label className="text-xs">{field.label}</Label>
                    <select
                      className="w-full border border-border rounded-md px-2.5 py-1.5 text-sm bg-background text-foreground"
                      value={mapping[field.key]}
                      onChange={(e) =>
                        setMapping((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                    >
                      <option value="">
                        {field.required ? "Selecione uma coluna..." : "Ignorar"}
                      </option>
                      {headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  Prévia ({mappedItems.length} de {rows.length} linhas válidas)
                </span>
                {isMappingReady && mappedItems.length > 0 ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 size={14} /> Pronto para importar
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <AlertCircle size={14} /> Mapeie os campos obrigatórios
                  </span>
                )}
              </div>

              {mappedItems.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="text-left px-3 py-2">Data</th>
                        <th className="text-left px-3 py-2">Descrição</th>
                        <th className="text-left px-3 py-2">Categoria</th>
                        <th className="text-right px-3 py-2">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mappedItems.slice(0, 5).map((item, idx) => (
                        <tr key={`${item.description}-${idx}`}>
                          <td className="px-3 py-2">{item.expenseDate}</td>
                          <td className="px-3 py-2 font-medium">{item.description}</td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {item.categoryName || "Sem Categoria"}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-red-600">
                            {formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={
              !activeWalletId ||
              !isMappingReady ||
              mappedItems.length === 0 ||
              mutation.isPending
            }
            onClick={() =>
              mutation.mutate({
                walletId: activeWalletId,
                items: mappedItems.slice(0, 500),
              })
            }
          >
            {mutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Importar {mappedItems.length > 0 ? `(${mappedItems.length})` : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}
