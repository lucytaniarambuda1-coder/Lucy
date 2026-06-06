import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const SEASON = {
  name: 'Season 1: Foundation Building',
  years: '2024 – 2027',
  description: 'Build the foundation. Everything else compounds from here.',
  outcomes: [
    'Grow closer to God',
    "Complete the Master's successfully",
    'Become one of the strongest AI-enabled operators at Dash',
    'Help Dash Digital become successful',
    'Build a healthy, joyful life outside of work',
  ],
}

const TIME_BLOCKS = [
  { label: 'Sleep',    hours: 49,   color: '#6366F1' },
  { label: 'Work',     hours: 50,   color: '#059669' },
  { label: 'Commute',  hours: 17.5, color: '#F59E0B' },
  { label: 'Church',   hours: 6,    color: '#EC4899' },
]
const TOTAL_HOURS = 168
const COMMITTED   = 122.5

const CEO_ROTATION = [
  'Document a project case study',
  'Write a LinkedIn post',
  'Update your consulting portfolio',
  'Learn a consulting skill',
]

const AREAS = [
  { key: 'work',     label: 'Work Goals' },
  { key: 'study',    label: 'Study Goals' },
  { key: 'personal', label: 'Personal Goals' },
]

function getWeekKey() {
  const d = new Date()
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}

const emptyGoals = { weekKey: '', work: ['', '', ''], study: ['', '', ''], personal: ['', '', ''] }

export default function FocusView() {
  const [outcomes, setOutcomes] = useLocalStorage('lucys-outcomes', {})
  const [stored, setStored] = useLocalStorage('lucys-weekly-goals', emptyGoals)
  const [savedMsg, setSavedMsg] = useState(false)

  const weekKey = getWeekKey()
  const goals = stored.weekKey === weekKey ? stored : { ...emptyGoals, weekKey }

  const toggleOutcome = (i) => setOutcomes(prev => ({ ...prev, [i]: !prev[i] }))

  const updateGoal = (area, idx, val) => {
    const next = { ...goals, weekKey, [area]: goals[area].map((v, j) => j === idx ? val : v) }
    setStored(next)
  }

  const handleBlur = () => {
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  const weekOfMonth = Math.min(Math.ceil(new Date().getDate() / 7), 4) - 1
  const completedOutcomes = SEASON.outcomes.filter((_, i) => outcomes[i]).length

  return (
    <div style={s.page}>

      {/* Season Banner */}
      <div style={s.seasonBanner}>
        <div style={s.seasonLabel}>CURRENT SEASON</div>
        <div style={s.seasonName}>{SEASON.name}</div>
        <div style={s.seasonYears}>{SEASON.years}</div>
        <div style={s.seasonDesc}>{SEASON.description}</div>
      </div>

      {/* Core Outcomes */}
      <div>
        <div style={s.sectionTitle}>5 CORE OUTCOMES — {completedOutcomes} of 5</div>
        <div style={s.card}>
          {SEASON.outcomes.map((outcome, i) => (
            <button
              key={i}
              style={{ ...s.outcomeRow, ...(i < SEASON.outcomes.length - 1 ? s.outcomeBorder : {}) }}
              onClick={() => toggleOutcome(i)}
            >
              <div style={{ ...s.outcomeCheck, ...(outcomes[i] ? s.outcomeCheckDone : {}) }}>
                {outcomes[i] && <span style={s.checkMark}>✓</span>}
              </div>
              <span style={{ ...s.outcomeText, ...(outcomes[i] ? s.outcomeDone : {}) }}>
                {outcome}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Reality */}
      <div>
        <div style={s.sectionTitle}>YOUR TIME REALITY — 168 HOURS/WEEK</div>
        <div style={s.card}>
          <div style={s.timeBarWrap}>
            {TIME_BLOCKS.map(b => (
              <div
                key={b.label}
                style={{ ...s.timeSegment, background: b.color, flex: b.hours }}
              />
            ))}
            <div style={{ ...s.timeSegment, background: '#E5E7EB', flex: TOTAL_HOURS - COMMITTED }} />
          </div>

          <div style={s.timeLegend}>
            {TIME_BLOCKS.map(b => (
              <div key={b.label} style={s.timeLegendRow}>
                <div style={{ ...s.legendDot, background: b.color }} />
                <span style={s.legendLabel}>{b.label}</span>
                <span style={s.legendHours}>{b.hours}h / week</span>
              </div>
            ))}
            <div style={s.timeDivider} />
            <div style={s.timeLegendRow}>
              <div style={{ ...s.legendDot, background: '#9CA3AF' }} />
              <span style={{ ...s.legendLabel, fontWeight: 600 }}>Committed total</span>
              <span style={{ ...s.legendHours, fontWeight: 700 }}>{COMMITTED}h</span>
            </div>
          </div>

          <div style={s.timeFooter}>
            After meals, chores, and daily essentials — you realistically have{' '}
            <strong>30–35 quality hours each week.</strong>
            {' '}Not everything can have your best energy. Choose deliberately.
          </div>
        </div>
      </div>

      {/* Weekly Goals */}
      <div>
        <div style={s.sectionTitleRow}>
          <span style={s.sectionTitle}>WEEKLY GOALS — {weekKey.replace('-W', ' · Week ')}</span>
          {savedMsg && <span style={s.savedChip}>Saved</span>}
        </div>
        <div style={s.card}>
          {AREAS.map((area, ai) => (
            <div key={area.key} style={{ ...s.goalsArea, ...(ai < AREAS.length - 1 ? s.goalsAreaBorder : {}) }}>
              <div style={s.goalsAreaLabel}>{area.label}</div>
              {goals[area.key].map((val, i) => (
                <div key={i} style={s.goalRow}>
                  <span style={s.goalNum}>{i + 1}</span>
                  <input
                    style={s.goalInput}
                    placeholder={`Goal ${i + 1}...`}
                    value={val}
                    onChange={e => updateGoal(area.key, i, e.target.value)}
                    onBlur={handleBlur}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CEO Saturday */}
      <div>
        <div style={s.sectionTitle}>CEO SATURDAY — CONSULTING HOUR (8:00–9:00 AM)</div>
        <div style={s.card}>
          <div style={s.ceoThisWeek}>
            <div style={s.ceoWeekLabel}>THIS WEEK (WEEK {weekOfMonth + 1} OF MONTH)</div>
            <div style={s.ceoFocus}>{CEO_ROTATION[weekOfMonth]}</div>
          </div>
          <div style={s.ceoRotation}>
            {CEO_ROTATION.map((item, i) => (
              <div key={i} style={{ ...s.ceoRotRow, ...(i < CEO_ROTATION.length - 1 ? { borderBottom: '1px solid #F9FAFB' } : {}) }}>
                <span style={{ ...s.ceoRotNum, ...(i === weekOfMonth ? s.ceoRotNumActive : {}) }}>
                  W{i + 1}
                </span>
                <span style={{ ...s.ceoRotText, ...(i === weekOfMonth ? s.ceoRotTextActive : {}) }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

const s = {
  page: { padding: '20px 16px 48px', display: 'flex', flexDirection: 'column', gap: 20 },

  seasonBanner: {
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    borderRadius: 'var(--radius)', padding: '20px 18px', color: 'white',
  },
  seasonLabel: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.75, marginBottom: 4 },
  seasonName: { fontSize: 20, fontWeight: 800, fontFamily: "'Playfair Display', serif", lineHeight: 1.2 },
  seasonYears: { fontSize: 13, opacity: 0.85, marginTop: 3 },
  seasonDesc: { fontSize: 13, opacity: 0.75, marginTop: 10, fontStyle: 'italic', lineHeight: 1.5 },

  sectionTitle: { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 8 },
  sectionTitleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  savedChip: {
    fontSize: 11, fontWeight: 600, color: '#059669',
    background: '#D1FAE5', padding: '2px 10px', borderRadius: 99,
  },

  card: { background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' },

  outcomeRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '13px 16px', width: '100%',
    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
  },
  outcomeBorder: { borderBottom: '1px solid #F3F4F6' },
  outcomeCheck: {
    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
    border: '2px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white',
  },
  outcomeCheckDone: { background: 'var(--primary)', borderColor: 'var(--primary)' },
  checkMark: { color: 'white', fontSize: 11, fontWeight: 700 },
  outcomeText: { fontSize: 14, color: 'var(--text)', lineHeight: 1.4, textAlign: 'left' },
  outcomeDone: { textDecoration: 'line-through', color: 'var(--text-3)' },

  timeBarWrap: { display: 'flex', height: 12, margin: '16px 16px 0', borderRadius: 99, overflow: 'hidden' },
  timeSegment: { height: '100%' },
  timeLegend: { padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 7 },
  timeLegendRow: { display: 'flex', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  legendLabel: { flex: 1, fontSize: 13, color: 'var(--text-2)' },
  legendHours: { fontSize: 13, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' },
  timeDivider: { height: 1, background: '#F3F4F6', margin: '4px 0' },
  timeFooter: {
    fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65,
    padding: '14px 16px 16px', borderTop: '1px solid #F3F4F6', marginTop: 14,
  },

  goalsArea: { padding: '14px 16px' },
  goalsAreaBorder: { borderBottom: '1px solid #F3F4F6' },
  goalsAreaLabel: { fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: 10 },
  goalRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  goalNum: {
    width: 22, height: 22, borderRadius: '50%',
    background: 'var(--primary-pale)', color: 'var(--primary)',
    fontSize: 11, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  goalInput: {
    flex: 1, border: '1.5px solid var(--border)', borderRadius: 8,
    padding: '9px 10px', fontSize: 14, background: 'white', color: 'var(--text)',
  },

  ceoThisWeek: { padding: '16px 16px 14px', background: 'var(--primary-pale)' },
  ceoWeekLabel: { fontSize: 10, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em', marginBottom: 4 },
  ceoFocus: { fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: "'Playfair Display', serif", lineHeight: 1.3 },
  ceoRotation: { padding: '4px 16px 4px' },
  ceoRotRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' },
  ceoRotNum: { fontSize: 11, fontWeight: 700, color: 'var(--text-3)', width: 24, flexShrink: 0 },
  ceoRotNumActive: { color: 'var(--primary)' },
  ceoRotText: { fontSize: 13, color: 'var(--text-3)' },
  ceoRotTextActive: { color: 'var(--text)', fontWeight: 600 },
}
