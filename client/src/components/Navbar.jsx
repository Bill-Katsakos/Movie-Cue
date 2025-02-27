import { Link, useNavigate } from "react-router-dom"; 

function Navbar() { 
  let token = null;
  const navigate = useNavigate();

  try {
    if (localStorage.getItem("token")) { 
      token = localStorage.getItem("token");
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
    <nav className="navbar custom-navbar">
    <div className="container d-flex justify-content-between align-items-center">
      <ul className="navbar-nav d-flex flex-row align-items-center left-links">
        {token ? (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/find-movie">
                Find
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/watchlist">
                Watchlist
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/unwatched-movies">
                Unwatched
              </Link>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
        )}
      </ul>

      <ul className="navbar-nav d-flex flex-row align-items-center right-links">
        {token ? (
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  </nav>
  );
}

export default Navbar;
// 🦖