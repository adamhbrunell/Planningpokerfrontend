import React from "react";
import Cards from "../Images";
import "./Card.css";

const Card = ({ value, deck, onClick, visible = true, className }) => {
  return (
    <img
      src={visible ? Cards(`./${deck}/${value}.png`) : Cards(`./cardback.png`)}
      alt={value}
      onClick={onClick}
      className={className}
    />
  );
};

export default Card;
