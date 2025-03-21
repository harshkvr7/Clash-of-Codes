import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/room.js"

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
    res.send("test");
})

app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}/`);
})