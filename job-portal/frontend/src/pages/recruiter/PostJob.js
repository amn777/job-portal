import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiBriefcase } from 'react-icons/fi';

const JOB_TYPES = ['FULL_TIME','PART_TIME','REMOTE','CONTRACT'];

export default function PostJob() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get('edit');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title:'', company:'', location:'', salary:'',
    description:'', requirements:'', jobType:'FULL_TIME'
  });

  useEffect(() => {
    if (editId) {
      jobAPI.getById(editId).then(r => {
        const j = r.data;
        setForm({ title:j.title, company:j.company, location:j.location,
          salary:j.salary||'', description:j.description||'',
          requirements:j.requirements||'', jobType:j.jobType||'FULL_TIME' });
      });
    }
  }, [editId]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await jobAPI.update(editId, form);
        toast.success('Job updated successfully!');
      } else {
        await jobAPI.create(form);
        toast.success('Job posted successfully! 🎉');
      }
      navigate('/recruiter');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save job');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 760, margin:'0 auto' }}>
      <button onClick={() => navigate('/recruiter')} className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}>
        <FiArrowLeft size={14}/> Back to Dashboard
      </button>

      <div className="card">
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
          <FiBriefcase size={22} color="var(--primary)"/>
          <h1 style={{ fontSize:20, fontWeight:700 }}>{editId ? 'Edit Job' : 'Post a New Job'}</h1>
        </div>

        <form onSubmit={submit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Job Title *</label>
              <input name="title" placeholder="e.g. Senior React Developer" value={form.title} onChange={handle} required/>
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input name="company" placeholder="e.g. Tech Corp" value={form.company} onChange={handle} required/>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Location *</label>
              <input name="location" placeholder="e.g. Bangalore / Remote" value={form.location} onChange={handle} required/>
            </div>
            <div className="form-group">
              <label>Salary Range</label>
              <input name="salary" placeholder="e.g. ₹10-15 LPA" value={form.salary} onChange={handle}/>
            </div>
          </div>

          <div className="form-group">
            <label>Job Type</label>
            <select name="jobType" value={form.jobType} onChange={handle}>
              {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea name="description" placeholder="Describe the role, responsibilities, and what you're looking for..." value={form.description} onChange={handle} rows={6} required/>
          </div>

          <div className="form-group">
            <label>Requirements</label>
            <textarea name="requirements" placeholder="List required skills, experience, qualifications..." value={form.requirements} onChange={handle} rows={5}/>
          </div>

          <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/recruiter')}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : editId ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
