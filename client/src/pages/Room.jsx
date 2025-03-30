import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StarBorder from "../components/StarBorder";

const RoomPage = () => {
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [message, setMessage] = useState("");
  const [joinedRooms, setJoinedRooms] = useState([]);
  const navigate = useNavigate();

  const fetchJoinedRooms = async () => {
    try {
      const { data } = await axios.get("/api/room/joined");
      setJoinedRooms(data.joinedRooms);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch joined rooms.");
    }
  };

  const handleCreateRoom = async () => {
    try {
      const { data } = await axios.post("/api/room/create");
      setMessage(`Room created successfully! Room code: ${data.room.room_code}`);
      fetchJoinedRooms();
      navigate(`/room/${data.room.room_code}`);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create room.");
    }
  };

  const handleJoinRoom = async () => {
    try {
      const { data } = await axios.post("/api/room/join", { roomCode: joinRoomCode });
      setMessage(`Joined room successfully! Room code: ${data.room.room_code}`);
      fetchJoinedRooms();
      navigate(`/room/${data.room.room_code}`);
    } catch (error) {
      console.error(error);
      setMessage("Failed to join room.");
    }
  };

  const handleLeaveRoom = async (roomCode) => {
    try {
      const { data } = await axios.post("/api/room/leave", { roomCode });
      setMessage(`Left room successfully! Room code: ${data.room.room_code}`);
      fetchJoinedRooms();
    } catch (error) {
      console.error(error);
      setMessage("Failed to leave room.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <StarBorder
        as="div"
        className="custom-class p-6 rounded-lg shadow-xl w-full max-w-4xl flex"
        color="cyan"
        speed="5s"
      >
        <div className="flex p-6">
          <div className="w-1/2 border-r border-zinc-800 pr-4 flex flex-col items-center">
            <h2 className="text-2xl mb-4 text-gray-100 font-semibold">Create Room</h2>
            <button
              onClick={handleCreateRoom}
              className="w-full rounded bg-blue-600 hover:cursor-pointer hover:bg-blue-500 text-white p-2 transition-colors"
            >
              Create Room
            </button>
          </div>
          <div className="w-1/2 pl-4 flex flex-col items-center justify-center">
            <h2 className="text-2xl mb-4 text-gray-100 font-semibold">Join Room</h2>
            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinRoomCode}
              onChange={(e) => setJoinRoomCode(e.target.value)}
              className="w-full rounded border border-gray-700 bg-zinc-700 text-gray-100 p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoinRoom}
              className="w-full rounded bg-green-600 hover:bg-green-500 text-white p-2 transition-colors hover:cursor-pointer"
            >
              Join Room
            </button>
          </div>
        </div>
      </StarBorder>



      <div className="mt-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl text-gray-100">Joined Rooms</h3>
          <img
            src="/refresh.png"
            alt="Refresh"
            onClick={fetchJoinedRooms}
            className="w-6 h-6 cursor-pointer"
          />
        </div>
        {joinedRooms.length > 0 ? (
          <ul className="space-y-3">
            {joinedRooms.map((room) => (
              <li key={room.id} className="flex justify-between items-center bg-zinc-800 p-3 rounded">
                <span className="text-gray-100">Room Code: {room.room_code}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/room/${room.room_code}`)}
                    className="rounded bg-green-700 hover:bg-green-600 text-white p-1 hover:cursor-pointer transition-all"
                  >
                    Open Room
                  </button>
                  <button
                    onClick={() => handleLeaveRoom(room.room_code)}
                    className="rounded bg-red-700 hover:bg-red-600 text-white p-1 hover:cursor-pointer transition-all"
                  >
                    Leave Room
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">You haven't joined any rooms yet.</p>
        )}
      </div>
      {message && <div className="absolute bottom-4 text-gray-100">{message}</div>}
    </div>
  );
};

export default RoomPage;
