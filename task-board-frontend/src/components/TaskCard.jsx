import { Draggable } from '@hello-pangea/dnd';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, index, onSelfAssign, onDelete }) => {
  const { user } = useAuth();
  const isUnassigned = !task.assignedTo;
  const canDelete = user.role === 'admin' || task.creator._id === user._id;

  const handleDeleteClick = async () => {
    const result = await Swal.fire({
      title: 'Delete this task?',
      text: `"${task.title}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B4472F',
      cancelButtonColor: '#8B8F87',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      onDelete(task._id);
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card${snapshot.isDragging ? ' is-dragging' : ''}`}
        >
          <span className="task-title">{task.title}</span>
          {task.description && <p className="task-desc">{task.description}</p>}

          <div className="task-meta">
            <span>Created by {task.creator?.name || 'Unknown'}</span>
            <span>Assigned to {task.assignedTo?.name || 'Unassigned'}</span>
          </div>

          <div className="task-actions">
            {isUnassigned && (
              <button className="assign-btn" onClick={() => onSelfAssign(task._id)}>
                Assign to me
              </button>
            )}
            {canDelete && (
              <button className="btn-danger-text" onClick={handleDeleteClick}>
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;