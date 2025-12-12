import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { getWorkoutHistory } from "../api/history";
import "../index.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const [joinDate, setJoinDate] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("users/me/");
        setJoinDate(userRes.data.date_joined);

        const historyRes = await getWorkoutHistory();
        setHistory(historyRes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  if (!user) return <div className="container" style={{paddingTop: "50px"}}>Loading profile...</div>;

  return (
    <div className="container">
      <div style={{ maxWidth: "800px", margin: "40px auto" }}>
        
        {/* --- GŁÓWNA KARTA PROFILOWA --- */}
        <div className="card" style={{ padding: "40px", textAlign: "center", marginBottom: "30px" }}>
          
          {/* Avatar */}
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

        {/* --- STATYSTYKI --- */}
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

          {/* Stat 2: Ukończone treningi */}
          <div className="card" style={{ padding: "20px", textAlign: "center" }}>
            <span style={{ fontSize: "2rem" }}>🔥</span>
            <h3 style={{ margin: "10px 0 5px" }}>Workouts Done</h3>
            <p style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "1.2rem", margin: 0 }}>
              {history.length}
            </p>
          </div>

          {/* Stat 3: Cel */}
          <div className="card" style={{ padding: "20px", textAlign: "center" }}>
            <span style={{ fontSize: "2rem" }}>🎯</span>
            <h3 style={{ margin: "10px 0 5px" }}>Current Goal</h3>
            <p style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "1.2rem", margin: 0 }}>
              Build Muscle
            </p>
          </div>
        </div>

        {/* --- HISTORIA TRENINGÓW --- */}
        <h2 style={{ marginBottom: "20px", borderTop: "1px solid #333", paddingTop: "40px" }}>Recent Activity</h2>
        
        {history.length === 0 ? (
            <div className="card" style={{ padding: "30px", textAlign: "center", color: "#777" }}>
                <p style={{ fontSize: "1.2rem" }}>No workouts recorded yet.</p>
                <p>Go to <strong>Plans</strong> and start your first training! 🏋️‍♂️</p>
            </div>
        ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {history.map((session: any) => (
                    <div key={session.id} className="card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            {/* --- ZMIANA TUTAJ: Wyświetlamy custom_name --- */}
                            <h4 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "var(--accent)" }}>
                                {session.custom_name || session.plan_name || "Workout"}
                            </h4>
                            <span style={{ fontSize: "0.9rem", color: "#888" }}>
                                {new Date(session.start_time).toLocaleDateString()} • {session.duration_minutes} min
                            </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem", display: "block" }}>
                                {session.logs.length}
                            </span>
                            <span style={{ fontSize: "0.8rem", color: "#666" }}>Sets completed</span>
                        </div>
                    </div>
                ))}
            </div>
        )}

        <button 
          onClick={logout} 
          className="btn-danger" 
          style={{ width: "100%", padding: "15px", fontSize: "1.1rem", marginTop: "40px" }}
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Profile;