import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getExerciseDetails } from "../api/exercises";
import "../index.css";

const ExerciseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getExerciseDetails(Number(id))
        .then((data) => setExercise(data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!exercise) return <div className="container" style={{paddingTop: "50px"}}>Loading...</div>;

  return (
    <div className="container">
      {/* Przycisk powrotu */}
      <div style={{ margin: "20px 0" }}>
        <Link to="/exercises" style={{ color: "var(--accent)", textDecoration: "underline" }}>
          &larr; Back to exercise database
        </Link>
      </div>

      <div className="card" style={{ padding: "40px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* Lewa kolumna: Zdjęcie (lub placeholder) */}
        <div style={{ flex: "1 1 300px", minWidth: "300px" }}>
          <div style={{ 
            height: "300px", 
            background: exercise.image_url ? "transparent" : "linear-gradient(135deg, #333, #111)",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #444"
          }}>
             {exercise.image_url ? (
               <img src={exercise.image_url} alt={exercise.name} style={{width: "100%", height: "100%", objectFit: "cover"}} />
             ) : (
               <span style={{fontSize: "4rem"}}>🏋️</span>
             )}
          </div>
        </div>

        {/* Prawa kolumna: Treść */}
        <div style={{ flex: "2 1 400px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
             <span className="badge badge-muscle">{exercise.muscle_group}</span>
             <span className="badge badge-diff">{exercise.difficulty}</span>
          </div>
          
          <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>{exercise.name}</h1>
          
          <h3 style={{ color: "var(--accent)" }}>Technique description:</h3>
          <p style={{ lineHeight: "1.8", color: "var(--text-secondary)", whiteSpace: "pre-line" }}>
            {exercise.description || "Brak opisu dla tego ćwiczenia."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetails;