import { useEffect, useState } from "react";
import { getExercises } from "../api/exercises";
import ExerciseCard from "../components/ExerciseCard";
import "../index.css";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    getExercises().then((data: any) => setExercises(data));
  }, []);

  return (
    <div className="container">
      <div style={{ margin: "40px 0", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
        <h1>Baza Ćwiczeń</h1>
        <p style={{ color: "var(--text-secondary)" }}>Przeglądaj dostępne ćwiczenia i techniki.</p>
      </div>

      <div className="grid-layout">
        {exercises.map((ex: any) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  );
};

export default Exercises;