import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlanDetails } from "../api/plans";
import DayCard from "../components/Daycard";
import Feedback from "./Feedback";
import "../index.css";

const PlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const planId = Number(id);
    getPlanDetails(planId).then((data) => setPlan(data));
  }, [id]);

  if (!plan) return <div className="container" style={{paddingTop: "50px"}}>Loading...</div>;

  return (
    <div className="container">
      {/* Plan Header */}
      <div style={{ background: "var(--bg-secondary)", padding: "40px", borderRadius: "12px", marginTop: "20px" }}>
        <span className="badge badge-level" style={{marginBottom: "15px"}}>{plan.level}</span>
        <h1>{plan.name}</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "800px" }}>
          {plan.description}
        </p>
      </div>

      {/* Schedule */}
      <div style={{ margin: "40px 0" }}>
        <h2 style={{ marginBottom: "20px" }}>Schedule</h2>
        {plan.days.map((day: any) => (
          <DayCard key={day.id} day={day} />
        ))}
      </div>

      {/* Feedback Section */}
      <div style={{ borderTop: "1px solid #333", paddingTop: "40px", paddingBottom: "60px" }}>
        <Feedback planId={plan.id} />
      </div>
    </div>
  );
};

export default PlanDetails;