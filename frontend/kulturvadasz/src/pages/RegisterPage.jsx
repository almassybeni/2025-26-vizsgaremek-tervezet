import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('A jelszavak nem egyeznek');
      return;
    }

    if (formData.password.length < 6) {
      setError('A jelszónak legalább 6 karakter hosszúnak kell lennie');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone_number
    });
    
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message || 'Hiba a regisztráció során');
    }
    
    setLoading(false);
  };

  return (
    <div className="register-page">
      <Header />
      
      <main className="register-main">
        <div className="container">
          <div className="register-container">
            <div className="register-header">
              <h1>Regisztráció</h1>
              <p>Csatlakozz a GasztroKalandok közösségéhez!</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="name">Teljes név</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Pl. Nagy János"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email cím</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="pelda@email.hu"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone_number">Telefonszám</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+36 30 123 4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Jelszó</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirm">Jelszó megerősítése</label>
                <input
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                className="register-button"
                disabled={loading}
              >
                {loading ? 'Regisztráció...' : 'Regisztráció'}
              </button>
            </form>

            <div className="register-footer">
              <p>Már van fiókod? <Link to="/login">Bejelentkezés</Link></p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;