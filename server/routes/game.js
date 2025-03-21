import express from "express";

import authMiddleware from "../middleware/authMiddleware.js"
import { check_sub } from "../controllers/game.js";

const router = express.Router();

router.post("/check_sub", authMiddleware, check_sub);

export default router;