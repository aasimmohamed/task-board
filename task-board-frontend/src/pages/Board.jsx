import { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import Column from '../components/Column';
import { getTasks, createTask, updateTaskStatus, assignTask, deleteTask } from '../api/tasks';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
];

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      toast.error('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTask = await createTask(title, description);
      setTasks((prev) => [newTask, ...prev]);
      setTitle('');
      setDescription('');
      toast.success('Task created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleSelfAssign = async (taskId) => {
    try {
      const updated = await assignTask(taskId);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      toast.success('Task assigned to you');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not assign task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete task');
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    setTasks((prev) => prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t)));

    try {
      await updateTaskStatus(draggableId, newStatus);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move task');
      loadTasks();
    }
  };

  if (loading) return <p>Loading board...</p>;

  return (
    <div>
      <form onSubmit={handleCreate} className="new-task-form">
        <input className="title" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="desc" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="btn btn-primary" type="submit">Add task</button>
      </form>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              columnId={col.id}
              title={col.title}
              tasks={tasks.filter((t) => t.status === col.id)}
              onSelfAssign={handleSelfAssign}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;