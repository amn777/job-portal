import React, { useState, useEffect, useCallback } from 'react';
import { jobAPI, savedJobAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/jobs/JobCard';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT'];

export default function JobList() {
  const { isUser } = useAuth();
  const [jobs, setJobs]         = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(0);
  const [totalPages, setTotal]  = useState(0);
  const [filters, setFilters]   = useState({ keyword: '', location: '', jobType: '' });
  const [applied, setApplied]   = useState({ keyword: '', location: '', jobType: '' });

  const loadJobs = useCallback(async (f, p) => {
    setLoading(true);
    try {
      const res = await jobAPI.search({ ...f, page: p, size: 10 });
      setJobs(res.data.content);
      setTotal(res.data.totalPages);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadJobs(applied, page); }, [applied, page, loadJobs]);

  useEffect(() => {
    if (isUser()) {
      savedJobAPI.getMySaved().then(res => {
        setSavedIds(new Set(res.data.map(s => s.job?.id || s.id)));
      }).catch(() => {});
    }
  }, [isUser]);

  const search = (e) => { e.preventDefault(); setPage(0); setApplied({ ...filters }); };
  const clear  = () => { const empty = { keyword:'', location:'', jobType:'' }; setFilters(empty); setApplied(empty); setPage(0); };

  const toggleSave = async (jobId, isSaved) => {
    if (!isUser()) { toast.error('Login as User to save jobs'); return; }
    try {
      if (isSaved) { await savedJobAPI.unsave(jobId); setSavedIds(p => { const n = new Set(p); n.delete(jobId); return n; }); toast.success('Removed from saved'); }
      else         { await savedJobAPI.save(jobId);   setSavedIds(p => new Set([...p, jobId])); toast.success('Job saved!'); }
    } catch { toast.error('Failed to update saved jobs'); }
  };

  const hasFilters = applied.keyword || applied.location || applied.jobType;

  return (
    <div>
      <div className="flex-between mb-24">
        <div>
          <h1 className="page-title">Browse Jobs</h1>
          <p className="page-subtitle">Find your perfect opportunity</p>
        </div>
      </div>

      {/* Search & Filter */}
      <form onSubmit={search} style={styles.filterBox}>
        <div style={styles.filterRow}>
          <div style={{ flex: 2, position: 'relative' }}>
            <FiSearch style={styles.searchIcon} size={16}/>
            <input
              placeholder="Search job title, company, or keyword..."
              value={filters.keyword}
              onChange={e => setFilters({ ...filters, keyword: e.target.value })}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              placeholder="Location"
              value={filters.location}
              onChange={e => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          <select value={filters.jobType} onChange={e => setFilters({ ...filters, jobType: e.target.value })} style={{ flex: 1 }}>
            <option value="">All Types</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            <FiFilter size={15}/> Search
          </button>
          {hasFilters && (
            <button type="button" onClick={clear} className="btn btn-outline" style={{ flexShrink: 0 }}>
              <FiX size={15}/> Clear
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="loading-spinner"/>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
            Showing {jobs.length} jobs {hasFilters && `for "${applied.keyword || applied.location || applied.jobType}"`}
          </p>
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              saved={savedIds.has(job.id)}
              onSave={isUser() ? toggleSave : null}
            />
          ))}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i)} className={page === i ? 'active' : ''}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  filterBox: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 24, boxShadow: 'var(--shadow)' },
  filterRow: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' },
};
