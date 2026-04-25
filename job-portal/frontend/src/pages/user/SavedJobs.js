import React, { useState, useEffect } from 'react';
import { savedJobAPI } from '../../services/api';
import JobCard from '../../components/jobs/JobCard';
import toast from 'react-hot-toast';

export default function SavedJobs() {
  const [saved, setSaved]     = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    savedJobAPI.getMySaved()
      .then(r => {
        setSaved(r.data);
        setSavedIds(new Set(r.data.map(s => s.job?.id || s.id)));
      })
      .catch(() => toast.error('Failed to load saved jobs'))
      .finally(() => setLoading(false));
  }, []);

  const unsave = async (jobId) => {
    try {
      await savedJobAPI.unsave(jobId);
      setSaved(prev => prev.filter(s => (s.job?.id || s.id) !== jobId));
      setSavedIds(prev => { const n = new Set(prev); n.delete(jobId); return n; });
      toast.success('Removed from saved');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading-spinner"/>;

  return (
    <div>
      <h1 className="page-title">Saved Jobs</h1>
      <p className="page-subtitle">{saved.length} saved {saved.length === 1 ? 'job' : 'jobs'}</p>

      {saved.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔖</div>
          <h3>No saved jobs</h3>
          <p>Save jobs you're interested in to find them easily later</p>
        </div>
      ) : (
        saved.map(s => {
          const job = s.job || s;
          return <JobCard key={job.id} job={job} saved={savedIds.has(job.id)} onSave={(id) => unsave(id)} />;
        })
      )}
    </div>
  );
}
