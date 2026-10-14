import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const QUIZ_URL = 'https://attachment.personaldevelopmentschool.com/'

const STYLES = {
  secure: {
    name: 'Secure',
    color: '#059669', bg: '#ECFDF5',
    summary: 'Comfortable with closeness and with independence. Trusts that love is steady, says what they need, and can repair after conflict.',
    grow: 'Keep protecting the habits that make you feel safe: honest conversations, healthy boundaries and rest.',
  },
  anxious: {
    name: 'Anxious',
    color: '#DB2777', bg: '#FDF2F8',
    summary: 'Deeply loyal and tuned in to others. Can worry about being left or not being enough, and may look for reassurance when distance appears.',
    grow: 'Practise soothing yourself first, then ask for what you need clearly instead of waiting to be noticed.',
  },
  dismissive: {
    name: 'Dismissive-Avoidant',
    color: '#2563EB', bg: '#EFF6FF',
    summary: 'Independent and self-reliant. May feel crowded when things get too close and pull back to feel safe.',
    grow: 'Notice the urge to withdraw, name it, and share a little more than feels comfortable with people who have earned trust.',
  },
  fearful: {
    name: 'Fearful-Avoidant',
    color: '#7C3AED', bg: '#F5F3FF',
    summary: 'Wants closeness but also fears it. Can move between reaching out and pulling away, especially under stress.',
    grow: 'Go slowly, build consistency and safety, and learn to stay present when feelings are mixed.',
  },
}
const KEYS = Object.keys(STYLES)
const emptyScores = { secure: '', anxious: '', dismissive: '', fearful: '' }

const primaryOf = (scores) => KEYS.reduce((a, b) => (Number(scores[b]) > Number(scores[a]) ? b : a))

export default function AttachmentView() {
  const [profiles, setProfiles] = useLocalStorage('lucys-attachment', [])
  const [phase, setPhase] = useState('landing')
  const [name, setName] = useState('')
  const [scores, setScores] = useState(emptyScores)
  const [viewProfile, setViewProfile] = useState(null)

  const startNew = () => { setName(''); setScores(emptyScores); setPhase('entry') }
  const canSave = name.trim() && KEYS.some(k => scores[k] !== '')

  const save = () => {
    const clean = Object.fromEntries(KEYS.map(k => [k, Math.max(0, Math.min(100, Number(scores[k]) || 0))]))
    const profile = {
      id: Date.now(),
      name: name.trim(),
      date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
      scores: clean,
      primary: primaryOf(clean),
    }
    setProfiles(prev => [profile, ...prev.filter(p => p.name !== profile.name)])
    setViewProfile(profile)
    setPhase('landing')
  }

  if (viewProfile) {
    return <ProfileDetail profile={viewProfile} onBack={() => setViewProfile(null)} />
  }

  if (phase === 'entry') {
    return (
      <div style={s.page}>
        <button style={s.backBtn} onClick={() => setPhase('landing')}>← Back</button>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Save quiz results</h2>
          <p style={s.cardSub}>
            Take the official quiz, then copy the percentage it gives for each style here.
          </p>
          <input
            style={s.input}
            placeholder="Name..."
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          {KEYS.map(k => (
            <label key={k} style={s.scoreInputRow}>
              <span style={{ ...s.scoreInputName, color: STYLES[k].color }}>{STYLES[k].name}</span>
              <input
                style={s.pctInput}
                type="number"
                inputMode="numeric"
                min="0"
                max="100"
                placeholder="0"
                value={scores[k]}
                onChange={e => setScores(prev => ({ ...prev, [k]: e.target.value }))}
              />
              <span style={s.pctSign}>%</span>
            </label>
          ))}
          <button
            style={{ ...s.btn, marginTop: 16, opacity: canSave ? 1 : 0.4 }}
            onClick={save}
            disabled={!canSave}
          >
            Save Results
          </button>
        </div>
        <a style={s.linkBtn} href={QUIZ_URL} target="_blank" rel="noopener noreferrer">Open the quiz ↗</a>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.heroIcon}>∞</div>
        <h1 style={s.heroTitle}>Attachment Style</h1>
        <p style={s.heroSub}>
          Understand how you connect, what makes you feel safe in relationships, and where you can grow.
        </p>
        <a style={s.btnLink} href={QUIZ_URL} target="_blank" rel="noopener noreferrer">
          Take the official free quiz ↗
        </a>
        <button style={{ ...s.btnOutline, marginTop: 10 }} onClick={startNew}>Save my results</button>
        <p style={s.hint}>The quiz is by The Personal Development School and opens in a new tab.</p>
      </div>

      {profiles.length > 0 && (
        <div style={s.section}>
          <p style={s.sectionLabel}>Saved Profiles</p>
          {profiles.map(p => {
            const st = STYLES[p.primary]
            return (
              <div key={p.id} style={{ ...s.profileCard, borderLeftColor: st.color }} onClick={() => setViewProfile(p)}>
                <div>
                  <p style={s.pcName}>{p.name}</p>
                  <p style={{ ...s.pcStyle, color: st.color }}>{st.name} · {p.scores[p.primary]}%</p>
                  <p style={s.pcDate}>{p.date}</p>
                </div>
                <button
                  style={s.delBtn}
                  onClick={e => { e.stopPropagation(); setProfiles(prev => prev.filter(x => x.id !== p.id)) }}
                  aria-label="Delete profile"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div style={s.section}>
        <p style={s.sectionLabel}>The four styles</p>
        {KEYS.map(k => (
          <div key={k} style={{ ...s.infoBox, background: STYLES[k].bg, borderColor: STYLES[k].color }}>
            <p style={{ ...s.infoTitle, color: STYLES[k].color }}>{STYLES[k].name}</p>
            <p style={s.infoText}>{STYLES[k].summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfileDetail({ profile, onBack }) {
  const st = STYLES[profile.primary]
  const ranked = [...KEYS].sort((a, b) => profile.scores[b] - profile.scores[a])
  return (
    <div style={s.page}>
      <button style={s.backBtn} onClick={onBack}>← Back</button>
      <div style={{ ...s.resultHero, background: st.bg, borderColor: st.color }}>
        <p style={s.resultFor}>{profile.name}&rsquo;s Attachment Style</p>
        <h2 style={{ ...s.resultPrimary, color: st.color }}>{st.name}</h2>
        <p style={s.resultSummary}>{st.summary}</p>
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>Scores · {profile.date}</p>
        {ranked.map(k => (
          <div key={k} style={s.scoreRow}>
            <span style={{ ...s.scoreName, color: STYLES[k].color }}>{STYLES[k].name}</span>
            <div style={s.scoreTrack}>
              <div style={{ ...s.scoreFill, width: `${profile.scores[k]}%`, background: STYLES[k].color }} />
            </div>
            <span style={s.scoreNum}>{profile.scores[k]}%</span>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>Growth focus</p>
        <div style={{ ...s.infoBox, background: st.bg, borderColor: st.color }}>
          <p style={s.infoText}>{st.grow}</p>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { padding: '16px 16px 48px' },
  hero: { textAlign: 'center', padding: '28px 8px 24px' },
  heroIcon: { fontSize: 44, color: '#7C3AED', marginBottom: 12, lineHeight: 1 },
  heroTitle: {
    fontSize: 24, fontWeight: 800, color: '#1F2937',
    fontFamily: "'Playfair Display', serif", marginBottom: 10,
  },
  heroSub: { fontSize: 14, color: '#6B7280', lineHeight: 1.7, maxWidth: 300, margin: '0 auto 24px' },

  btn: {
    width: '100%', padding: '14px', background: '#7C3AED', color: 'white',
    border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer',
  },
  btnLink: {
    display: 'block', width: '100%', padding: '14px', background: '#7C3AED', color: 'white',
    borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none',
  },
  btnOutline: {
    width: '100%', padding: '13px', background: 'white', color: '#7C3AED',
    border: '2px solid #7C3AED', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer',
  },
  linkBtn: {
    display: 'block', textAlign: 'center', color: '#7C3AED', fontSize: 14,
    fontWeight: 600, textDecoration: 'none', padding: 8,
  },
  backBtn: {
    background: 'none', border: 'none', color: '#7C3AED', fontSize: 14,
    fontWeight: 600, cursor: 'pointer', padding: '0 0 16px', display: 'block',
  },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
  },
  hint: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 10 },

  profileCard: {
    background: 'white', borderRadius: 12, padding: '14px 16px', marginBottom: 10,
    borderLeft: '4px solid', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  pcName: { fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 2 },
  pcStyle: { fontSize: 13, fontWeight: 600, marginBottom: 2 },
  pcDate: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  delBtn: {
    background: 'none', border: 'none', color: '#D1D5DB',
    fontSize: 20, cursor: 'pointer', padding: '0 4px', lineHeight: 1,
  },

  card: {
    background: 'white', borderRadius: 16, padding: '20px', marginBottom: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    fontSize: 20, fontWeight: 800, color: '#1F2937',
    fontFamily: "'Playfair Display', serif", marginBottom: 10,
  },
  cardSub: { fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 20 },
  input: {
    width: '100%', padding: '12px 14px', border: '2px solid #E5E7EB',
    borderRadius: 10, fontSize: 16, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', color: '#1F2937', marginBottom: 16,
  },
  scoreInputRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  scoreInputName: { flex: 1, fontSize: 14, fontWeight: 700 },
  pctInput: {
    width: 72, padding: '10px 10px', border: '2px solid #E5E7EB', borderRadius: 10,
    fontSize: 16, outline: 'none', fontFamily: 'inherit', color: '#1F2937', textAlign: 'right',
  },
  pctSign: { fontSize: 14, color: '#6B7280', width: 14 },

  resultHero: {
    borderRadius: 16, padding: '24px 20px', marginBottom: 24,
    border: '2px solid', textAlign: 'center',
  },
  resultFor: {
    fontSize: 11, fontWeight: 700, color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
  },
  resultPrimary: {
    fontSize: 26, fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: 12,
  },
  resultSummary: { fontSize: 14, color: '#374151', lineHeight: 1.6 },

  scoreRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  scoreName: { fontSize: 11, fontWeight: 700, width: 128, flexShrink: 0, lineHeight: 1.3 },
  scoreTrack: { flex: 1, height: 8, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: 99, transition: 'width 0.6s ease' },
  scoreNum: { fontSize: 14, fontWeight: 700, color: '#374151', width: 40, textAlign: 'right', flexShrink: 0 },

  infoBox: { borderRadius: 12, padding: '16px', border: '1.5px solid', marginBottom: 10 },
  infoTitle: { fontSize: 15, fontWeight: 700, marginBottom: 6 },
  infoText: { fontSize: 14, color: '#374151', lineHeight: 1.7 },
}
