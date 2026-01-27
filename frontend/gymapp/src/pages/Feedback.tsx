import { useState } from "react";
import { sendFeedback } from "../api/feedback";
import "../index.css";

interface FeedbackProps {
  planId: number;
}

const Feedback = ({ planId }: FeedbackProps) => {
  const [rating, setRating] = useState<number>(2);
  
  
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSend = async () => {
    setMessage(null); 

    try {
      await sendFeedback({ plan: planId, rating });
      
      
      setMessage({ text: "Thanks for your feedback! ⭐", type: "success" });
      
    } catch (error: any) {
      console.error(error);
      
      let errorText = "Failed to send feedback.";
      
      
      if (error.response && error.response.status === 400 && error.response.data.error) {
          errorText = error.response.data.error; 
      }

      
      setMessage({ text: errorText, type: "error" });
    }

    
    setTimeout(() => {
        setMessage(null);
    }, 4000);
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
          style={{ flex: 1, padding: "10px" }}
        >
          <option value={1}>Too easy (Increase level)</option>
          <option value={2}>Perfect</option>
          <option value={3}>Too hard (Decrease level)</option>
        </select>

        <button onClick={handleSend} className="btn-primary">
          Submit
        </button>
      </div>

      
      {message && (
        <div style={{ 
            marginTop: "15px", 
            padding: "10px", 
            borderRadius: "8px",
            textAlign: "center",
            
            background: message.type === 'success' ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
            border: message.type === 'success' ? "1px solid var(--success)" : "1px solid var(--danger)",
            color: message.type === 'success' ? "var(--success)" : "var(--danger)"
        }}>
            {message.text}
        </div>
      )}

    </div>
  );
};

export default Feedback;