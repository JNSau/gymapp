import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../index.css";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch {
      setError("Wrong login or password");
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h1 style={{ marginBottom: "30px" }}>Zaloguj się</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nazwa użytkownika</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Wpisz login..."
            />
          </div>

          <div className="form-group">
            <label>Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wpisz hasło..."
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
            Wejdź
          </button>
        </form>

        {error && <p style={{ color: "var(--danger)", marginTop: "15px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;