import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate(from);
    } else {
      setError(result.message || 'Hibás email vagy jelszó');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-page">
      <Header />
      
      <main className="login-main">
        <div className="container">
          <div className="login-container">
            <div className="login-header">
              <h1>Bejelentkezés</h1>
              <p>Üdv újra! Jelentkezz be a foglaláshoz.</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email cím</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="pelda@email.hu"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Jelszó</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
              </button>
            </form>

            <div className="login-footer">
              <p>Még nincs fiókod? <Link to="/register">Regisztráció</Link></p>
              <p className="demo-admin">Demo admin: admin@gasztrokalandok.hu / admin123</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;