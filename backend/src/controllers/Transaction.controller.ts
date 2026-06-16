import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { createTransactionSchema } from "../schemas/Transaction.schema";

const prisma = new PrismaClient();

// POST /transactions
export async function createTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Dados inválidos.", details: parsed.error.flatten() });
    }

    const { description, value, date, categoryId, type } = parsed.data;

    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!categoryExists) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: value,
        date,
        type,
        categoryId,
      },
      include: { category: true },
    });

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
}

// GET /transactions?month=10&year=2026
export async function listTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const { month, year } = req.query;

    const monthNum = month ? parseInt(month as string, 10) : null;
    const yearNum  = year  ? parseInt(year  as string, 10) : null;

    // Valida os query params quando informados
    if (month !== undefined && (isNaN(monthNum!) || monthNum! < 1 || monthNum! > 12)) {
      return res.status(400).json({ error: "month deve ser um número entre 1 e 12." });
    }
    if (year !== undefined && (isNaN(yearNum!) || yearNum! < 2000 || yearNum! > 2100)) {
      return res.status(400).json({ error: "year deve ser um número válido (ex: 2026)." });
    }

    // Monta filtro de data somente quando ambos forem fornecidos (ou apenas year)
    let dateFilter: { gte: Date; lte: Date } | undefined;

    if (yearNum) {
      const m = monthNum ?? 1;
      const start = new Date(yearNum, m - 1, 1);           // 1º dia do mês
      const end   = new Date(yearNum, monthNum ? m : 12, 0, 23, 59, 59, 999); // último dia

      // Se só year foi passado, filtra o ano inteiro
      const periodEnd = monthNum
        ? new Date(yearNum, m, 0, 23, 59, 59, 999)
        : new Date(yearNum, 12, 0, 23, 59, 59, 999);

      dateFilter = { gte: start, lte: periodEnd };
    }

    const transactions = await prisma.transaction.findMany({
      where: dateFilter ? { date: dateFilter } : undefined,
      include: { category: true },
      orderBy: { date: "desc" },
    });

    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

// DELETE /transactions/:id
export async function deleteTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    // O "as string" força o TypeScript a aceitar que o parâmetro é um texto único
    const transactionId = req.params.id as string;

    const existing = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!existing) return res.status(404).json({ error: "Transação não encontrada." });

    await prisma.transaction.delete({ where: { id: transactionId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}