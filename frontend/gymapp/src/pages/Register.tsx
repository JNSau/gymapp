import { useState } from "react";
import { registerUser } from "../api/users";
import { Link } from "react-router-dom"; // Usunąłem useNavigate, bo teraz user klika sam przycisk
import "../index.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // <--- NOWY STAN

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser({ username, email, password, level });
      // Zamiast alertu i przekierowania, zmieniamy stan widoku
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data) {
        // Czasami Django zwraca błędy jako tablicę, czasami jako obiekt
        const data = err.response.data;
        let messages = "Registration failed.";
        
        if (typeof data === 'object') {
             // Łączymy wszystkie komunikaty błędów w jeden ciąg
             messages = Object.values(data).flat().join(", ");
        }
        
        setError(messages);
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  // --- WIDOK SUKCESU (Zamiast Alertu) ---
  if (success) {
    return (
      <div className="container">
        <div className="auth-container" style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🎉</div>
          <h2 style={{ marginBottom: "15px", color: "var(--success)" }}>Success!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "30px", fontSize: "1.1rem" }}>
            Your account has been created successfully. <br />
            Please log in to start your training.
          </p>
          
          <Link to="/login" className="btn-primary" style={{ display: "inline-block", width: "100%", textDecoration: "none" }}>
            Login Now 🚀
          </Link>
        </div>
      </div>
    );
  }

  // --- WIDOK FORMULARZA (Standardowy) ---
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
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "5px" }}>
                *You can change this later by taking the Quiz.
            </p>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "15px" }}>
            Sign Up
          </button>
        </form>

        {/* --- KOMUNIKAT BŁĘDU (Jeśli coś pójdzie nie tak) --- */}
        {error && (
          <div style={{ marginTop: "15px", padding: "10px", background: "rgba(255, 68, 68, 0.1)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: "8px", fontSize: "0.9rem", textAlign: "center" }}>
            ⚠️ {error}
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