import express from 'express';
import { registerUser, getCurrentUser, logoutUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.post("/login", loginUser);
router.get("/me", getCurrentUser);

export default router;