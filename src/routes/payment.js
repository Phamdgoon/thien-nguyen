import express from "express";
import * as paymentController from "../controllers/payment";
import verifyToken from "../middleware/verifyToken";
const router = express.Router();

router.post(
    "/payment/:campaignId",
    verifyToken,
    paymentController.paymentHandler
);

router.post("/callback", paymentController.callbackHandler);

router.post(
    "/transaction-status",
    verifyToken,
    paymentController.transactionStatusHandler
);
export default router;
