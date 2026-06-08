import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { title: '', description: '', priority: 'MEDIUM', status: 'TODO' };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks]       = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await taskApi.getAll();
      setTasks(res.data.data || []);
    } catch { setError('Failed to load tasks.'); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      if (editingId) {
        await taskApi.update(editingId, form);
        setMessage('Task updated!');
      } else {
        await taskApi.create(form);
        setMessage('Task created!');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setForm({ title: task.title, description: task.description || '',
              priority: task.priority, status: task.status });
    setEditingId(task.id);
    setShowForm(true);
    setMessage(''); setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskApi.delete(id);
      setMessage('Task deleted.');
      fetchTasks();
    } catch { setError('Failed to delete task.'); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(''); setMessage('');
  };

  return (
    <>
      <div className="navbar">
        <h2>📋 Task Manager</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14 }}>
            👤 {user?.username}
            <span style={{ marginLeft: 8, background: 'rgba(255,255,255,0.2)',
              padding: '2px 8px', borderRadius: 999, fontSize: 11 }}>
              {user?.role}
            </span>
          </span>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.15)',
            color: 'white' }} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="container">
        {message && <div className="alert alert-success">{message}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        {/* New Task Button */}
        {!showForm && (
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setMessage(''); setError(''); }}>
            + New Task
          </button>
        )}

        {/* Task Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20 }}>{editingId ? 'Edit Task' : 'Create New Task'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input className="input" name="title" value={form.title}
                  onChange={handleChange} placeholder="Task title" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" name="description" value={form.description}
                  onChange={handleChange} placeholder="Optional description" rows={3} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="input" name="priority" value={form.priority} onChange={handleChange}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                {editingId && (
                  <div className="form-group">
                    <label>Status</label>
                    <select className="input" name="status" value={form.status} onChange={handleChange}>
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Task' : 'Create Task'}
                </button>
                <button className="btn" type="button" onClick={cancelForm}
                  style={{ background: '#E5E7EB' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Your Tasks ({tasks.length})</h3>
          {tasks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: '#9CA3AF', padding: 40 }}>
              No tasks yet. Create your first task!
            </div>
          ) : (
            <div className="task-grid">
              {tasks.map(task => (
                <div key={task.id} className="task-card">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                      <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                    </div>
                    <h4 style={{ marginBottom: 4 }}>{task.title}</h4>
                    {task.description && (
                      <p style={{ fontSize: 13, color: '#6B7280' }}>{task.description}</p>
                    )}
                    <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="task-actions">
                    <button className="btn btn-sm" style={{ background: '#E5E7EB' }}
                      onClick={() => handleEdit(task)}>Edit</button>
                    <button className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(task.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
