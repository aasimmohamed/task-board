import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const Column = ({ columnId, title, tasks, onSelfAssign, onDelete }) => {
  return (
    <div className="column" data-col={columnId}>
      <div className="column-header">
        <span className="column-title">{title}</span>
        <span className="column-count">{tasks.length}</span>
      </div>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-drop${snapshot.isDraggingOver ? ' is-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onSelfAssign={onSelfAssign}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;