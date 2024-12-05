import express from "express";
import verifyToken from "../middleware/verifyToken";
import * as reportController from "../controllers/report";
const router = express.Router();
router.get("/donation-by-time", reportController.getDonationsByTime);
router.get(
    "/campaigns-organization-by-time",
    reportController.getCampaignsOrganizationByTime
);

export default router;
