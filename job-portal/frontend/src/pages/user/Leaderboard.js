import React, { useState, useEffect } from 'react';
import { referralAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiAward } from 'react-icons/fi';

const MEDALS = ['🥇','🥈','🥉'];

export default function Leaderboard() {
  const { user } = useAuth();
  const [board, setBoard]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    referralAPI.getLeaderboard()
      .then(r => setBoard(r.data))
      .catch(() => toast.error('Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"/>;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ textAlign:'center', marginBottom: 32 }}>
        <FiAward size={40} color="#f59e0b" style={{ marginBottom: 8 }}/>
        <h1 className="page-title">Referral Leaderboard</h1>
        <p className="page-subtitle">Top referrers this month — refer more to climb the ranks!</p>
      </div>

      {board.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🏆</div>
          <h3>No referrals yet</h3>
          <p>Be the first to refer a candidate!</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow:'hidden' }}>
          {board.map((entry, i) => {
            const isMe = user?.email === entry.email;
            return (
              <div key={entry.userId} style={{ ...styles.row, background: isMe ? 'var(--primary-light)' : i%2===0 ? 'var(--card-bg)' : 'var(--bg)' }}>
                <span style={styles.rank}>
                  {i < 3 ? MEDALS[i] : <span style={styles.rankNum}>#{i+1}</span>}
                </span>
                <div style={styles.info}>
                  <p style={styles.name}>{entry.name} {isMe && <span style={styles.you}>(You)</span>}</p>
                  <p style={styles.email}>{entry.email}</p>
                </div>
                <div style={styles.count}>
                  <span style={styles.countNum}>{entry.referralCount}</span>
                  <span style={styles.countLabel}>referrals</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  row: { display:'flex', alignItems:'center', gap:16, padding:'16px 24px', borderBottom:'1px solid var(--border)', transition:'background 0.2s' },
  rank: { fontSize: 24, width: 36, textAlign:'center', flexShrink:0 },
  rankNum: { fontSize: 16, fontWeight: 600, color:'var(--text-secondary)' },
  info: { flex: 1 },
  name: { fontWeight: 600, fontSize: 15, marginBottom: 2 },
  email: { fontSize: 13, color:'var(--text-secondary)' },
  you: { color:'var(--primary)', fontSize: 12, fontWeight: 500 },
  count: { textAlign:'center', flexShrink:0 },
  countNum: { display:'block', fontSize: 24, fontWeight: 700, color:'var(--primary)' },
  countLabel: { fontSize: 12, color:'var(--text-secondary)' },
};
