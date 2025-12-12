import { Link } from "react-router-dom"; // <--- 1. Importujemy Link
import "../index.css";

type Props = {
  day: {
    id: number;
    plan: number; // <--- 2. To ID jest potrzebne do linku (backend musi je zwracać)
    day_number: number;
    exercises: {
      id: number;
      exercise_name: string;
      sets: number;
      reps: string;
      rest_time: string;
    }[];
  };
};

const DayCard = ({ day }: Props) => {
  return (
    <div className="card" style={{ marginTop: "30px", padding: "0" }}>
      {/* Nagłówek Dnia */}
      <div style={{ padding: "15px 25px", borderBottom: "1px solid #333", background: "rgba(255,255,255,0.03)" }}>
        <h3 style={{ margin: 0, color: "var(--accent)" }}>Day {day.day_number}</h3>
      </div>

      {/* Lista ćwiczeń */}
      <ul className="exercise-list">
        {day.exercises.map((ex) => (
          <li key={ex.id} className="exercise-item">
            <div style={{ paddingLeft: "25px" }}>
              <span className="exercise-name">{ex.exercise_name}</span>
            </div>
            <div className="exercise-meta" style={{ paddingRight: "25px" }}>
              {ex.sets} sets x {ex.reps} <span style={{color: "#555"}}>|</span> Rest: {ex.rest_time}
            </div>
          </li>
        ))}
      </ul>

      {/* --- 3. PRZYCISK START WORKOUT --- */}
      <div style={{ padding: "15px 25px", borderTop: "1px solid #333" }}>
        {/* Link przenosi do ekranu aktywnego treningu */}
        <Link to={`/workout/${day.plan}/${day.id}`}>
            <button 
                className="btn-primary" 
                style={{ 
                    width: "100%", 
                    padding: "10px", 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    gap: "10px",
                    fontWeight: "bold"
                }}
            >
                START WORKOUT <span>▶</span>
            </button>
        </Link>
      </div>

    </div>
  );
};

export default DayCard;