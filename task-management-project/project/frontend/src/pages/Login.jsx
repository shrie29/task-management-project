import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.login(form);
      login(response);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h2 style={{ marginBottom: 8, color: '#4F46E5' }}>Welcome Back 👋</h2>
        <p style={{ marginBottom: 24, color: '#6B7280', fontSize: 14 }}>
          Sign in to your Task Manager
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input className="input" name="username" value={form.username}
              onChange={handleChange} placeholder="Enter username" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="Enter password" required />
          </div>
          <button className="btn btn-primary" type="submit"
            style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4F46E5' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
