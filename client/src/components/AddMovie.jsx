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

    try {
      const searchRes = await axios.get("http://localhost:4000/api/omdb", {
        params: { s: omdbQuery },
      });

      if (searchRes.data.Error) {
        setOmdbError(searchRes.data.Error);
        setOmdbResults([]);
      } else {
        const movies = searchRes.data.Search;
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

        detailedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        setOmdbResults(detailedMovies);
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
    <div>
      <h2>Search movies</h2>
      <form onSubmit={searchOMDB}>
        <input
          type="text"
          placeholder="Enter movie name..."
          value={omdbQuery}
          onChange={(e) => setOmdbQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {omdbError && <p style={{ color: "red" }}>{omdbError}</p>}

      <div>
        {omdbResults.length > 0 &&
          omdbResults.map((movie) => {
            const isInWatchlist = !!imdbToMovieIdMap[movie.imdbID];
            return (
              <div
                key={movie.imdbID}
                style={{
                  border: "1px dashed gray",
                  margin: "8px",
                  padding: "8px",
                }}
              >
                <h3>{movie.Title}</h3>
                <p>Year: {movie.Year}</p>
                <p>Type: {movie.Type}</p>
                <p>IMDB Rating: ⭐️ {movie.imdbRating}/10</p>
                <p>Description: {movie.Plot}</p>
                {movie.Poster !== "N/A" && (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    style={{ width: "100px" }}
                  />
                )}
                <button onClick={() => toggleWatchlist(movie)}>
                  {isInWatchlist ? "Added to watchlist" : "Add to watchlist"}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AddMovie;
// 🦖