import { z } from "zod";

export const createTransactionSchema = z.object({
  description: z.string().min(1, "description é obrigatório").max(255),
  value: z
    .number({ invalid_type_error: "value deve ser um número" })
    .positive("value deve ser maior que zero"),
  date: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: "date inválida (ISO 8601 esperado)" })
    .transform((v) => new Date(v)),
  categoryId: z.string().uuid("categoryId deve ser um UUID válido"),
  type: z.enum(["INCOME", "EXPENSE"], {
    errorMap: () => ({ message: 'type deve ser "INCOME" ou "EXPENSE"' }),
  }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;