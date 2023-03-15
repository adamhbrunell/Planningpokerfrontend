import React from "react";
import "./Table.css";

const Table = ({ task, children }) => {
  return (
    <div className="table">
      <h2>{task}</h2>
      {children}
    </div>
  );
};

export default Table;
