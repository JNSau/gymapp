import "../index.css";

type Props = {
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
};

const DayCard = ({ day }: Props) => {
  return (
    <div className="card" style={{ marginTop: "30px", padding: "0" }}>
      <div style={{ padding: "15px 25px", borderBottom: "1px solid #333", background: "rgba(255,255,255,0.03)" }}>
        <h3 style={{ margin: 0, color: "var(--accent)" }}>Dzień {day.day_number}</h3>
      </div>

      <ul className="exercise-list">
        {day.exercises.map((ex) => (
          <li key={ex.id} className="exercise-item">
            <div style={{ paddingLeft: "25px" }}>
              <span className="exercise-name">{ex.exercise_name}</span>
            </div>
            <div className="exercise-meta" style={{ paddingRight: "25px" }}>
              {ex.sets} serii x {ex.reps} <span style={{color: "#555"}}>|</span> Rest: {ex.rest_time}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DayCard;