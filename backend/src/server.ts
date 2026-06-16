import express from "express";
import cors from "cors";
import "dotenv/config";
import transactionRoutes from "./routes/Transaction.routes";

import categoryRoutes from "./routes/categories.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" })); // Ajuste origin em produção
app.use(express.json());

// ── Health-check ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Gestão Financeira API", timestamp: new Date().toISOString() });
});

// ── Rotas ────────────────────────────────────────────────────────────────────
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

// ── Error handler (sempre o último middleware) ────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});

export default app;
