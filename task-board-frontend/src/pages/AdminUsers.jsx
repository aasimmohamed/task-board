import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getUsers } from '../api/users';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => toast.error('Could not load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="page-panel">
      <div className="page-header-row">
        <div>
          <h2>All users</h2>
          <p className="page-subtitle">
            {users.length} registered {users.length === 1 ? 'user' : 'users'}
          </p>
        </div>
        <input
          className="search-input"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="table-card">
        {filtered.length === 0 ? (
          <div className="empty-state">No users match "{query}"</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Created</th>
                <th>Assigned</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td data-label="User">
                    <div className="user-cell">
                      <div className="table-avatar">{u.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="user-cell-name">{u.name}</div>
                        <div className="user-cell-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Role"><span className={`role-pill ${u.role}`}>{u.role}</span></td>
                  <td data-label="Joined" className="dim-cell">
                    {new Date(u.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td data-label="Created">
                    <span className="count-badge">{u.createdTaskCount}</span>
                  </td>
                  <td data-label="Assigned">
                    <span className="count-badge">{u.assignedTaskCount}</span>
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

export default AdminUsers;