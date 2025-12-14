import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserLevel } from "../api/users";
import { useAuth } from "../context/AuthContext";
import "../index.css";

const Survey = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  // --- STANY ANKIETY ---
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ wilks: number; level: string } | null>(null);
  
  // --- NOWY STAN: Błędy walidacji ---
  const [error, setError] = useState<string | null>(null);

  // --- DANE UŻYTKOWNIKA ---
  const [formData, setFormData] = useState({
    gender: "male",
    bodyWeight: "",
    age: "",
    benchPress: "0",
    squat: "0",
    deadlift: "0",
  });

  // --- OBSŁUGA INPUTÓW ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Jeśli użytkownik zaczyna pisać, usuwamy błąd
    if (error) setError(null);
  };

  // --- PRZEJŚCIE DO KROKU 2 (Z WALIDACJĄ) ---
  const handleNextStep = () => {
    if (!formData.bodyWeight || Number(formData.bodyWeight) <= 0) {
        setError("Please enter a valid body weight (kg).");
        return;
    }
    if (!formData.age || Number(formData.age) <= 0) {
        setError("Please enter your age.");
        return;
    }
    
    setError(null);
    setStep(2);
  };

  // --- LOGIKA WILKS ---
  const calculateWilksAndLevel = () => {
    const bw = parseFloat(formData.bodyWeight);
    const totalLift = 
      parseFloat(formData.benchPress || "0") + 
      parseFloat(formData.squat || "0") + 
      parseFloat(formData.deadlift || "0");

    // Walidacja wagi (na wszelki wypadek)
    if (!bw || bw <= 0) {
      setError("Invalid body weight.");
      return;
    }

    // Współczynniki Wilks (Standard 2020/Original)
    let a, b, c, d, e, f;

    if (formData.gender === "male") {
      a = -216.0475144;
      b = 16.2606339;
      c = -0.002388645;
      d = -0.00113732;
      e = 7.01863E-06;
      f = -1.291E-08;
    } else {
      a = 594.31747775582;
      b = -27.23842536447;
      c = 0.82112226871;
      d = -0.00930733913;
      e = 4.731582E-05;
      f = -9.054E-08;
    }

    const coeff = 500 / (a + b * bw + c * Math.pow(bw, 2) + d * Math.pow(bw, 3) + e * Math.pow(bw, 4) + f * Math.pow(bw, 5));
    const wilksScore = totalLift * coeff;

    let level = "BEGINNER";
    
    if (formData.gender === "male") {
        if (wilksScore >= 350) level = "ADVANCED";
        else if (wilksScore >= 250) level = "INTERMEDIATE";
    } else {
        if (wilksScore >= 300) level = "ADVANCED";
        else if (wilksScore >= 200) level = "INTERMEDIATE";
    }

    saveResult(wilksScore, level);
  };

  const saveResult = async (score: number, level: string) => {
    setLoading(true);
    setResult({ wilks: score, level });
    
    try {
      await updateUserLevel(level);
      await fetchUser();
    } catch (error) {
      console.error(error);
      setError("Failed to save your level. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDEROWANIE KROKÓW ---

  // KROK 1: DANE OSOBOWE
  if (step === 1) {
    return (
      <div className="container" style={{ maxWidth: "500px", marginTop: "50px" }}>
        <div className="card" style={{ padding: "40px" }}>
            <h2 style={{ marginTop: 0 }}>Step 1: Your Stats 📏</h2>
            <p style={{ color: "var(--text-secondary)" }}>To calculate your strength potential.</p>
            
            <label style={{ display:"block", marginTop: "20px" }}>Gender</label>
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                <button 
                    className={formData.gender === "male" ? "btn-primary" : "btn-secondary"}
                    style={{ flex: 1, padding: "10px", border: "1px solid #444", background: formData.gender === "male" ? "var(--accent)" : "transparent", color: formData.gender === "male" ? "black" : "white" }}
                    onClick={() => setFormData({...formData, gender: "male"})}
                >
                    Male 👨
                </button>
                <button 
                    className={formData.gender === "female" ? "btn-primary" : "btn-secondary"}
                    style={{ flex: 1, padding: "10px", border: "1px solid #444", background: formData.gender === "female" ? "var(--accent)" : "transparent", color: formData.gender === "female" ? "black" : "white" }}
                    onClick={() => setFormData({...formData, gender: "female"})}
                >
                    Female 👩
                </button>
            </div>

            <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <div style={{ flex: 1 }}>
                    <label>Weight (kg)</label>
                    <input 
                        type="number" name="bodyWeight" 
                        value={formData.bodyWeight} onChange={handleChange}
                        placeholder="e.g. 80"
                        style={{ width: "100%", padding: "10px", marginTop: "5px", border: error && !formData.bodyWeight ? "1px solid red" : "1px solid #444" }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label>Age</label>
                    <input 
                        type="number" name="age" 
                        value={formData.age} onChange={handleChange}
                        placeholder="e.g. 25"
                        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                    />
                </div>
            </div>

            {/* --- KOMUNIKAT BŁĘDU (Zamiast Alert) --- */}
            {error && (
                <div style={{ color: "var(--danger)", marginTop: "20px", background: "rgba(255, 0, 0, 0.1)", padding: "10px", borderRadius: "5px", fontSize: "0.9rem" }}>
                    ⚠️ {error}
                </div>
            )}

            <button 
                className="btn-primary" 
                style={{ width: "100%", marginTop: "20px", padding: "12px" }}
                onClick={handleNextStep}
            >
                Next &rarr;
            </button>
        </div>
      </div>
    );
  }

  // KROK 2: WYNIKI SIŁOWE
  if (step === 2 && !result) {
    return (
        <div className="container" style={{ maxWidth: "500px", marginTop: "50px" }}>
          <div className="card" style={{ padding: "40px" }}>
              <h2 style={{ marginTop: 0 }}>Step 2: Max Lifts 🏋️</h2>
              <p style={{ color: "var(--text-secondary)" }}>Enter your 1 Rep Max (1RM) in kg. <br/> Leave 0 if you don't do the exercise.</p>
              
              <div style={{ marginTop: "20px" }}>
                  <label>Bench Press</label>
                  <input 
                      type="number" name="benchPress" 
                      value={formData.benchPress} onChange={handleChange}
                      style={{ width: "100%", padding: "10px", marginTop: "5px", marginBottom: "15px" }}
                  />

                  <label>Squat </label>
                  <input 
                      type="number" name="squat" 
                      value={formData.squat} onChange={handleChange}
                      style={{ width: "100%", padding: "10px", marginTop: "5px", marginBottom: "15px" }}
                  />

                  <label>Deadlift </label>
                  <input 
                      type="number" name="deadlift" 
                      value={formData.deadlift} onChange={handleChange}
                      style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                  />
              </div>

              {/* --- KOMUNIKAT BŁĘDU --- */}
              {error && (
                <div style={{ color: "var(--danger)", marginTop: "10px", textAlign: "center" }}>
                    {error}
                </div>
              )}
  
              <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                <button 
                    onClick={() => {
                        setStep(1); 
                        setError(null);
                    }}
                    style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid #555", color: "white", borderRadius: "8px", cursor: "pointer" }}
                >
                    &larr; Back
                </button>
                <button 
                    className="btn-primary" 
                    style={{ flex: 1, padding: "12px" }}
                    onClick={calculateWilksAndLevel}
                >
                    Calculate Level 🧮
                </button>
              </div>
          </div>
        </div>
      );
  }

  // KROK 3: WYNIK (Bez zmian logicznych, tylko render)
  if (result) {
    return (
        <div className="container" style={{ textAlign: "center", paddingTop: "50px" }}>
          <div className="card" style={{ padding: "40px", maxWidth: "500px", margin: "0 auto", borderTop: "4px solid var(--accent)" }}>
            <h1 style={{ fontSize: "4rem", margin: "0 0 10px 0" }}>🏆</h1>
            <h2 style={{ fontSize: "2rem" }}>Results</h2>
            
            <div style={{ display: "flex", justifyContent: "space-around", margin: "20px 0", color: "var(--text-secondary)" }}>
                <div>
                    <div style={{ fontSize: "0.9rem" }}>Total Lifted</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>
                        {parseFloat(formData.benchPress) + parseFloat(formData.squat) + parseFloat(formData.deadlift)} kg
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: "0.9rem" }}>Wilks Score</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>
                        {result.wilks.toFixed(2)}
                    </div>
                </div>
            </div>

            <p>Your calculated strength level is:</p>
            
            <div style={{ 
              fontSize: "2.5rem", fontWeight: "bold", 
              color: "var(--accent)", margin: "20px 0",
              letterSpacing: "2px",
              textShadow: "0 0 10px rgba(212, 255, 0, 0.3)"
            }}>
              {result.level}
            </div>
  
            <p style={{ marginBottom: "30px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              {result.level === "BEGINNER" && "You have a solid foundation. Let's focus on technique and linear progression."}
              {result.level === "INTERMEDIATE" && "Impressive strength! You are ready for periodized training plans."}
              {result.level === "ADVANCED" && "Elite strength detected. Our advanced peaking programs are unlocked for you."}
            </p>
            
            {loading ? (
              <p>Saving...</p>
            ) : (
              <button 
                  onClick={() => navigate("/plans")} 
                  className="btn-primary" 
                  style={{ width: "100%", padding: "15px", fontSize: "1.2rem" }}
              >
                  See My Plans 🚀
              </button>
            )}
          </div>
        </div>
      );
  }

  return <div>Loading...</div>;
};

export default Survey;