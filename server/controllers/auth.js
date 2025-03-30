import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../db.js";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
    try {
        const { name, email, password, handle } = req.body;
        if (!name || !email || !password || !handle) {
            return res.status(400).json({ message: "Please provide name, email, password, and handle." });
        }

        const emailCheck = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await client.query(
            "INSERT INTO users (name, email, password, handle) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, handle]
        );

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    console.log("hello");
    
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password." });
        }

        const userQuery = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        const user = userQuery.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const payload = { id: user.id, email: user.email, handle: user.handle };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "720h" });

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAuthenticatedUser = async (req, res) => {
    try {
        const userQuery = await client.query(
            'SELECT id, name, email, handle FROM users WHERE id = $1',
            [req.user.id]
        );
        const user = userQuery.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ message: "Logout successful" });
};
