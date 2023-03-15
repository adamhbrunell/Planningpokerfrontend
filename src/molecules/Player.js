import React, { useState, useEffect } from "react";
import Card from "../atoms/Card";
import "./Player.css";

const Player = ({ id, name, deck, card = "none", openCard }) => {
  const [color, setColor] = useState("");

  useEffect(() => {
    const saturation = 30;
    const lightness = 60;
    const hue = Math.floor(Math.random() * 360);

    const randomColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    setColor(randomColor);
  }, []);

  return (
    <div className="player" id={id}>
      <Card value={card} deck={deck} className="played" visible={openCard} />
      <div className="name" style={{ backgroundColor: color, color: "white" }}>
        {name}
      </div>
    </div>
  );
};

export default Player;
