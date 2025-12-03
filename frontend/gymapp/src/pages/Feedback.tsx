import { useState } from "react";
import { sendFeedback } from "../api/feedback";
import "../index.css";

interface FeedbackProps {
  planId: number;
}

const Feedback = ({ planId }: FeedbackProps) => {
  const [rating, setRating] = useState<number>(2);

  const handleSend = async () => {
    try {
      await sendFeedback({ plan: planId, rating });
      alert("Dzięki za opinię!");
    } catch (error) {
      console.error(error);
      alert("Nie udało się wysłać opinii.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: "500px", padding: "30px", background: "#1a1a1a" }}>
      <h3 style={{ marginTop: 0 }}>Jak oceniasz ten plan?</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
        Twoja opinia pomaga nam lepiej dobierać obciążenie.
      </p>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <select 
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ flex: 1 }}
        >
          <option value={1}>Za łatwy (Zwiększ poziom)</option>
          <option value={2}>Idealny</option>
          <option value={3}>Za trudny (Zmniejsz poziom)</option>
        </select>

        <button onClick={handleSend} className="btn-primary">
          Wyślij
        </button>
      </div>
    </div>
  );
};

export default Feedback;