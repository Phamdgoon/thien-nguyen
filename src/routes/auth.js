import express from "express";
import * as authController from "../controllers/auth";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();
router.post("/register", authController.Register);
router.post("/register-organization", authController.RegisterOrganization);
router.post("/login", authController.Login);
router.post("/login-organization", authController.LoginOrganization);
router.post("/login-admin", authController.LoginAdmin);
router.use(verifyToken);

export default router;
