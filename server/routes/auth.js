import express from "express";

import { register } from "../controllers/auth.js";
import { login, logout } from "../controllers/auth.js";
import { getAuthenticatedUser } from '../controllers/auth.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/me', authMiddleware, getAuthenticatedUser);
router.post("/logout", logout);

export default router;