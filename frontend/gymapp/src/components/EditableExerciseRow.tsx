import { useState } from "react";
import { updateExerciseSettings } from "../api/plans";

interface Props {
  exercise: any;
  isEditing: boolean;
  allExercises?: any[]; // Lista ćwiczeń do wyboru
}

const EditableExerciseRow = ({ exercise, isEditing, allExercises = [] }: Props) => {
  // Stany parametrów
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);
  const [rest, setRest] = useState(exercise.rest_time);
  
  // Stan wybranego ćwiczenia (ID).
  // exercise.exercise to w Django ID ćwiczenia (np. 15)
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercise.exercise); 

  // Funkcja zapisu
  const handleSave = async (newExerciseId?: number) => {
    // Jeśli podaliśmy nowe ID (przy zmianie selecta) to użyj jego, w przeciwnym razie obecny stan
    const idToSave = newExerciseId || selectedExerciseId;

    try {
      await updateExerciseSettings(exercise.id, {
        exercise_id: Number(idToSave), // Wysyłamy ID nowego ćwiczenia
        sets: Number(sets),
        reps: reps,
        rest_time: rest,
      });
      console.log("Saved changes");
    } catch (error) {
      console.error("Failed to update", error);
    }
  };

  // Obsługa zmiany ćwiczenia (Select)
  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newId = Number(e.target.value);
      setSelectedExerciseId(newId);
      // Zapisujemy od razu po wyborze z listy, żeby użytkownik widział efekt
      handleSave(newId); 
  };

  // --- 1. TRYB PODGLĄDU (Zwykły tekst) ---
  if (!isEditing) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 25px", borderBottom: "1px solid #222" }}>
        <div style={{ fontWeight: "bold" }}>{exercise.exercise_name}</div>
        <div className="exercise-meta" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
           {sets} sets x {reps} <span style={{color: "#444", margin: "0 5px"}}>|</span> {rest}
        </div>
      </div>
    );
  }

  // --- 2. TRYB EDYCJI (Inputy + Select) ---
  return (
    <div style={{ padding: "15px 25px", borderBottom: "1px solid #222", background: "rgba(255, 255, 255, 0.05)" }}>
      
      {/* WYBÓR ĆWICZENIA */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{fontSize: "0.7rem", color: "#888", display: "block", marginBottom: "4px"}}>Exercise</label>
        <select
            value={selectedExerciseId}
            onChange={handleExerciseChange}
            style={{ 
                width: "100%", 
                padding: "10px", 
                background: "#111", 
                border: "1px solid var(--accent)", // Zielona ramka wyróżnia
                color: "white", 
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "1rem"
            }}
        >
            {allExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                    {ex.name}
                </option>
            ))}
        </select>
      </div>
      
      {/* PARAMETRY (Sets, Reps, Rest) */}
      <div style={{ display: "flex", gap: "15px" }}>
        <div style={{ flex: 1 }}>
            <label style={{fontSize: "0.7rem", color: "#888", display: "block", marginBottom: "4px"}}>Sets</label>
            <input 
                type="number" 
                value={sets} 
                onChange={(e) => setSets(e.target.value)} 
                onBlur={() => handleSave()}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #444", color: "white", borderRadius: "4px" }}
            />
        </div>
        
        <div style={{ flex: 1 }}>
            <label style={{fontSize: "0.7rem", color: "#888", display: "block", marginBottom: "4px"}}>Reps</label>
            <input 
                type="text" 
                value={reps} 
                onChange={(e) => setReps(e.target.value)} 
                onBlur={() => handleSave()}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #444", color: "white", borderRadius: "4px" }}
            />
        </div>

        <div style={{ flex: 1 }}>
            <label style={{fontSize: "0.7rem", color: "#888", display: "block", marginBottom: "4px"}}>Rest</label>
            <input 
                type="text" 
                value={rest} 
                onChange={(e) => setRest(e.target.value)} 
                onBlur={() => handleSave()}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #444", color: "white", borderRadius: "4px" }}
            />
        </div>
      </div>
    </div>
  );
};

export default EditableExerciseRow;