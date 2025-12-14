import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanDetails, copyPlanToMyWorkouts, updatePlan } from "../api/plans"; 
import { getExercises } from "../api/exercises"; 
import DayCard from "../components/Daycard"; 
import Feedback from "./Feedback";
import "../index.css";

const PlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState<any>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [allExercises, setAllExercises] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    loadPlan();
  }, [id]);

  useEffect(() => {
    if (isEditing && allExercises.length === 0) {
        getExercises().then((data: any) => setAllExercises(data));
    }
  }, [isEditing]);

  const loadPlan = () => {
    getPlanDetails(Number(id)).then((data) => {
        setPlan(data);
        setEditedName(data.name);
        setEditedDesc(data.description);
    });
  }

  const isSystemPlan = plan?.user === null;
  const isOwner = !isSystemPlan; 

  const handleSaveChanges = async () => {
    setLoadingAction(true);
    try {
        await updatePlan(plan.id, { name: editedName, description: editedDesc });
        setNotification("Plan updated successfully!");
        setIsEditing(false);
        loadPlan();
        setTimeout(() => setNotification(null), 3000);
    } catch (error) {
        setNotification("Error: Failed to update plan");
    } finally {
        setLoadingAction(false);
    }
  };

  const handleAddToMyPlans = async () => {
    setLoadingAction(true);
    try {
        await copyPlanToMyWorkouts(plan.id);
        setNotification("Plan copied successfully!");
        setTimeout(() => navigate("/my-workouts"), 1500);
    } catch (error) {
        setNotification("Failed to add plan.");
        setTimeout(() => setNotification(null), 3000);
    } finally {
        setLoadingAction(false);
    }
  };

  if (!plan) return <div className="container" style={{paddingTop: "50px"}}>Loading...</div>;

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      {notification && (
        <div className="toast-notification">
            <div className="toast-icon">{notification.includes("Error") ? "⚠️" : "✅"}</div>
            <div className="toast-message">{notification}</div>
        </div>
      )}

      <div style={{ background: "var(--bg-secondary)", padding: "40px", borderRadius: "12px", marginTop: "20px", border: isOwner ? "1px solid var(--accent)" : "1px solid #333" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: 1 }}>
                <span className="badge badge-level" style={{ marginBottom: "15px", background: isOwner ? "var(--accent)" : "#444", color: isOwner ? "black" : "white" }}>
                    {isOwner ? "YOUR PLAN" : plan.level}
                </span>

                {isEditing ? (
                    <div style={{ marginTop: "15px", animation: "fadeIn 0.3s" }}>
                        <label style={{fontSize: "0.8rem", color: "#888", display:"block", marginBottom:"5px"}}>Plan Name</label>
                        <input 
                            value={editedName} 
                            onChange={(e) => setEditedName(e.target.value)}
                            style={{ fontSize: "1.8rem", fontWeight: "bold", padding: "10px", marginBottom: "15px", width: "100%", background: "#111", border: "1px solid var(--accent)", color: "white", borderRadius: "8px" }}
                        />
                        <label style={{fontSize: "0.8rem", color: "#888", display:"block", marginBottom:"5px"}}>Description</label>
                         <textarea 
                            value={editedDesc}
                            onChange={(e) => setEditedDesc(e.target.value)}
                            style={{ width: "100%", background: "#111", border: "1px solid #444", color: "white", padding: "10px", borderRadius: "8px", minHeight: "80px" }}
                        />
                    </div>
                ) : (
                    <>
                        <h1 style={{ marginTop: "10px" }}>{plan.name}</h1>
                        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "800px" }}>{plan.description}</p>
                    </>
                )}
            </div>

            <div style={{ minWidth: "200px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {isSystemPlan ? (
                    <button className="btn-primary" onClick={handleAddToMyPlans} disabled={loadingAction}>
                        {loadingAction ? "Adding..." : "📥 Add to My Workouts"}
                    </button>
                ) : (
                    <>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} style={{ background: "#333", border: "1px solid #555", color: "white", padding: "12px", borderRadius: "8px", cursor: "pointer", display: "flex", justifyContent: "center", gap: "10px", fontWeight: "bold" }}>
                                ✏️ Edit Plan
                            </button>
                        ) : (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button className="btn-primary" onClick={handleSaveChanges} style={{ flex: 1 }}>Save</button>
                                <button onClick={() => { setIsEditing(false); setEditedName(plan.name); setEditedDesc(plan.description); }} style={{ flex: 1, background: "transparent", border: "1px solid #555", color: "#aaa", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                            </div>
                        )}
                        {!isEditing && <div style={{ textAlign: "center", padding: "10px", fontSize: "0.8rem", color: "#666" }}>You can customize exercises.</div>}
                    </>
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
            isEditing={isEditing}
            allExercises={allExercises} 
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