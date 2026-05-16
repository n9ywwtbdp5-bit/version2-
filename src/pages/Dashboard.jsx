import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../store.js'

const MOTIVATIONAL = [
  "Every champion was once a beginner. Keep going! 💪",
  "You're building something incredible, one day at a time. 🌟",
  "Your future self is cheering you on right now! 🎉",
  "Consistency beats perfection every single time. 🔥",
  "Small daily improvements lead to stunning results. ✨",
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, currentStreak, longestStreak, xp, level, xpToNextLevel, todayMinutes, weeklyGoal, weeklyMinutes, subjects, activeSubjects, achievements, openPaywall, setPlan } = useStore()
  const [quote] = useState(() => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)])
  const [greeting, setGreeting] = useState('')
  const [celebrated, setCelebrated] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState('')

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
  }, [])
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const paidPlan = searchParams.get('plan')

    if (paymentStatus !== 'success' || !['pro', 'premium'].includes(paidPlan)) return

    // Demo-only client update: production apps should confirm payment via webhook/backend.
    setPlan(paidPlan)
    setCheckoutMessage(`🎉 ${paidPlan === 'pro' ? 'Pro' : 'Premium'} activated successfully!`)

    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('payment')
    nextParams.delete('plan')
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setPlan, setSearchParams])

  const xpPct = Math.min(100, Math.round((xp / xpToNextLevel) * 100))
  const weeklyPct = Math.min(100, Math.round((weeklyMinutes / weeklyGoal) * 100))
  const unlockedAchievements = achievements.filter((a) => a.unlocked)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {checkoutMessage && (
        <div className="card" style={{ padding: '14px 18px', marginBottom: 18, background: 'rgba(6,214,160,0.12)', borderColor: 'var(--brand-green)' }}>
          <span style={{ fontWeight: 800, color: '#049E78' }}>{checkoutMessage}</span>
        </div>
      )}
      {/* Header */}
      <div style={{ marginBottom: 32, animation: 'slide-up 0.5s ease both' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: 8 }}>
          {greeting}, {user.name}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1.05rem' }}>{quote}</p>
      </div>

      {/* Top stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
        {/* Current Streak */}
        <div className="card animate-pop-in" style={{ padding: 24, background: 'linear-gradient(135deg, #FF6B35, #FFD23F)', border: 'none', boxShadow: '0 6px 0 #C94E1F', animationDelay: '0s' }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>CURRENT STREAK</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 44, animation: 'streak-fire 1.5s ease-in-out infinite' }}>🔥</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', color: 'white', lineHeight: 1 }}>{currentStreak}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.9rem' }}>days in a row</div>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="card animate-pop-in" style={{ padding: 24, animationDelay: '0.08s' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>LONGEST STREAK</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36 }}>🏆</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--brand-orange)', lineHeight: 1 }}>{longestStreak}</div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem' }}>personal best</div>
            </div>
          </div>
        </div>

        {/* Level */}
        <div className="card animate-pop-in" style={{ padding: 24, animationDelay: '0.16s' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>SCHOLAR LEVEL</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>⭐</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--brand-purple)', lineHeight: 1 }}>Lv.{level}</div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem' }}>{xp} XP total</div>
            </div>
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 700 }}>{xpToNextLevel - xp} XP to Level {level + 1}</div>
        </div>

        {/* Today */}
        <div className="card animate-pop-in" style={{ padding: 24, animationDelay: '0.24s' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>TODAY'S SESSION</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36 }}>⏱️</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--brand-green)', lineHeight: 1 }}>{todayMinutes}m</div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem' }}>studied today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* Weekly Goal */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 900, fontSize: '1.1rem' }}>📅 Weekly Goal</h3>
            <span style={{ color: 'var(--brand-orange)', fontWeight: 800 }}>{weeklyMinutes}/{weeklyGoal} min</span>
          </div>
          <div style={{ background: 'var(--border)', borderRadius: 99, height: 20, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{
              height: '100%', borderRadius: 99, width: `${weeklyPct}%`,
              background: weeklyPct >= 100
                ? 'linear-gradient(90deg, var(--brand-green), #04B586)'
                : 'linear-gradient(90deg, var(--brand-orange), var(--brand-yellow))',
              transition: 'width 1s var(--ease-bounce)',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
            }}>
              {weeklyPct > 15 && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>{weeklyPct}%</span>}
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
            {weeklyPct >= 100 ? '🎉 Goal crushed! Amazing work!' : `${weeklyGoal - weeklyMinutes} minutes left this week`}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: 16 }}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => navigate('/app/timer')} style={{ width: '100%', justifyContent: 'center' }}>
              ⏱️ Start Study Session
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/app/progress')} style={{ width: '100%', justifyContent: 'center' }}>
              📊 View Progress
            </button>
            {user.plan === 'free' && (
              <button className="btn" onClick={() => openPaywall('Quick Actions')} style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-pink))', color: 'white', boxShadow: '0 4px 0 #7B3DB5' }}>
                👑 Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="card" style={{ padding: 28, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.15rem' }}>📚 Your Subjects</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--brand-orange)', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>Manage →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {subjects.map(({ id, label, emoji, color }) => {
            const active = activeSubjects.includes(id)
            return (
              <button key={id} onClick={() => navigate('/app/timer')} style={{
                background: active ? `${color}18` : 'var(--bg-primary)',
                border: `2px solid ${active ? color : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s var(--ease-bounce)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 28 }}>{emoji}</span>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: active ? color : 'var(--text-secondary)' }}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.15rem' }}>🏆 Recent Achievements</h3>
          <button onClick={() => navigate('/app/achievements')} style={{ background: 'none', border: 'none', color: 'var(--brand-orange)', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>View All →</button>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {unlockedAchievements.map(({ id, label, emoji, desc }) => (
            <div key={id} title={desc} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, rgba(255,210,63,0.15), rgba(255,107,53,0.15))',
              border: '2px solid var(--brand-yellow)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              fontWeight: 800, fontSize: '0.9rem',
              cursor: 'default',
            }}>
              <span style={{ fontSize: 20 }}>{emoji}</span> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
