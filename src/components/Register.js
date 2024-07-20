import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS for Register

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Use useNavigate hook


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://ashutosh.systems/auth/register",
        { username, password },
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
