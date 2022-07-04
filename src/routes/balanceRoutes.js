import { postTransaction, getTransaction } from "../controllers/transactionsController.js";
import { Router } from "express";
import validateUser from "../middlewares/validateUser.js";

const router = Router();

router.post('/transactions', postTransaction);
router.get('/transactions', validateUser, getTransaction);

export default router;