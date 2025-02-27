import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Home() {
  const navigate = useNavigate();

  // Visibility change: redirect to "/watchlist" if token exists when the tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const token = localStorage.getItem("token");
        if (token) {
          navigate("/newmovie");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to Movie Cue</h1>
      <h2>login to Enjoy</h2>
    </div>
  );
}

export default Home;
// 🦖