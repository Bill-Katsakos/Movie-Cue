import axios from "axios";
import React, { useEffect, useState } from "react";

function UserMovies() {
  const [movies, setMovies] = useState([]);

  // 1) Φέρνουμε από τον server ΟΛΕΣ τις ταινίες του χρήστη
  // 2) Φιλτράρουμε τοπικά τις ταινίες που ΔΕΝ είναι watched
  async function getUserMovies() {
    try {
      let res = await axios.get("http://localhost:4000/movies/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Φιλτράρουμε μόνο τις ταινίες που έχουν watched === false
      const unWatched = res.data.filter((movie) => !movie.watched);
      setMovies(unWatched);
    } catch (error) {
      console.log("Error fetching user movies:", error);
    }
  }

  useEffect(() => {
    getUserMovies();
  }, []);

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
          {/* Προβολή των δεδομένων που έχεις ορίσει στο schema: title, year, κλπ. */}
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
            />)}


          {/* Αν χρειάζεται, έλεγξε ότι υπάρχει user (σε περίπτωση που δεν επιστρέφεται) */}
          {movie.user && (
            <>
              <h6>{movie.user.username}</h6>
              <h6>{movie.user.email}</h6>
            </>
          )}
        </div>
      ))}
    </>
  );
}

export default UserMovies;
