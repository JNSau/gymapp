import { useState } from "react";
import { registerUser } from "../api/users";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser({ username, email, password, level });
      alert("Account created successfully! You can now log in.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data) {
        const messages = Object.values(err.response.data).flat().join(", ");
        setError(messages || "Registration failed.");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h1 style={{ marginBottom: "30px" }}>Join Us</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              required
              minLength={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
            />
          </div>

          <div className="form-group">
            <label>Fitness Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "15px" }}>
            Sign Up
          </button>
        </form>

        {error && (
          <div style={{ marginTop: "15px", padding: "10px", background: "rgba(255, 68, 68, 0.1)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: "8px", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <p style={{ marginTop: "20px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent)" }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;