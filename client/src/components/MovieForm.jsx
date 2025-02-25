import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieForm() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let newMovieInfo = { content };
      let res = await axios.post(
        "http://localhost:4000/movies/create",
        newMovieInfo,
        {
          // εδω ορίζουμε το Authorization στο headers. Πρέπει να συμπεριλάβουμε και το "Bearer " πριν το token για ταυτοποίηση
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.msg);
      navigate("/"); // μόλις έχει γίνει η ταυτοποίηση και έχει πετύχει, κατευθίνουμε τον user στην αρχηκή
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="movie content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input type="submit" value="Create movie" />
      </form>
    </div>
  );
}

export default MovieForm;
