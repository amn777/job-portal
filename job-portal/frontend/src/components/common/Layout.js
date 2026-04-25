import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ padding: '28px 0 60px' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
