import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanDetails, copyPlanToMyWorkouts } from "../api/plans";
import DayCard from "../components/Daycard"; 
import Feedback from "./Feedback";
import "../index.css";

const PlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState<any>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const planId = Number(id);
    getPlanDetails(planId).then((data) => setPlan(data));
  }, [id]);

  const isSystemPlan = plan?.user === null;
  const isOwner = !isSystemPlan; 

  const handleAddToMyPlans = async () => {
    setLoadingAction(true);
    try {
        await copyPlanToMyWorkouts(plan.id);
        
        setNotification("Plan copied successfully!");
        
        setTimeout(() => {
             navigate("/my-workouts");
        }, 1500);

    } catch (error) {
        console.error(error);
        setNotification("Failed to add plan.");
        setLoadingAction(false);
        setTimeout(() => setNotification(null), 3000);
    }
  };

  if (!plan) return <div className="container" style={{paddingTop: "50px"}}>Loading...</div>;

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className="toast-notification">
            <div className="toast-icon">
                {notification.includes("Failed") ? "❌" : "🎉"}
            </div>
            <div className="toast-message">{notification}</div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ background: "var(--bg-secondary)", padding: "40px", borderRadius: "12px", marginTop: "20px", border: isOwner ? "1px solid var(--accent)" : "1px solid #333" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
            <div>
                <span className="badge badge-level" style={{ marginBottom: "15px", background: isOwner ? "var(--accent)" : "#444", color: isOwner ? "black" : "white" }}>
                    {isOwner ? "YOUR PLAN" : plan.level}
                </span>
                <h1 style={{ marginTop: "10px" }}>{plan.name}</h1>
                <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "800px" }}>
                    {plan.description}
                </p>
            </div>

            <div style={{ minWidth: "200px" }}>
                {isSystemPlan ? (
                    <button 
                        className="btn-primary" 
                        onClick={handleAddToMyPlans}
                        disabled={loadingAction}
                        style={{ width: "100%", padding: "15px", fontSize: "1rem" }}
                    >
                        {loadingAction ? "Adding..." : " Add to My Workouts"}
                    </button>
                ) : (
                    <div style={{ textAlign: "center", padding: "15px", background: "rgba(212, 255, 0, 0.1)", borderRadius: "10px", border: "1px solid var(--accent)" }}>
                        <h3 style={{ margin: "0 0 10px 0", color: "var(--accent)" }}>Ready to Train? 🚀</h3>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#ddd" }}>
                            Select a day below to start tracking.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div style={{ margin: "40px 0" }}>
        <h2 style={{ marginBottom: "20px" }}>Schedule</h2>
        {plan.days.map((day: any) => (
          <DayCard 
            key={day.id} 
            day={day} 
            planId={plan.id} 
            isOwner={isOwner} 
          />
        ))}
      </div>

      <div style={{ borderTop: "1px solid #333", paddingTop: "40px", paddingBottom: "60px" }}>
        <Feedback planId={plan.id} />
      </div>
    </div>
  );
};

export default PlanDetails;