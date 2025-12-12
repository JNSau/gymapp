import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanDetails } from "../api/plans";
import { saveWorkout } from "../api/history"; // <--- 1. IMPORTUJEMY FUNKCJĘ ZAPISU
import "../index.css";

const ActiveWorkout = () => {
  const { planId, dayId } = useParams();
  const navigate = useNavigate();
  
  // Stan stopera
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Dane treningowe
  const [dayData, setDayData] = useState<any>(null);
  
  // Stan wprowadzonych wyników
  const [logs, setLogs] = useState<any>({});

  // 1. Stoper
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // 2. Pobieranie danych
  useEffect(() => {
    if(planId) {
        getPlanDetails(Number(planId)).then(plan => {
            const day = plan.days.find((d: any) => d.id === Number(dayId));
            setDayData(day);
        });
    }
  }, [planId, dayId]);

  // Obsługa wpisywania danych
  const handleInputChange = (exerciseId: number, setIndex: number, field: string, value: any) => {
    setLogs((prevLogs: any) => ({
      ...prevLogs,
      [exerciseId]: {
        ...prevLogs[exerciseId],
        [setIndex]: {
          ...prevLogs[exerciseId]?.[setIndex],
          [field]: value
        }
      }
    }));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // --- 3. GŁÓWNA ZMIANA: ZAPISYWANIE DO BAZY ---
  const handleFinish = async () => {
    // Zatrzymujemy czas
    setIsActive(false);
    
    const confirm = window.confirm("Finish workout and save?");
    
    if (confirm) {
        try {
            // FORMATOWANIE DANYCH:
            // Musimy zamienić nasz obiekt 'logs' na płaską listę, którą przyjmie Django
            const formattedLogs: any[] = [];
            
            Object.keys(logs).forEach(exerciseId => {
                const sets = logs[exerciseId];
                Object.keys(sets).forEach(setIndex => {
                    const set = sets[setIndex];
                    // Zapisujemy tylko serie zaznaczone jako "done"
                    if (set.done) { 
                        formattedLogs.push({
                            exercise: Number(exerciseId),
                            set_number: Number(setIndex) + 1,
                            reps_done: Number(set.reps || 0),
                            weight_kg: Number(set.weight || 0)
                        });
                    }
                });
            });

            // Przygotowanie paczki danych (Payload)
            const payload = {
                duration_minutes: Math.ceil(seconds / 60), // Czas w minutach
                training_day: Number(dayId), // ID dnia (żeby wiedzieć jaki to był plan)
                logs: formattedLogs, // Lista wykonanych serii
            };

            console.log("Sending to API:", payload);

            // WYSYŁKA
            await saveWorkout(payload);
            
            alert("Workout saved successfully! Great job! 💪");
            navigate("/profile"); // Przekierowanie do profilu

        } catch (error) {
            console.error(error);
            alert("Failed to save workout. Check console for details.");
            setIsActive(true); // Wznawiamy stoper w razie błędu
        }
    } else {
        setIsActive(true); // Anulowano, czas leci dalej
    }
  };

  if (!dayData) return <div className="container" style={{marginTop: "50px"}}>Loading workout...</div>;

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      
      {/* Timer */}
      <div style={{ 
        position: "sticky", top: "70px", zIndex: 10, 
        background: "#1a1a1a", padding: "15px", 
        borderBottom: "2px solid var(--accent)",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Day {dayData.day_number}</h2>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>In progress...</span>
        </div>
        <div style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "monospace", color: "var(--accent)" }}>
            {formatTime(seconds)}
        </div>
      </div>

      {/* Lista Ćwiczeń */}
      <div style={{ marginTop: "20px" }}>
        {dayData.exercises.map((ex: any) => (
            <div key={ex.id} className="card" style={{ marginBottom: "20px", padding: "20px" }}>
                <h3 style={{ marginTop: 0 }}>{ex.exercise_name}</h3>
                <p style={{ color: "var(--text-secondary)" }}>Target: {ex.sets} sets x {ex.reps}</p>
                
                {Array.from({ length: ex.sets }).map((_, index) => (
                    <div key={index} style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
                        <span style={{ width: "20px", fontWeight: "bold", color: "#555" }}>{index + 1}</span>
                        
                        <input 
                            type="number" 
                            placeholder="kg" 
                            style={{ width: "80px", padding: "8px" }}
                            onChange={(e) => handleInputChange(ex.id, index, "weight", e.target.value)}
                        />
                        <input 
                            type="number" 
                            placeholder="reps" 
                            defaultValue={ex.reps.split("-")[0]}
                            style={{ width: "80px", padding: "8px" }}
                            onChange={(e) => handleInputChange(ex.id, index, "reps", e.target.value)}
                        />
                        <input 
                            type="checkbox" 
                            style={{ width: "25px", height: "25px", accentColor: "var(--accent)" }} 
                            onChange={(e) => handleInputChange(ex.id, index, "done", e.target.checked)}
                        />
                    </div>
                ))}
            </div>
        ))}
      </div>

      {/* Przycisk Zakończ */}
      <div style={{ 
        position: "fixed", bottom: 0, left: 0, right: 0, 
        background: "#121212", padding: "20px", borderTop: "1px solid #333",
        display: "flex", justifyContent: "center"
      }}>
        <button 
            onClick={handleFinish} 
            className="btn-primary" 
            style={{ width: "100%", maxWidth: "400px", padding: "15px", fontSize: "1.2rem" }}
        >
            FINISH WORKOUT 🏁
        </button>
      </div>

    </div>
  );
};

export default ActiveWorkout;