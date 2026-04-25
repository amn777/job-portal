import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiBriefcase, FiMail, FiLock, FiUser } from 'react-icons/fi';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome, ${user.name}!`);
      if (user.role === 'RECRUITER') navigate('/recruiter');
      else navigate('/jobs');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <FiBriefcase size={32} color="#4f46e5" />
          <h1 style={styles.logoText}>JobPortal</h1>
        </div>
        <p style={styles.sub}>Create your account</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={styles.inputWrap}>
              <FiUser style={styles.icon} size={16}/>
              <input name="name" placeholder="John Doe" value={form.name} onChange={handle} required style={styles.input}/>
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div style={styles.inputWrap}>
              <FiMail style={styles.icon} size={16}/>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required style={styles.input}/>
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={styles.inputWrap}>
              <FiLock style={styles.icon} size={16}/>
              <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handle} required style={styles.input}/>
            </div>
          </div>
          <div className="form-group">
            <label>Register as</label>
            <select name="role" value={form.role} onChange={handle}>
              <option value="USER">Job Seeker</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 20 },
  card: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-md)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  logoText: { fontSize: 24, fontWeight: 700, color: 'var(--primary)' },
  sub: { color: 'var(--text-secondary)', marginBottom: 28, fontSize: 14 },
  inputWrap: { position: 'relative' },
  icon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' },
  input: { paddingLeft: 38 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' },
};
