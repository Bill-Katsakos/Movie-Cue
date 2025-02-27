import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UnwatchedMovies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  // 1) Fetch all user movies from the server
  // 2) Locally filter movies that are NOT watched
  async function getUserMovies() {
    try {
      let res = await axios.get("http://localhost:4000/movies/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Filter only movies with watched === false
      const unWatched = res.data.filter((movie) => !movie.watched);
      setMovies(unWatched);
    } catch (error) {
      console.log("Error fetching user movies:", error);
    }
  }

  // Initial fetch of user movies when the component mounts
  useEffect(() => {
    getUserMovies();
  }, []);

  // Visibility change: check token when the tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          // If token does not exist, redirect to the home page
          navigate("/");
        } else {
          // If token exists, refresh the user movies list
          getUserMovies();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  return (
    <>
      <h1>My Unwatched Movies</h1>
      {movies.map((movie) => (
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            margin: "4px",
          }}
          key={movie._id}
        >
          <h3>{movie.title}</h3>
          <p>Year: {movie.year}</p>
          <p>Type: {movie.type}</p>
          <p>IMDB Rating: ⭐️ {movie.imdbRating}/10</p>
          <p>Plot: {movie.plot}</p>
          {movie.poster && movie.poster !== "N/A" && (
            <img
              src={movie.poster}
              alt={movie.title}
              style={{ width: "100px" }}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default UnwatchedMovies;
// 🦖