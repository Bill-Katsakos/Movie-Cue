import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // _________Register new user and automatically log in_________
  async function handleRegister(e) {
    e.preventDefault();
    try {
      const newUserInfo = {
        username,
        email,
        password,
      };
      // Register user
      await axios.post("http://localhost:4000/user/register", newUserInfo);
      
      // Automatically log in user after successful registration
      const loginRes = await axios.post("http://localhost:4000/user/login", {
        email,
        password,
      });
      
      // Store token and redirect to "/newmovie"
      localStorage.setItem("token", loginRes.data.token);
      navigate("/newmovie");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          placeholder="username"
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default Register;
// 🦖