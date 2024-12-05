import express from "express";
import * as categoryController from "../controllers/category";

const router = express.Router();
router.get("/get-categories", categoryController.GetCategories);
router.get(
    "/get-campaign-by-category",
    categoryController.GetCampaignsByCategory
);

export default router;
