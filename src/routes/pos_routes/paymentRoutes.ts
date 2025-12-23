import { Router } from "express";
import { createPayment, checkPayment } from "../../controllers/pos_controllers/paymentController";

const router = Router();

// POST /api/payment/create
router.post("/create", createPayment);

// GET /api/payment/check/:md5
router.post("/check", checkPayment);

export default router;
