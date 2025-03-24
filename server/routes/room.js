import express from "express";
import { createRoom } from "../controllers/room.js";
import { joinRoom } from "../controllers/room.js"; 
import { getJoinedRooms } from "../controllers/room.js";
import { leaveRoom } from "../controllers/room.js";
import { getRoomMembers } from "../controllers/room.js";
import { getRoomDetails } from "../controllers/room.js";
import { updateRating } from "../controllers/room.js";
import { startNewRound } from "../controllers/room.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.post("/join", authMiddleware, joinRoom);
router.get("/joined", authMiddleware, getJoinedRooms);
router.post("/leave", authMiddleware, leaveRoom);
router.get("/:roomCode/members", getRoomMembers);
router.get("/:roomCode/details", getRoomDetails);
router.post("/updateRating", updateRating);
router.post("/startNewRound", startNewRound);

export default router;