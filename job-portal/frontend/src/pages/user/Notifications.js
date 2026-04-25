import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiBell, FiCheckCircle } from 'react-icons/fi';

export default function Notifications() {
  const [notes, setNotes]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationAPI.getAll()
      .then(r => setNotes(r.data))
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false));
  }, []);

  const markAll = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotes(prev => prev.map(n => ({ ...n, readStatus: true })));
      toast.success('All marked as read');
    } catch { toast.error('Failed'); }
  };

  const unread = notes.filter(n => !n.readStatus).length;

  if (loading) return <div className="loading-spinner"/>;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="flex-between mb-24">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unread > 0 ? `${unread} unread` : 'All caught up!'}</p>
        </div>
        {unread > 0 && (
          <button className="btn btn-outline btn-sm" onClick={markAll}>
            <FiCheckCircle size={14}/> Mark all read
          </button>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔔</div>
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow:'hidden' }}>
          {notes.map(n => (
            <div key={n.id} style={{ ...styles.row, background: n.readStatus ? 'var(--card-bg)' : 'var(--primary-light)' }}>
              <div style={{ ...styles.dot, background: n.readStatus ? 'var(--border)' : 'var(--primary)' }}/>
              <div style={{ flex: 1 }}>
                <p style={styles.message}>{n.message}</p>
                <p style={styles.time}>{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.readStatus && <FiBell size={16} color="var(--primary)"/>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  row: { display:'flex', alignItems:'center', gap:14, padding:'14px 20px', borderBottom:'1px solid var(--border)', transition:'background 0.2s' },
  dot: { width: 8, height: 8, borderRadius:'50%', flexShrink:0 },
  message: { fontSize: 14, fontWeight: 500, marginBottom: 3 },
  time: { fontSize: 12, color:'var(--text-secondary)' },
};
