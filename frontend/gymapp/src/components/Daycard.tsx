import { Link } from "react-router-dom";
import EditableExerciseRow from "./EditableExerciseRow"; 
import "../index.css";

interface Props {
  day: any;
  planId?: number; 
  isOwner?: boolean; 
  isEditing?: boolean;
  allExercises?: any[];
}

const DayCard = ({ day, planId, isOwner = false, isEditing = false, allExercises = [] }: Props) => {
  return (
    <div className="card" style={{ marginTop: "30px", padding: "0", overflow: "hidden" }}>
      <div style={{ padding: "15px 25px", borderBottom: "1px solid #333", background: "rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, color: "var(--accent)" }}>Day {day.day_number}</h3>
        {!isOwner && <span style={{fontSize: "0.8rem", color: "#666"}}>View Only</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {day.exercises.map((ex: any) => (
          <EditableExerciseRow 
            key={ex.id} 
            exercise={ex} 
            isEditing={isEditing} 
            allExercises={allExercises} 
          />
        ))}
      </div>

      {isOwner && planId && !isEditing && (
        <div style={{ padding: "15px 25px", background: "rgba(0,0,0,0.2)" }}>
           <Link to={`/workout/${planId}/${day.id}`} style={{ textDecoration: "none" }}>
               <button className="btn-primary" style={{ width: "100%", padding: "12px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", fontWeight: "bold", fontSize: "1rem" }}>
                   START WORKOUT <span>▶</span>
               </button>
           </Link>
        </div>
      )}
    </div>
  );
};

export default DayCard;