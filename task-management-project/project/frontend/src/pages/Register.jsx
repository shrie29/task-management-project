import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
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
      const response = await authApi.register(form);
      login(response);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      const fieldErrors = err.response?.data?.data;
      if (fieldErrors) {
        setError(Object.values(fieldErrors).join(', '));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h2 style={{ marginBottom: 8, color: '#4F46E5' }}>Create Account</h2>
        <p style={{ marginBottom: 24, color: '#6B7280', fontSize: 14 }}>
          Join Task Manager today
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input className="input" name="username" value={form.username}
              onChange={handleChange} placeholder="Choose a username" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="input" type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="Enter email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="Min 6 characters" required />
          </div>
          <button className="btn btn-primary" type="submit"
            style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' }}>
          Already have an account? <Link to="/login" style={{ color: '#4F46E5' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
