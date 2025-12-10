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

  const imgSrc = exercise.image_url || exercise.image;

  return (
    <div className="container">
      <div style={{ margin: "20px 0" }}>
        <Link to="/exercises" style={{ color: "var(--accent)", textDecoration: "underline" }}>
          &larr; Back to list
        </Link>
      </div>

      <div className="card" style={{ padding: "40px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* Left Column: Image */}
        <div style={{ flex: "1 1 300px", minWidth: "300px" }}>
          <div style={{ 
            height: "400px",
            background: imgSrc ? "transparent" : "linear-gradient(135deg, #333, #111)",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #444"
          }}>
             {imgSrc ? (
               <img src={imgSrc} alt={exercise.name} style={{width: "100%", height: "100%", objectFit: "cover"}} />
             ) : (
               <span style={{fontSize: "5rem", color: "#555"}}>🏋️</span>
             )}
          </div>
        </div>

        {/* Right Column: Content */}
        <div style={{ flex: "2 1 400px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
             <span className="badge badge-muscle">{exercise.muscle_group}</span>
             <span className="badge badge-diff">{exercise.difficulty}</span>
          </div>
          
          <h1 style={{ fontSize: "3rem", marginBottom: "25px", lineHeight: "1.1" }}>{exercise.name}</h1>
          
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px" }}>
            <h3 style={{ color: "var(--accent)", marginTop: 0 }}>Instructions / Description:</h3>
            <p style={{ lineHeight: "1.8", color: "#ddd", whiteSpace: "pre-line", fontSize: "1.1rem" }}>
              {exercise.description ? exercise.description : "No description available for this exercise."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetails;