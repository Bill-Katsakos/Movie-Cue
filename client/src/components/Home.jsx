import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Home() {
  const [movies, setMovies] = useState([]);

  // ----- token -------
  let token = null;
  let decodedToken = null;

  try {
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
      decodedToken = jwtDecode(token);
      console.log(decodedToken);
    }
  } catch (error) {
    console.log(error);
  }

  //   ________Retrieving all the movies _______
  async function getAllMovies() {
    try {
      let res = await axios.get("http://localhost:4000/movies");
      setMovies(res.data.reverse());
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllMovies();
  }, []);

  //   ________Toggle watched movies_______
  async function toggleStatus(e, id) {
    const isChecked = e.target.checked;
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie._id === id ? { ...movie, watched: isChecked } : movie
      )
    );
    try {
      await axios.put(
        "http://localhost:4000/movies/update",
        { movieId: id, watched: isChecked },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      getAllMovies();
    } catch (error) {
      console.error("Error updating movie status:", error);
    }
  }

  //   ________Delete a movie _______
  async function deleteMovie(id) {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this movie? 🤔"
    );
    if (!confirmDeletion) return;
    try {
      await axios.delete("http://localhost:4000/movies/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          movieId: id,
        },
      });
      getAllMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  }

  return (
    <div>
      <h1>Welcome to Movie Cue</h1>
      <h2>See your watchlist</h2>
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
            <input
              type="checkbox"
              checked={movie.watched}
              onChange={(e) => toggleStatus(e, movie._id)}
            />

            <div className={movie.watched ? "watched" : ""}>
              <h3>{movie.title}</h3>
              <p>Year: {movie.year}</p>
              <p>Type: {movie.type}</p>
              <p>IMDB Rating: {movie.imdbRating}</p>
              <p>Plot: {movie.plot}</p>
              {movie.poster && movie.poster !== "N/A" && (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{ width: "100px" }}
                />
              )}
            </div>

            {movie.user && (
              <>
                <h6>{movie.user.username}</h6>
                <h6>{movie.user.email}</h6>
              </>
            )}

            {token && movie.user && movie.user._id === decodedToken.userId ? (
              <div>
                <button onClick={() => deleteMovie(movie._id)}>Delete</button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default Home;
// 🦖