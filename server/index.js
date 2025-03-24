import express from "express";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http"

import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/room.js"
import problemRoutes from "./routes/problem.js"
import gameRoutes from "./routes/game.js"

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
    res.send("test");
})

app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/problem", problemRoutes);
app.use("/api/game/", gameRoutes);

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("joinRoom", (roomCode) => {
        socket.join(roomCode);
        console.log(`Socket ${socket.id} joined room ${roomCode}`);
    });

    socket.on("leaveRoom", (roomCode) => {
        socket.leave(roomCode);
        console.log(`Socket ${socket.id} left room ${roomCode}`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});