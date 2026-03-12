import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Vezérlőpult',
      icon: '📊',
      path: '/admin'
    },
    {
      id: 'tours',
      title: 'Túrák kezelése',
      icon: '🗺️',
      path: '/admin/tours'
    },
    {
      id: 'bookings',
      title: 'Foglalások',
      icon: '📅',
      path: '/admin/bookings'
    },
    {
      id: 'users',
      title: 'Felhasználók',
      icon: '👥',
      path: '/admin/users'
    },
    {
      id: 'messages',
      title: 'Üzenetek',
      icon: '✉️',
      path: '/admin/messages'
    },
    {
      id: 'settings',
      title: 'Beállítások',
      icon: '⚙️',
      path: '/admin/settings'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    // Átirányítás a felhasználói profil oldalra
    navigate('/profile');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo" onClick={() => navigate('/admin')}>
            <h2>Gasztro<span>Admin</span></h2>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Admin profil - kattintható */}
        <div className="admin-profile" onClick={handleProfileClick}>
          <div className="admin-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="admin-info">
              <div className="admin-name">{user?.name}</div>
              <div className="admin-role">Adminisztrátor</div>
              <div className="profile-hint">Kattints a profilodhoz →</div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  className={`nav-item ${window.location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {sidebarOpen && <span className="nav-title">{item.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span className="nav-title">Kijelentkezés</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`main-content ${sidebarOpen ? 'with-sidebar' : 'full'}`}>
        <div className="content-header">
          <h1>Admin felület</h1>
          <div className="header-actions">
            <button className="notification-btn">🔔</button>
            <div className="admin-badge">
              <span>Admin</span>
            </div>
          </div>
        </div>
        
        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;