import { v4 as uuidv4 } from 'uuid';
import client from "../db.js";
import axios from 'axios';

export const createRoom = async (req, res) => {
    try {
        const hostId = req.user.id;

        const roomCode = uuidv4().slice(0, 8);

        await client.query('BEGIN');

        const newRoom = await client.query(
            "INSERT INTO rooms (host_id, room_code) VALUES ($1, $2) RETURNING *",
            [hostId, roomCode]
        );

        const roomId = newRoom.rows[0].id;

        await client.query(
            "INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)",
            [roomId, hostId]
        );

        await client.query('COMMIT');

        res.status(201).json({ message: "Room created successfully", room: newRoom.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const joinRoom = async (req, res) => {
    try {
        const userId = req.user.id;
        const { roomCode } = req.body;

        if (!roomCode) {
            return res.status(400).json({ message: "Please provide a room code." });
        }

        const roomQuery = await client.query("SELECT * FROM rooms WHERE room_code = $1", [roomCode]);
        if (roomQuery.rows.length === 0) {
            return res.status(404).json({ message: "Room not found." });
        }
        const room = roomQuery.rows[0];

        const memberCheck = await client.query(
            "SELECT * FROM room_members WHERE room_id = $1 AND user_id = $2",
            [room.id, userId]
        );
        if (memberCheck.rows.length > 0) {
            return res.status(400).json({ message: "You have already joined this room." });
        }

        await client.query(
            "INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)",
            [room.id, userId]
        );

        req.io.to(roomCode).emit("roomMembersUpdated");

        res.status(200).json({ message: "Joined room successfully", room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getJoinedRooms = async (req, res) => {
    try {
        const userId = req.user.id;
        const joinedRooms = await client.query(
            `SELECT r.* 
             FROM rooms r 
             JOIN room_members rm ON rm.room_id = r.id 
             WHERE rm.user_id = $1`,
            [userId]
        );
        res.status(200).json({ joinedRooms: joinedRooms.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const leaveRoom = async (req, res) => {
    try {
        const userId = req.user.id;
        const { roomCode } = req.body;

        if (!roomCode) {
            return res.status(400).json({ message: "Please provide a room code." });
        }

        const roomQuery = await client.query("SELECT * FROM rooms WHERE room_code = $1", [roomCode]);
        if (roomQuery.rows.length === 0) {
            return res.status(404).json({ message: "Room not found." });
        }
        const room = roomQuery.rows[0];

        const memberCheck = await client.query(
            "SELECT * FROM room_members WHERE room_id = $1 AND user_id = $2",
            [room.id, userId]
        );
        if (memberCheck.rows.length === 0) {
            return res.status(400).json({ message: "You are not a member of this room." });
        }

        await client.query(
            "DELETE FROM room_members WHERE room_id = $1 AND user_id = $2",
            [room.id, userId]
        );

        req.io.to(roomCode).emit("roomMembersUpdated");

        res.status(200).json({ message: "Left room successfully", room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getRoomMembers = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const roomQuery = await client.query(
            "SELECT * FROM rooms WHERE room_code = $1",
            [roomCode]
        );

        if (roomQuery.rows.length === 0) {
            return res.status(404).json({ message: "Room not found." });
        }
        const room = roomQuery.rows[0];

        const membersQuery = await client.query(
            `SELECT u.id, u.name, u.email, u.handle, rm.score, rm.last_scored_round
         FROM room_members rm 
         JOIN users u ON rm.user_id = u.id 
         WHERE rm.room_id = $1`,
            [room.id]
        );

        res.status(200).json({ members: membersQuery.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getRoomDetails = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const roomQuery = await client.query(
            "SELECT * FROM rooms WHERE room_code = $1",
            [roomCode]
        );

        if (roomQuery.rows.length === 0) {
            return res.status(404).json({ message: "Room not found." });
        }

        const room = roomQuery.rows[0];

        res.status(200).json({ room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const startNewRound = async (req, res) => {
    try {
        const { roomCode, newRating } = req.body;

        if (!roomCode || !newRating) {
            return res.status(400).json({ message: "Please provide roomCode and newRating." });
        }

        const roomQuery = await client.query("SELECT * FROM rooms WHERE room_code = $1", [roomCode]);
        if (roomQuery.rows.length === 0) {
            return res.status(404).json({ message: "Room not found." });
        }
        const room = roomQuery.rows[0];

        const rating = Number(newRating);
        if (isNaN(rating)) {
            return res.status(400).json({ message: "Invalid rating value." });
        }

        const cfResponse = await axios.get("https://codeforces.com/api/problemset.problems");
        if (cfResponse.data.status !== "OK") {
            return res.status(500).json({ message: "Failed to fetch CodeForces problems." });
        }
        const problems = cfResponse.data.result.problems;
        const filteredProblems = problems.filter((problem) => problem.rating === rating);
        if (filteredProblems.length === 0) {
            return res.status(404).json({ message: "No problem found with that rating." });
        }

        const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];

        const newRound = room.round ? Number(room.round) + 1 : 1;

        const updatedRoomQuery = await client.query(
            "UPDATE rooms SET rating = $1, question = $2, problem_index = $3, problem_id = $4, round = $5 WHERE id = $6 RETURNING *",
            [rating, randomProblem.name, randomProblem.index, randomProblem.contestId, newRound, room.id]
        );

        req.io.to(roomCode).emit("newRoundStarted");

        res.status(200).json({
            message: "New round started, rating updated and new question selected.",
            room: updatedRoomQuery.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
