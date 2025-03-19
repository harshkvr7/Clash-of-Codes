import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      setUser(data.user);
      navigate("/");
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900">
      <form onSubmit={handleLogin} className="bg-zinc-800 p-6 rounded-lg shadow-xl w-80">
        <h2 className="text-2xl mb-4 text-gray-100 font-semibold">Login</h2>
        <input
          type="email"
          className="w-full rounded border border-gray-700 bg-zinc-700 text-gray-100 p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded border border-gray-700 bg-zinc-700 text-gray-100 p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-600 hover:bg-blue-500 text-white p-2 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
