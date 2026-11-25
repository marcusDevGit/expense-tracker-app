import { z } from "zod";

export const createWalletSchema = z.object({
  name: z.string().min(1, "Nome da carteira é obrigatório"),
  currency: z.string().min(1).optional(),
  initialBalance: z.coerce.number().default(0),
});

export const updateWalletSchema = z
  .object({
    name: z.string().min(1, "Nome inválido").optional(),
    currency: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser informado",
  });

export const walletIdParamSchema = z.object({
  id: z.string().min(1, "ID da carteira inválido"),
});

export const walletDashboardQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});
