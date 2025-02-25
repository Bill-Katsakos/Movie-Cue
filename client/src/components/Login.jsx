// How to save the token in the client side
// Local storage (not secure) - (browser API)
    // localStorage.setItem("name","yasmeen") -  για αποθήκευση
    // localStorage.removeItem("name") - για remove του αποθηκευμένου
// states (state management tool )
// cookie
// session storage

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Μας οδηγεί στην σελίδα που επιλέγουμε πχ. navigate("/")

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   _________Login new User_________
  async function handleLogin(e) {
    e.preventDefault();
    try {
      let userInfo = {
        email,
        password,
      };
      let res = await axios.post("http://localhost:4000/user/login", userInfo);
      alert(res.data.msg);
      localStorage.setItem("token", res.data.token); // ("όνομα που επιλέγουμε", "τιμή για αποθήκευση")
      navigate("/"); // Μας οδηγεί στην σελίδα "/"
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
