import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../index.css";

const Home = () => {
  const { user } = useAuth();

  // Wspólny styl dla przycisków (możesz go wynieść do zmiennej, żeby nie powtarzać kodu)
  const buttonStyle: React.CSSProperties = {
    display: "inline-block",
    background: "var(--accent)", 
    color: "black",
    padding: "18px 45px", 
    fontSize: "1.3rem", 
    fontWeight: "bold",
    borderRadius: "50px", 
    textDecoration: "none",
    boxShadow: "0 0 20px rgba(212, 255, 0, 0.4)", 
    transition: "transform 0.2s ease",
    cursor: "pointer"
  };

  // Funkcje animacji z poprawionymi typami TypeScript
  const handleMouseOver = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <div className="container" style={{ textAlign: "center", padding: "60px 20px" }}>
      
      {/* --- HERO SECTION --- */}
      <div style={{ marginBottom: "80px" }}>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "20px", lineHeight: "1.1" }}>
          Welcome to <span style={{ color: "var(--accent)" }}>Gymersive</span>
        </h1>
        <p style={{ 
            fontSize: "1.2rem", 
            color: "var(--text-secondary)", 
            maxWidth: "600px", 
            margin: "0 auto",
            lineHeight: "1.6"
        }}>
          Your personal training companion. Track your progress, follow professional plans, and crush your goals with our smart workout tools.
        </p>
        
        <div style={{ marginTop: "40px", display: "flex", gap: "20px", justifyContent: "center" }}>
          
          {user ? (
            // --- ZALOGOWANY: Przycisk do planów (Teraz wygląda super!) ---
            <Link 
              to="/plans" 
              style={buttonStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Browse Plans 📋
            </Link>
          ) : (
            // --- NIEZALOGOWANY: Przycisk CTA ---
            <Link 
              to="/login" 
              style={buttonStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Start Training Now 🚀
            </Link>
          )}

        </div>
      </div>

      {/* --- ANKIETA (Tylko dla zalogowanych) --- */}
      {user && (
        <div className="hover-effect" style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #252525 100%)",
          padding: "40px",
          borderRadius: "15px",
          border: "1px solid #333",
          borderLeft: "6px solid var(--accent)",
          maxWidth: "800px",
          margin: "0 auto",
          marginBottom: "80px",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "1.8rem" }}>
              Not sure where to start? 🤔
            </h2>
            <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "1rem" }}>
              Take our quick assessment quiz to calculate your strength level.
            </p>
          </div>

          <Link to="/survey" className="btn-primary" style={{ whiteSpace: "nowrap" }}>
            Check My Level ⚡
          </Link>
        </div>
      )}

      {/* --- FEATURE CARDS --- */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: "30px",
        marginTop: user ? "0px" : "80px"
      }}>
        <FeatureCard 
            icon="📊" 
            title="Track Progress" 
            desc="Save your workout history and monitor your strength gains over time." 
        />
        <FeatureCard 
            icon="🏋️" 
            title="Expert Plans" 
            desc="Access curated routines designed for Beginner, Intermediate, and Advanced athletes." 
        />
        <FeatureCard 
            icon="⏱️" 
            title="Focus Mode" 
            desc="Use our built-in rest timer and distraction-free interface during your sessions." 
        />
      </div>

    </div>
  );
};

// Komponent Karty
const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="card" style={{ padding: "30px", textAlign: "left", height: "100%" }}>
    <div style={{ fontSize: "3rem", marginBottom: "15px" }}>{icon}</div>
    <h3 style={{ marginTop: 0, fontSize: "1.5rem" }}>{title}</h3>
    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.5" }}>{desc}</p>
  </div>
);

export default Home;