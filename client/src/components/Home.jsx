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
          navigate("/find-movie");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  return (
<div className="d-flex flex-column justify-content-center align-items-center text-center mt-5">
  <h1>Welcome to Movie Cue</h1>
  <h3 className="mt-5">Login to Enjoy</h3>
</div>


  );
}

export default Home;
// 🦖