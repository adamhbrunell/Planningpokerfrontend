import React from "react";
import { Link } from "react-router-dom";
import "./StartPage.css";

const StartPage = () => {
  return (
    <div className="main">
      <Link to="/join">
        <button>Join Lobby</button>
      </Link>
      <Link to="/create">
        <button>Create Lobby</button>
      </Link>
    </div>
  );
};

export default StartPage;
