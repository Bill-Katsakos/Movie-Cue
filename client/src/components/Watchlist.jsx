import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Watchlist() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const token = localStorage.getItem("token");
  let decodedToken = null;

  try {
    if (token) {
      decodedToken = jwtDecode(token);
    }
  } catch (error) {
    console.log(error);
  }

  // Function to load movies
  async function getAllMovies() {
    try {
      let res = await axios.get("http://localhost:4000/movies/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMovies(res.data.reverse());
    } catch (error) {
      console.log(error);
    }
  }

  // Check the token when the component loads
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getAllMovies();
    }
  }, [navigate, token]);

  // Detect when the tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          // If there is no token, redirect to the home page
          navigate("/");
        } else {
          // If there is a token, you can refresh the data if needed
          getAllMovies();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  // Function to toggle "watched" status
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

  // Function to delete a movie
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

  if (!token) {
    return null; // Returns null if there is no token
  }



  return (
    <div className="container">
      <h1
      className="my-4"
      >Watchlist</h1>
      <div className="row g-0">
        {movies.map((movie) => (
          <div key={movie._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100  movie-card p-2">
              <div className="card-body card-watchlist p-1">
                {/* Internal layout: tape elements */}
                <div className="row">
                  <div className="col-6">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text mb-1">
                      <strong>Year:</strong> {movie.year}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Type:</strong> {movie.type}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Rating:</strong> {movie.imdbRating}/10
                    </p>
                    <div
                    className="mb-1"
                    >
                      <input
                        type="checkbox"
                        className="movie-checkbox align-middle"
                        checked={movie.watched}
                        onChange={(e) => toggleStatus(e, movie._id)}
                      />
                      <label className="ms-1">{movie.watched ? "Watched" : "Awaiting"}</label>
                    </div>
                    <button
                      className="btn btn-danger btn-sm mt-2 bttn-Delete"
                      onClick={() => deleteMovie(movie._id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="col-6 d-flex align-items-center justify-content-center">
                    {movie.poster && movie.poster !== "N/A" && (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="img-fluid poster"
                      />
                    )}
                  </div>
                </div>
                {/* Description below the data and image */}
                <div className="mt-3">
                  <p className="card-text">{movie.plot}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;
// 🦖