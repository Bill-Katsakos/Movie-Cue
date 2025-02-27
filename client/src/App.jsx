import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./components/Login";
import Watchlist from "./components/Watchlist";
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
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<Watchlist />} />``
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