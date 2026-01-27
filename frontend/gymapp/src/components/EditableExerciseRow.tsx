import { useState } from "react";
import { updateExerciseSettings } from "../api/plans";

interface Props {
  exercise: any;
  isEditing: boolean;
  allExercises?: any[]; 
}

const EditableExerciseRow = ({ exercise, isEditing, allExercises = [] }: Props) => {
  
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);
  const [rest, setRest] = useState(exercise.rest_time);
  
  
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercise.exercise); 

  
  const blockInvalidChar = (e: React.KeyboardEvent) => {
    if (['-', '+', 'e', 'E'].includes(e.key)) {
        e.preventDefault();
    }
  };

  
  const blockPaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData('text');
    if (pasteData.includes('-') || pasteData.includes('+')) {
        e.preventDefault();
    }
  };

  
  const sanitizeTextParams = (value: string) => {
      
      if (value.startsWith('-')) {
          return value.replace('-', '');
      }
      return value;
  };

  

  
  const handleSave = async (newExerciseId?: number) => {
    const idToSave = newExerciseId || selectedExerciseId;

    try {
      await updateExerciseSettings(exercise.id, {
        exercise_id: Number(idToSave),
        sets: Number(sets), 
        reps: reps,
        rest_time: rest,
      });
      console.log("Saved changes");
    } catch (error) {
      console.error("Failed to update", error);
    }
  };

  
  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newId = Number(e.target.value);
      setSelectedExerciseId(newId);
      handleSave(newId); 
  };

  
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

  
  return (
    <div style={{ padding: "15px 25px", borderBottom: "1px solid #222", background: "rgba(255, 255, 255, 0.05)" }}>
      
      
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
      
      
      <div style={{ display: "flex", gap: "15px" }}>
        
        
        <div style={{ flex: 1 }}>
            <label style={{fontSize: "0.7rem", color: "#888", display: "block", marginBottom: "4px"}}>Sets</label>
            <input 
                type="number" 
                min="0"
                value={sets} 
                onKeyDown={blockInvalidChar} 
                onPaste={blockPaste} 
                onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0) setSets(e.target.value);
                }} 
                onBlur={() => handleSave()}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #444", color: "white", borderRadius: "4px" }}
            />
        </div>
        
        
        <div style={{ flex: 1 }}>
            <label style={{fontSize: "0.7rem", color: "#888", display: "block", marginBottom: "4px"}}>Reps</label>
            <input 
                type="text" 
                value={reps} 
                
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