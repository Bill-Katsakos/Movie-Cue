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
      
      // Store token and redirect to "/find-movie"
      localStorage.setItem("token", loginRes.data.token);
      navigate("/find-movie");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center mt-5">
      <h1>Register</h1>
      <form onSubmit={handleRegister} className="w-50">
        <div className="mb-3">
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary bttn-Register">
          Register
        </button>
      </form>
    </div>
  );
  
}

export default Register;
// 🦖