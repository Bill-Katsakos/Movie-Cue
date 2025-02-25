import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Home from "./components/Home";
import MovieForm from "./components/MovieForm";
import UserMovies from "./components/UserMovies";

function App() {


  return (
    <>
     <BrowserRouter>
        <Navbar />
        <Routes> 
          {/* Εδώ προσθέτω τις σελίδες που θέλω να ανοίγω |
           ότι διεύθυνση βάζω μέσα στα routes βάζω το ίδιο και στην σελίδα που θα έχω το λίκ 
           όπως για παράδειγμα στο NavBar.jsx <<Link to="/usermovies">My movies</Link>>*/}
          {/* Κάθε βέα σελίδα που φτιάχνω σε άλλα component πρέπει να την προσθέτω και εδώ για να λειτουργεί το link */}
          <Route path="/" element={<Home />} />
          {/* στο path="το endpoint της σελίδας", element={<Το component που περιέχει την σελίδα />} */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/newmovie" element={<MovieForm />} />
          <Route path="/usermovies" element={<UserMovies />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
// 🦖