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
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercise.exercise); 

  // --- 1. FUNKCJE ZABEZPIECZAJĄCE (BLOKADY) ---

  // Blokada klawiszy dla pól stricte liczbowych (np. Sets)
  const blockInvalidChar = (e: React.KeyboardEvent) => {
    if (['-', '+', 'e', 'E'].includes(e.key)) {
        e.preventDefault();
    }
  };

  // Blokada wklejania minusów
  const blockPaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData('text');
    if (pasteData.includes('-') || pasteData.includes('+')) {
        e.preventDefault();
    }
  };

  // Funkcja czyszcząca inputy tekstowe (Reps/Rest)
  // Pozwala na "8-12" (zakres), ale blokuje "-5" (ujemne)
  const sanitizeTextParams = (value: string) => {
      // Jeśli wartość zaczyna się od minusa, usuń go
      if (value.startsWith('-')) {
          return value.replace('-', '');
      }
      return value;
  };

  // --- KONIEC FUNKCJI ZABEZPIECZAJĄCYCH ---

  // Funkcja zapisu
  const handleSave = async (newExerciseId?: number) => {
    const idToSave = newExerciseId || selectedExerciseId;

    try {
      await updateExerciseSettings(exercise.id, {
        exercise_id: Number(idToSave),
        sets: Number(sets), // Tu zawsze liczba
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
                border: "1px solid var(--accent)", 
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
        
        {/* SETS - TYP NUMBER (Pełna blokada minusów) */}
        <div style={{ flex: 1 }}>
            <label style={{fontSize: "0.7rem", color: "#888", display: "block", marginBottom: "4px"}}>Sets</label>
            <input 
                type="number" 
                min="0"
                value={sets} 
                onKeyDown={blockInvalidChar} // Blokuje klawisz
                onPaste={blockPaste} // Blokuje wklejanie
                onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0) setSets(e.target.value);
                }} 
                onBlur={() => handleSave()}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #444", color: "white", borderRadius: "4px" }}
            />
        </div>
        
        {/* REPS - TYP TEXT (Dozwolone zakresy "8-12", ale blokada ujemnych "-8") */}
        <div style={{ flex: 1 }}>
            <label style={{fontSize: "0.7rem", color: "#888", display: "block", marginBottom: "4px"}}>Reps</label>
            <input 
                type="text" 
                value={reps} 
                // Nie dajemy onKeyDown={blockInvalidChar}, bo zablokowałoby myślnik w "8-12"
                onChange={(e) => setReps(sanitizeTextParams(e.target.value))} 
                onBlur={() => handleSave()}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #444", color: "white", borderRadius: "4px" }}
            />
        </div>

        {/* REST - TYP TEXT (Dozwolone "60s", blokada ujemnych) */}
        <div style={{ flex: 1 }}>
            <label style={{fontSize: "0.7rem", color: "#888", display: "block", marginBottom: "4px"}}>Rest</label>
            <input 
                type="text" 
                value={rest} 
                onChange={(e) => setRest(sanitizeTextParams(e.target.value))} 
                onBlur={() => handleSave()}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #444", color: "white", borderRadius: "4px" }}
            />
        </div>
      </div>
    </div>
  );
};

export default EditableExerciseRow;