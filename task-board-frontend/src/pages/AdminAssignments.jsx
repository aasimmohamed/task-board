import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getUsers } from '../api/users';
import { getTasks, assignTask } from '../api/tasks';

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'To Do' },
  { id: 'doing', label: 'Doing' },
  { id: 'done', label: 'Done' },
];

const AdminAssignments = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const [taskData, userData] = await Promise.all([getTasks(), getUsers()]);
      setTasks(taskData);
      setUsers(userData);
    } catch {
      toast.error('Could not load assignment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesQuery = !q || t.title.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [tasks, query, statusFilter]);

  const handleReassign = async (taskId, userId) => {
    try {
      const updated = await assignTask(taskId, userId || null);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      toast.success('Assignment updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update assignment');
    }
  };

  if (loading) return <p>Loading assignments...</p>;

  return (
    <div className="page-panel">
      <div className="page-header-row">
        <div>
          <h2>Manage assignments</h2>
          <p className="page-subtitle">Reassign any task to any user, or unassign it</p>
        </div>
        <input
          className="search-input"
          placeholder="Search tasks"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="filter-tabs">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            className={`filter-tab${statusFilter === f.id ? ' active' : ''}`}
            onClick={() => setStatusFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="table-card">
        {filtered.length === 0 ? (
          <div className="empty-state">No tasks match your filters</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Assigned to</th>
                <th>Reassign</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr key={task._id}>
                  <td data-label="Task" className="task-title-cell">{task.title}</td>
                  <td data-label="Status"><span className={`status-pill ${task.status}`}>{task.status}</span></td>
                  <td data-label="Assigned to">
                    {task.assignedTo ? (
                      <div className="user-cell">
                        <div className="table-avatar sm">
                          {task.assignedTo.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{task.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="dim-cell">Unassigned</span>
                    )}
                  </td>
                  <td data-label="Reassign">
                    <select
                      value={task.assignedTo?._id || ''}
                      onChange={(e) => handleReassign(task._id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminAssignments;