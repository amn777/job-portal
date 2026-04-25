import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiUsers, FiEdit2, FiTrash2, FiBriefcase } from 'react-icons/fi';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(0);
  const [totalPages, setTotal] = useState(0);

  const load = (p = 0) => {
    setLoading(true);
    jobAPI.getMyJobs(p, 10)
      .then(r => { setJobs(r.data.content); setTotal(r.data.totalPages); setPage(p); })
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await jobAPI.delete(id);
      toast.success('Job deleted');
      load(page);
    } catch { toast.error('Failed to delete'); }
  };

  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);

  return (
    <div>
      <div className="flex-between mb-24">
        <div>
          <h1 className="page-title">Recruiter Dashboard</h1>
          <p className="page-subtitle">Manage your job postings</p>
        </div>
        <Link to="/recruiter/post-job" className="btn btn-primary">
          <FiPlus size={16}/> Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        <StatCard icon={<FiBriefcase size={22} color="#4f46e5"/>} label="Total Jobs" value={jobs.length} color="#ede9fe"/>
        <StatCard icon={<FiUsers size={22} color="#10b981"/>} label="Total Applicants" value={totalApps} color="#d1fae5"/>
        <StatCard icon={<FiBriefcase size={22} color="#f59e0b"/>} label="Active Jobs" value={jobs.filter(j => j.active).length} color="#fef3c7"/>
      </div>

      {/* Jobs table */}
      {loading ? <div className="loading-spinner"/> : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No jobs posted yet</h3>
          <p>Post your first job to start receiving applications</p>
          <Link to="/recruiter/post-job" className="btn btn-primary" style={{ marginTop: 16 }}>Post a Job</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow:'hidden' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Job Title</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Applicants</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} style={styles.tr}>
                  <td style={styles.td}>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{job.title}</p>
                    <p style={{ fontSize: 12, color:'var(--text-secondary)' }}>{job.company}</p>
                  </td>
                  <td style={styles.td}>{job.location}</td>
                  <td style={styles.td}>{job.jobType?.replace('_',' ') || '—'}</td>
                  <td style={styles.td}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/recruiter/applicants/${job.id}`)}>
                      <FiUsers size={13}/> {job.applicationCount || 0}
                    </button>
                  </td>
                  <td style={styles.td}>
                    <span className={`badge badge-${job.active ? 'green' : 'gray'}`}>{job.active ? 'Active' : 'Closed'}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/recruiter/post-job?edit=${job.id}`)}>
                        <FiEdit2 size={13}/>
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteJob(job.id)}>
                        <FiTrash2 size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="pagination" style={{ padding:'12px 0' }}>
              <button onClick={() => load(page-1)} disabled={page===0}>← Prev</button>
              {[...Array(totalPages)].map((_,i) => <button key={i} onClick={() => load(i)} className={page===i?'active':''}>{i+1}</button>)}
              <button onClick={() => load(page+1)} disabled={page>=totalPages-1}>Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="card" style={{ display:'flex', alignItems:'center', gap:16 }}>
      <div style={{ background: color, borderRadius: 12, padding: 14 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 13, color:'var(--text-secondary)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 700 }}>{value}</p>
      </div>
    </div>
  );
}

const styles = {
  table: { width:'100%', borderCollapse:'collapse' },
  thead: { background:'var(--bg)' },
  th: { padding:'12px 16px', textAlign:'left', fontSize:13, fontWeight:600, color:'var(--text-secondary)', borderBottom:'1px solid var(--border)' },
  tr: { borderBottom:'1px solid var(--border)', transition:'background 0.15s' },
  td: { padding:'14px 16px', fontSize:14, verticalAlign:'middle' },
};
