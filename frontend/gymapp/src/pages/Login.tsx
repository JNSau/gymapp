import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Dodano brakujące importy
import "../index.css";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Opcjonalnie do przekierowania po zalogowaniu

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/"); // Przekierowanie na stronę główną po zalogowaniu
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h1 style={{ marginBottom: "30px" }}>Welcome Back</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
            Sign In
          </button>
        </form>

        {error && <p style={{ color: "var(--danger)", marginTop: "15px" }}>{error}</p>}
        
        <p style={{ marginTop: "20px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--accent)" }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;