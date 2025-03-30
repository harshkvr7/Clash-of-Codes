import express, { json } from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hi");
})

app.get("/check_sub", async (req, res) => {
    const { userContestId, userProblemIndex, userHandle } = req.body;

    const url = `https://codeforces.com/api/user.status?handle=${userHandle}&from=1&count=10`;

    const subDetails = await axios.get(url);
    const subDetailsData = subDetails.data;

    let accepted = false;

    for (const sub of subDetailsData.result) {
        if (sub.contestId == userContestId && sub.problem.index == userProblemIndex && sub.verdict == "OK") {
            accepted = true;
            break;
        }
    }

    res.send(accepted);
})

app.get("/problem", async (req, res) => {
    const { contest_id, problem_index } = req.query;

    console.log(contest_id);
    
    try {
        const cf_req = await axios.get(`http://codeforces.com/problemset/problem/${contest_id}/${problem_index}`);
        res.send(cf_req.data);
    } catch (error) {
        res.send({ message: error });
    }
});


app.listen(port, () => {
    console.log(`server running on http://localhost:${port}/`);
})