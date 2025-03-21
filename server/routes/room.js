import express from "express";
import { createRoom } from "../controllers/room.js";
import { joinRoom } from "../controllers/room.js"; 
import { getJoinedRooms } from "../controllers/room.js";
import { leaveRoom } from "../controllers/room.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.post("/join", authMiddleware, joinRoom);
router.get("/joined", authMiddleware, getJoinedRooms);
router.post("/leave", authMiddleware, leaveRoom);

export default router;