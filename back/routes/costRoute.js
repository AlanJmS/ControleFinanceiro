import express  from "express";
import * as costController from "../controllers/costController.js";

const router = express.Router();

//Busca os gastos de uma carteira específica
router.get('/:walletId',costController.getAllCosts);

//Cria um gasto
router.post('/',costController.createCost);

//Edita um gasto
router.put('/:id',costController.editCost);

//Deleta um gasto
router.delete('/:id',costController.deleteCost);

export {router as costRouter}