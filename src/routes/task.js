import express from "express";
import * as taskController from "../controllers/task";
import verifyToken from "../middleware/verifyToken";
const router = express.Router();
router.get("/get-all", taskController.getTaskTypes);
router.post("/assign-task", verifyToken, taskController.assignTask);

export default router;
