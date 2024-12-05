import express from "express";
import * as campaignController from "../controllers/campaign";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();
router.post(
    "/create-campaign",
    verifyToken,
    campaignController.createNewCampaign
);
router.get("/get-all", campaignController.getCampaigns);
router.get("/get-info", campaignController.getInfo);
router.get("/get-campaign", campaignController.getCampaignById);
router.get(
    `/limit-organization`,
    verifyToken,
    campaignController.getCampaignLimitOrganization
);
router.delete(`/delete`, verifyToken, campaignController.deleteCampaign);
router.put(`/update`, verifyToken, campaignController.updateCampaign);
router.post(
    "/approved-campaign",
    verifyToken,
    campaignController.approvedCampaign
);

export default router;
