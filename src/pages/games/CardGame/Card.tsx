import React from "react";
import "./Card.css";

type CardProps = {
  id: number;
  value: number;
  flipped: boolean;
  onClick: (id: number) => void;
};

const Card: React.FC<CardProps> = ({ id, value, flipped, onClick }) => {
  return (
    <div
      className={`game-card ${flipped ? "flipped" : ""}`}
      onClick={() => !flipped && onClick(id)}
    >
      <div className="card-inner">
        <div className="card-front">
          <span className="card-value">{value}</span>
        </div>
        <div className="card-back">
          <span className="card-back-design">🂠</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
