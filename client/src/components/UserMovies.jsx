import axios from "axios";
import React, { useEffect, useState } from "react";

function UserMovies() {
  const [movies, setMovies] = useState([]);

  async function getUserMovies() {
    try {
      let res = await axios.get("http://localhost:4000/movies/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, 
      });
      setMovies(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserMovies();
  }, []);

  return (
    <>
      <h1>My movies</h1>
      {movies.map((movie) => {
        return (
          <div
            style={{
              border: "1px solid black",
              padding: "10px",
              margin: "4px",
            }}
            key={movie._id}
          >
            <p>{movie.content}</p>
            <h6>{movie.user.username}</h6>
            <h6>{movie.user.email}</h6>
          </div>
        );
      })}
    </>
  );
}

export default UserMovies;
// 🦖