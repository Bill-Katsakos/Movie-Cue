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
    <div>
      <h2>Watchlist:</h2>
      {movies.map((movie) => {
        return (
          <div key={movie._id}>

            <div 
            className={movie.watched ? "watched" : ""}
            style={{
                display: "flex",
                border: "1px solid black",
                padding: "10px",
                margin: "4px",
            }}
            >
                <div>

            <input
              type="checkbox"
              checked={movie.watched}
              onChange={(e) => toggleStatus(e, movie._id)}
            />
                </div>
                <div>
              <h3>{movie.title}</h3>
              <p>Year: {movie.year}</p>
              <p>Type: {movie.type}</p>
              <p>IMDB Rating: ⭐️ {movie.imdbRating}/10</p>
              <p
              style={{width: "500px"}}
              >Plot: {movie.plot}</p>
                    
                </div>
                <div>
              {movie.poster && movie.poster !== "N/A" && (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{ width: "100px" }}
                />
              )}

                </div>
              <div>
                <button onClick={() => deleteMovie(movie._id)}>Delete</button>
              </div>
               
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default Watchlist;
// 🦖