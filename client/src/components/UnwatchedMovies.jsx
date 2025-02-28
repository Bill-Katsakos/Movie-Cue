import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UnwatchedMovies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [randomMovie, setRandomMovie] = useState(null);

  // 1) Fetch all user movies from the server
  // 2) Filter movies locally that are NOT watched
  async function getUserMovies() {
    try {
      let res = await axios.get("http://localhost:4000/movies/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Filter only movies with watched === false
      const unWatched = res.data.filter((movie) => !movie.watched);
      setMovies(unWatched);
      // Reset the random movie selection when the list updates
      setRandomMovie(null);
    } catch (error) {
      console.log("Error fetching user movies:", error);
    }
  }

  // Select a random movie from the unwatched list
  function surpriseMe() {
    if (movies.length === 0) return;
    const randomIndex = Math.floor(Math.random() * movies.length);
    setRandomMovie(movies[randomIndex]);
    window.scrollTo(0, 0);
  }

  // Initial fetch of user movies when the component mounts
  useEffect(() => {
    getUserMovies();
  }, []);

  // Detect visibility change: check token when the tab becomes visible
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

  // If a random movie is selected, display only that movie
  if (randomMovie) {
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="card surprise-movie  movie-card mt-2">
          {randomMovie.poster && randomMovie.poster !== "N/A" && (
            <img
              src={randomMovie.poster}
              className="card-img-top"
              alt={randomMovie.title}
            />
          )}
          <div className="card-body">
            <h5 className="card-title">{randomMovie.title}</h5>
            <p className="card-text my-1">
              <strong>Year:</strong> {randomMovie.year}
            </p>
            <p className="card-text my-1">
              <strong>Type:</strong> {randomMovie.type}
            </p>
            <p className="card-text mt-1">
              <strong>IMDB Rating:</strong> ⭐ {randomMovie.imdbRating}/10
            </p>
            <p className="card-text">
              <strong>Plot:</strong> {randomMovie.plot}
            </p>
          </div>
        </div>
        {/* Button to return to the full list */}
        <button
          className="btn btn-secondary mt-2 mb-5 bttn-ShowAll"
          onClick={() => {
            setRandomMovie(null);
            window.scrollTo(0, 0);
          }}
        >
          Show All Unwatched
        </button>
      </div>
    );
  }

  // If no random movie is selected, show the full list of unwatched movies
  return (
    <div className="container">
      {/* Header with title and button */}
      <div className="d-flex justify-content-between align-items-center my-4">
        <h1 className="mb-0">Unwatched</h1>
        <button className="btn btn-primary bttn-surpriseMe" onClick={surpriseMe}>
          Surprise Me
        </button>
      </div>

      <div className="row g-0">
        {movies.map((movie) => (
          <div key={movie._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 movie-card  p-2">
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
                        className="img-fluid poster-small poster"
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