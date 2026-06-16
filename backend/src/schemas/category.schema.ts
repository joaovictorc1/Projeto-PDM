import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "name deve ter ao menos 2 caracteres")
    .max(50)
    .regex(/^[a-z0-9_-]+$/, "name deve ser lowercase sem espaços (slug)"),
  displayName: z.string().min(2).max(80),
  icon: z.string().min(1),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "color deve ser hex (#RRGGBB)")
    .optional()
    .default("#6c757d"),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
