import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddMovie() {
  const navigate = useNavigate();
  const [omdbResults, setOmdbResults] = useState([]);
  const [omdbQuery, setOmdbQuery] = useState("");
  const [omdbError, setOmdbError] = useState("");

  const [userWatchlist, setUserWatchlist] = useState([]);
  const [imdbToMovieIdMap, setImdbToMovieIdMap] = useState({});

  // Token check when the component loads
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    fetchUserWatchlist();
  }, [navigate]);

  // Visibility change for token checking when the tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          navigate("/");
        } else {
          // If there is a token, we can update the data
          fetchUserWatchlist();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  async function fetchUserWatchlist() {
    try {
      const res = await axios.get("http://localhost:4000/movies/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserWatchlist(res.data);

      const map = {};
      res.data.forEach((m) => {
        if (m.imdbID) {
          map[m.imdbID] = m._id;
        }
      });
      setImdbToMovieIdMap(map);
    } catch (error) {
      console.error(error);
    }
  }

  // ----------- Search on OMDB -----------
  async function searchOMDB(e) {
    e.preventDefault();
    setOmdbError("");
  
    const trimmedQuery = omdbQuery.trim();
    if (trimmedQuery === "") {
      setOmdbQuery("");
      return;
    }
  
    try {
      const res = await axios.get("http://localhost:4000/api/omdb", {
        params: { s: trimmedQuery },
      });
  
      if (res.data.Error) {
        setOmdbError(res.data.Error);
        setOmdbResults([]);
      } else {
        const movies = res.data.Search;
        const detailedMovies = await Promise.all(
          movies.map(async (movie) => {
            const detailRes = await axios.get("http://localhost:4000/api/omdb", {
              params: {
                i: movie.imdbID,
                plot: "short",
              },
            });
            return {
              ...movie,
              imdbRating: detailRes.data.imdbRating || "N/A",
              Plot: detailRes.data.Plot || "No description available",
            };
          })
        );
  
        detailedMovies.sort((a, b) => {
          const queryLower = trimmedQuery.toLowerCase();
          const aMatches = a.Title.toLowerCase() === queryLower;
          const bMatches = b.Title.toLowerCase() === queryLower;
        
          // If only one matches, then it comes first
          if (aMatches && !bMatches) return -1;
          if (!aMatches && bMatches) return 1;
        
          // If both match or none, then sort by date (in reverse)
          return parseInt(b.Year) - parseInt(a.Year);
        });
        
        setOmdbResults(detailedMovies);
        setOmdbQuery("")
      }
    } catch (error) {
      console.error(error);
      setOmdbError("Error when communicating with the OMDB API.");
    }
  }
  

  async function addToWatchlist(selectedMovie) {
    try {
      const newMovieInfo = {
        title: selectedMovie.Title,
        year: selectedMovie.Year,
        type: selectedMovie.Type,
        imdbRating: selectedMovie.imdbRating,
        plot: selectedMovie.Plot,
        poster: selectedMovie.Poster,
        imdbID: selectedMovie.imdbID, 
      };

      const res = await axios.post(
        "http://localhost:4000/movies/create",
        newMovieInfo,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      await fetchUserWatchlist();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Something went wrong.");
    }
  }

  async function removeFromWatchlist(selectedMovie) {
    try {
      const movieId = imdbToMovieIdMap[selectedMovie.imdbID];
      if (!movieId) return;

      const res = await axios.delete("http://localhost:4000/movies/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          movieId,
        },
      });
      await fetchUserWatchlist();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Something went wrong.");
    }
  }

  function toggleWatchlist(movie) {
    const isInWatchlist = !!imdbToMovieIdMap[movie.imdbID];
    if (isInWatchlist) {
      removeFromWatchlist(movie);
    } else {
      addToWatchlist(movie);
    }
  }

  return (
    <div className="container">
      <h2 className="my-4">Search Movies/Series</h2>
      <form onSubmit={searchOMDB} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control "
            id="input"
            placeholder="Enter film or series name..."
            value={omdbQuery}
            onChange={(e) => setOmdbQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
  
      {omdbError && <p className="text-danger">{omdbError}</p>}
  
      <div className="row g-0">
        {omdbResults.length > 0 &&
          omdbResults.map((movie) => {
            const isInWatchlist = !!imdbToMovieIdMap[movie.imdbID];
            return (
              <div key={movie.imdbID} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body p-1">
                    <div className="row">
                      <div className="col-6">
                        <h5 className="card-title">{movie.Title}</h5>
                        <p className="card-text mb-1">
                          <strong>Year:</strong> {movie.Year}
                        </p>
                        <p className="card-text mb-1">
                          <strong>Type:</strong> {movie.Type}
                        </p>
                        <p className="card-text mb-1">
                          <strong>IMDB Rating:</strong> ⭐ {movie.imdbRating}/10
                        </p>
                        <button
                          className={`btn ${isInWatchlist ? "btn-danger" : "btn-secondary"} btn-sm mt-2`}
                          onClick={() => toggleWatchlist(movie)}
                        >
                          {isInWatchlist ? "Added to watchlist" : "Add to watchlist"}
                        </button>
                      </div>
                      <div className="col-6 d-flex align-items-center justify-content-center">
                        {movie.Poster !== "N/A" && (
                          <img
                            src={movie.Poster}
                            alt={movie.Title}
                            className="img-fluid poster"
                          />
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="card-text">
                        <strong>Description:</strong> {movie.Plot}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
  
}

export default AddMovie;
// 🦖