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
    <div className="container">
      <h1 className="my-4">My Unwatched Movies</h1>
      <div className="row g-0">
        {movies.map((movie) => (
          <div key={movie._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body p-1">
                <div className="row">
                  <div className="col-6">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text mb-1">
                      <strong>Year:</strong> {movie.year}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Type:</strong> {movie.type}
                    </p>
                    <p className="card-text mb-1">
                      <strong>IMDB Rating:</strong> ⭐ {movie.imdbRating}/10
                    </p>
                  </div>
                  <div className="col-6 d-flex align-items-center justify-content-center">
                    {movie.poster && movie.poster !== "N/A" && (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="img-fluid poster-small"
                      />
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="card-text">
                    <strong>Plot:</strong> {movie.plot}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default UnwatchedMovies;
// 🦖