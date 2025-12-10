import { useEffect, useState } from "react";
import { getPlans } from "../api/plans";
import PlanCard from "../components/PlanCard";
import "../index.css";

const Plans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getPlans().then((data: any) => setPlans(data));
  }, []);

  return (
    <div className="container">
      <div style={{ margin: "40px 0", textAlign: "center" }}>
        <h1>Training Plans</h1>
        <p style={{ color: "var(--text-secondary)" }}>Choose a plan that fits your goal.</p>
      </div>

      <div className="grid-layout">
        {plans.map((plan: any) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default Plans;