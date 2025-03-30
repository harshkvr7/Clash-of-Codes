import { useNavigate } from "react-router-dom";
import DecryptedText from "../components/DecryptedText"
import StarBorder from '../components/StarBorder'

const Home = () => {
  const navigate = useNavigate();

  const handleGoToRoom = () => {
    navigate("/room");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-gray-100">
      <h1 className="text-5xl font-bold mb-4">
        <DecryptedText
          text="Enter the Code Arena"
          animateOn="view"
          revealDirection="start"
          speed={70}
          maxIterations="20"
          sequential="true"
        /></h1>
      <p className="text-xl mb-2">Challenge your skills and fight in epic coding battles.</p>
      <p className="text-lg mb-8">Join or create rooms and prove you're the ultimate coder.</p>

      <StarBorder
        as="button"
        color="cyan"
        speed="3s"
        onClick={handleGoToRoom}
        className="px-6 custom-class text-white rounded transition-colors hover:cursor-pointer"
      >
        Start
      </StarBorder>
    </div>
  );
};

export default Home;
