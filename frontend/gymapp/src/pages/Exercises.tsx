import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { getExercises } from "../api/exercises";
import "../index.css";

const Exercises = () => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExercises()
      .then((data: any) => {
        setExercises(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container" style={{ marginTop: "50px" }}>Loading exercises...</div>;

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <h1>Exercise Library </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Browse our comprehensive database of movements.
        </p>
      </div>

      <div className="exercises-grid">
        {exercises.map((ex) => (
          <Link 
            key={ex.id} 
            to={`/exercises/${ex.id}`} 
            className="exercise-card"
          >
            <div>
              {/* --- 1. ZDJĘCIE ĆWICZENIA --- */}
              {ex.image ? (
                <img 
                  src={ex.image} 
                  alt={ex.name} 
                  className="exercise-img"
                  onError={(e) => {
                     // Jeśli zdjęcie nie działa, ukrywamy img i pokazujemy div pod spodem
                     e.currentTarget.style.display = 'none'; 
                     e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex !important');
                  }}
                />
              ) : null}

              {/* Placeholder (pokazuje się gdy brak zdjęcia lub błąd ładowania) */}
              {(!ex.image) && (
                  <div className="exercise-img" style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      background: "#222", 
                      color: "#555",      // Kolor emotki (jeśli system nie narzuci swojego)
                      fontSize: "4rem",   // Duży rozmiar
                      opacity: "0.5"      // Lekka przezroczystość, żeby była tłem
                  }}>
                      🏋️
                  </div>
              )}

              {/* --- 2. BADGE I TREŚĆ --- */}
              <span className="muscle-badge">
                 {ex.muscle_group || "General"}
              </span>
              
              <h2 style={{ 
                  fontSize: "1.4rem", 
                  margin: "0 0 10px 0", 
                  border: "none", 
                  padding: 0 
              }}>
                {ex.name}
              </h2>
              
              <p style={{ 
                  color: "var(--text-secondary)", 
                  fontSize: "0.9rem", 
                  lineHeight: "1.5" 
              }}>
                {ex.description 
                  ? ex.description.substring(0, 80) + (ex.description.length > 80 ? "..." : "")
                  : "No description available."}
              </p>
            </div>

            <div style={{ 
                marginTop: "15px", 
                textAlign: "right", 
                color: "var(--accent)", 
                fontWeight: "bold",
                fontSize: "1.2rem"
            }}>
              &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Exercises;