import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-zinc-900 text-gray-100 p-4 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center space-x-4">
      <Link className="hover:text-blue-400 transition-colors" to="/"><h1 className="text-2xl font-extrabold">Clash of Codes</h1></Link>
      </div>
      <div className="flex gap-6">
        <Link className="hover:text-blue-400 transition-colors" to="/">Home</Link>

        {user && (
          <Link className="hover:text-blue-400 transition-colors" to="/room">
            Rooms
          </Link>
        )}

        {user && (
          <Link className="hover:text-green-400 transition-colors" to="/profile">
            {user.handle}
          </Link>
        )}

        {user ? (
          <button
            onClick={handleLogout}
            className="hover:text-red-400 transition-colors hover:cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <>
            <Link className="hover:text-blue-400 transition-colors" to="/login">
              Login
            </Link>
            <Link className="hover:text-blue-400 transition-colors" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
