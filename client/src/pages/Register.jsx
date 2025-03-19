import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", { name, email, password, handle });
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Please check your details and try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900">
      <form onSubmit={handleRegister} className="bg-zinc-800 p-6 rounded-lg shadow-xl w-80">
        <h2 className="text-2xl mb-4 text-gray-100 font-semibold">Register</h2>
        <input
          type="text"
          className="w-full rounded border border-gray-700 bg-zinc-700 text-gray-100 p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          type="text"
          className="w-full rounded border border-gray-700 bg-zinc-700 text-gray-100 p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-600 hover:bg-blue-500 text-white p-2 transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
