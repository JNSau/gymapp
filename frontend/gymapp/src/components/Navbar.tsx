import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "15px", background: "#222", color: "white" }}>
      <ul style={{ display: "flex", gap: "20px", listStyle: "none" }}>
        <li><Link to="/" style={{ color: "white" }}>Home</Link></li>
        <li><Link to="/exercises" style={{ color: "white" }}>Exercises</Link></li>
        <li><Link to="/plans" style={{ color: "white" }}>Plans</Link></li>

        {user ? (
          <>
            <li>Hello, {user.username}</li>
            <li>
              <button onClick={logout} style={{ background: "red", color: "white", border: "none", padding: "5px 10px" }}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" style={{ color: "white" }}>Login</Link></li>
            <li><Link to="/register" style={{ color: "white" }}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
