import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
// Source of truth for every project. Lives in the GitHub repo; Claude updates it and pushing redeploys the site.
import tracker from '../data/projects.json'

const STATUS = {
  launching: { label: 'Launching', color: '#DB2777', bg: '#FCE7F3' },
  active: { label: 'Active', color: '#7C3AED', bg: '#EDE9FE' },
  planning: { label: 'Planning', color: '#2563EB', bg: '#DBEAFE' },
  ongoing: { label: 'Ongoing', color: '#059669', bg: '#D1FAE5' },
  paused: { label: 'Paused', color: '#6B7280', bg: '#F3F4F6' },
  done: { label: 'Done', color: '#6B7280', bg: '#F3F4F6' },
}

const SEED_LINKS = [
  { id: 1, label: 'Flow Corner website', url: 'https://flowcornerr.netlify.app' },
  { id: 2, label: 'Flow Corner Instagram', url: 'https://www.instagram.com/flow_cornerr/' },
  { id: 3, label: 'My Instagram', url: '' },
  { id: 4, label: 'Substack', url: '' },
  { id: 5, label: 'LinkedIn', url: 'https://www.linkedin.com/in/mukhethwa-lucytania-rambuda-836575169/' },
]

const areaOf = (id) => tracker.areas.find(a => a.id === id) || { name: id, color: '#7C3AED' }

const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const daysUntil = (iso) => Math.round((new Date(iso + 'T00:00:00') - new Date(todayISO() + 'T00:00:00')) / 86400000)
const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
const whenLabel = (iso) => {
  const n = daysUntil(iso)
  if (n === 0) return 'Today'
  if (n === 1) return 'Tomorrow'
  if (n < 0) return `${-n}d overdue`
  return `in ${n}d`
}

export default function ProjectsView({ tasks = [] }) {
  // Ticks made in the app are kept here until Claude copies them into projects.json.
  const [ticks, setTicks] = useLocalStorage('lucys-project-ticks', {})
  const [links, setLinks] = useLocalStorage('lucys-links', SEED_LINKS)
  const [editingLinks, setEditingLinks] = useState(false)
  const [filter, setFilter] = useState('all')
  const [copied, setCopied] = useState(false)

  const isDone = (p, i) => {
    const k = `${p.id}:${i}`
    return k in ticks ? ticks[k] : p.milestones[i].done
  }
  const toggle = (p, i) => {
    const k = `${p.id}:${i}`
    const next = !isDone(p, i)
    setTicks(prev => {
      const copy = { ...prev }
      if (next === p.milestones[i].done) delete copy[k]
      else copy[k] = next
      return copy
    })
  }

  const pending = Object.entries(ticks).map(([k, done]) => {
    const [pid, i] = k.split(':')
    const p = tracker.projects.find(x => x.id === pid)
    const m = p?.milestones[Number(i)]
    return m && m.done !== done ? { project: p.name, text: m.text, done } : null
  }).filter(Boolean)

  const copyUpdates = async () => {
    const text = 'Project updates for Claude:\n' + pending.map(u => `- ${u.project}: ${u.done ? 'DONE' : 'not done'}: ${u.text}`).join('\n')
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  const live = tracker.projects.filter(p => p.status !== 'done')
  const shown = tracker.projects
    .filter(p => filter === 'all' ? p.status !== 'done' : filter === 'done' ? p.status === 'done' : p.area === filter && p.status !== 'done')
    .sort((a, b) => a.priority - b.priority || (a.due || '9999').localeCompare(b.due || '9999'))

  const upcoming = live.flatMap(p => [
    ...p.keyDates.map(d => ({ ...d, project: p })),
    ...(p.due ? [{ date: p.due, label: `Due: ${p.nextAction || p.name}`, project: p }] : []),
  ])
    .filter(d => daysUntil(d.date) >= -3 && daysUntil(d.date) <= 30)
    .sort((a, b) => a.date.localeCompare(b.date))

  const waiting = live.flatMap(p => p.waitingOnLucy.map(text => ({ text, project: p })))
  const dueSoon = live.filter(p => p.due && daysUntil(p.due) <= 14).length

  return (
    <div style={s.page}>
      <h1 style={s.title}>Projects</h1>
      <p style={s.sub}>Updated {fmtDate(tracker.updated)} · saved on GitHub, managed with Claude</p>

      <div style={s.stats}>
        <Stat n={live.length} label="Live projects" />
        <Stat n={dueSoon} label="Due in 14 days" />
        <Stat n={waiting.length} label="Waiting on me" />
      </div>

      {pending.length > 0 && (
        <div style={s.pendingBox}>
          <p style={s.pendingText}>
            You ticked {pending.length} step{pending.length === 1 ? '' : 's'} here. Send them to Claude so they're saved on GitHub.
          </p>
          <button style={s.pendingBtn} onClick={copyUpdates}>{copied ? 'Copied ✓' : 'Copy updates'}</button>
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={s.section}>
          <p style={s.sectionLabel}>Coming up</p>
          <div style={s.listCard}>
            {upcoming.map((d, i) => (
              <div key={i} style={{ ...s.listRow, ...(i ? s.listRowBorder : {}) }}>
                <div style={s.dateCol}>
                  <span style={s.dateText}>{fmtDate(d.date)}</span>
                  <span style={{ ...s.when, ...(daysUntil(d.date) < 0 ? { color: '#EF4444' } : {}) }}>{whenLabel(d.date)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={s.rowText}>{d.label}</p>
                  <p style={{ ...s.rowProject, color: areaOf(d.project.area).color }}>{d.project.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {waiting.length > 0 && (
        <div style={s.section}>
          <p style={s.sectionLabel}>Waiting on me</p>
          <div style={s.listCard}>
            {waiting.map((w, i) => (
              <div key={i} style={{ ...s.listRow, ...(i ? s.listRowBorder : {}) }}>
                <span style={{ ...s.dot, background: areaOf(w.project.area).color }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={s.rowText}>{w.text}</p>
                  <p style={{ ...s.rowProject, color: areaOf(w.project.area).color }}>{w.project.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={s.section}>
        <p style={s.sectionLabel}>All projects</p>
        <div style={s.filters}>
          {[{ id: 'all', name: 'All' }, ...tracker.areas.filter(a => live.some(p => p.area === a.id)), { id: 'done', name: 'Done' }].map(f => (
            <button
              key={f.id}
              style={{ ...s.filterChip, ...(filter === f.id ? s.filterOn : {}) }}
              onClick={() => setFilter(f.id)}
            >
              {f.name}
            </button>
          ))}
        </div>
        {shown.map(p => (
          <ProjectCard
            key={p.id}
            project={p}
            isDone={i => isDone(p, i)}
            onToggle={i => toggle(p, i)}
            relatedCount={p.tag ? tasks.filter(t => !t.completed && t.tags?.includes(p.tag)).length : 0}
          />
        ))}
        {shown.length === 0 && <p style={s.empty}>Nothing here.</p>}
      </div>

      <div style={s.section}>
        <div style={s.sectionHead}>
          <p style={s.sectionLabel}>My Links</p>
          <button style={s.textBtn} onClick={() => setEditingLinks(e => !e)}>
            {editingLinks ? 'Done' : 'Edit'}
          </button>
        </div>
        {editingLinks ? (
          <LinkEditor links={links} setLinks={setLinks} />
        ) : (
          <div style={s.linkGrid}>
            {links.map(l => l.url ? (
              <a key={l.id} style={s.linkChip} href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            ) : (
              <button key={l.id} style={{ ...s.linkChip, ...s.linkEmpty }} onClick={() => setEditingLinks(true)}>
                + Add {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {tracker.log.length > 0 && (
        <div style={s.section}>
          <p style={s.sectionLabel}>Progress log</p>
          <div style={s.listCard}>
            {tracker.log.slice(0, 8).map((l, i) => (
              <div key={i} style={{ ...s.listRow, ...(i ? s.listRowBorder : {}) }}>
                <span style={s.logDate}>{fmtDate(l.date)}</span>
                <p style={{ ...s.rowText, flex: 1 }}>{l.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ n, label }) {
  return (
    <div style={s.stat}>
      <span style={s.statNum}>{n}</span>
      <span style={s.statLabel}>{label}</span>
    </div>
  )
}

function ProjectCard({ project: p, isDone, onToggle, relatedCount }) {
  const [open, setOpen] = useState(false)
  const area = areaOf(p.area)
  const st = STATUS[p.status] || STATUS.active
  const total = p.milestones.length
  const done = p.milestones.filter((_, i) => isDone(i)).length
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div style={{ ...s.card, borderTopColor: area.color }}>
      <button style={s.cardHeadBtn} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div style={s.cardHead}>
          <div style={{ minWidth: 0 }}>
            <p style={{ ...s.kind, color: area.color }}>
              {area.name}{p.priority === 1 ? ' · Top priority' : ''}
            </p>
            <h2 style={s.cardTitle}>{p.name}</h2>
          </div>
          <span style={{ ...s.pill, color: st.color, background: st.bg }}>{st.label}</span>
        </div>

        <div style={s.progressRow}>
          <div style={s.track}>
            <div style={{ ...s.fill, width: `${pct}%`, background: area.color }} />
          </div>
          <span style={s.pct}>{done}/{total}</span>
        </div>

        {p.nextAction && (
          <p style={s.next}>
            <strong>Next:</strong> {p.nextAction}
            {p.due && <span style={{ ...s.due, ...(daysUntil(p.due) < 0 ? { color: '#EF4444' } : {}) }}> · {fmtDate(p.due)} ({whenLabel(p.due)})</span>}
          </p>
        )}
        <span style={s.chevron}>{open ? 'Hide details ▲' : 'Show details ▼'}</span>
      </button>

      {open && (
        <div style={s.details}>
          <p style={s.summary}>{p.summary}</p>

          <div style={s.steps}>
            {p.milestones.map((m, i) => {
              const d = isDone(i)
              return (
                <div key={i} style={s.stepRow}>
                  <button
                    style={{ ...s.check, ...(d ? { background: area.color, borderColor: area.color } : {}) }}
                    onClick={() => onToggle(i)}
                    aria-label={d ? 'Mark not done' : 'Mark done'}
                  >
                    {d ? '✓' : ''}
                  </button>
                  <span style={s.stepText}>
                    <span style={d ? s.stepDone : undefined}>{m.text}</span>
                    {d !== m.done && <span style={s.changed}> · changed here</span>}
                  </span>
                </div>
              )
            })}
          </div>

          {p.links.length > 0 && (
            <div style={s.linkGrid}>
              {p.links.map(l => (
                <a key={l.url} style={s.linkChip} href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
              ))}
            </div>
          )}

          <p style={s.meta}>
            {p.folder && <>📁 {p.folder}<br /></>}
            Last updated {fmtDate(p.updated)}
            {relatedCount > 0 && <> · {relatedCount} open task{relatedCount === 1 ? '' : 's'} tagged #{p.tag}</>}
          </p>
        </div>
      )}
    </div>
  )
}

function LinkEditor({ links, setLinks }) {
  const update = (id, field, val) => setLinks(prev => prev.map(l => (l.id === id ? { ...l, [field]: val } : l)))
  return (
    <div style={s.card}>
      {links.map(l => (
        <div key={l.id} style={s.linkEditRow}>
          <input style={s.linkLabelInput} value={l.label} onChange={e => update(l.id, 'label', e.target.value)} />
          <div style={s.linkUrlRow}>
            <input
              style={s.linkUrlInput}
              placeholder="https://..."
              value={l.url}
              inputMode="url"
              onChange={e => update(l.id, 'url', e.target.value.trim())}
            />
            <button style={s.delBtn} onClick={() => setLinks(prev => prev.filter(x => x.id !== l.id))} aria-label="Remove link">×</button>
          </div>
        </div>
      ))}
      <button style={s.textBtn} onClick={() => setLinks(prev => [...prev, { id: Date.now(), label: 'New link', url: '' }])}>
        + Add link
      </button>
    </div>
  )
}

const s = {
  page: { padding: '16px 16px 48px' },
  title: {
    fontSize: 24, fontWeight: 800, color: '#1F2937',
    fontFamily: "'Playfair Display', serif", marginBottom: 4,
  },
  sub: { fontSize: 13, color: '#6B7280', marginBottom: 16 },

  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 },
  stat: {
    background: 'white', borderRadius: 14, padding: '12px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 2,
  },
  statNum: { fontSize: 22, fontWeight: 800, color: '#1F2937' },
  statLabel: { fontSize: 11, fontWeight: 600, color: '#6B7280', lineHeight: 1.3 },

  pendingBox: {
    background: '#FEF3C7', borderRadius: 14, padding: '12px 14px', marginBottom: 20,
    display: 'flex', alignItems: 'center', gap: 10,
  },
  pendingText: { flex: 1, fontSize: 13, color: '#92400E', lineHeight: 1.4 },
  pendingBtn: {
    border: 'none', background: '#D97706', color: 'white', borderRadius: 10,
    padding: '8px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
  },

  section: { marginBottom: 24 },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
  },
  textBtn: {
    background: 'none', border: 'none', color: '#7C3AED', fontSize: 13,
    fontWeight: 600, cursor: 'pointer', padding: '4px 0',
  },

  listCard: { background: 'white', borderRadius: 16, padding: '4px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  listRow: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0' },
  listRowBorder: { borderTop: '1px solid #F3F4F6' },
  dateCol: { width: 64, flexShrink: 0, display: 'flex', flexDirection: 'column' },
  dateText: { fontSize: 13, fontWeight: 700, color: '#1F2937' },
  when: { fontSize: 11, color: '#9CA3AF', fontWeight: 600 },
  rowText: { fontSize: 14, color: '#374151', lineHeight: 1.4 },
  rowProject: { fontSize: 12, fontWeight: 600, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 99, marginTop: 6, flexShrink: 0 },
  logDate: { width: 52, flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#9CA3AF', paddingTop: 2 },

  filters: { display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 12 },
  filterChip: {
    flexShrink: 0, background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 99,
    padding: '6px 12px', fontSize: 13, fontWeight: 600, color: '#6B7280', cursor: 'pointer',
  },
  filterOn: { background: '#7C3AED', borderColor: '#7C3AED', color: 'white' },
  empty: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', padding: 20 },

  linkGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  linkChip: {
    background: 'white', color: '#7C3AED', border: '1.5px solid #DDD6FE', borderRadius: 99,
    padding: '8px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  },
  linkEmpty: { color: '#9CA3AF', borderStyle: 'dashed', borderColor: '#D1D5DB', background: 'transparent' },
  linkEditRow: { marginBottom: 14 },
  linkLabelInput: {
    width: '100%', border: 'none', fontSize: 13, fontWeight: 700, color: '#374151',
    marginBottom: 4, outline: 'none', fontFamily: 'inherit', background: 'transparent',
  },
  linkUrlRow: { display: 'flex', alignItems: 'center', gap: 6 },
  linkUrlInput: {
    flex: 1, minWidth: 0, padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: 10,
    fontSize: 15, outline: 'none', fontFamily: 'inherit', color: '#1F2937',
  },

  card: {
    background: 'white', borderRadius: 16, padding: '18px', marginBottom: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: '4px solid transparent',
  },
  cardHeadBtn: {
    display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none',
    padding: 0, cursor: 'pointer', fontFamily: 'inherit', color: 'inherit',
  },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  kind: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 },
  cardTitle: {
    fontSize: 19, fontWeight: 800, color: '#1F2937',
    fontFamily: "'Playfair Display', serif", lineHeight: 1.3,
  },
  pill: { fontSize: 11, fontWeight: 700, borderRadius: 99, padding: '4px 10px', flexShrink: 0 },
  progressRow: { display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' },
  track: { flex: 1, height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99, transition: 'width 0.4s ease' },
  pct: { fontSize: 12, fontWeight: 700, color: '#6B7280' },
  next: { fontSize: 13, color: '#374151', lineHeight: 1.45, marginBottom: 8 },
  due: { color: '#6B7280', fontWeight: 600 },
  chevron: { fontSize: 12, fontWeight: 600, color: '#9CA3AF' },

  details: { marginTop: 14, paddingTop: 14, borderTop: '1px solid #F3F4F6' },
  summary: { fontSize: 13, color: '#6B7280', lineHeight: 1.5, marginBottom: 14 },
  steps: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 },
  stepRow: { display: 'flex', alignItems: 'center', gap: 10 },
  check: {
    width: 22, height: 22, borderRadius: 6, border: '2px solid #D1D5DB', background: 'white',
    color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
  },
  stepText: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 1.4 },
  stepDone: { textDecoration: 'line-through', color: '#9CA3AF' },
  changed: { fontSize: 11, color: '#D97706', fontWeight: 700, textDecoration: 'none' },
  meta: { fontSize: 12, color: '#9CA3AF', marginTop: 14, lineHeight: 1.6 },
  delBtn: {
    background: 'none', border: 'none', color: '#D1D5DB',
    fontSize: 20, cursor: 'pointer', padding: '0 4px', lineHeight: 1,
  },
}
