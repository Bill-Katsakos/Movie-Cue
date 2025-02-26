import axios from "axios";
import React, { useEffect, useState } from "react";
// jwtDecode: είναι library για να κάνω decode το token 
import { jwtDecode } from "jwt-decode";

function Home() {
  const [movies, setMovies] = useState([]);

    // Νέο state για τα αποτελέσματα αναζήτησης από το OMDB API
    const [omdbResults, setOmdbResults] = useState([]);
    // Νέο state για το query της αναζήτησης OMDB
    const [omdbQuery, setOmdbQuery] = useState("");
    // Νέο state για πιθανό error από την αναζήτηση OMDB
    const [omdbError, setOmdbError] = useState("");

  // ----- token -------
  // token ==== logged in user (this token include the userId )
  // the movies ==> each movie contains the user id
  // if the movie user id === token id (the logged in user)

  // Αυτός είναι ο ίδιος κωδικας με αυτό στο NavBar.jsx για το token
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
      setMovies(res.data.reverse()); // με το .reverse() φαίρνουμε τα τελευταία movie που δημειουργίθηκαν πρώτα στην σειρά
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
      // Ενημέρωση της τοπικής κατάστασης (optimistic update)
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
        // Ανανεώνουμε τη λίστα για να σιγουρευτούμε ότι είναι συγχρονισμένη με τον server
        getAllMovies();
      } catch (error) {
        console.error("Error updating movie status:", error);
      }
    }

      //   ________Delete a movie _______
  async function deleteMovie(id) {
    const confirmDeletion = window.confirm("Are you sure you want to delete this movie? 🤔");
    if (!confirmDeletion) return;
    try {
      
      await axios.delete("http://localhost:4000/movies/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        data: {
          movieId: id
        }
      });
      getAllMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  }
  

      // _______  OMDB API _______
  async function searchOMDB(e) {
    e.preventDefault();
    setOmdbError(""); 
    try {
      const res = await axios.get("http://www.omdbapi.com/", {
        params: {
          s: omdbQuery,         // το query που εισήγαγε ο χρήστης
          apikey: ""     // ****************** OMDB API key
        }
      });
      if (res.data.Error) {
        setOmdbError(res.data.Error);
        setOmdbResults([]);
      } else {
        // Για κάθε αποτέλεσμα, πραγματοποιούμε επιπλέον κλήση για να πάρουμε λεπτομερείς πληροφορίες:
        // τύπο (Type), βαθμολογία (imdbRating) και περιγραφή (Plot)
        const moviesDetailed = await Promise.all(
          res.data.Search.map(async (movie) => {
            const details = await axios.get("http://www.omdbapi.com/", {
              params: {
                i: movie.imdbID,      // χρησιμοποιούμε το imdbID για λεπτομέρειες
                plot: "short",        // μικρή περιγραφή
                apikey: ""   // ****************** OMDB API key
              }
            });
            return details.data;
          })
        );
        // Προσθήκη: Ταξινόμηση των αποτελεσμάτων με βάση το έτος (Year) σε φθίνουσα σειρά
        moviesDetailed.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        setOmdbResults(moviesDetailed);
      }
    } catch (error) {
      setOmdbError("Σφάλμα κατά την επικοινωνία με το OMDB API.");
      console.error(error);
    }
  }
  
  return (
    <div>
      <h1>Welcome to Movie Cue </h1>
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
          <span className={movie.watched ? "watched" : ""}>
            {movie.content}
          </span>
            <h6>{movie.user.username}</h6> {/* τα δεδομένα του user μέσα από το movie, τα φαίρνω χρησημοποιώντας το <Movie.find().populate("user", "-password"); > από το server στο get all movies */} 
            <h6>{movie.user.email}</h6>

            {token && movie.user._id === decodedToken.userId ? ( // το movie.user._id αντοιστιχεί στο id του user
            // τσεκάρουμε αν υπάρχει το token και είναι ίσο με το id του user του movie και αν ναι εμφανίζουμε τα παρακάτω κουμπιά
              <div>
                <button onClick={() => deleteMovie(movie._id)}>Delete</button>
              </div>
            ) : (
              // άμα δεν συμπίπτουν τα id δεν εμφανίζονται το delete
              ""
            )}
          </div>
        );
      })}

      <h2>Search movies on OMDB</h2>
      <form onSubmit={searchOMDB}>
        {/* Προσθήκη: Εισαγωγή query για αναζήτηση στο OMDB */}
        <input
          type="text"
          placeholder="Enter movie name..."
          value={omdbQuery}
          onChange={(e) => setOmdbQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {/* Προσθήκη: Εμφάνιση μηνύματος λάθους αν υπάρχει */}
      {omdbError && <p style={{ color: "red" }}>{omdbError}</p>}
      {/* Προσθήκη: Εμφάνιση αποτελεσμάτων από το OMDB API */}
      <div>
        {omdbResults.length > 0 &&
          omdbResults.map((movie) => (
            <div
              key={movie.imdbID}
              style={{ border: "1px dashed gray", margin: "8px", padding: "8px" }}
            >
              <h3>{movie.Title}</h3>
              <p>Year: {movie.Year}</p>
              {/* Προσθήκη: Εμφάνιση του τύπου (ταινία ή σειρά) */}
              <p>Film type: {movie.Type}</p>
              {/* Προσθήκη: Εμφάνιση της βαθμολογίας (imdbRating) */}
              <p>Rating: {movie.imdbRating}</p> {/* Το πεδίο αυτό έρχεται από το IMDb μέσω του OMDB API */}
              {/* Προσθήκη: Εμφάνιση της περιγραφής (Plot) */}
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

export default Home;

// token ==== logged in user (this token include the userId )
// the movies ==> each movie contains the user id
// if the movie user id === token id (the logged in user)
