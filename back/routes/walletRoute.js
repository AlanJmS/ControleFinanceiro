import express from "express";
import * as walletController from "../controllers/walletController.js";

const router = express.Router();

// GET /wallets
router.get("/", walletController.getAllWallets);

// Cria uma nova carteira
router.post("/", walletController.createWallet);

// Edita uma carteira
router.put("/:id", walletController.editWallet);

// Deleta uma carteira
router.delete("/:id", walletController.deleteWallet);

export { router as walletRouter };