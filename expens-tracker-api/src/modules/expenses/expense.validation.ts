import { z } from "zod";

export const createExpenseSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  walletId: z.string().min(1, "Carteira é obrigatória"),
  categoryId: z.string().min(1).nullable().optional(),
  newCategoryName: z.string().min(1).optional(),
  expenseDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Data da despesa inválida",
  }),
  installments: z.coerce.number().int().min(1).optional(),
  isRecurring: z.boolean().optional(),
  recurrenceType: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]).nullable().optional(),
  paymentMethod: z.string().min(1).optional(),
});

export const updateExpenseSchema = z
  .object({
    description: z.string().min(1).optional(),
    amount: z.coerce.number().positive("Valor deve ser maior que zero").optional(),
    walletId: z.string().min(1).optional(),
    categoryId: z.string().min(1).nullable().optional(),
    newCategoryName: z.string().min(1).optional(),
    expenseDate: z
      .string()
      .refine((val) => !Number.isNaN(Date.parse(val)), {
        message: "Data da despesa inválida",
      })
      .optional(),
    installments: z.coerce.number().int().min(1).optional(),
    isRecurring: z.boolean().optional(),
    recurrenceType: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]).nullable().optional(),
    paymentMethod: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser informado",
  });

export const listExpensesQuerySchema = z.object({
  walletId: z.string().min(1, "walletId é obrigatório"),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  categoryId: z.string().min(1).optional(),
});

export const expenseIdParamSchema = z.object({
  id: z.string().min(1, "ID da despesa inválido"),
});

export const expenseSuggestionsQuerySchema = z.object({
  q: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(10).optional(),
});
