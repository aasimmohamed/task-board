import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import Sidebar from './Sidebar';

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-left">
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
          <span className="brand">Task Board</span>
        </div>
        <ProfileMenu />
      </div>

      <div className="layout-body">
        <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;