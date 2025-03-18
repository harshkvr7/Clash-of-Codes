import express from "express";
import axios from "axios";

import client from "./db.js";
import authRoutes from "./routes/auth.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/test", (req, res) => {
    res.send("test");
})

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}/`);
})