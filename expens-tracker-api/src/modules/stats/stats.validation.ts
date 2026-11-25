import { z } from "zod";

export const dashboardStatsQuerySchema = z.object({
  walletId: z.string().min(1, "walletId é obrigatório"),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});

export const trendsQuerySchema = z.object({
  walletId: z.string().min(1, "walletId é obrigatório"),
  limit: z.coerce.number().int().min(1).max(24).optional(),
});

export const comparisonQuerySchema = z.object({
  walletId: z.string().min(1, "walletId é obrigatório"),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});
