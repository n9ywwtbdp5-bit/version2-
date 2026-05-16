import React from 'react'
import { useStore } from '../store.js'

const ALL_ACHIEVEMENTS = [
  { id: 'first_day', label: 'Day One', emoji: '🌱', desc: 'Complete your first study session', xp: 50, category: 'Beginner' },
  { id: 'week_warrior', label: 'Week Warrior', emoji: '⚔️', desc: 'Study 7 days in a row', xp: 150, category: 'Streak' },
  { id: 'century', label: 'Centurion', emoji: '💯', desc: 'Reach a 100-day streak', xp: 1000, category: 'Streak' },
  { id: 'night_owl', label: 'Night Owl', emoji: '🦉', desc: 'Study after 10pm', xp: 75, category: 'Habits' },
  { id: 'early_bird', label: 'Early Bird', emoji: '🐦', desc: 'Study before 7am', xp: 75, category: 'Habits' },
  { id: 'marathon', label: 'Marathon', emoji: '🏃', desc: 'Study 3 hours in one day', xp: 300, category: 'Time' },
  { id: 'scholar', label: 'Scholar', emoji: '🎓', desc: 'Reach Level 10', xp: 500, category: 'Level' },
  { id: 'pomodoro_king', label: 'Pomodoro King', emoji: '🍅', desc: 'Complete 50 Pomodoro sessions', xp: 400, category: 'Time' },
  { id: 'multi_subject', label: 'Renaissance', emoji: '🎨', desc: 'Study 5 different subjects', xp: 200, category: 'Variety' },
  { id: 'perfect_week', label: 'Perfect Week', emoji: '✨', desc: 'Hit your goal every day for a week', xp: 350, category: 'Goals' },
  { id: 'comeback', label: 'Comeback Kid', emoji: '💪', desc: 'Restart a streak after breaking it', xp: 100, category: 'Habits' },
  { id: 'legend', label: 'Legend', emoji: '👑', desc: 'Reach a 365-day streak', xp: 9999, category: 'Streak' },
]

const CATEGORIES = ['All', 'Streak', 'Habits', 'Time', 'Level', 'Goals', 'Variety', 'Beginner']

export default function Achievements() {
  const { achievements } = useStore()
  const [filter, setFilter] = React.useState('All')
  const unlockedIds = new Set(achievements.filter((a) => a.unlocked).map((a) => a.id))

  const filtered = ALL_ACHIEVEMENTS.filter((a) => filter === 'All' || a.category === filter)
  const unlocked = filtered.filter((a) => unlockedIds.has(a.id))
  const locked = filtered.filter((a) => !unlockedIds.has(a.id))

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32, animation: 'slide-up 0.4s ease both' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', marginBottom: 6 }}>🏆 Achievements</h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
          {unlockedIds.size} of {ALL_ACHIEVEMENTS.length} badges unlocked · Keep pushing! 💪
        </p>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding: 24, marginBottom: 28, background: 'linear-gradient(135deg, rgba(255,210,63,0.1), rgba(255,107,53,0.1))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 900 }}>Badge Collection</span>
          <span style={{ color: 'var(--brand-orange)', fontWeight: 900 }}>{unlockedIds.size}/{ALL_ACHIEVEMENTS.length}</span>
        </div>
        <div className="xp-bar-container" style={{ height: 16 }}>
          <div className="xp-bar-fill" style={{ width: `${(unlockedIds.size / ALL_ACHIEVEMENTS.length) * 100}%` }} />
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: '8px 18px', borderRadius: 99,
            background: filter === c ? 'var(--brand-orange)' : 'white',
            color: filter === c ? 'white' : 'var(--text-secondary)',
            border: `2px solid ${filter === c ? 'var(--brand-orange)' : 'var(--border)'}`,
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
            boxShadow: filter === c ? '0 3px 0 #C94E1F' : '0 2px 0 var(--border-strong)',
            transition: 'all 0.2s var(--ease-bounce)',
          }}>{c}</button>
        ))}
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <>
          <h3 style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--brand-green)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            ✅ Unlocked ({unlocked.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
            {unlocked.map(({ id, label, emoji, desc, xp, category }) => (
              <div key={id} className="card animate-pop-in" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(255,210,63,0.12), rgba(255,107,53,0.08))' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>{emoji}</div>
                <div style={{ fontWeight: 900, fontSize: '1rem', marginBottom: 4 }}>{label}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: 600, marginBottom: 10, lineHeight: 1.5 }}>{desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'var(--brand-yellow)', color: 'var(--text-primary)', borderRadius: 99, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 900 }}>{category}</span>
                  <span style={{ color: 'var(--brand-orange)', fontWeight: 900, fontSize: '0.9rem' }}>+{xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <>
          <h3 style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            🔒 Locked ({locked.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {locked.map(({ id, label, emoji, desc, xp, category }) => (
              <div key={id} className="card" style={{ padding: 24, opacity: 0.55, filter: 'grayscale(0.4)' }}>
                <div style={{ fontSize: 44, marginBottom: 12, filter: 'grayscale(1)' }}>{emoji}</div>
                <div style={{ fontWeight: 900, fontSize: '1rem', marginBottom: 4 }}>{label}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: 600, marginBottom: 10, lineHeight: 1.5 }}>{desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'var(--border)', color: 'var(--text-muted)', borderRadius: 99, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 900 }}>{category}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 900, fontSize: '0.9rem' }}>+{xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
