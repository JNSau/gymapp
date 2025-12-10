import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "../index.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const [joinDate, setJoinDate] = useState("");

  // Pobieramy świeże dane o użytkowniku (w tym datę dołączenia)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("users/me/");
        setJoinDate(response.data.date_joined);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, []);

  if (!user) return <div className="container" style={{paddingTop: "50px"}}>Loading profile...</div>;

  return (
    <div className="container">
      <div style={{ maxWidth: "800px", margin: "40px auto" }}>
        
        {/* --- GŁÓWNA KARTA PROFILOWA --- */}
        <div className="card" style={{ padding: "40px", textAlign: "center", marginBottom: "30px" }}>
          
          {/* Avatar z inicjałem */}
          <div style={{ 
            width: "120px", height: "120px", 
            background: "linear-gradient(135deg, var(--accent), #aebb00)", 
            borderRadius: "50%", 
            margin: "0 auto 20px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "3.5rem", color: "black", fontWeight: "800",
            boxShadow: "0 0 20px rgba(212, 255, 0, 0.3)"
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>

          <h1 style={{ margin: "10px 0", fontSize: "2.5rem" }}>{user.username}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>{user.email}</p>
          
          <div style={{ marginTop: "15px" }}>
            <span className="badge badge-level" style={{ fontSize: "1rem", padding: "8px 16px" }}>
              {user.level || "BEGINNER"}
            </span>
          </div>
        </div>

        {/* --- STATYSTYKI (GRID) --- */}
        <h2 style={{ marginBottom: "20px" }}>Your Statistics</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "20px",
          marginBottom: "40px"
        }}>
          
          {/* Stat 1: Data dołączenia */}
          <div className="card" style={{ padding: "20px", textAlign: "center" }}>
            <span style={{ fontSize: "2rem" }}>📅</span>
            <h3 style={{ margin: "10px 0 5px" }}>Member Since</h3>
            <p style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "1.2rem", margin: 0 }}>
              {joinDate || "Loading..."}
            </p>
          </div>

          {/* Stat 2: Ukończone treningi (MOCK - na razie statyczne) */}
          <div className="card" style={{ padding: "20px", textAlign: "center" }}>
            <span style={{ fontSize: "2rem" }}>🔥</span>
            <h3 style={{ margin: "10px 0 5px" }}>Workouts Done</h3>
            <p style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "1.2rem", margin: 0 }}>
              0
            </p>
            <small style={{ color: "#555" }}>(Coming soon)</small>
          </div>

          {/* Stat 3: Aktualny cel */}
          <div className="card" style={{ padding: "20px", textAlign: "center" }}>
            <span style={{ fontSize: "2rem" }}>🎯</span>
            <h3 style={{ margin: "10px 0 5px" }}>Current Goal</h3>
            <p style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "1.2rem", margin: 0 }}>
              Build Muscle
            </p>
          </div>
        </div>

        {/* Przycisk Wylogowania */}
        <button 
          onClick={logout} 
          className="btn-danger" 
          style={{ width: "100%", padding: "15px", fontSize: "1.1rem" }}
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Profile;