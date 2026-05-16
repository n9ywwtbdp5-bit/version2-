import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { useStore } from '../store.js'

const COLORS = ['#FF6B35', '#FFD23F', '#06D6A0', '#118AB2', '#9B5DE5', '#F72585']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '2px solid var(--border)', borderRadius: 12, padding: '10px 16px', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{label}</div>
      <div style={{ color: 'var(--brand-orange)', fontSize: '1.1rem' }}>{payload[0].value} {payload[0].name === 'minutes' ? 'min' : 'XP'}</div>
    </div>
  )
}

export default function Progress() {
  const { weekData, currentStreak, longestStreak, todayMinutes, weeklyMinutes, weeklyGoal, subjects, openPaywall, user } = useStore()
  const [activeChart, setActiveChart] = useState('minutes')

  const subjectData = subjects.map((s, i) => ({
    name: s.label, value: Math.floor(Math.random() * 60 + 10), color: COLORS[i]
  }))

  const consistencyScore = Math.min(100, Math.round((currentStreak / 30) * 100))

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32, animation: 'slide-up 0.4s ease both' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', marginBottom: 6 }}>📊 Your Progress</h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>See how far you've come. Every minute counts.</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 18, marginBottom: 28 }}>
        {[
          { label: 'This Week', value: `${weeklyMinutes}m`, emoji: '📅', color: 'var(--brand-orange)' },
          { label: 'Consistency', value: `${consistencyScore}%`, emoji: '🎯', color: 'var(--brand-green)' },
          { label: 'Best Day', value: `${Math.max(...weekData.map(d => d.minutes))}m`, emoji: '⭐', color: 'var(--brand-purple)' },
          { label: 'Daily Avg', value: `${Math.round(weeklyMinutes / 7)}m`, emoji: '📈', color: 'var(--brand-blue)' },
        ].map(({ label, value, emoji, color }) => (
          <div key={label} className="card animate-pop-in" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color, lineHeight: 1 }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="card" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.1rem' }}>📈 Weekly Activity</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {['minutes', 'xp'].map((c) => (
              <button key={c} onClick={() => setActiveChart(c)} style={{
                padding: '6px 16px', borderRadius: 99,
                background: activeChart === c ? 'var(--brand-orange)' : 'var(--bg-primary)',
                color: activeChart === c ? 'white' : 'var(--text-secondary)',
                border: `2px solid ${activeChart === c ? 'var(--brand-orange)' : 'var(--border)'}`,
                fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
              }}>{c === 'minutes' ? '⏱ Time' : '⚡ XP'}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weekData} barSize={36}>
            <XAxis dataKey="day" tick={{ fontFamily: 'Nunito', fontWeight: 700, fill: '#6B6B8A', fontSize: 13 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,107,53,0.06)', radius: 8 }} />
            <Bar dataKey={activeChart} name={activeChart} radius={[8, 8, 0, 0]}
              fill="var(--brand-orange)"
              label={false}
            >
              {weekData.map((_, i) => (
                <Cell key={i} fill={i === new Date().getDay() - 1 ? 'var(--brand-orange)' : 'rgba(255,107,53,0.3)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Subject Breakdown */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: 20 }}>🎯 Subject Breakdown</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <PieChart width={160} height={160}>
              <Pie data={subjectData} cx={75} cy={75} innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={0}>
                {subjectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </div>
          {subjectData.map(({ name, value, color }) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{name}</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{value}m</span>
            </div>
          ))}
        </div>

        {/* Streak calendar */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: 16 }}>🔥 Streak Calendar</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem', paddingBottom: 4 }}>{d}</div>
            ))}
            {[...Array(28)].map((_, i) => {
              const studied = i < currentStreak || (i > 10 && Math.random() > 0.3)
              const isToday = i === 20
              return (
                <div key={i} style={{
                  aspectRatio: '1', borderRadius: 8,
                  background: isToday ? 'var(--brand-orange)' : studied ? 'rgba(255,107,53,0.25)' : 'var(--bg-primary)',
                  border: isToday ? '2px solid var(--brand-orange)' : `2px solid ${studied ? 'rgba(255,107,53,0.3)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem',
                }}>
                  {isToday && <span style={{ color: 'white', fontWeight: 900 }}>▲</span>}
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: 'rgba(255,107,53,0.25)', border: '2px solid rgba(255,107,53,0.3)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Studied</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--brand-orange)', border: '2px solid var(--brand-orange)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Locked premium feature */}
      {user.plan === 'free' && (
        <div className="card" style={{ padding: 32, textAlign: 'center', background: 'linear-gradient(135deg, rgba(155,93,229,0.07), rgba(247,37,133,0.05))', border: '2px dashed var(--brand-purple)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h3 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: 8, color: 'var(--brand-purple)' }}>Advanced Analytics</h3>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 20 }}>
            Unlock peak study hour analysis, subject mastery scores, and 6-month trend reports with Pro.
          </p>
          <button className="btn" onClick={() => openPaywall('Advanced Analytics')} style={{ background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-pink))', color: 'white', boxShadow: '0 4px 0 #7B3DB5', margin: '0 auto' }}>
            👑 Unlock Pro Analytics
          </button>
        </div>
      )}
    </div>
  )
}
