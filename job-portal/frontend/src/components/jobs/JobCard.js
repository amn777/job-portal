import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiBriefcase, FiClock, FiBookmark } from 'react-icons/fi';

const statusBadge = { FULL_TIME:'blue', PART_TIME:'yellow', REMOTE:'green', CONTRACT:'purple' };

export default function JobCard({ job, onSave, saved }) {
  const navigate = useNavigate();
  const age = Math.floor((Date.now() - new Date(job.createdAt)) / 86400000);

  return (
    <div style={styles.card} onClick={() => navigate(`/jobs/${job.id}`)}>
      <div style={styles.top}>
        <div>
          <h3 style={styles.title}>{job.title}</h3>
          <p style={styles.company}>{job.company}</p>
        </div>
        {onSave && (
          <button
            style={{ ...styles.saveBtn, color: saved ? '#4f46e5' : 'var(--text-secondary)' }}
            onClick={(e) => { e.stopPropagation(); onSave(job.id, saved); }}
            title={saved ? 'Unsave' : 'Save job'}
          >
            <FiBookmark size={18} fill={saved ? '#4f46e5' : 'none'} />
          </button>
        )}
      </div>

      <div style={styles.meta}>
        <span style={styles.metaItem}><FiMapPin size={13}/> {job.location}</span>
        {job.salary && <span style={styles.metaItem}><FiDollarSign size={13}/> {job.salary}</span>}
        {job.jobType && (
          <span className={`badge badge-${statusBadge[job.jobType] || 'gray'}`}>
            <FiBriefcase size={11} style={{ marginRight: 4 }}/>{job.jobType.replace('_',' ')}
          </span>
        )}
      </div>

      {job.description && (
        <p style={styles.desc}>
          {job.description.length > 120 ? job.description.slice(0, 120) + '...' : job.description}
        </p>
      )}

      <div style={styles.footer}>
        <span style={styles.age}><FiClock size={12}/> {age === 0 ? 'Today' : `${age}d ago`}</span>
        {job.applicationCount > 0 && (
          <span style={styles.apps}>{job.applicationCount} applicants</span>
        )}
        <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}>
          View Details
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'all 0.2s', marginBottom: 12 },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  title: { fontSize: 16, fontWeight: 600, marginBottom: 2, color: 'var(--text)' },
  company: { fontSize: 14, color: 'var(--primary)', fontWeight: 500 },
  meta: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 },
  metaItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' },
  desc: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  age: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' },
  apps: { fontSize: 12, color: 'var(--text-secondary)' },
  saveBtn: { background: 'none', border: 'none', padding: 4, cursor: 'pointer', transition: 'color 0.2s' },
};
