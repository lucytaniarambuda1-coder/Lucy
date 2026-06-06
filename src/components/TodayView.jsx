import React, { useState } from 'react'
import { buildGCalUrl } from '../utils/gcal'

const CAT_COLORS = {
  home: '#0EA5E9', work: '#059669', personal: '#A78BFA',
  school: '#6366F1', health: '#EF4444', finance: '#D97706',
}

const PRI_COLORS = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }

const DEEP_WORK = {
  0: { label: 'Rest & Reset',        note: 'Church, family, planning for the week ahead' },
  1: { label: "Master's",            note: 'Research, reading, writing, supervisor prep' },
  2: { label: "Master's",            note: 'Research, reading, writing, supervisor prep' },
  3: { label: 'AI Skills',           note: 'Claude, prompting, automation, AI agents' },
  4: { label: 'Dash Digital',        note: 'Dashboard, MSA, operating model, Needle' },
  5: { label: 'Strategic Projects',  note: 'Kenya, consulting portfolio, planning' },
  6: { label: 'CEO Day',             note: 'Masters 3h → Dash Digital 2h → Life in the evening' },
}

function todayKey() {
  return new Date().toDateString()
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning, Lucy'
  if (h < 17) return 'Good afternoon, Lucy'
  return 'Good evening, Lucy'
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function TodayView({ tasks, onToggle, top3, setTop3 }) {
  const [picking, setPicking] = useState(false)
  const [search, setSearch] = useState('')

  const todayIds = top3[todayKey()] || []
  const setTodayIds = (ids) => setTop3(prev => ({ ...prev, [todayKey()]: ids }))

  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const highPri = tasks.filter(t => !t.completed && t.priority === 'high').length
  const remaining = tasks.filter(t => !t.completed).length

  const top3Tasks = todayIds
    .map(id => tasks.find(t => t.id === id))
    .filter(Boolean)

  const pendingTasks = tasks.filter(t => !t.completed && !todayIds.includes(t.id))
  const filtered = search
    ? pendingTasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    : pendingTasks

  const toggleTop3 = (id) => {
    if (todayIds.includes(id)) {
      setTodayIds(todayIds.filter(x => x !== id))
    } else if (todayIds.length < 3) {
      setTodayIds([...todayIds, id])
    }
  }

  const deepWork = DEEP_WORK[new Date().getDay()]

  return (
    <div style={s.page}>
      {/* Greeting */}
      <div style={s.greeting}>{getGreeting()}</div>
      <div style={s.date}>{formatDate()}</div>
      <div style={s.sub}>Pick your Top 3 priorities for today</div>

      {/* Stats */}
      <div style={s.statsGrid}>
        <StatBox label="Total Tasks" value={total} color="var(--primary)" />
        <StatBox label="Completed" value={completed} color="var(--success, #10B981)" />
        <StatBox label="High Priority" value={highPri} color="#EF4444" />
        <StatBox label="Remaining" value={remaining} color="var(--primary)" />
      </div>

      {/* Deep Work Block */}
      <div style={s.section}>
        <div style={s.sectionTitle}>TODAY'S DEEP WORK BLOCK  ·  9:00 – 11:00 AM</div>
        <div style={s.deepWorkCard}>
          <div style={s.deepWorkFocus}>{deepWork.label}</div>
          <div style={s.deepWorkNote}>{deepWork.note}</div>
        </div>
      </div>

      {/* Top 3 */}
      <div style={s.section}>
        <div style={s.sectionTitle}>TODAY'S TOP 3</div>
        <div style={s.top3Card}>
          {top3Tasks.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyText}>No Top 3 selected yet.</div>
              <div style={s.emptyHint}>Tap below to pick your priorities!</div>
            </div>
          ) : (
            top3Tasks.map((task, i) => (
              <div key={task.id} style={s.top3Row}>
                <button
                  style={{ ...s.check, ...(task.completed ? s.checkDone : {}) }}
                  onClick={() => onToggle(task.id)}
                >
                  {task.completed && <span style={s.checkMark}>✓</span>}
                </button>
                <div style={s.top3Content}>
                  <div style={{ ...s.top3Title, ...(task.completed ? s.strikethrough : {}) }}>
                    {task.title}
                  </div>
                  <div style={s.top3Meta}>
                    {task.category && (
                      <span style={{ ...s.catTag, background: CAT_COLORS[task.category] + '22', color: CAT_COLORS[task.category] }}>
                        {task.category}
                      </span>
                    )}
                    <span style={{ ...s.priDot, background: PRI_COLORS[task.priority] || '#9CA3AF' }} />
                    {task.dueDate && (
                      <a href={buildGCalUrl(task)} target="_blank" rel="noopener noreferrer" style={s.gcalLink} onClick={e => e.stopPropagation()}>
                        GCal
                      </a>
                    )}
                  </div>
                </div>
                <button style={s.removeTop3} onClick={() => setTodayIds(todayIds.filter(x => x !== task.id))}>×</button>
              </div>
            ))
          )}
          <button
            style={{ ...s.pickBtn, ...(todayIds.length >= 3 ? s.pickBtnFull : {}) }}
            onClick={() => setPicking(true)}
            disabled={todayIds.length >= 3}
          >
            {todayIds.length >= 3 ? 'Top 3 selected!' : `Pick Top 3 ${todayIds.length > 0 ? `(${todayIds.length}/3)` : ''}`}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={s.section}>
        <div style={s.sectionTitle}>OVERALL PROGRESS</div>
        <div style={s.progressCard}>
          <div style={s.progressRow}>
            <span style={s.progressLabel}>{completed} of {total} tasks done</span>
            <span style={s.progressPct}>{total ? Math.round((completed / total) * 100) : 0}%</span>
          </div>
          <div style={s.track}>
            <div style={{ ...s.fill, width: `${total ? (completed / total) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Picker overlay */}
      {picking && (
        <div style={s.overlay} onClick={() => setPicking(false)}>
          <div style={s.sheet} onClick={e => e.stopPropagation()}>
            <div style={s.sheetHeader}>
              <div style={s.sheetTitle}>Pick Top 3 ({todayIds.length}/3)</div>
              <button style={s.sheetClose} onClick={() => setPicking(false)}>Done</button>
            </div>
            <input
              style={s.sheetSearch}
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            <div style={s.sheetList}>
              {filtered.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>
                  {search ? 'No tasks match' : 'No pending tasks'}
                </div>
              )}
              {filtered.map(task => {
                const picked = todayIds.includes(task.id)
                return (
                  <button
                    key={task.id}
                    style={{ ...s.pickRow, ...(picked ? s.pickRowActive : {}) }}
                    onClick={() => toggleTop3(task.id)}
                    disabled={!picked && todayIds.length >= 3}
                  >
                    <div style={{ ...s.pickCheck, ...(picked ? s.pickCheckDone : {}) }}>
                      {picked && '✓'}
                    </div>
                    <div style={s.pickInfo}>
                      <div style={s.pickTitle}>{task.title}</div>
                      <div style={s.pickMeta}>
                        <span style={{ color: CAT_COLORS[task.category] || '#9CA3AF', fontSize: 12 }}>{task.category}</span>
                        {task.dueDate && <span style={{ color: 'var(--text-3)', fontSize: 11, marginLeft: 6 }}>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                      </div>
                    </div>
                    <span style={{ ...s.priDot, background: PRI_COLORS[task.priority] || '#9CA3AF', flexShrink: 0 }} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div style={s.statBox}>
      <div style={{ ...s.statVal, color }}>{value}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  )
}

const s = {
  page: { padding: '20px 16px 32px', display: 'flex', flexDirection: 'column', gap: 20 },
  greeting: { fontSize: 22, fontWeight: 800, color: 'var(--text)', fontFamily: "'Playfair Display', serif" },
  date: { fontSize: 14, color: 'var(--text-2)', marginTop: -14 },
  sub: { fontSize: 13, color: 'var(--text-2)', fontStyle: 'italic' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  statBox: {
    background: 'white',
    borderRadius: 'var(--radius)',
    padding: '18px 16px',
    boxShadow: 'var(--shadow)',
    textAlign: 'center',
  },
  statVal: { fontSize: 32, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 12, color: 'var(--text-2)', marginTop: 4, fontWeight: 500 },
  section: {},
  sectionTitle: { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 8 },
  deepWorkCard: {
    background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)',
    padding: '14px 16px', borderLeft: '4px solid #0EA5E9',
  },
  deepWorkFocus: { fontSize: 20, fontWeight: 800, color: 'var(--text)', fontFamily: "'Playfair Display', serif" },
  deepWorkNote: { fontSize: 13, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.5 },
  top3Card: {
    background: 'white',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    overflow: 'hidden',
  },
  empty: { padding: '24px 16px 4px', textAlign: 'center' },
  emptyText: { fontSize: 14, color: 'var(--text-2)', fontWeight: 500 },
  emptyHint: { fontSize: 12, color: 'var(--text-3)', marginTop: 4 },
  top3Row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '1px solid #F3F4F6',
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: '2px solid var(--border)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    cursor: 'pointer',
  },
  checkDone: { background: 'var(--primary)', borderColor: 'var(--primary)' },
  checkMark: { color: 'white', fontSize: 11, fontWeight: 700 },
  top3Content: { flex: 1, minWidth: 0 },
  top3Title: { fontSize: 14, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  strikethrough: { textDecoration: 'line-through', color: 'var(--text-3)' },
  top3Meta: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 },
  catTag: { fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99 },
  priDot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
  removeTop3: { color: 'var(--text-3)', fontSize: 18, padding: '4px 8px', cursor: 'pointer' },
  gcalLink: {
    fontSize: 10, fontWeight: 700, color: '#059669',
    textDecoration: 'none', padding: '2px 5px',
    background: '#D1FAE5', borderRadius: 4, lineHeight: 1.4,
  },
  pickBtn: {
    width: '100%',
    padding: '14px 16px',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: 'white',
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    border: 'none',
    cursor: 'pointer',
  },
  pickBtnFull: { background: 'var(--success, #10B981)', cursor: 'default' },
  progressCard: {
    background: 'white',
    borderRadius: 'var(--radius)',
    padding: '16px',
    boxShadow: 'var(--shadow)',
  },
  progressRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressLabel: { fontSize: 13, color: 'var(--text-2)' },
  progressPct: { fontSize: 16, fontWeight: 800, color: 'var(--primary)' },
  track: { height: 8, background: 'var(--primary-pale)', borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', background: 'linear-gradient(90deg, #7C3AED, #EC4899)', borderRadius: 99, transition: 'width 0.4s' },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    zIndex: 500, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
  },
  sheet: {
    background: 'white', borderRadius: '20px 20px 0 0',
    maxHeight: '80vh', display: 'flex', flexDirection: 'column',
  },
  sheetHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid var(--border)',
  },
  sheetTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text)' },
  sheetClose: {
    color: 'var(--primary)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
    background: 'var(--primary-pale)', padding: '6px 14px', borderRadius: 8, border: 'none',
  },
  sheetSearch: {
    margin: '12px 16px',
    border: '1.5px solid var(--border)',
    borderRadius: 10, padding: '10px 14px',
    fontSize: 15, background: '#FAFAFA',
  },
  sheetList: { overflowY: 'auto', flex: 1 },
  pickRow: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
    borderBottom: '1px solid #F9FAFB', textAlign: 'left',
  },
  pickRowActive: { background: 'var(--primary-pale)' },
  pickCheck: {
    width: 22, height: 22, borderRadius: '50%',
    border: '2px solid var(--border)', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: 'white',
  },
  pickCheckDone: { background: 'var(--primary)', borderColor: 'var(--primary)' },
  pickInfo: { flex: 1, minWidth: 0, textAlign: 'left' },
  pickTitle: { fontSize: 14, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  pickMeta: { marginTop: 2 },
}
