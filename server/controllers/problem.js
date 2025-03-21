import puppeteer from "puppeteer";
import client from "../db.js";

export const getProblemStatement = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const roomQuery = await client.query("SELECT * FROM rooms WHERE room_code = $1", [roomCode]);
    if (roomQuery.rows.length === 0) {
      return res.status(404).json({ message: "Room not found." });
    }
    const room = roomQuery.rows[0];

    if (!room.problem_id || !room.problem_index) {
      return res.status(400).json({ message: "Room does not have a problem assigned." });
    }
    
    const problemUrl = `https://codeforces.com/problemset/problem/${room.problem_id}/${room.problem_index}`;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");

    await page.goto(problemUrl, { waitUntil: "networkidle2" });
    
    const fullHtml = await page.content();
    
    await browser.close();

    res.status(200).json({ problem: fullHtml });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
