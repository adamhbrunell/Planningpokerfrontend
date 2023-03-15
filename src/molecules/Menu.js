import React from "react";

const Menu = ({tasks, handleTaskClick}) => {
		return(
			<div>
				{tasks.map(task =>
					(<div className="item">
					<Task
              key={task.id}
              id={task.id}
              header={task.header}
              content={task.content}
              complete={task.complete}
              onClick={() => handleTaskClick(task)}
            />
					</div>))}
			</div>
		)

}

export default Menu