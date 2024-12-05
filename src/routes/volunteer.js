import express from "express";
import * as volunteerController from "../controllers/volunteer";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();
router.post(
    "/register-volunteer/:campaignId",
    verifyToken,
    volunteerController.registerVolunteer
);
router.get("/get-all", verifyToken, volunteerController.getAllVolunteer);
router.get(
    "/get-volunteer-by-id",
    verifyToken,
    volunteerController.getVolunteerById
);
router.delete(`/delete`, verifyToken, volunteerController.deleteVolunteer);
router.post(
    "/approved-volunteer",
    verifyToken,
    volunteerController.approvedVolunteer
);

export default router;
