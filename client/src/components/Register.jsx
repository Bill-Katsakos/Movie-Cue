import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   _________Register new User_________
  async function handleRegister(e) {
    e.preventDefault();
    try {
      let newUserInfo = {
        username,
        email,
        password,
      };
      let res = await axios.post(
        "http://localhost:4000/user/register",
        newUserInfo
      );
      alert(res.data.msg); // αυτό είναι το μύνημα που πέρνουμε από το server
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
