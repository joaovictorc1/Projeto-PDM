import { Router } from "express";
import {
  createTransaction,
  listTransactions,
  deleteTransaction,
} from "../controllers/Transaction.controller";

const router = Router();

router.get("/",     listTransactions);
router.post("/",    createTransaction);
router.delete("/:id", deleteTransaction);

export default router;