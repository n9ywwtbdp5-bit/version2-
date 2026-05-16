import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.js'

export default function PaywallModal() {
  const { closePaywall, paywallFeature, setPlan } = useStore()
  const navigate = useNavigate()

  const handleUpgrade = (plan) => {
    // In production: open Stripe checkout
    setPlan(plan)
    closePaywall()
    alert(`🎉 Welcome to ${plan === 'pro' ? 'Pro' : 'Premium'}! (Stripe checkout would open here in production)`)
  }

  return (
    <div className="modal-overlay" onClick={closePaywall}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button onClick={closePaywall} style={{
          position: 'absolute', top: 16, right: 16, background: 'var(--bg-primary)',
          border: '2px solid var(--border)', borderRadius: '50%', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-secondary)',
        }}>×</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 56, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>
            Unlock <span style={{ color: 'var(--brand-orange)' }}>{paywallFeature || 'Pro Features'}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, lineHeight: 1.6 }}>
            You've hit the free plan limit. Upgrade to keep crushing your goals!
          </p>
        </div>

        {/* Mini plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          {/* Pro */}
          <div onClick={() => handleUpgrade('pro')} style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,210,63,0.06))',
            border: '2.5px solid var(--brand-orange)', borderRadius: 18, padding: 20, cursor: 'pointer',
            transition: 'transform 0.2s var(--ease-bounce)',
            position: 'relative',
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--brand-orange)', color: 'white', borderRadius: 99, padding: '2px 12px', fontSize: '0.72rem', fontWeight: 900, whiteSpace: 'nowrap' }}>MOST POPULAR</div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--brand-orange)' }}>Pro</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', lineHeight: 1, margin: '6px 0' }}>$16.99</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, marginBottom: 12 }}>per month</div>
            {['All subjects', 'Advanced analytics', '3 streak shields', '50+ achievements'].map((f) => (
              <div key={f} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                <span style={{ color: 'var(--brand-green)' }}>✓</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Premium */}
          <div onClick={() => handleUpgrade('premium')} style={{
            background: 'linear-gradient(135deg, rgba(155,93,229,0.08), rgba(247,37,133,0.05))',
            border: '2.5px solid var(--brand-purple)', borderRadius: 18, padding: 20, cursor: 'pointer',
            transition: 'transform 0.2s var(--ease-bounce)',
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>👑</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--brand-purple)' }}>Premium</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', lineHeight: 1, margin: '6px 0' }}>$23.99</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, marginBottom: 12 }}>per month</div>
            {['Everything in Pro', 'AI study planner', 'Unlimited shields', 'Leaderboards'].map((f) => (
              <div key={f} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                <span style={{ color: 'var(--brand-purple)' }}>✓</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => { closePaywall(); navigate('/app/pricing') }} style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}>
          See Full Pricing →
        </button>
        <button onClick={closePaywall} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 700, padding: '12px', cursor: 'pointer', fontSize: '0.85rem', marginTop: 4 }}>
          Maybe later
        </button>

        <div style={{ textAlign: 'center', marginTop: 8, color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>
          🔒 Secure checkout · Cancel anytime · 7-day free trial
        </div>
      </div>
    </div>
  )
}
