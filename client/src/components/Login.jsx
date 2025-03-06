import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   _________Login new User_________
  async function handleLogin(e) {
    e.preventDefault();
    try {
      let userInfo = { email, password };
      let res = await axios.post("http://localhost:4000/user/login", userInfo);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/find-movie");
      } else {
        alert(res.data.msg);
      }
    } catch (error) {
      console.log(error);
      alert("Please enter a valid email or password.");
    }
  }
  
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center mt-5">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="w-50">
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
        <button type="submit" className="btn btn-primary bttn-Login">
          Login
        </button>
      </form>
    </div>
  );
  
}

export default Login;
// 🦖