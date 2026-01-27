import { Link } from "react-router-dom"; // <--- 1. Importujemy Link
import "../index.css";

type Props = {
  exercise: {
    id: number;
    name: string;
    muscle_group: string;
    difficulty: string;
    image_url?: string; 
    image?: string; 
  };
};

const ExerciseCard = ({ exercise }: Props) => {
  
  const imgSrc = exercise.image_url || exercise.image;

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Sekcja obrazka */}
      <div 
        style={{ 
          height: "180px", 
          overflow: "hidden", 
          background: imgSrc ? "transparent" : "linear-gradient(135deg, #333, #111)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #333"
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={exercise.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{color: "#555", fontSize: "3rem"}}>🏋️</span>
        )}
      </div>

      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <span className="badge badge-muscle">{exercise.muscle_group}</span>
          <span className="badge badge-diff">{exercise.difficulty}</span>
        </div>
        
        <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem", flex: 1 }}>
          {exercise.name}
        </h3>

        {/* 3. Przycisk na samym dole */}
        <div style={{ marginTop: "15px" }}>
          <Link to={`/exercises/${exercise.id}`}>
            <button className="btn-primary" style={{ width: "100%" }}>
              See Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;