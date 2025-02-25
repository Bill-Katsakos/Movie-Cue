import axios from "axios";
import React, { useEffect, useState } from "react";
// jwtDecode: είναι library για να κάνω decode το token 
import { jwtDecode } from "jwt-decode";

function Home() {
  const [movies, setMovies] = useState([]);

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
            <p>{movie.content}</p> 
            <h6>{movie.user.username}</h6> {/* τα δεδομένα του user μέσα από το movie, τα φαίρνω χρησημοποιώντας το <Movie.find().populate("user", "-password"); > από το server στο get all movies */} 
            <h6>{movie.user.email}</h6>

            {token && movie.user._id === decodedToken.userId ? ( // το movie.user._id αντοιστιχεί στο id του user
            // τσεκάρουμε αν υπάρχει το token και είναι ίσο με το id του user του movie και αν ναι εμφανίζουμε τα παρακάτω κουμπιά
              <div>
                <button onClick={() => deleteMovie(movie._id)}>Delete</button>
                <button>Edit</button>
              </div>
            ) : (
              // άμα δεν συμπίπτουν τα id δεν εμφανίζονται τα κουμπια
              ""
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Home;

// token ==== logged in user (this token include the userId )
// the movies ==> each movie contains the user id
// if the movie user id === token id (the logged in user)
