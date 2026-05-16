import React, { useState } from 'react'
import { useStore } from '../store.js'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    emoji: '🌱',
    price: 0,
    priceLabel: '$0',
    period: 'forever',
    tagline: 'Get started and build your first habit',
    color: '#6B6B8A',
    shadow: '#A9A9C0',
    features: [
      '✅ 1 active subject',
      '✅ Basic streak tracking',
      '✅ Pomodoro timer',
      '✅ 7-day history',
      '✅ 3 achievements',
      '❌ Advanced analytics',
      '❌ All subjects unlocked',
      '❌ Streak freeze shields',
      '❌ AI study planner',
      '❌ Leaderboards',
    ],
    cta: 'Current Plan',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    emoji: '⚡',
    price: 16.99,
    priceLabel: '$16.99',
    period: 'per month',
    tagline: 'For students serious about building habits',
    color: '#FF6B35',
    shadow: '#C94E1F',
    badge: '🏆 Most Popular',
    features: [
      '✅ All 6 subjects unlocked',
      '✅ Advanced streak analytics',
      '✅ Full progress charts',
      '✅ 90-day history',
      '✅ All 50+ achievements',
      '✅ 3 streak freeze shields/month',
      '✅ Custom timer modes',
      '✅ Weekly email reports',
      '❌ AI study planner',
      '❌ Priority support',
    ],
    cta: 'Start Pro — $16.99/mo',
    highlight: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    emoji: '👑',
    price: 23.99,
    priceLabel: '$23.99',
    period: 'per month',
    tagline: 'The full arsenal for top performers',
    color: '#9B5DE5',
    shadow: '#7B3DB5',
    features: [
      '✅ Everything in Pro',
      '✅ AI-powered study planner',
      '✅ Unlimited streak shields',
      '✅ Leaderboard access',
      '✅ 1-year history & exports',
      '✅ Study group challenges',
      '✅ Priority support (24hr)',
      '✅ Early feature access',
      '✅ Custom avatar & themes',
      '✅ Monthly 1-on-1 coaching call',
    ],
    cta: 'Go Premium — $23.99/mo',
    highlight: false,
  },
]

const FAQ = [
  { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel in one click — no questions asked, no hidden fees. Your data stays safe.' },
  { q: 'Is there a free trial?', a: 'Yes! Pro and Premium both come with a 7-day free trial. No credit card required to start.' },
  { q: 'What happens to my streak if I cancel?', a: 'Your streak and progress are always preserved. You\'ll drop to Free features, but never lose your data.' },
  { q: 'Do you offer student discounts?', a: 'Yes! Email us with your .edu address for 30% off any plan.' },
]

export default function Pricing() {
  const { user, setPlan, closePaywall } = useStore()
  const [billing, setBilling] = useState('monthly')
  const [activeFaq, setActiveFaq] = useState(null)

  const handleSelect = (planId) => {
    if (planId === 'free') return
    // In production this would open Stripe checkout
    setPlan(planId)
    alert(`🎉 Welcome to ${planId === 'pro' ? 'Pro' : 'Premium'}! (Stripe checkout would open here)`)
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48, animation: 'slide-up 0.4s ease both' }}>
        <div style={{ display: 'inline-block', background: 'var(--border)', borderRadius: 99, padding: '6px 20px', fontWeight: 800, fontSize: '0.85rem', color: 'var(--brand-orange)', marginBottom: 16 }}>
          💳 Simple, honest pricing
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', marginBottom: 16 }}>
          Invest in Your <span style={{ color: 'var(--brand-orange)' }}>Future Self 🚀</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600, maxWidth: 500, margin: '0 auto 28px' }}>
          Less than a coffee a week. More valuable than any textbook. Start free, upgrade when you're ready.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', background: 'var(--border)', borderRadius: 99, padding: 4 }}>
          {['monthly', 'annual'].map((b) => (
            <button key={b} onClick={() => setBilling(b)} style={{
              padding: '8px 24px', borderRadius: 99,
              background: billing === b ? 'white' : 'transparent',
              border: 'none', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '0.9rem',
              color: billing === b ? 'var(--brand-orange)' : 'var(--text-muted)',
              cursor: 'pointer', boxShadow: billing === b ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}>
              {b === 'monthly' ? 'Monthly' : '🎁 Annual (Save 20%)'}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 60 }}>
        {PLANS.map(({ id, name, emoji, priceLabel, price, period, tagline, color, shadow, badge, features, cta, highlight }) => {
          const finalPrice = billing === 'annual' && price > 0 ? (price * 0.8).toFixed(2) : price
          const isCurrent = user.plan === id
          return (
            <div key={id} style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              border: `3px solid ${highlight ? color : 'var(--border)'}`,
              boxShadow: highlight ? `0 8px 0 ${shadow}, var(--shadow-lg)` : 'var(--shadow-card)',
              padding: 32,
              position: 'relative',
              transform: highlight ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.2s var(--ease-bounce)',
            }}>
              {badge && (
                <div style={{
                  position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                  background: color, color: 'white', borderRadius: 99, padding: '6px 20px',
                  fontWeight: 900, fontSize: '0.85rem', whiteSpace: 'nowrap',
                  boxShadow: `0 3px 0 ${shadow}`,
                }}>{badge}</div>
              )}

              <div style={{ fontSize: 44, marginBottom: 12 }}>{emoji}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color, marginBottom: 4 }}>{name}</div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 20 }}>{tagline}</div>

              <div style={{ marginBottom: 28 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {price === 0 ? '$0' : `$${finalPrice}`}
                </span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', marginLeft: 4 }}>/{period}</span>
                {billing === 'annual' && price > 0 && (
                  <div style={{ color: 'var(--brand-green)', fontWeight: 800, fontSize: '0.82rem', marginTop: 4 }}>
                    🎉 Save ${(price * 0.2 * 12).toFixed(2)}/year
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 28 }}>
                {features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, opacity: f.startsWith('❌') ? 0.45 : 1 }}>
                    <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{f.slice(0, 2)}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{f.slice(3)}</span>
                  </div>
                ))}
              </div>

              <button
                className="btn"
                onClick={() => handleSelect(id)}
                disabled={isCurrent}
                style={{
                  width: '100%', justifyContent: 'center',
                  background: isCurrent ? 'var(--border)' : highlight ? color : 'white',
                  color: isCurrent ? 'var(--text-muted)' : highlight ? 'white' : color,
                  border: `2.5px solid ${isCurrent ? 'var(--border)' : color}`,
                  boxShadow: isCurrent ? 'none' : `0 4px 0 ${shadow}`,
                  cursor: isCurrent ? 'default' : 'pointer',
                  fontSize: '0.95rem',
                }}>
                {isCurrent ? '✓ Current Plan' : cta}
              </button>

              {id !== 'free' && (
                <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700 }}>
                  7-day free trial · Cancel anytime
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Social proof */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ color: '#FFD23F', fontSize: '1.8rem', marginBottom: 12, letterSpacing: 4 }}>★★★★★</div>
        <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          "StudyStreak Pro literally changed my GPA. I went from a 2.8 to a 3.7 in one semester. Worth every penny."
        </p>
        <div style={{ marginTop: 12, fontWeight: 900 }}>— Jake M., Engineering Student</div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textAlign: 'center', marginBottom: 28 }}>
          Got Questions? 🙋
        </h2>
        {FAQ.map(({ q, a }, i) => (
          <div key={i} className="card" style={{ padding: '20px 24px', marginBottom: 12, cursor: 'pointer' }} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{q}</span>
              <span style={{ color: 'var(--brand-orange)', fontWeight: 900, fontSize: '1.2rem', transition: 'transform 0.2s', transform: activeFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
            </div>
            {activeFaq === i && (
              <div style={{ marginTop: 12, color: 'var(--text-secondary)', fontWeight: 600, lineHeight: 1.7, fontSize: '0.9rem', animation: 'slide-up 0.2s ease' }}>
                {a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
