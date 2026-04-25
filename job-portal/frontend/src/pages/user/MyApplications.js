import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiBriefcase, FiCalendar, FiExternalLink } from 'react-icons/fi';

const STATUS_BADGE = {
  APPLIED: 'blue', REVIEWING: 'yellow', SHORTLISTED: 'purple',
  REJECTED: 'red', SELECTED: 'green'
};

export default function MyApplications() {
  const navigate = useNavigate();
  const [apps, setApps]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(0);
  const [totalPages, setTotal] = useState(0);

  useEffect(() => {
    applicationAPI.getMyApps(page, 10)
      .then(r => { setApps(r.data.content); setTotal(r.data.totalPages); })
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div className="loading-spinner"/>;

  return (
    <div>
      <h1 className="page-title">My Applications</h1>
      <p className="page-subtitle">Track all your job applications</p>

      {apps.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📄</div>
          <h3>No applications yet</h3>
          <p>Start applying to jobs!</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/jobs')}>Browse Jobs</button>
        </div>
      ) : (
        <>
          {apps.map(app => (
            <div key={app.id} className="card" style={styles.card}>
              <div style={styles.top}>
                <div>
                  <h3 style={styles.title}>{app.jobTitle}</h3>
                  <p style={styles.company}>{app.company}</p>
                </div>
                <span className={`badge badge-${STATUS_BADGE[app.status] || 'gray'}`}>{app.status}</span>
              </div>
              <div style={styles.meta}>
                <span style={styles.metaItem}><FiBriefcase size={13}/> {app.company}</span>
                <span style={styles.metaItem}><FiCalendar size={13}/> Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
              </div>
              {app.resumeUrl && (
                <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={styles.resumeLink} onClick={e => e.stopPropagation()}>
                  <FiExternalLink size={13}/> View Resume
                </a>
              )}
            </div>
          ))}

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => p-1)} disabled={page===0}>← Prev</button>
              {[...Array(totalPages)].map((_,i) => (
                <button key={i} onClick={() => setPage(i)} className={page===i?'active':''}>{i+1}</button>
              ))}
              <button onClick={() => setPage(p => p+1)} disabled={page>=totalPages-1}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  card: { marginBottom: 12, transition: 'box-shadow 0.2s' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  title: { fontSize: 16, fontWeight: 600, marginBottom: 2 },
  company: { fontSize: 14, color: 'var(--primary)', fontWeight: 500 },
  meta: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' },
  resumeLink: { display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 13, color: 'var(--primary)' },
};
