import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!user) return null;

  const initial = user.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        className="profile-avatar"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {initial}
      </button>

      {open && (
        <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-header">
            <div className="profile-avatar-lg">{initial}</div>
            <div>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
            </div>
          </div>

          <div className="profile-dropdown-row">
            <span>Role</span>
            <span className="role-badge">{user.role}</span>
          </div>

          <button className="profile-logout" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;