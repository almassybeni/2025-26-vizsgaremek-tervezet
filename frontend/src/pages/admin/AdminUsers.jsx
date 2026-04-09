import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import './AdminUsers.css';

const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    phone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Szimulált adatok
      setTimeout(() => {
        setUsers([
          { 
            id: 1, 
            name: 'Admin User', 
            email: 'admin@gasztrokalandok.hu', 
            role: 'admin', 
            phone: '+36 30 123 4567',
            created_at: '2024-01-01',
            last_login: '2024-03-15',
            is_active: true,
            bookings: 0
          },
          { 
            id: 2, 
            name: 'Kovács János', 
            email: 'kovacs.janos@email.hu', 
            role: 'client', 
            phone: '+36 20 234 5678',
            created_at: '2024-02-10',
            last_login: '2024-03-14',
            is_active: true,
            bookings: 3
          },
          { 
            id: 3, 
            name: 'Nagy Anna', 
            email: 'nagy.anna@email.hu', 
            role: 'client', 
            phone: '+36 70 345 6789',
            created_at: '2024-02-15',
            last_login: '2024-03-13',
            is_active: true,
            bookings: 2
          },
          { 
            id: 4, 
            name: 'Szabó Péter', 
            email: 'szabo.peter@email.hu', 
            role: 'client', 
            phone: '+36 30 456 7890',
            created_at: '2024-02-20',
            last_login: '2024-03-12',
            is_active: false,
            bookings: 1
          },
          { 
            id: 5, 
            name: 'Tóth Eszter', 
            email: 'toth.eszter@email.hu', 
            role: 'client', 
            phone: '+36 20 567 8901',
            created_at: '2024-02-25',
            last_login: '2024-03-10',
            is_active: true,
            bookings: 4
          },
          { 
            id: 6, 
            name: 'Varga Gábor', 
            email: 'varga.gabor@email.hu', 
            role: 'client', 
            phone: '+36 70 678 9012',
            created_at: '2024-03-01',
            last_login: '2024-03-09',
            is_active: true,
            bookings: 0
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Hiba a felhasználók betöltésekor:', error);
      setLoading(false);
    }
  };

  const handleRoleChange = (id, newRole) => {
    if (window.confirm(`Biztosan módosítod a felhasználó jogosultságát "${newRole}"-re?`)) {
      setUsers(users.map(user => 
        user.id === id ? { ...user, role: newRole } : user
      ));
    }
  };

  const handleStatusToggle = (id) => {
    const user = users.find(u => u.id === id);
    const action = user.is_active ? 'letiltani' : 'aktiválni';
    if (window.confirm(`Biztosan ${action} szeretnéd ezt a felhasználót?`)) {
      setUsers(users.map(user => 
        user.id === id ? { ...user, is_active: !user.is_active } : user
      ));
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a felhasználót? Ez a művelet nem visszavonható!')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const newId = Math.max(...users.map(u => u.id)) + 1;
    setUsers([...users, {
      id: newId,
      ...newUser,
      phone: newUser.phone,
      created_at: new Date().toISOString().split('T')[0],
      last_login: null,
      is_active: true,
      bookings: 0
    }]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', password: '', role: 'client', phone: '' });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Soha';
    return new Date(dateString).toLocaleDateString('hu-HU');
  };

  if (loading) {
    return (
      <div className="admin-users">
        <BackButton to="/admin" label="Vissza a vezérlőpultra" />
        <div className="loading-spinner">Felhasználók betöltése...</div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <BackButton to="/admin" label="Vissza a vezérlőpultra" />
      
      <div className="admin-users-header">
        <h2>Felhasználók kezelése</h2>
        <button className="add-button" onClick={() => setShowAddModal(true)}>
          <span className="add-icon">➕</span>
          Új felhasználó
        </button>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Összes felhasználó</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <div className="stat-value">{users.filter(u => u.role === 'client').length}</div>
            <div className="stat-label">Ügyfél</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
            <div className="stat-label">Admin</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{users.filter(u => u.is_active).length}</div>
            <div className="stat-label">Aktív</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-value">{users.filter(u => !u.is_active).length}</div>
            <div className="stat-label">Inaktív</div>
          </div>
        </div>
      </div>

      <div className="users-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Keresés név, email vagy telefonszám alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Minden szerepkör</option>
          <option value="admin">Admin</option>
          <option value="client">Ügyfél</option>
        </select>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Név</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Szerepkör</th>
              <th>Regisztráció</th>
              <th>Utolsó belépés</th>
              <th>Foglalások</th>
              <th>Státusz</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className={!user.is_active ? 'inactive' : ''}>
                <td>#{user.id}</td>
                <td>
                  <div className="user-name">{user.name}</div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`role-select ${user.role === 'admin' ? 'admin-role' : 'client-role'}`}
                  >
                    <option value="client">Ügyfél</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td>{formatDate(user.last_login)}</td>
                <td className="text-center">{user.bookings}</td>
                <td>
                  <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Aktív' : 'Inaktív'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className={`action-btn ${user.is_active ? 'warning' : 'success'}`}
                      onClick={() => handleStatusToggle(user.id)}
                      title={user.is_active ? 'Letiltás' : 'Aktiválás'}
                    >
                      {user.is_active ? '🔒' : '🔓'}
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Törlés"
                    >
                      🗑️
                    </button>
                    <button 
                      className="action-btn email"
                      onClick={() => window.location.href = `mailto:${user.email}`}
                      title="Email küldése"
                    >
                      ✉️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Új felhasználó modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Új felhasználó hozzáadása</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label htmlFor="name">Név *</label>
                <input
                  type="text"
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Jelszó *</label>
                <input
                  type="password"
                  id="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Telefonszám</label>
                <input
                  type="tel"
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Szerepkör</label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="client">Ügyfél</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Mentés</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Mégse</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;