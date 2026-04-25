import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationAPI } from '../../services/api';
import {
  FiBriefcase, FiHome, FiLogOut, FiBell, FiMoon, FiSun,
  FiUser, FiMenu, FiX, FiBookmark, FiAward, FiUsers
} from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAdmin, isRecruiter } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      notificationAPI.getUnread()
        .then(res => setUnread(res.data.count))
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        {/* Logo */}
        <Link to="/jobs" style={styles.logo}>
          <FiBriefcase size={22} color="#4f46e5" />
          <span style={styles.logoText}>JobPortal</span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          <NavLink to="/jobs" active={isActive('/jobs')} icon={<FiHome size={16}/>} label="Jobs" />

          {!isRecruiter() && !isAdmin() && (
            <>
              <NavLink to="/my-applications" active={isActive('/my-applications')} icon={<FiUser size={16}/>} label="Applications" />
              <NavLink to="/saved-jobs" active={isActive('/saved-jobs')} icon={<FiBookmark size={16}/>} label="Saved" />
              <NavLink to="/referrals" active={isActive('/referrals')} icon={<FiUsers size={16}/>} label="Referrals" />
            </>
          )}

          {isRecruiter() && !isAdmin() && (
            <NavLink to="/recruiter" active={isActive('/recruiter')} icon={<FiBriefcase size={16}/>} label="Dashboard" />
          )}

          {isAdmin() && (
            <NavLink to="/admin" active={isActive('/admin')} icon={<FiHome size={16}/>} label="Admin" />
          )}

          <NavLink to="/leaderboard" active={isActive('/leaderboard')} icon={<FiAward size={16}/>} label="Leaderboard" />
        </div>

        {/* Right side */}
        <div style={styles.right}>
          {/* Dark mode */}
          <button onClick={toggle} style={styles.iconBtn} title="Toggle theme">
            {dark ? <FiSun size={18}/> : <FiMoon size={18}/>}
          </button>

          {/* Notifications */}
          <Link to="/notifications" style={{ ...styles.iconBtn, position: 'relative' }}>
            <FiBell size={18}/>
            {unread > 0 && (
              <span style={styles.badge}>{unread > 9 ? '9+' : unread}</span>
            )}
          </Link>

          {/* User info + logout */}
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.name}</span>
            <span className={`badge badge-${roleColor(user?.role)}`}>{user?.role}</span>
          </div>

          <button onClick={handleLogout} style={styles.iconBtn} title="Logout">
            <FiLogOut size={18}/>
          </button>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ ...styles.iconBtn, display: 'none' }} id="menu-btn">
            {menuOpen ? <FiX size={20}/> : <FiMenu size={20}/>}
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, icon, label }) {
  return (
    <Link to={to} style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}>
      {icon}{label}
    </Link>
  );
}

function roleColor(role) {
  if (role === 'ADMIN') return 'red';
  if (role === 'RECRUITER') return 'purple';
  return 'blue';
}

const styles = {
  nav: {
    background: 'var(--card-bg)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    gap: 16,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--primary)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    transition: 'all 0.15s',
    textDecoration: 'none',
  },
  linkActive: {
    color: 'var(--primary)',
    background: 'var(--primary-light)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: 8,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    background: '#ef4444',
    color: 'white',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 10,
    padding: '1px 5px',
    minWidth: 16,
    textAlign: 'center',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text)',
  },
};
