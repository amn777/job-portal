import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiTrash2, FiUser, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ROLE_BADGE = { USER:'blue', RECRUITER:'purple', ADMIN:'red' };

export default function ManageUsers() {
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.getAllUsers()
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-spinner"/>;

  return (
    <div>
      <button onClick={() => navigate('/admin')} className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}>
        <FiArrowLeft size={14}/> Back to Dashboard
      </button>

      <div className="flex-between mb-24">
        <div>
          <h1 className="page-title">Manage Users</h1>
          <p className="page-subtitle">{users.length} total users</p>
        </div>
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 280 }}
        />
      </div>

      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={styles.avatar}><FiUser size={15} color="var(--primary)"/></div>
                    <span style={{ fontWeight:500 }}>{u.name}</span>
                    {u.id === me?.userId && <span style={styles.youBadge}>You</span>}
                  </div>
                </td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <span className={`badge badge-${ROLE_BADGE[u.role]||'gray'}`}>{u.role}</span>
                </td>
                <td style={styles.td}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                </td>
                <td style={styles.td}>
                  {u.id !== me?.userId && u.role !== 'ADMIN' ? (
                    <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id, u.name)}>
                      <FiTrash2 size={13}/> Delete
                    </button>
                  ) : (
                    <span style={{ fontSize:12, color:'var(--text-secondary)' }}>Protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state" style={{ padding:'40px 0' }}>
            <p>No users found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  table: { width:'100%', borderCollapse:'collapse' },
  thead: { background:'var(--bg)' },
  th: { padding:'12px 16px', textAlign:'left', fontSize:13, fontWeight:600, color:'var(--text-secondary)', borderBottom:'1px solid var(--border)' },
  tr: { borderBottom:'1px solid var(--border)' },
  td: { padding:'14px 16px', fontSize:14, verticalAlign:'middle' },
  avatar: { width:32, height:32, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  youBadge: { fontSize:11, background:'var(--primary-light)', color:'var(--primary)', padding:'2px 8px', borderRadius:10, fontWeight:600 },
};
