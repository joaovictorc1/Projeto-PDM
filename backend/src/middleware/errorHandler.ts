import { Request, Response, NextFunction } from "express";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  console.error("[Error]", err);

  // Prisma: unique constraint
  if (typeof err === "object" && err !== null && "code" in err) {
    const prismaErr = err as { code: string; meta?: { target?: string[] } };
    if (prismaErr.code === "P2002") {
      return res.status(409).json({
        error: "Conflito: registro duplicado.",
        field: prismaErr.meta?.target,
      });
    }
  }

  res.status(500).json({ error: "Erro interno do servidor." });
}
