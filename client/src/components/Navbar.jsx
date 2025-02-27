import React from "react";
import { Link, useNavigate } from "react-router-dom"; 

import { jwtDecode } from "jwt-decode";

function Navbar() { 
  let token = null;
  let decodedToken = null;
  const navigate = useNavigate();

  try {
    if (localStorage.getItem("token")) { 
      token = localStorage.getItem("token");
      decodedToken = jwtDecode(token);
    }
  } catch (error) {
    console.log(error);
  }

  //   __________HandleLogout Function_________

  function handleLogout() {
    try {
      if (token) {
        localStorage.removeItem("token"); 
        navigate("/watchlist");
      }
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div>
      <ul
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* <h4> {decodedToken && `Welcome ${decodedToken.email}`}</h4>  */}
        {token ? ( 
          <>
            <li>
              <Link to="/newmovie">Find Movie</Link>
            </li>
            <li>
              <Link to="/watchlist">Watchlist</Link>
            </li>
            <li>
              <Link to="/usermovies">Unwatched Movies</Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout}> 
                Logout
              </Link>
            </li>
          </>
        ) : (
          <> 
            {" "}
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
// 🦖