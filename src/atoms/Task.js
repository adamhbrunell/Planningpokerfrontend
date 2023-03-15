import React, { useState } from "react";
import "./Task.css";

const Task = ({
  id,
  header,
  content,
  value = "-",
  isSelected,
  swapTask,
  collapsed = true,
  isNew,
  onEdit,
}) => {
  const [isCollapsed, setCollapsed] = useState(collapsed);

  function expand() {
    setCollapsed(!isCollapsed);
  }

  function handleHeaderChange(event) {
    onEdit({ header: event.target.value });
  }

  function handleContentChange(event) {
    onEdit({ content: event.target.value });
  }

  function handleSave() {
    onEdit({ isNew: false });
  }

  return (
    <div
      className={`task ${isCollapsed ? "collapsed" : ""} ${
        isSelected ? "selected" : ""
      }
        ${value !== "-" ? "completed" : ""} `}
    >
      {isNew ? (
        <>
          <input
            type="text"
            value={header}
            onChange={handleHeaderChange}
            placeholder="Enter header"
          />
          <br />
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Enter content"
          />
          <br />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <div className="task_text">
            <h2 onClick={expand}>{header}</h2>
            <p>{!isCollapsed && content}</p>
          </div>
          <div className="task_bottom">
            <button onClick={() => swapTask(id)} disabled={isSelected}>
              {isSelected ? "Voting now..." : "Vote on task"}
            </button>
            <div className="value">{value}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Task;
