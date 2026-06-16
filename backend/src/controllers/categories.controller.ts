import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";

const prisma = new PrismaClient();

// GET /categories
export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

// GET /categories/:id
export async function getCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) return res.status(404).json({ error: "Categoria não encontrada." });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

// POST /categories
export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Dados inválidos.", details: parsed.error.flatten() });
    }

    const existing = await prisma.category.findUnique({ where: { name: parsed.data.name } });
    if (existing) {
      return res.status(409).json({ error: `Categoria com name "${parsed.data.name}" já existe.` });
    }

    const category = await prisma.category.create({ data: parsed.data });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

// PUT /categories/:id
export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Categoria não encontrada." });

    const parsed = updateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Dados inválidos.", details: parsed.error.flatten() });
    }

    // Bloqueia mudança de "name" (slug) em categorias padrão
    if (existing.isDefault && parsed.data.name && parsed.data.name !== existing.name) {
      return res.status(400).json({ error: "Não é permitido alterar o slug (name) de uma categoria padrão." });
    }

    const updated = await prisma.category.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /categories/:id
export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) return res.status(404).json({ error: "Categoria não encontrada." });

    // Regra de negócio: categorias padrão não podem ser deletadas
    if (category.isDefault) {
      return res.status(400).json({
        error: "Categorias padrão não podem ser excluídas.",
        category: category.name,
      });
    }

    // Impede exclusão se houver transações vinculadas
    const txCount = await prisma.transaction.count({ where: { categoryId: req.params.id } });
    if (txCount > 0) {
      return res.status(400).json({
        error: `Não é possível excluir: existem ${txCount} transação(ões) vinculadas a esta categoria.`,
      });
    }

    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
