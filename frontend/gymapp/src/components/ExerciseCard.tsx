import "../index.css";

type Props = {
  exercise: {
    id: number;
    name: string;
    muscle_group: string;
    difficulty: string;
    image?: string;
  };
};

const ExerciseCard = ({ exercise }: Props) => {
  return (
    <div className="card">
      {/* Sekcja obrazka - jeśli brak, pokazujemy gradient */}
      <div 
        style={{ 
          height: "150px", 
          overflow: "hidden", 
          background: exercise.image ? "transparent" : "linear-gradient(135deg, #333, #111)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {exercise.image ? (
          <img
            src={exercise.image}
            alt={exercise.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{color: "#555", fontSize: "2rem"}}>🏋️</span>
        )}
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <span className="badge badge-muscle">{exercise.muscle_group}</span>
          <span className="badge badge-diff">{exercise.difficulty}</span>
        </div>
        
        <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>{exercise.name}</h3>
      </div>
    </div>
  );
};

export default ExerciseCard;