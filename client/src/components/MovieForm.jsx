import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieForm() {
  const navigate = useNavigate();

  const [omdbResults, setOmdbResults] = useState([]);
  const [omdbQuery, setOmdbQuery] = useState("");
  const [omdbError, setOmdbError] = useState("");

  // ----------- Search OMDB -----------
  async function searchOMDB(e) {
    e.preventDefault();
    setOmdbError("");

    try {
      const res = await axios.get("http://localhost:4000/api/omdb", {
        params: {
          s: omdbQuery,
          plot: "short",
        },
      });

      if (res.data.Error) {
        setOmdbError(res.data.Error);
        setOmdbResults([]);
      } else {
        const moviesDetailed = res.data.Search.map((movie) => ({
          ...movie,
          imdbRating: movie.imdbRating || "N/A",
          Plot: movie.Plot || "No description available",
        }));

        moviesDetailed.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        setOmdbResults(moviesDetailed);
      }
    } catch (error) {
      setOmdbError("Error when communicating with the OMDB API.");
      console.error(error);
    }
  }

  // ----------- Add to Watchlist -----------
  async function addToWatchlist(selectedMovie) {
    try {
      const newMovieInfo = {
        title: selectedMovie.Title,
        year: selectedMovie.Year,
        type: selectedMovie.Type,
        imdbRating: selectedMovie.imdbRating,
        plot: selectedMovie.Plot,
        poster: selectedMovie.Poster,
      };

      const res = await axios.post(
        "http://localhost:4000/movies/create",
        newMovieInfo,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert(res.data.msg);
      // navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Something went wrong.");
    }
  }

  return (
    <div>
      <h2>Search movies on OMDB</h2>
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
          omdbResults.map((movie) => (
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

              <button onClick={() => addToWatchlist(movie)}>
                add to watchlist
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MovieForm;
// 🦖