import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  // Style dla przycisku Logout (Ghost Button)
  const logoutButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #444",
    color: "var(--text-secondary)", // Szary kolor tekstu
    padding: "8px 16px",
    borderRadius: "20px", // Pigułka
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          GYM<span className="text-accent">ERSIVE</span>
        </Link>

        {/* Menu */}
        <nav className="navbar-links">
          <Link to="/exercises">Exercises</Link>
          <Link to="/plans">Plans</Link>
          
          {/* NOWOŚĆ: Link My Workouts widoczny tylko dla zalogowanych */}
          {user && (
             <Link to="/my-workouts" style={{ color: "var(--accent)" }}>My Workouts</Link>
          )}

          {user ? (
            <div className="user-section" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              
              {/* --- LINK DO PROFILU --- */}
              <Link 
                to="/profile" 
                className="hover-effect"
                style={{ 
                  textDecoration: "none", 
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#222",
                  padding: "6px 12px",
                  borderRadius: "30px",
                  border: "1px solid #333"
                }}
              >
                {/* Ikona awatara */}
                <div style={{ 
                    width: "24px", height: "24px", 
                    background: "var(--accent)", borderRadius: "50%", 
                    display: "flex", justifyContent: "center", alignItems: "center",
                    color: "black", fontSize: "0.8rem", fontWeight: "bold"
                }}>
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{user.username}</span>
              </Link>

              {/* --- PRZYCISK LOGOUT --- */}
              <button 
                onClick={logout} 
                style={logoutButtonStyle}
                onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#ff4d4d"; // Czerwony przy hoverze
                    e.currentTarget.style.color = "#ff4d4d";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#444"; // Powrót do szarego
                    e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>

            </div>
          ) : (
            /* Sekcja dla niezalogowanych */
            <div className="auth-links" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <Link to="/login" className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.9rem" }}>
                Login
              </Link>
              <Link to="/register" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;