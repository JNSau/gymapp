import { Link } from "react-router-dom";
import "../index.css";

type Props = {
  plan: {
    id: number;
    name: string;
    level: string;
    description: string;
  };
};

const PlanCard = ({ plan }: Props) => {
  return (
    <div className="card" style={{ padding: "25px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>{plan.name}</h2>
          <span className="badge badge-level">{plan.level}</span>
        </div>
        
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "20px" }}>
          {plan.description}
        </p>
      </div>

      <Link to={`/plans/${plan.id}`}>
        <button className="btn-primary" style={{ width: "100%" }}>
          Wybierz Plan
        </button>
      </Link>
    </div>
  );
};

export default PlanCard;