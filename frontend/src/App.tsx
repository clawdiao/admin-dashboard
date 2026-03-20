import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Subscriptions from './pages/Subscriptions';
import Metrics from './pages/Metrics';
import Config from './pages/Config';

function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify token
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? Promise.resolve() : Promise.reject())
        .catch(() => {
          localStorage.removeItem('admin_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div className="p-8">Carregando...</div>;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login onLogin={setToken} />} />
      <Route path="/" element={token ? <><Navbar token={token} onLogout={handleLogout} /><Dashboard token={token} /></> : <Navigate to="/login" />} />
      <Route path="/users" element={token ? <><Navbar token={token} onLogout={handleLogout} /><Users token={token} /></> : <Navigate to="/login" />} />
      <Route path="/subscriptions" element={token ? <><Navbar token={token} onLogout={handleLogout} /><Subscriptions token={token} /></> : <Navigate to="/login" />} />
      <Route path="/metrics" element={token ? <><Navbar token={token} onLogout={handleLogout} /><Metrics token={token} /></> : <Navigate to="/login" />} />
      <Route path="/config" element={token ? <><Navbar token={token} onLogout={handleLogout} /><Config token={token} /></> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
