import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo - Zmienione na GYMERSIVE */}
        <Link to="/" className="navbar-logo">
          GYM<span className="text-accent">ERSIVE</span>
        </Link>

        {/* Menu */}
        <nav className="navbar-links">
          <Link to="/exercises">Exercises</Link>
          <Link to="/plans">Plans</Link>
          
          {user ? (
            <div className="user-section">
              {/* --- ZMIANA TUTAJ: Link do Profilu --- */}
              <Link 
                to="/profile" 
                className="username" 
                style={{ 
                  textDecoration: "none", 
                  cursor: "pointer", 
                  marginRight: "15px",
                  fontWeight: "bold"
                }}
              >
                {user.username}
              </Link>

              <button onClick={logout} className="btn-danger small">Logout</button>
            </div>
          ) : (
            /* Sekcja dla niezalogowanych */
            <div className="auth-links" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;