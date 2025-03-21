import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGoToRoom = () => {
    navigate("/room");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-gray-100">
      <h1 className="text-5xl font-bold mb-4">Enter the Code Arena</h1>
      <p className="text-xl mb-2">Challenge your skills and battle in epic coding duels.</p>
      <p className="text-lg mb-8">Join or create rooms and prove you're the ultimate coder.</p>
      <button
        onClick={handleGoToRoom}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors hover:cursor-pointer"
      >
        Start
      </button>
    </div>
  );
};

export default Home;
