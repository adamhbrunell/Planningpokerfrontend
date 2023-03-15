import React from "react";
import Card from "../atoms/Card";

const Hand = ({ onCardClick, deck }) => {
  return (
    <div className="hand">
      {deck["values"].map((value) => (
        <Card
          key={value}
          deck={deck["name"]}
          value={value}
          onClick={() => onCardClick(value)}
        />
      ))}
    </div>
  );
};

export default Hand;
