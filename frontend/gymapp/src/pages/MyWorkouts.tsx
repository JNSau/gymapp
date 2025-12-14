import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserPlans, deletePlan } from "../api/plans";
import "../index.css";

const MyWorkouts = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchMyPlans();
  }, []);

  const fetchMyPlans = () => {
    getUserPlans()
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault(); // Zapobiega wejściu w plan
    e.stopPropagation(); // Zatrzymuje propagację kliknięcia

    try {
        await deletePlan(id);
        setNotification("Plan deleted successfully");
        setTimeout(() => setNotification(null), 3000);
        fetchMyPlans(); 
    } catch (error) {
        setNotification("Error: Failed to delete plan");
        setTimeout(() => setNotification(null), 3000);
    }
  }

  if (loading) return <div className="container" style={{marginTop: "50px"}}>Loading your plans...</div>;

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className="toast-notification">
            <div className="toast-icon">
                {notification.includes("Error") ? "⚠️" : "🗑️"}
            </div>
            <div className="toast-message">{notification}</div>
        </div>
      )}

      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>My Workouts 💪</h1>
      <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "40px" }}>
        Your personal collection. Click to start or edit.
      </p>

      {plans.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <h2>No plans yet</h2>
            <p>Go to the catalog to find a workout plan.</p>
            <Link to="/plans" className="btn-primary" style={{ display: "inline-block", marginTop: "15px" }}>
                Browse Catalog 🌍
            </Link>
        </div>
      ) : (
        <div className="grid">
            {plans.map((plan) => (
                <Link key={plan.id} to={`/plans/${plan.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="card hover-effect" style={{ 
                        borderLeft: "4px solid var(--accent)", 
                        display: "flex", 
                        flexDirection: "column",
                        height: "100%",
                        minHeight: "200px" // Żeby karty były równe
                    }}>
                        
                        {/* GÓRA KARTY */}
                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: "10px" }}>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", border: "1px solid #333", padding: "4px 8px", borderRadius: "4px" }}>
                                    My Plan
                                </span>
                            </div>
                            
                            <h2 style={{ margin: "15px 0 10px 0", fontSize: "1.5rem" }}>{plan.name}</h2>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                                {plan.description.substring(0, 80)}
                                {plan.description.length > 80 && "..."}
                            </p>
                        </div>
                        
                        {/* DÓŁ KARTY (FOOTER) */}
                        <div style={{ 
                            marginTop: "20px", 
                            paddingTop: "15px", 
                            borderTop: "1px solid #333", 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center" 
                        }}>
                            
                            {/* START (LEWA STRONA) */}
                            <span style={{ 
                                color: "var(--accent)", 
                                fontWeight: "bold", 
                                letterSpacing: "0.5px",
                                fontSize: "0.95rem"
                            }}>
                                START TRAINING
                            </span>

                            {/* DELETE (PRAWA STRONA) - TEKSTOWY PRZYCISK */}
                            <button 
                                onClick={(e) => handleDelete(plan.id, e)}
                                style={{ 
                                    background: "transparent", 
                                    border: "none", 
                                    color: "#666", 
                                    fontSize: "0.85rem",
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                    padding: "5px 10px",
                                    transition: "color 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = "var(--danger)"}
                                onMouseOut={(e) => e.currentTarget.style.color = "#666"}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyWorkouts;