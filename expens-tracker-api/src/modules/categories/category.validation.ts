import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  color: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  budget: z.coerce.number().nonnegative("Orçamento inválido").optional(),
});

export const updateCategorySchema = z
  .object({
    name: z.string().min(1, "Nome inválido").optional(),
    color: z.string().min(1).optional(),
    icon: z.string().min(1).optional(),
    budget: z.coerce.number().nonnegative("Orçamento inválido").nullable().optional(),
    isActive: z.boolean().optional(),
    order: z.coerce.number().int().nonnegative().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser informado",
  });

export const categoryIdParamSchema = z.object({
  id: z.string().min(1, "ID da categoria inválido"),
});
