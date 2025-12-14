import { Link } from "react-router-dom";
import "../index.css";

// Definiujemy typy Props
interface Props {
  day: {
    id: number;
    day_number: number;
    exercises: {
      id: number;
      exercise_name: string;
      sets: number;
      reps: string;
      rest_time: string;
    }[];
  };
  // Te pola są przekazywane z PlanDetails
  planId?: number; 
  isOwner?: boolean; 
}

const DayCard = ({ day, planId, isOwner = false }: Props) => {
  return (
    <div className="card" style={{ marginTop: "30px", padding: "0", overflow: "hidden" }}>
      
      {/* --- NAGŁÓWEK DNIA --- */}
      <div style={{ 
          padding: "15px 25px", 
          borderBottom: "1px solid #333", 
          background: "rgba(255,255,255,0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
      }}>
        <h3 style={{ margin: 0, color: "var(--accent)" }}>Day {day.day_number}</h3>
        {!isOwner && <span style={{fontSize: "0.8rem", color: "#666"}}>View Only</span>}
      </div>

      {/* --- LISTA ĆWICZEŃ --- */}
      <ul className="exercise-list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {day.exercises.map((ex) => (
          <li key={ex.id} className="exercise-item" style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              padding: "15px 25px", 
              borderBottom: "1px solid #222" 
          }}>
            <div style={{ fontWeight: "bold" }}>
              {ex.exercise_name}
            </div>
            <div className="exercise-meta" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              {ex.sets} sets x {ex.reps} <span style={{color: "#444", margin: "0 5px"}}>|</span> {ex.rest_time}
            </div>
          </li>
        ))}
      </ul>

      {/* --- PRZYCISK START (TYLKO DLA WŁAŚCICIELA) --- */}
      {isOwner && planId && (
        <div style={{ padding: "15px 25px", background: "rgba(0,0,0,0.2)" }}>
           {/* Używamy planId przekazanego z Props, a nie z day.plan */}
           <Link to={`/workout/${planId}/${day.id}`} style={{ textDecoration: "none" }}>
               <button 
                   className="btn-primary" 
                   style={{ 
                       width: "100%", 
                       padding: "12px", 
                       display: "flex", 
                       justifyContent: "center", 
                       alignItems: "center", 
                       gap: "10px",
                       fontWeight: "bold",
                       fontSize: "1rem"
                   }}
               >
                   START WORKOUT <span>▶</span>
               </button>
           </Link>
        </div>
      )}

    </div>
  );
};

export default DayCard;