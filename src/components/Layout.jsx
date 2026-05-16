import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store.js'

const NAV = [
  { to: '/app/dashboard', label: 'Home', emoji: '🏠' },
  { to: '/app/timer', label: 'Study', emoji: '⏱️' },
  { to: '/app/progress', label: 'Progress', emoji: '📊' },
  { to: '/app/achievements', label: 'Badges', emoji: '🏆' },
  { to: '/app/pricing', label: 'Upgrade', emoji: '⚡' },
]

export default function Layout() {
  const { user, currentStreak, xp, level, xpToNextLevel } = useStore()
  const navigate = useNavigate()
  const xpPct = Math.min(100, Math.round((xp / xpToNextLevel) * 100))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'white',
        borderRight: '2px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32,
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
          borderRadius: 12, transition: 'background 0.2s',
        }}>
          <span style={{ fontSize: 32, animation: 'streak-fire 1.5s ease-in-out infinite' }}>🔥</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--brand-orange)', letterSpacing: 1 }}>
            StudyStreak
          </span>
        </button>

        {/* User Card */}
        <div className="card" style={{ padding: '16px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-orange), var(--brand-yellow))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>{user.avatar}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user.name}</div>
              <div style={{ color: 'var(--brand-purple)', fontWeight: 700, fontSize: '0.8rem' }}>
                Level {level} ⭐
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 700 }}>
            {xp} / {xpToNextLevel} XP
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        {/* Streak */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div className="streak-badge">
            🔥 {currentStreak} Day Streak
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {NAV.map(({ to, label, emoji }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              style={{ flexDirection: 'row', justifyContent: 'flex-start', fontSize: '0.95rem' }}>
              <span style={{ fontSize: 20 }}>{emoji}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Plan badge */}
        <div style={{
          background: user.plan === 'free'
            ? 'var(--border)'
            : 'linear-gradient(135deg, var(--brand-orange), var(--brand-yellow))',
          borderRadius: 12, padding: '10px 16px', textAlign: 'center',
          color: user.plan === 'free' ? 'var(--text-secondary)' : 'white',
          fontWeight: 800, fontSize: '0.85rem',
        }}>
          {user.plan === 'free' ? '🆓 Free Plan' : user.plan === 'pro' ? '⚡ Pro Plan' : '👑 Premium Plan'}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxWidth: 'calc(100vw - 240px)' }}>
        <Outlet />
      </main>
    </div>
  )
}
