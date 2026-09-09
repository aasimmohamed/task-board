import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`;

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <button className="sidebar-close" onClick={onClose} aria-label="Close menu">✕</button>

      <div className="sidebar-section">
        <span className="sidebar-label">Workspace</span>
        <NavLink to="/board" className={linkClass} onClick={onClose}>Board</NavLink>
      </div>

      {user?.role === 'admin' && (
        <div className="sidebar-section">
          <span className="sidebar-label">Admin</span>
          <NavLink to="/admin/users" className={linkClass} onClick={onClose}>All Users</NavLink>
          <NavLink to="/admin/assignments" className={linkClass} onClick={onClose}>Manage Assignments</NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;