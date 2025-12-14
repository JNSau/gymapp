import { useEffect, useState } from "react";
import { getPublicPlans, copyPlanToMyWorkouts } from "../api/plans";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Plans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPublicPlans()
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddToMyPlans = async (id: number) => {
    try {
        await copyPlanToMyWorkouts(id);
        
        setNotification("Success! Plan added to My Workouts 📥");
        
        setTimeout(() => {
            navigate("/my-workouts");
        }, 1500);

    } catch (error) {
        console.error("Failed to copy plan", error);
        setNotification("Error: Could not add plan.");
        setTimeout(() => setNotification(null), 3000);
    }
  };

  if (loading) return <div className="container" style={{marginTop: "50px"}}>Loading catalog...</div>;

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className="toast-notification">
            <div className="toast-icon">
                {notification.includes("Error") ? "❌" : "✅"}
            </div>
            <div className="toast-message">{notification}</div>
        </div>
      )}

      <div style={{ margin: "40px 0", textAlign: "center" }}>
        <h1>Workout Catalog</h1>
        <p style={{ color: "var(--text-secondary)" }}>
            Browse professional plans and add them to your library to start training.
        </p>
      </div>

      <div className="grid">
        {plans.map((plan) => (
            <div key={plan.id} className="card hover-effect" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                 <span className="badge" style={{ 
                    background: plan.level === "BEGINNER" ? "var(--success)" : "orange",
                    color: "black"
                 }}>
                    {plan.level}
                 </span>
                 <span style={{ color: "#888", fontSize: "0.8rem" }}>System Plan</span>
              </div>

              <h2 style={{ margin: "0 0 10px 0" }}>{plan.name}</h2>
              <p style={{ color: "var(--text-secondary)", flex: 1 }}>
                {plan.description.substring(0, 80)}...
              </p>

              <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexDirection: "column" }}>
                <button 
                    className="btn-primary" 
                    onClick={() => handleAddToMyPlans(plan.id)}
                    style={{ width: "100%" }}
                >
                    Add to My Workouts
                </button>

                <button 
                    onClick={() => navigate(`/plans/${plan.id}`)}
                    style={{ 
                        background: "transparent", border: "1px solid #444", color: "white", 
                        padding: "10px", borderRadius: "8px", cursor: "pointer" 
                    }}
                >
                    View Details
                </button>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;