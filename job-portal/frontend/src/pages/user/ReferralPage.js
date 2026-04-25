import React, { useState, useEffect } from 'react';
import { referralAPI, jobAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiUsers, FiSend } from 'react-icons/fi';

const STATUS_BADGE = { PENDING:'yellow', APPLIED:'blue', SHORTLISTED:'purple', HIRED:'green', REJECTED:'red' };

export default function ReferralPage() {
  const [referrals, setReferrals] = useState([]);
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState({ candidateName:'', candidateEmail:'', jobId:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      referralAPI.getMyReferrals(),
      jobAPI.getAll(0, 100)
    ]).then(([r, j]) => {
      setReferrals(r.data);
      setJobs(j.data.content || []);
    }).catch(() => toast.error('Failed to load'))
    .finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await referralAPI.create({ ...form, jobId: Number(form.jobId) });
      setReferrals(prev => [res.data, ...prev]);
      setForm({ candidateName:'', candidateEmail:'', jobId:'' });
      toast.success('Referral sent! Candidate will receive an email 📧');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send referral');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-spinner"/>;

  return (
    <div>
      <h1 className="page-title">Refer a Candidate</h1>
      <p className="page-subtitle">Help someone land a job and climb the leaderboard</p>

      <div style={styles.grid}>
        {/* Refer form */}
        <div className="card">
          <h2 style={styles.sectionTitle}><FiSend size={18}/> Send a Referral</h2>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Candidate Name</label>
              <input placeholder="John Doe" value={form.candidateName}
                onChange={e => setForm({...form, candidateName: e.target.value})} required/>
            </div>
            <div className="form-group">
              <label>Candidate Email</label>
              <input type="email" placeholder="candidate@example.com" value={form.candidateEmail}
                onChange={e => setForm({...form, candidateEmail: e.target.value})} required/>
            </div>
            <div className="form-group">
              <label>Job Position</label>
              <select value={form.jobId} onChange={e => setForm({...form, jobId: e.target.value})} required>
                <option value="">Select a job...</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title} — {j.company}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={submitting}>
              <FiSend size={15}/> {submitting ? 'Sending...' : 'Send Referral'}
            </button>
          </form>
        </div>

        {/* My referrals */}
        <div>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 16 }}><FiUsers size={18}/> My Referrals ({referrals.length})</h2>
          {referrals.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="icon">👥</div>
              <h3>No referrals yet</h3>
              <p>Start referring candidates to earn leaderboard points!</p>
            </div>
          ) : referrals.map(r => (
            <div key={r.id} className="card" style={styles.referralCard}>
              <div style={styles.refTop}>
                <div>
                  <p style={styles.refName}>{r.candidateName}</p>
                  <p style={styles.refEmail}>{r.candidateEmail}</p>
                </div>
                <span className={`badge badge-${STATUS_BADGE[r.status] || 'gray'}`}>{r.status}</span>
              </div>
              <p style={styles.refJob}>📋 {r.jobTitle} at {r.company}</p>
              <p style={styles.refDate}>Referred on {new Date(r.referredAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: '400px 1fr', gap: 24, alignItems: 'start' },
  sectionTitle: { fontSize: 17, fontWeight: 600, marginBottom: 20, display:'flex', alignItems:'center', gap:8 },
  referralCard: { marginBottom: 10, padding: 16 },
  refTop: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 8 },
  refName: { fontWeight: 600, fontSize: 15 },
  refEmail: { fontSize: 13, color:'var(--text-secondary)' },
  refJob: { fontSize: 13, color:'var(--text-secondary)', marginBottom: 4 },
  refDate: { fontSize: 12, color:'var(--text-secondary)' },
};
