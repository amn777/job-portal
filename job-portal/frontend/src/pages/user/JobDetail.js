import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI, savedJobAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMapPin, FiDollarSign, FiBriefcase, FiCalendar, FiArrowLeft, FiBookmark, FiSend } from 'react-icons/fi';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isUser } = useAuth();
  const [job, setJob]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [form, setForm]     = useState({ resumeUrl: '', coverLetter: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    jobAPI.getById(id).then(r => { setJob(r.data); setLoading(false); }).catch(() => navigate('/jobs'));
    if (isUser()) {
      savedJobAPI.getMySaved().then(r => {
        setSaved(r.data.some(s => (s.job?.id || s.id) === Number(id)));
      }).catch(() => {});
    }
  }, [id, isUser, navigate]);

  const apply = async (e) => {
    e.preventDefault();
    if (!form.resumeUrl) { toast.error('Resume URL is required'); return; }
    setApplying(true);
    try {
      await applicationAPI.apply({ jobId: Number(id), ...form });
      toast.success('Application submitted! 🎉');
      setApplied(true);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Application failed');
    } finally { setApplying(false); }
  };

  const toggleSave = async () => {
    if (!isUser()) { toast.error('Login as User to save jobs'); return; }
    try {
      if (saved) { await savedJobAPI.unsave(id); setSaved(false); toast.success('Removed from saved'); }
      else       { await savedJobAPI.save(id);   setSaved(true);  toast.success('Job saved!'); }
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading-spinner"/>;
  if (!job)    return null;

  const posted = new Date(job.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });

  return (
    <div style={styles.page}>
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}>
        <FiArrowLeft size={14}/> Back to Jobs
      </button>

      <div style={styles.grid}>
        {/* Left: Job details */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={styles.header}>
              <div>
                <h1 style={styles.title}>{job.title}</h1>
                <p style={styles.company}>{job.company}</p>
              </div>
              {isUser() && (
                <button onClick={toggleSave} style={styles.saveBtn} title={saved ? 'Unsave' : 'Save'}>
                  <FiBookmark size={22} fill={saved ? '#4f46e5' : 'none'} color={saved ? '#4f46e5' : 'var(--text-secondary)'}/>
                </button>
              )}
            </div>

            <div style={styles.metaRow}>
              <MetaItem icon={<FiMapPin size={14}/>} text={job.location}/>
              {job.salary && <MetaItem icon={<FiDollarSign size={14}/>} text={job.salary}/>}
              {job.jobType && <MetaItem icon={<FiBriefcase size={14}/>} text={job.jobType.replace('_',' ')}/>}
              <MetaItem icon={<FiCalendar size={14}/>} text={`Posted ${posted}`}/>
            </div>

            {job.applicationCount > 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
                {job.applicationCount} people applied
              </p>
            )}
          </div>

          {job.description && (
            <div className="card" style={{ marginBottom: 16 }}>
              <h2 style={styles.sectionTitle}>Job Description</h2>
              <p style={styles.body}>{job.description}</p>
            </div>
          )}

          {job.requirements && (
            <div className="card">
              <h2 style={styles.sectionTitle}>Requirements</h2>
              <p style={styles.body}>{job.requirements}</p>
            </div>
          )}
        </div>

        {/* Right: Apply panel */}
        <div>
          <div className="card">
            {!user ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>Login to apply for this job</p>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/login')}>
                  Login to Apply
                </button>
              </div>
            ) : applied ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                <h3 style={{ marginBottom: 4 }}>Application Submitted!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>We'll notify you of updates</p>
              </div>
            ) : isUser() ? (
              <>
                {!showForm ? (
                  <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowForm(true)}>
                    <FiSend size={16}/> Apply Now
                  </button>
                ) : (
                  <form onSubmit={apply}>
                    <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>Apply for {job.title}</h3>
                    <div className="form-group">
                      <label>Resume URL *</label>
                      <input placeholder="https://drive.google.com/your-resume" value={form.resumeUrl} onChange={e => setForm({...form, resumeUrl: e.target.value})} required/>
                      <small style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Google Drive, Dropbox, or any public link</small>
                    </div>
                    <div className="form-group">
                      <label>Cover Letter (optional)</label>
                      <textarea placeholder="Why are you a great fit?" value={form.coverLetter} onChange={e => setForm({...form, coverLetter: e.target.value})} rows={4}/>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={applying}>
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center' }}>
                Only job seekers can apply
              </p>
            )}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>About this Role</h3>
            <InfoRow label="Company" value={job.company}/>
            <InfoRow label="Location" value={job.location}/>
            {job.jobType && <InfoRow label="Type" value={job.jobType.replace('_',' ')}/>}
            {job.salary && <InfoRow label="Salary" value={job.salary}/>}
            <InfoRow label="Posted by" value={job.createdByName || 'Recruiter'}/>
          </div>
        </div>
      </div>
    </div>
  );
}

const MetaItem = ({ icon, text }) => (
  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'var(--text-secondary)' }}>
    {icon} {text}
  </span>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:14 }}>
    <span style={{ color:'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontWeight:500 }}>{value}</span>
  </div>
);

const styles = {
  page: {},
  grid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  company: { fontSize: 16, color: 'var(--primary)', fontWeight: 500 },
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 600, marginBottom: 12 },
  body: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' },
  saveBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4 },
};
