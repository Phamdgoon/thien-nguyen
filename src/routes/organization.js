import express from "express";
import * as organizationController from "../controllers/organization";
import verifyToken from "../middleware/verifyToken";
const router = express.Router();
router.get("/get-all", organizationController.getAllOrganization);
router.delete(
    `/delete`,
    verifyToken,
    organizationController.deleteOrganization
);

export default router;
