import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiBriefcase, FiMail, FiLock } from 'react-icons/fi';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'ADMIN')     navigate('/admin');
      else if (user.role === 'RECRUITER') navigate('/recruiter');
      else navigate('/jobs');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <FiBriefcase size={32} color="#4f46e5" />
          <h1 style={styles.logoText}>JobPortal</h1>
        </div>
        <p style={styles.sub}>Sign in to your account</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <div style={styles.inputWrap}>
              <FiMail style={styles.inputIcon} size={16}/>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={styles.inputWrap}>
              <FiLock style={styles.inputIcon} size={16}/>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handle}
                required
                style={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            Register here
          </Link>
        </p>

        {/* Demo credentials */}
        <div style={styles.demo}>
          <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Demo Credentials</p>
          <DemoCard label="Admin"     email="admin@demo.com"     pass="admin123" />
          <DemoCard label="Recruiter" email="recruiter@demo.com" pass="recruiter123" />
          <DemoCard label="User"      email="user@demo.com"      pass="user123" />
        </div>
      </div>
    </div>
  );
}

function DemoCard({ label, email, pass }) {
  return (
    <div style={{ fontSize: 12, marginBottom: 4, color: 'var(--text-secondary)' }}>
      <strong>{label}:</strong> {email} / {pass}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: 20,
  },
  card: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 420,
    boxShadow: 'var(--shadow-md)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  logoText: { fontSize: 24, fontWeight: 700, color: 'var(--primary)' },
  sub: { color: 'var(--text-secondary)', marginBottom: 28, fontSize: 14 },
  inputWrap: { position: 'relative' },
  inputIcon: {
    position: 'absolute', left: 12, top: '50%',
    transform: 'translateY(-50%)', color: 'var(--text-secondary)',
  },
  input: { paddingLeft: 38 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' },
  demo: {
    marginTop: 24,
    padding: 14,
    background: 'var(--bg)',
    borderRadius: 8,
    border: '1px solid var(--border)',
  },
};
