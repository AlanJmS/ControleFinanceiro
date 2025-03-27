import express from "express";
import * as userController from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get userInfo
router.get("/info", auth, userController.userInfo);

// Cria um novo usuário
router.post("/registro", userController.newUser);

// Atualiza um usuário
router.put("/atualizar", auth, userController.updateUser);

// Fazer login
router.post("/login", userController.login);

export { router as userRouter };