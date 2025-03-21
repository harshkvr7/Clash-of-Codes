import express from "express";

import { getProblemStatement } from "../controllers/problem.js";

const router = express.Router();

router.get("/:roomCode/", getProblemStatement);

export default router;