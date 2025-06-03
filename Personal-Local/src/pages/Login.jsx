import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // for redirecting after login

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://16.171.158.43:3001/auth/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");
      navigate("/edit-profile"); // ✅ Redirect to edit profile after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Login
      </h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary w-full mt-4">
          Login
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="flex justify-between text-sm mt-4">
        <Link to="/forgot-password" className="text-indigo-600 hover:underline">
          Forgot Password?
        </Link>
        <Link to="/signup" className="text-indigo-600 hover:underline">
          Signup
        </Link>
      </div>
    </div>
  );
}
