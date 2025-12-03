import { useState } from "react";
import { registerUser } from "../api/users";
import "../index.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("BEGINNER");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({ username, password, level });
      alert("Konto utworzone! Możesz się zalogować.");
    } catch (error) {
      console.error(error);
      alert("Błąd rejestracji");
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h1 style={{ marginBottom: "30px" }}>Dołącz do nas</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nazwa użytkownika</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Poziom zaawansowania</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="BEGINNER">Początkujący</option>
              <option value="INTERMEDIATE">Średniozaawansowany</option>
              <option value="ADVANCED">Ekspert</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
            Zarejestruj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;