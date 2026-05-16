import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store.js'

const MODES = [
  { id: 'pomodoro', label: '🍅 Pomodoro', seconds: 25 * 60 },
  { id: 'short', label: '☕ Short Break', seconds: 5 * 60 },
  { id: 'long', label: '🌙 Long Break', seconds: 15 * 60 },
  { id: 'custom', label: '⚡ Custom', seconds: 0 },
]

export default function Timer() {
  const { subjects, activeSubjects, addXP, addMinutes, openPaywall, user } = useStore()
  const [mode, setMode] = useState('pomodoro')
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [subject, setSubject] = useState(activeSubjects[0] || 'math')
  const [customMins, setCustomMins] = useState(30)
  const [sessions, setSessions] = useState(0)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)
  const totalRef = useRef(25 * 60)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            handleComplete()
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const handleComplete = () => {
    const minsStudied = Math.floor(totalRef.current / 60)
    const xpEarned = minsStudied * 3
    addXP(xpEarned)
    addMinutes(minsStudied)
    setSessions((s) => s + 1)
    setFinished(true)
    setTimeout(() => setFinished(false), 4000)
  }

  const selectMode = (m) => {
    setMode(m.id)
    setRunning(false)
    const secs = m.id === 'custom' ? customMins * 60 : m.seconds
    setSeconds(secs)
    totalRef.current = secs
  }

  const toggleTimer = () => setRunning((r) => !r)

  const resetTimer = () => {
    setRunning(false)
    const m = MODES.find((x) => x.id === mode)
    const secs = mode === 'custom' ? customMins * 60 : m.seconds
    setSeconds(secs)
    totalRef.current = secs
  }

  const pct = totalRef.current > 0 ? 1 - seconds / totalRef.current : 0
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  // SVG circle
  const R = 110
  const circ = 2 * Math.PI * R
  const dash = circ * (1 - pct)

  const selectedSubject = subjects.find((s) => s.id === subject)

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 32, animation: 'slide-up 0.4s ease both' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', marginBottom: 6 }}>⏱️ Study Timer</h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Focus deep. Earn XP. Never break the chain.</p>
      </div>

      {/* Session count */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: i < sessions ? 'var(--brand-orange)' : 'var(--border)',
            border: `3px solid ${i < sessions ? '#C94E1F' : 'var(--border-strong)'}`,
            transition: 'all 0.3s var(--ease-bounce)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {i < sessions && <span style={{ color: 'white', fontSize: 14 }}>✓</span>}
          </div>
        ))}
        <span style={{ color: 'var(--text-secondary)', fontWeight: 700, alignSelf: 'center', fontSize: '0.9rem' }}>
          {sessions} sessions today
        </span>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
        {MODES.map((m) => (
          <button key={m.id} onClick={() => selectMode(m)} style={{
            padding: '10px 18px', borderRadius: 'var(--radius-full)',
            background: mode === m.id ? 'var(--brand-orange)' : 'white',
            color: mode === m.id ? 'white' : 'var(--text-secondary)',
            border: `2px solid ${mode === m.id ? 'var(--brand-orange)' : 'var(--border)'}`,
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
            transition: 'all 0.2s var(--ease-bounce)',
            boxShadow: mode === m.id ? '0 3px 0 #C94E1F' : '0 2px 0 var(--border-strong)',
          }}>{m.label}</button>
        ))}
      </div>

      {mode === 'custom' && (
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ fontWeight: 800, color: 'var(--text-secondary)' }}>Minutes:</label>
          <input type="number" min={1} max={180} value={customMins}
            onChange={(e) => {
              const v = parseInt(e.target.value) || 1
              setCustomMins(v)
              setSeconds(v * 60)
              totalRef.current = v * 60
            }}
            style={{ width: 80, padding: '8px 12px', border: '2px solid var(--border)', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '1.1rem', textAlign: 'center' }}
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Timer circle */}
        <div className="card" style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {/* Finished flash */}
          {finished && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--brand-green)', color: 'white', textAlign: 'center', padding: 12, fontWeight: 900, fontSize: '1.1rem', borderRadius: '24px 24px 0 0', animation: 'pop-in 0.3s ease both' }}>
              🎉 Session Complete! XP Earned!
            </div>
          )}

          <div style={{ position: 'relative', width: 260, height: 260 }}>
            <svg width={260} height={260} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={130} cy={130} r={R} fill="none" stroke="var(--border)" strokeWidth={14} />
              <circle cx={130} cy={130} r={R} fill="none"
                stroke={running ? 'var(--brand-orange)' : selectedSubject?.color || 'var(--brand-orange)'}
                strokeWidth={14} strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={dash}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <div style={{ fontSize: 32 }}>{selectedSubject?.emoji || '📚'}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                {mins}:{secs}
              </div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                {mode === 'pomodoro' ? 'Focus Time' : mode === 'short' ? 'Short Break' : mode === 'long' ? 'Long Break' : 'Custom'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={toggleTimer} style={{ padding: '14px 36px', fontSize: '1.1rem' }}>
              {running ? '⏸ Pause' : '▶️ Start'}
            </button>
            <button className="btn btn-secondary" onClick={resetTimer} style={{ padding: '14px 20px' }}>🔄</button>
          </div>

          <div style={{ color: 'var(--brand-orange)', fontWeight: 800, fontSize: '0.9rem', textAlign: 'center' }}>
            +{Math.floor((totalRef.current / 60) * 3)} XP on completion ⚡
          </div>
        </div>

        {/* Subject picker + tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 900, fontSize: '1rem', marginBottom: 14 }}>📚 Study Subject</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {subjects.map(({ id, label, emoji, color }) => (
                <button key={id} onClick={() => setSubject(id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  background: subject === id ? `${color}20` : 'var(--bg-primary)',
                  border: `2px solid ${subject === id ? color : 'transparent'}`,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-body)', fontWeight: 800,
                  color: subject === id ? color : 'var(--text-secondary)',
                  fontSize: '0.9rem', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 20 }}>{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(155,93,229,0.08), rgba(247,37,133,0.06))' }}>
            <h3 style={{ fontWeight: 900, fontSize: '1rem', marginBottom: 12 }}>💡 Pro Tips</h3>
            {[
              '4 pomodoros = 1 full session 🍅',
              'Study at the same time daily for max streak gains',
              'Short breaks protect your focus!',
            ].map((t) => (
              <div key={t} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span style={{ color: 'var(--brand-orange)' }}>→</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.88rem' }}>{t}</span>
              </div>
            ))}
            {user.plan === 'free' && (
              <button onClick={() => openPaywall('Pro Tips')} style={{ marginTop: 12, width: '100%', padding: '10px', background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-pink))', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>
                🔒 Unlock AI Study Planner →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
