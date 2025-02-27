import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./components/Login";
import Watchlist from "./components/Watchlist";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Home from "./components/Home";
import AddMovie from "./components/AddMovie";
import UnwatchedMovies from "./components/UnwatchedMovies";
import "bootstrap/dist/css/bootstrap.min.css";

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
          <Route path="/find-movie" element={<AddMovie />} />
          <Route path="/unwatched-movies" element={<UnwatchedMovies />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
// 🦖