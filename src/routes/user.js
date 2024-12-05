import express from "express";
import verifyToken from "../middleware/verifyToken";
import * as controllers from "../controllers/user";
const router = express.Router();

router.get("/get-current", verifyToken, controllers.getCurrent);
router.get("/get-all", controllers.getAllUser);
router.put("/update-user", verifyToken, controllers.updateUser);
router.delete(`/delete`, verifyToken, controllers.deleteUser);
router.post("/chat", verifyToken, controllers.chatUser);

export default router;
