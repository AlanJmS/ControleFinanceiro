import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// Cria um novo usuário
router.post("/registro", userController.newUser);

// Fazer login
router.post("/login", userController.login);

export { router as userRouter };