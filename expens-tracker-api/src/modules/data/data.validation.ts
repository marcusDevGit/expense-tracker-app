import { z } from "zod";

const paymentMethods = [
  "CASH",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "PIX",
  "BANK_TRANSFER",
  "OTHER",
] as const;

export const importExpenseItemSchema = z.object({
  description: z.string().trim().min(1, "Descrição é obrigatória"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  expenseDate: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  categoryName: z.string().trim().optional(),
  paymentMethod: z.enum(paymentMethods).optional(),
});

export const importExpensesSchema = z.object({
  walletId: z.string().min(1, "Carteira é obrigatória"),
  items: z
    .array(importExpenseItemSchema)
    .min(1, "Informe pelo menos um item para importar")
    .max(500, "Máximo de 500 itens por importação"),
});

export type ImportExpenseItemInput = z.infer<typeof importExpenseItemSchema>;
