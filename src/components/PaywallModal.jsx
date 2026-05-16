import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.js'
import { startStripeCheckout } from '../lib/stripeCheckout.js'

export default function PaywallModal() {
  const { closePaywall, paywallFeature } = useStore()
  const navigate = useNavigate()
  const [checkoutPlan, setCheckoutPlan] = useState('')

  const handleUpgrade = async (plan) => {
    setCheckoutPlan(plan)
    const result = await startStripeCheckout({ plan, billing: 'monthly' })

    if (!result.ok) {
      alert(result.message)
      setCheckoutPlan('')
    }
  }

  return (
    <div className="modal-overlay" onClick={closePaywall}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button onClick={closePaywall} style={{
          position: 'absolute', top: 20, right: 20, background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: '50%', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-secondary)',
          transition: 'all 0.2s var(--ease-smooth)',
        }} onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-tertiary)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--bg-card)';
          e.currentTarget.style.transform = 'scale(1)';
        }}>
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 64, marginBottom: 16, display: 'inline-block', animation: 'float 4s ease-in-out infinite' }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: 8, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Unlock <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{paywallFeature || 'Pro Features'}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
            You've hit the free plan limit. Upgrade to keep crushing your goals!
          </p>
        </div>

        {/* Mini plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Pro */}
          <div onClick={() => { if (!checkoutPlan) handleUpgrade('pro') }} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            cursor: checkoutPlan ? 'default' : 'pointer',
            transition: 'all 0.3s var(--ease-smooth)',
            position: 'relative',
            overflow: 'hidden',
            opacity: checkoutPlan && checkoutPlan !== 'pro' ? 0.7 : 1,
          }}
            onMouseEnter={(e) => { 
              if (!checkoutPlan) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -6,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--brand-primary)',
                color: 'white',
                borderRadius: '12px',
                padding: '2px 10px',
                fontSize: '0.75rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              MOST POPULAR
            </div>
            <div style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>⚡</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--brand-primary)', textAlign: 'center', marginBottom: 4 }}>Pro</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, textAlign: 'center', lineHeight: 1, margin: '6px 0' }}>$16.99</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>per month</div>
            {['All subjects', 'Advanced analytics', '3 streak shields', '50+ achievements'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, justifyContent: 'center' }}>
                <span style={{ color: 'var(--brand-success)', fontSize: 1.2 }}>✓</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
            {checkoutPlan === 'pro' && (
              <div style={{
                marginTop: 10,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--brand-primary)',
                textAlign: 'center',
                animation: 'pulse-soft 2s ease-in-out infinite'
              }}>
                Processing checkout…
              </div>
            )}
          </div>

          {/* Premium */}
          <div onClick={() => { if (!checkoutPlan) handleUpgrade('premium') }} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            cursor: checkoutPlan ? 'default' : 'pointer',
            transition: 'all 0.3s var(--ease-smooth)',
            opacity: checkoutPlan && checkoutPlan !== 'premium' ? 0.7 : 1,
          }}
            onMouseEnter={(e) => { 
              if (!checkoutPlan) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>👑</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--brand-purple)', textAlign: 'center', marginBottom: 4 }}>Premium</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, textAlign: 'center', lineHeight: 1, margin: '6px 0' }}>$23.99</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>per month</div>
            {['Everything in Pro', 'AI study planner', 'Unlimited shields', 'Leaderboards'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, justifyContent: 'center' }}>
                <span style={{ color: 'var(--brand-purple)', fontSize: 1.2 }}>✓</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
            {checkoutPlan === 'premium' && (
              <div style={{
                marginTop: 10,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--brand-purple)',
                textAlign: 'center',
                animation: 'pulse-soft 2s ease-in-out infinite'
              }}>
                Processing checkout…
              </div>
            )}
          </div>
        </div>

        <button className="btn" onClick={() => { closePaywall(); navigate('/app/pricing') }} style={{ 
          width: '100%', 
          padding: '14px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          justifyContent: 'center',
          background: 'var(--brand-primary)',
          color: 'white',
          borderRadius: '50px',
          boxShadow: 'var(--shadow-md)',
          border: 'none',
          transition: 'all 0.2s var(--ease-smooth)',
        }} 
          disabled={Boolean(checkoutPlan)}
          onMouseEnter={(e) => {
            if (!checkoutPlan) {
              e.currentTarget.style.background = '#FF5722';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--brand-primary)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          {Boolean(checkoutPlan) ? 'Processing…' : 'See Full Pricing →'}
        </button>
        
        <button onClick={closePaywall} style={{ 
          width: '100%', 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-muted)', 
          fontFamily: 'var(--font-body)', 
          fontWeight: 600, 
          padding: '12px', 
          cursor: 'pointer', 
          fontSize: '0.9rem',
          marginTop: 8,
          transition: 'color 0.2s var(--ease-smooth)',
        }} 
          disabled={Boolean(checkoutPlan)}
          onMouseEnter={(e) => {
            if (!checkoutPlan) e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            if (!checkoutPlan) e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          Maybe later
        </button>

        <div style={{ 
          textAlign: 'center', 
          marginTop: 12, 
          color: 'var(--text-muted)', 
          fontSize: '0.8rem', 
          fontWeight: 600,
        }}>
          🔒 Secure checkout · Cancel anytime · 7-day free trial
        </div>
      </div>
    </div>
  )
}
