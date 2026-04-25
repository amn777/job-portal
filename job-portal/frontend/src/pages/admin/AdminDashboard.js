import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { FiUsers, FiBriefcase, FiFileText, FiTrendingUp } from 'react-icons/fi';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"/>;
  if (!stats)  return null;

  const chartData = (stats.monthlyApplications || []).map(m => ({
    month: MONTHS[(m.month || 1) - 1],
    applications: m.count
  }));

  return (
    <div>
      <div className="flex-between mb-24">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Platform overview and analytics</p>
        </div>
        <Link to="/admin/users" className="btn btn-outline"><FiUsers size={15}/> Manage Users</Link>
      </div>

      {/* Stats cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon={<FiUsers size={22} color="#4f46e5"/>} label="Total Users" value={stats.totalUsers} bg="#ede9fe"/>
        <StatCard icon={<FiBriefcase size={22} color="#10b981"/>} label="Total Jobs" value={stats.totalJobs} bg="#d1fae5"/>
        <StatCard icon={<FiFileText size={22} color="#f59e0b"/>} label="Applications" value={stats.totalApplications} bg="#fef3c7"/>
        <StatCard icon={<FiTrendingUp size={22} color="#3b82f6"/>} label="Active Jobs" value={stats.activeJobs} bg="#dbeafe"/>
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>Applications per Month</h2>
        {chartData.length === 0 ? (
          <div className="empty-state" style={{ padding:'40px 0' }}>
            <p>No application data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top:5, right:20, left:0, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--text-secondary)' }}/>
              <YAxis tick={{ fontSize:12, fill:'var(--text-secondary)' }}/>
              <Tooltip
                contentStyle={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, fontSize:13 }}
              />
              <Bar dataKey="applications" fill="#4f46e5" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Quick links */}
      <div className="grid-2">
        <Link to="/admin/users" style={styles.quickCard}>
          <FiUsers size={24} color="#4f46e5"/>
          <div>
            <p style={styles.qTitle}>Manage Users</p>
            <p style={styles.qSub}>View, manage, and delete users</p>
          </div>
        </Link>
        <Link to="/jobs" style={styles.quickCard}>
          <FiBriefcase size={24} color="#10b981"/>
          <div>
            <p style={styles.qTitle}>View All Jobs</p>
            <p style={styles.qSub}>Browse and manage job listings</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }) {
  return (
    <div className="card" style={{ display:'flex', alignItems:'center', gap:16 }}>
      <div style={{ background:bg, borderRadius:12, padding:14, flexShrink:0 }}>{icon}</div>
      <div>
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:2 }}>{label}</p>
        <p style={{ fontSize:28, fontWeight:700 }}>{value ?? '—'}</p>
      </div>
    </div>
  );
}

const styles = {
  quickCard: { display:'flex', alignItems:'center', gap:16, background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:12, padding:20, transition:'box-shadow 0.2s', cursor:'pointer' },
  qTitle: { fontWeight:600, fontSize:15, marginBottom:2 },
  qSub: { fontSize:13, color:'var(--text-secondary)' },
};
