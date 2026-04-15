import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import './AdminUsers.css';

const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Hiba a felhasználók betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (user) => {
    try {
      const newStatus = user.is_active === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/api/users/${user.id}`, 
        { ...user, is_active: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Frissítjük a helyi állapotot
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
    } catch (error) {
      alert('Hiba a státusz módosításakor.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-spinner">Betöltés...</div>;

  return (
    <div className="admin-users">
      <BackButton to="/admin" label="Vissza a vezérlőpultra" />
      
      <div className="admin-users-header">
        <h2>Felhasználók kezelése</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Keresés név vagy email alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Név</th>
              <th>Email</th>
              <th className="text-center">Telefonszám</th>
              <th className="text-center">Szerepkör</th>
              <th className="text-center">Regisztráció</th>
              <th className="text-center">Státusz</th>
              <th className="text-center">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="text-center">{user.phone_number || '-'}</td>
                  <td className="text-center">
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? 'Admin' : 'Felhasználó'}
                    </span>
                  </td>
                  <td className="text-center">{new Date(user.created_at).toLocaleDateString('hu-HU')}</td>
                  <td className="text-center">
                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                      {user.is_active ? 'Aktív' : 'Inaktív'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className={`action-btn ${user.is_active ? 'deactivate' : 'activate'}`}
                        onClick={() => handleStatusToggle(user)}
                      >
                        {user.is_active ? 'Letiltás' : 'Aktiválás'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="no-data">Nincs találat</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;