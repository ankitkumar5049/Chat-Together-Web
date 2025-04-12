import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../utils/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const result = await signUpUser(name, username, dob, password);
    if (result.success) {
      alert(result.message);
      navigate("/dashboard");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <img
        src="/app_logo.jpg"
        alt="Logo"
        className="w-24 h-24 mb-4 rounded-full"
      />
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sign Up</h2>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded-md"
        />
        <input
          type="date"
          placeholder="D.O.B"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full mb-4 p-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 border rounded-md"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
