import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieForm() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const [omdbResults, setOmdbResults] = useState([]);
  const [omdbQuery, setOmdbQuery] = useState("");
  const [omdbError, setOmdbError] = useState("");

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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let newMovieInfo = { content };
      let res = await axios.post(
        "http://localhost:4000/movies/create",
        newMovieInfo,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.msg);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  }

  return (
    <div>
      <h2>Create a New Movie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="movie content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input type="submit" value="Create movie" />
      </form>

      <hr />

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
            </div>
          ))}
      </div>
    </div>
  );
}

export default MovieForm;
