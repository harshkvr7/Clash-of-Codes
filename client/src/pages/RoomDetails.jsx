import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import ProblemComponent from "../components/ProblemComponent";

const RoomDetails = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [members, setMembers] = useState([]);
  const [roomData, setRoomData] = useState(null);
  const [problemStatement, setProblemStatement] = useState("");
  const [message, setMessage] = useState("");
  const [newRating, setNewRating] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchRoomMembers = async () => {
    try {
      const { data } = await axios.get(`/api/room/${roomCode}/members`);
      setMembers(data.members);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch room members.");
    }
  };

  const fetchRoomDetails = async () => {
    try {
      const { data } = await axios.get(`/api/room/${roomCode}/details`);
      setRoomData(data.room);
      setNewRating(data.room.question_rating || "");
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch room details.");
    }
  };

  const fetchProblemStatement = async () => {
    try {
      const { data } = await axios.get(`/api/problem/${roomCode}`);
      setProblemStatement(data.problem);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch problem statement.");
    }
  };

  useEffect(() => {
    fetchRoomMembers();
    fetchRoomDetails();
    fetchProblemStatement();
  }, [roomCode]);

  const handleLeaveRoom = async () => {
    try {
      await axios.post("/api/room/leave", { roomCode });
      navigate("/room");
    } catch (error) {
      console.error(error);
      setMessage("Failed to leave room.");
    }
  };

  const handleUpdateRating = async () => {
    try {
      const { data } = await axios.post("/api/room/updateRating", { roomCode, newRating });
      setRoomData(data.room);
      setMessage("Rating updated and a new question selected.");
      fetchProblemStatement();
    } catch (error) {
      console.error(error);
      setMessage("Failed to update rating.");
    }
  };

  const handleCheckSubmission = async () => {
    try {
      const { data } = await axios.post("/api/game/check_sub", { roomData });
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update submission.");
    }
  };

  const isHost = roomData && user && roomData.host_id === user.id;

  return (
    <div className="min-h-screen bg-zinc-900 text-gray-100 flex">
      {/* Left Panel: Room Members */}
      <div className="w-64 border-r border-gray-700 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Room Members</h2>
          <img
            src="/refresh.png"
            alt="Refresh"
            onClick={fetchRoomMembers}
            className="w-6 h-6 cursor-pointer"
          />
        </div>
        {members.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {members.map((member) => (
              <li key={member.id} className="py-2 flex justify-between items-center">
                <span>
                  {member.handle || member.name}{" "}
                  <span className="text-sm text-gray-400">- Score: {member.score}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No members found.</p>
        )}
        <button
          onClick={handleLeaveRoom}
          className="mt-6 bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors hover:cursor-pointer"
        >
          Leave Room
        </button>
      </div>

      {/* Main Content: Problem Statement and Submission Links */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 flex justify-between items-center">
          {roomData && roomData.problem_id ? (
            <div>
              ProblemId: {roomData.problem_id}{roomData.problem_index}
            </div>
          ) : (
            "Waiting for host..."
          )}
          <div className="flex items-center space-x-2">
            <a
              href="https://codeforces.com/problemset/submit"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded transition-colors"
            >
              Submit Link
            </a>
            <button
              onClick={handleCheckSubmission}
              className="bg-green-600 hover:cursor-pointer hover:bg-green-500 text-white px-2 py-1 rounded transition-colors"
            >
              Update Submission
            </button>
          </div>
        </div>
        {problemStatement ? (
          <ProblemComponent problemHTML={problemStatement} />
        ) : (
          <p>Loading problem statement...</p>
        )}
      </div>

      <div className="w-64 border-l border-gray-700 p-4 flex flex-col">
        {roomData ? (
          <div className="flex flex-col space-y-4 h-full">
            <div>
              <h2 className="text-xl mb-2">Room Details</h2>
              <p>
                <strong>Room Code: </strong> {roomCode}
              </p>
              <p>
                <strong>Rating:</strong> {roomData.rating || "Not set"}
              </p>
              <p>
                <strong>Problem:</strong> {roomData.question || "Not set"}
              </p>
              <p>
                <strong>Contest ID:</strong> {roomData.problem_id || "Not set"}
              </p>
              <p>
                <strong>Index:</strong> {roomData.problem_index || "Not set"}
              </p>
            </div>
            {isHost && (
              <div>
                <input
                  type="number"
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  className="w-full rounded border border-gray-700 bg-zinc-700 text-gray-100 p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new rating"
                />
                <button
                  onClick={handleUpdateRating}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded transition-colors hover:cursor-pointer"
                >
                  Update Rating
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Loading room details...</p>
        )}
      </div>

      {message && <div className="absolute bottom-4 text-gray-100">{message}</div>}
    </div>
  );
};

export default RoomDetails;
