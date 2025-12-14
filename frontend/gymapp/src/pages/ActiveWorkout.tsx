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

  // --- STANY MODALA ---
  const [showModal, setShowModal] = useState(false);
  const [workoutName, setWorkoutName] = useState("");

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

  const onFinishClick = () => {
    setIsActive(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsActive(true);
  };

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
            custom_name: workoutName,
            duration_minutes: Math.ceil(seconds / 60),
            training_day: Number(dayId),
            logs: formattedLogs,
        };

        await saveWorkout(payload);
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
      
      {/* --- HEADER Z CZASEM I STATUS BAR --- */}
      <div style={{ 
        position: "sticky", top: "70px", zIndex: 10, 
        background: "#1a1a1a", padding: "15px", 
        borderBottom: "2px solid var(--accent)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)" // Lekki cień pod paskiem
      }}>
        
        {/* LEWA STRONA: Tytuł i Status Badge */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h2 style={{ margin: 0, fontSize: "1.3rem", lineHeight: "1.1" }}>
                Day {dayData.day_number}
            </h2>
            
            {/* STYLOWY BADGE STATUSU */}
            <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "rgba(212, 255, 0, 0.1)", // Bardzo delikatne tło w kolorze akcentu
                color: "var(--accent)", // Kolor tekstu (ten sam co akcent)
                padding: "4px 8px",
                borderRadius: "12px", // Zaokrąglone rogi
                fontSize: "0.75rem",
                fontWeight: "bold",
                width: "fit-content",
                border: "1px solid rgba(212, 255, 0, 0.2)"
            }}>
                <span style={{ fontSize: "10px" }}>●</span> IN PROGRESS
            </div>
        </div>

        {/* PRAWA STRONA: Duży Zegar */}
        <div style={{ 
            fontSize: "2.2rem", 
            fontWeight: "bold", 
            fontFamily: "monospace", 
            color: "var(--accent)",
            background: "#222",
            padding: "5px 10px",
            borderRadius: "8px"
        }}>
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

      {/* Przycisk Główny */}
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

      {/* Modal */}
      {showModal && (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.85)", 
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