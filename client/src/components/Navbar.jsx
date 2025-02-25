// πως να χρησημοποιώ το token στο frontEnd
// πως στέλνω το token με κάθε request

import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Το useNavigate είναι ένα hook που μας βοηθάει να κατευθυνθούμε τον χρήστη σε μία σελίδα όπως πχ. navigate("/")

// jwtDecode: είναι library για να κάνω decode το token 
// Ετσι μπορώ να έχω από το token το payload που περιέχει τις πληροφορίες του χρήστη
import { jwtDecode } from "jwt-decode";

function Navbar() { 
  let token = null;
  let decodedToken = null;
  const navigate = useNavigate();

  try {
    if (localStorage.getItem("token")) { // εδώ στην ουσία παίρνουμε το token από το localStorage που το αποθηκεύσαμε
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
        localStorage.removeItem("token"); // αφαιρούμε το token από την μνύμη αν κάνουει ο χρήστης logout
        navigate("/login");
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
        <h4> {decodedToken && `Welcome ${decodedToken.email}`}</h4> {/* Εδώ στην ουσία τσεκάρουμε αν το decodedToken υπάρχει (είναι συνδεδεμένος ο χρήστης) και αν είναι εμφανίζουμε το μύνημα `Welcome ${decodedToken.email}` */}
        {token ? ( // Εδώ στην ουσία τσεκάρουμε αν το token υπάρχει (που σημαίνει ότι είμαστε συνδεδεμένοι) και αν ναί εμφανίζουμε τις παρακάτω επιλογές 
          <>
          {/* Για να λειτουργήσουν οι διευθύνσεις πρέπει να τις προσθέσω στο App.jsx
          όπως για παράδειγμα: <<Route path="/" element={<Home />} />> */}
            <li>
              <Link to="/">All movies</Link>
            </li>
            <li>
              <Link to="/usermovies">My Movies</Link>
            </li>
            <li>
              <Link to="/newmovie">New Movie</Link>
            </li>
            <li>
              <Link to="/login" onClick={handleLogout}> 
                Logout
              </Link>
            </li>
          </>
        ) : (
          <> {/* Τα παρακάτω εμφανίζονται αν ο χρήστης δεν είναι loged in*/}
            {" "}
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
