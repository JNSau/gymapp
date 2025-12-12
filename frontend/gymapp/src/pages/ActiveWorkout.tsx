import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanDetails } from "../api/plans";
import { saveWorkout } from "../api/history";
import "../index.css";

const ActiveWorkout = () => {
  const { planId, dayId } = useParams();
  const navigate = useNavigate();
  
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [dayData, setDayData] = useState<any>(null);
  const [logs, setLogs] = useState<any>({});

  // --- NOWE STANY DLA MODALA ---
  const [showModal, setShowModal] = useState(false); // Czy pokazać okienko?
  const [workoutName, setWorkoutName] = useState(""); // Przechowywanie nazwy

  // Stoper
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

  // Pobieranie danych
  useEffect(() => {
    if(planId) {
        getPlanDetails(Number(planId)).then(plan => {
            const day = plan.days.find((d: any) => d.id === Number(dayId));
            setDayData(day);
            // Ustawiamy domyślną nazwę od razu
            setWorkoutName(`Workout - Day ${day.day_number}`);
        });
    }
  }, [planId, dayId]);

  const handleInputChange = (exerciseId: number, setIndex: number, field: string, value: any) => {
    let cleanValue = value;
    if ((field === "weight" || field === "reps") && Number(value) < 0) {
        cleanValue = 0;
    }

    setLogs((prevLogs: any) => ({
      ...prevLogs,
      [exerciseId]: {
        ...prevLogs[exerciseId],
        [setIndex]: {
          ...prevLogs[exerciseId]?.[setIndex],
          [field]: cleanValue
        }
      }
    }));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // 1. Kliknięcie przycisku "FINISH" -> Otwiera okienko
  const onFinishClick = () => {
    setIsActive(false); // Zatrzymujemy czas
    setShowModal(true); // Pokazujemy nasze okno
  };

  // 2. Kliknięcie "Anuluj" w okienku
  const closeModal = () => {
    setShowModal(false);
    setIsActive(true); // Wznawiamy czas
  };

  // 3. Kliknięcie "Zapisz" w okienku -> Faktyczna wysyłka
  const confirmSave = async () => {
    try {
        const formattedLogs: any[] = [];
        
        Object.keys(logs).forEach(exerciseId => {
            const sets = logs[exerciseId];
            Object.keys(sets).forEach(setIndex => {
                const set = sets[setIndex];
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

        const payload = {
            custom_name: workoutName, // Bierzemy nazwę z naszego inputa
            duration_minutes: Math.ceil(seconds / 60),
            training_day: Number(dayId),
            logs: formattedLogs,
        };

        await saveWorkout(payload);
        
        // Zamykamy modal i przekierowujemy
        setShowModal(false);
        navigate("/profile");

    } catch (error) {
        console.error(error);
        alert("Failed to save workout.");
        setIsActive(true);
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
                            type="number" min="0" placeholder="kg" 
                            style={{ width: "80px", padding: "8px" }}
                            onChange={(e) => handleInputChange(ex.id, index, "weight", e.target.value)}
                        />
                        <input 
                            type="number" min="0" placeholder="reps" 
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

      {/* Przycisk Główny (Otwiera Modal) */}
      <div style={{ 
        position: "fixed", bottom: 0, left: 0, right: 0, 
        background: "#121212", padding: "20px", borderTop: "1px solid #333",
        display: "flex", justifyContent: "center"
      }}>
        <button 
            onClick={onFinishClick} 
            className="btn-primary" 
            style={{ width: "100%", maxWidth: "400px", padding: "15px", fontSize: "1.2rem" }}
        >
            FINISH WORKOUT 🏁
        </button>
      </div>

      {/* --- NASZ CUSTOMOWY MODAL --- */}
      {showModal && (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.85)", // Ciemne tło
            zIndex: 1000,
            display: "flex", justifyContent: "center", alignItems: "center",
            padding: "20px"
        }}>
            <div className="card" style={{ width: "100%", maxWidth: "400px", padding: "30px", border: "1px solid #444" }}>
                <h2 style={{ marginTop: 0, textAlign: "center" }}>Great Job! 🎉</h2>
                <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                    You exercised for {formatTime(seconds)}. <br/> Name your workout to save it.
                </p>

                <div style={{ margin: "20px 0" }}>
                    <label style={{ display: "block", marginBottom: "10px" }}>Workout Name</label>
                    <input 
                        type="text" 
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                        style={{ width: "100%", padding: "12px", fontSize: "1.1rem" }}
                        autoFocus
                    />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                        onClick={closeModal}
                        style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid #555", color: "white", borderRadius: "8px", cursor: "pointer" }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmSave}
                        className="btn-primary"
                        style={{ flex: 1, padding: "12px" }}
                    >
                        Save Workout
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default ActiveWorkout;