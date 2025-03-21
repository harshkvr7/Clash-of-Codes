import axios from "axios";

export const check_sub = async (req, res) => {
    const { roomData }= req.body;

    const url = `https://codeforces.com/api/user.status?handle=${req.user.handle}&from=1&count=10`;

    const subDetails = await axios.get(url);
    const subDetailsData = subDetails.data;

    let accepted = false;

    for (const sub of subDetailsData.result) {
        if(sub.contestId == roomData.problem_id && sub.problem.index == roomData.problem_index && sub.verdict == "OK")
        {
            accepted = true;
            break;
        }
    }

    if(accepted)
    {
        res.status(200).json({message : "accepted"});
    }
    else res.status(200).json({message : "couldnt find accepted submission"});
}