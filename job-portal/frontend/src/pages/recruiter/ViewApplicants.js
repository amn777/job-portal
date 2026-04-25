import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI, jobAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiExternalLink, FiUser } from 'react-icons/fi';

const STATUSES = ['APPLIED','REVIEWING','SHORTLISTED','SELECTED','REJECTED'];
const STATUS_BADGE = { APPLIED:'blue', REVIEWING:'yellow', SHORTLISTED:'purple', SELECTED:'green', REJECTED:'red' };

export default function ViewApplicants() {
  const { jobId } = useParams();
  const navigate  = useNavigate();
  const [job, setJob]       = useState(null);
  const [apps, setApps]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(0);
  const [totalPages, setTotal] = useState(0);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    jobAPI.getById(jobId).then(r => setJob(r.data)).catch(() => {});
    loadApps(0);
  }, [jobId]);

  const loadApps = (p) => {
    setLoading(true);
    applicationAPI.getJobApps(jobId, p, 10)
      .then(r => { setApps(r.data.content); setTotal(r.data.totalPages); setPage(p); })
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  };

  const updateStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      const res = await applicationAPI.updateStatus(appId, status);
      setApps(prev => prev.map(a => a.id === appId ? res.data : a));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  return (
    <div>
      <button onClick={() => navigate('/recruiter')} className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}>
        <FiArrowLeft size={14}/> Back to Dashboard
      </button>

      {job && (
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title">Applicants for: {job.title}</h1>
          <p className="page-subtitle">{job.company} · {job.location} · {apps.length} applicants</p>
        </div>
      )}

      {loading ? <div className="loading-spinner"/> : apps.length === 0 ? (
        <div className="empty-state">
          <div className="icon">👤</div>
          <h3>No applicants yet</h3>
          <p>Share the job posting to attract candidates</p>
        </div>
      ) : (
        <>
          {apps.map(app => (
            <div key={app.id} className="card" style={styles.card}>
              <div style={styles.top}>
                <div style={styles.userInfo}>
                  <div style={styles.avatar}><FiUser size={18} color="var(--primary)"/></div>
                  <div>
                    <p style={styles.name}>{app.userName}</p>
                    <p style={styles.email}>{app.userEmail}</p>
                  </div>
                </div>
                <span className={`badge badge-${STATUS_BADGE[app.status]||'gray'}`}>{app.status}</span>
              </div>

              <div style={styles.meta}>
                <span style={styles.date}>Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                {app.resumeUrl && (
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={styles.resumeLink}>
                    <FiExternalLink size={13}/> View Resume
                  </a>
                )}
              </div>

              {app.coverLetter && (
                <div style={styles.coverLetter}>
                  <p style={styles.clLabel}>Cover Letter</p>
                  <p style={styles.clText}>{app.coverLetter}</p>
                </div>
              )}

              <div style={styles.statusRow}>
                <span style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:500 }}>Update Status:</span>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      className={`btn btn-sm ${app.status === s ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => updateStatus(app.id, s)}
                      disabled={updating === app.id || app.status === s}
                      style={{ fontSize: 12 }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => loadApps(page-1)} disabled={page===0}>← Prev</button>
              {[...Array(totalPages)].map((_,i) => <button key={i} onClick={() => loadApps(i)} className={page===i?'active':''}>{i+1}</button>)}
              <button onClick={() => loadApps(page+1)} disabled={page>=totalPages-1}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  card: { marginBottom: 12 },
  top: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 12 },
  userInfo: { display:'flex', alignItems:'center', gap:12 },
  avatar: { width:40, height:40, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  name: { fontWeight:600, fontSize:15, marginBottom:2 },
  email: { fontSize:13, color:'var(--text-secondary)' },
  meta: { display:'flex', alignItems:'center', gap:16, marginBottom:12 },
  date: { fontSize:13, color:'var(--text-secondary)' },
  resumeLink: { display:'flex', alignItems:'center', gap:4, fontSize:13, color:'var(--primary)', fontWeight:500 },
  coverLetter: { background:'var(--bg)', borderRadius:8, padding:'10px 14px', marginBottom:12 },
  clLabel: { fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:4 },
  clText: { fontSize:13, color:'var(--text)', lineHeight:1.6 },
  statusRow: { display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', paddingTop:12, borderTop:'1px solid var(--border)' },
};
