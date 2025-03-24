import axios from "axios";
import client from "../db.js";

export const check_sub = async (req, res) => {
    const { roomData } = req.body;
    const url = `https://codeforces.com/api/user.status?handle=${req.user.handle}&from=1&count=10`;

    try {
        const subDetails = await axios.get(url);
        const subDetailsData = subDetails.data;
        let accepted = false;

        for (const sub of subDetailsData.result) {
            if (
                sub.contestId == roomData.problem_id &&
                sub.problem.index == roomData.problem_index &&
                sub.verdict === "OK"
            ) {
                accepted = true;
                break;
            }
        }

        if (accepted) {
            const memberQuery = await client.query(
                "SELECT * FROM room_members WHERE room_id = $1 AND user_id = $2",
                [roomData.id, req.user.id]
            );
            if (memberQuery.rows.length > 0) {
                const member = memberQuery.rows[0];
                if (member.last_scored_round < roomData.round) {
                    const newScore = Number(member.score) + 1;
                    await client.query(
                        "UPDATE room_members SET score = $1, last_scored_round = $2 WHERE id = $3",
                        [newScore, roomData.round, member.id]
                    );
                }
            }
            res.status(200).json({ message: "accepted" });
        } else {
            res.status(200).json({ message: "couldnt find accepted submission" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};