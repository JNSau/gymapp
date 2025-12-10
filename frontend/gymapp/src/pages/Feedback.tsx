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
      alert("Thanks for your feedback!");
    } catch (error) {
      console.error(error);
      alert("Failed to send feedback.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: "500px", padding: "30px", background: "#1a1a1a" }}>
      <h3 style={{ marginTop: 0 }}>How do you rate this plan?</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
        Your feedback helps us adjust the training load.
      </p>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <select 
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ flex: 1 }}
        >
          <option value={1}>Too easy (Increase level)</option>
          <option value={2}>Perfect</option>
          <option value={3}>Too hard (Decrease level)</option>
        </select>

        <button onClick={handleSend} className="btn-primary">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Feedback;