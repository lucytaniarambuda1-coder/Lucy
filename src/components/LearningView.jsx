import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { MODULES, COURSES, GLOSSARY, WEEKLY_GOAL_HOURS, WEEK_SPLIT } from '../data/learning'

const SECTIONS = [
  { id: 'week', label: 'This week' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'calc', label: 'P&L calculator' },
  { id: 'courses', label: 'Courses' },
  { id: 'glossary', label: 'Glossary' },
]

// ── date helpers (local time, YYYY-MM-DD) ──
const iso = (d) => d.toLocaleDateString('en-CA')
const mondayOf = (d) => { const x = new Date(d); const day = (x.getDay() + 6) % 7; x.setDate(x.getDate() - day); x.setHours(0, 0, 0, 0); return x }
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
const fmtDay = (s) => new Date(s + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })
const rand = (n) => (n < 0 ? '−R' : 'R') + Math.abs(Math.round(n)).toLocaleString('en-ZA')
const pct = (n) => (isFinite(n) ? (n * 100).toFixed(1) + '%' : '—')

// Renders **bold** inside lesson text
function Rich({ text }) {
  return <>{text.split(/(\*\*[^*]+\*\*)/).map((p, i) => p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>)}</>
}

export default function LearningView() {
  const [section, setSection] = useLocalStorage('lucys-learning-section', 'week')
  const [openModule, setOpenModule] = useState(null)
  const go = (id, mod = null) => { setSection(id); setOpenModule(mod); window.scrollTo({ top: 0 }) }

  return (
    <div style={s.page}>
      <div style={s.pillRow}>
        {SECTIONS.map(x => (
          <button key={x.id} onClick={() => go(x.id)} style={{ ...s.pill, ...(section === x.id ? s.pillActive : {}) }}>{x.label}</button>
        ))}
      </div>
      {section === 'week' && <WeekSection go={go} />}
      {section === 'lessons' && <LessonsSection openModule={openModule} setOpenModule={setOpenModule} />}
      {section === 'calc' && <CalcSection />}
      {section === 'courses' && <CoursesSection />}
      {section === 'glossary' && <GlossarySection />}
    </div>
  )
}

// ───────────────────────── This week ─────────────────────────
function WeekSection({ go }) {
  const [start, setStart] = useLocalStorage('lucys-learning-start', iso(mondayOf(new Date())))
  const [log, setLog] = useLocalStorage('lucys-learning-log', [])
  const [done] = useLocalStorage('lucys-learning-done', {})
  const [minutes, setMinutes] = useState(60)
  const [kind, setKind] = useState('Lessons & practice')
  const [what, setWhat] = useState('')
  const [date, setDate] = useState(iso(new Date()))

  const today = new Date()
  const weekStart = mondayOf(today)
  const weekEnd = addDays(weekStart, 6)
  const planWeek = Math.min(12, Math.max(1, Math.floor((weekStart - new Date(start + 'T00:00:00')) / (7 * 864e5)) + 1))
  const mod = MODULES[planWeek - 1]

  const inWeek = log.filter(e => e.date >= iso(weekStart) && e.date <= iso(weekEnd))
  const weekMins = inWeek.reduce((a, e) => a + e.minutes, 0)
  const weekHours = weekMins / 60
  const totalHours = log.reduce((a, e) => a + e.minutes, 0) / 60
  const byKind = WEEK_SPLIT.map(k => ({ ...k, done: inWeek.filter(e => e.kind === k.label).reduce((a, e) => a + e.minutes, 0) / 60 }))

  // streak: consecutive days with study, counting back from today (or yesterday if nothing yet today)
  const days = new Set(log.map(e => e.date))
  let streak = 0
  let d = days.has(iso(today)) ? today : addDays(today, -1)
  while (days.has(iso(d))) { streak++; d = addDays(d, -1) }

  const addSession = () => {
    if (!minutes) return
    setLog(prev => [{ id: Date.now(), date, minutes: Number(minutes), kind, what: what.trim() }, ...prev])
    setWhat('')
  }
  const remove = (id) => setLog(prev => prev.filter(e => e.id !== id))
  const doneCount = MODULES.filter(m => done[m.id]).length

  return (
    <>
      <div style={s.hero}>
        <div style={s.heroLabel}>Week {planWeek} of 12</div>
        <div style={s.heroBig}>{weekHours.toFixed(1)} <span style={s.heroSmall}>/ {WEEKLY_GOAL_HOURS} hours</span></div>
        <div style={s.barTrack}><div style={{ ...s.barFill, width: Math.min(100, (weekHours / WEEKLY_GOAL_HOURS) * 100) + '%' }} /></div>
        <div style={s.heroStats}>
          <span>🔥 {streak} day streak</span>
          <span>⏱ {totalHours.toFixed(1)} h total</span>
          <span>✓ {doneCount}/12 modules</span>
        </div>
      </div>

      <div style={s.card} onClick={() => go('lessons', mod.id)} role="button">
        <div style={s.kicker}>THIS WEEK'S MODULE</div>
        <div style={s.cardTitle}>{mod.week}. {mod.title} {done[mod.id] && '✓'}</div>
        <div style={s.muted}>{mod.why}</div>
        <div style={s.link}>Open lesson →</div>
      </div>

      <div style={s.card}>
        <div style={s.kicker}>YOUR 20 HOURS</div>
        {byKind.map(k => (
          <div key={k.label} style={{ marginTop: 10 }}>
            <div style={s.rowBetween}><span>{k.label}</span><span style={s.muted}>{k.done.toFixed(1)} / {k.hours} h</span></div>
            <div style={s.barTrackSm}><div style={{ ...s.barFillSm, width: Math.min(100, (k.done / k.hours) * 100) + '%' }} /></div>
          </div>
        ))}
        <div style={{ ...s.muted, marginTop: 10 }}>This week, apply it at work: {mod.apply}</div>
      </div>

      <div style={s.card}>
        <div style={s.kicker}>LOG A STUDY SESSION</div>
        <div style={s.chipRow}>
          {[30, 60, 90, 120, 180].map(m => (
            <button key={m} onClick={() => setMinutes(m)} style={{ ...s.chip, ...(minutes === m ? s.chipActive : {}) }}>{m < 60 ? m + 'm' : m / 60 + 'h'}</button>
          ))}
        </div>
        <div style={s.formRow}>
          <select style={{ ...s.input, flex: 1.4 }} value={kind} onChange={e => setKind(e.target.value)}>
            {WEEK_SPLIT.map(k => <option key={k.label}>{k.label}</option>)}
          </select>
          <input style={s.input} type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <input style={{ ...s.input, width: '100%', marginTop: 8 }} placeholder="What did you study? (optional)" value={what} onChange={e => setWhat(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSession()} />
        <button style={s.primaryBtn} onClick={addSession}>Add {minutes < 60 ? minutes + ' min' : minutes / 60 + ' h'}</button>
      </div>

      {log.length > 0 && (
        <div style={s.card}>
          <div style={s.kicker}>RECENT SESSIONS</div>
          {log.slice(0, 10).map(e => (
            <div key={e.id} style={s.logRow}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{fmtDay(e.date)} · {e.minutes < 60 ? e.minutes + ' min' : (e.minutes / 60) + ' h'}</div>
                <div style={s.muted}>{e.kind}{e.what ? ' · ' + e.what : ''}</div>
              </div>
              <button style={s.xBtn} onClick={() => remove(e.id)} aria-label="Delete session">×</button>
            </div>
          ))}
        </div>
      )}

      <div style={s.footNote}>
        Plan started week of {fmtDay(start)}.{' '}
        <button style={s.textBtn} onClick={() => { if (window.confirm('Restart the 12-week plan from this week? Your logged hours stay.')) setStart(iso(weekStart)) }}>Restart from this week</button>
      </div>
    </>
  )
}

// ───────────────────────── Lessons ─────────────────────────
function LessonsSection({ openModule, setOpenModule }) {
  const [done, setDone] = useLocalStorage('lucys-learning-done', {})
  const mod = MODULES.find(m => m.id === openModule)
  if (mod) return <LessonDetail mod={mod} isDone={!!done[mod.id]} toggle={() => setDone(p => ({ ...p, [mod.id]: !p[mod.id] }))} back={() => setOpenModule(null)} next={() => { const n = MODULES[MODULES.indexOf(mod) + 1]; setOpenModule(n ? n.id : null); window.scrollTo({ top: 0 }) }} />

  return (
    <>
      <div style={s.intro}>12 modules, one per week. Each has the key ideas, a worked AI example, a practice question and flashcards. All numbers are made up for practice.</div>
      {MODULES.map(m => (
        <button key={m.id} style={s.moduleRow} onClick={() => { setOpenModule(m.id); window.scrollTo({ top: 0 }) }}>
          <span style={{ ...s.weekBadge, ...(done[m.id] ? s.weekBadgeDone : {}) }}>{done[m.id] ? '✓' : m.week}</span>
          <span style={{ flex: 1, textAlign: 'left' }}>
            <span style={{ display: 'block', fontWeight: 600 }}>{m.title}</span>
            <span style={s.mutedSm}>Week {m.week}</span>
          </span>
          <span style={s.muted}>›</span>
        </button>
      ))}
    </>
  )
}

function LessonDetail({ mod, isDone, toggle, back, next }) {
  const [reveal, setReveal] = useState(false)
  const [card, setCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const courses = COURSES.filter(c => c.modules.includes(mod.week))
  const fc = mod.flashcards[card]
  React.useEffect(() => { setReveal(false); setCard(0); setFlipped(false) }, [mod.id])

  return (
    <>
      <button style={s.textBtn} onClick={back}>‹ All modules</button>
      <div style={s.hero}>
        <div style={s.heroLabel}>Week {mod.week}</div>
        <div style={{ ...s.heroBig, fontSize: 24 }}>{mod.title}</div>
        <div style={{ opacity: 0.9, fontSize: 14, marginTop: 6 }}>{mod.why}</div>
      </div>

      <div style={s.card}>
        <div style={s.kicker}>KEY IDEAS</div>
        <ul style={s.list}>{mod.points.map((p, i) => <li key={i} style={s.li}><Rich text={p} /></li>)}</ul>
      </div>

      <div style={s.card}>
        <div style={s.kicker}>WORKED EXAMPLE</div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>{mod.example.title}</div>
        {mod.example.rows.map(([l, r], i) => (
          <div key={i} style={s.exRow}><span>{l}</span><span style={s.exVal}>{r}</span></div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.kicker}>PRACTICE</div>
        <div style={{ lineHeight: 1.5 }}>{mod.practice.q}</div>
        {reveal
          ? <div style={s.answer}><Rich text={mod.practice.a} /></div>
          : <button style={s.secondaryBtn} onClick={() => setReveal(true)}>Work it out, then show answer</button>}
      </div>

      <div style={s.card}>
        <div style={s.kicker}>FLASHCARDS · {card + 1}/{mod.flashcards.length}</div>
        <button style={{ ...s.flash, ...(flipped ? s.flashBack : {}) }} onClick={() => setFlipped(f => !f)}>
          {flipped ? fc[1] : fc[0]}
          <span style={s.flashHint}>{flipped ? 'answer' : 'tap to flip'}</span>
        </button>
        <div style={s.rowBetween}>
          <button style={s.textBtn} disabled={card === 0} onClick={() => { setCard(c => c - 1); setFlipped(false) }}>‹ Prev</button>
          <button style={s.textBtn} disabled={card === mod.flashcards.length - 1} onClick={() => { setCard(c => c + 1); setFlipped(false) }}>Next ›</button>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.kicker}>APPLY IT AT WORK (2 H)</div>
        <div style={{ lineHeight: 1.5 }}>{mod.apply}</div>
      </div>

      {courses.length > 0 && (
        <div style={s.card}>
          <div style={s.kicker}>COURSES FOR THIS MODULE</div>
          {courses.map(c => (
            <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" style={s.courseLink}>
              <span><CostTag cost={c.cost} /> {c.title}</span>
              <span style={s.mutedSm}>{c.platform} ↗</span>
            </a>
          ))}
        </div>
      )}

      <button style={{ ...s.primaryBtn, ...(isDone ? s.doneBtn : {}) }} onClick={toggle}>{isDone ? '✓ Module complete (tap to undo)' : 'Mark module complete'}</button>
      {mod.week < 12 && <button style={{ ...s.secondaryBtn, width: '100%' }} onClick={next}>Next module ›</button>}
    </>
  )
}

// ───────────────────────── P&L calculator ─────────────────────────
const CALC_DEFAULTS = {
  customers: 50, price: 10000, convPerCustomer: 4000, tokensIn: 2000, tokensOut: 500,
  priceIn: 55, priceOut: 275, hosting: 25000, otherCogs: 70000,
  salaries: 200000, marketing: 50000, admin: 30000,
}
const CALC_FIELDS = [
  ['REVENUE', [['customers', 'Paying customers'], ['price', 'Price per customer / month (R)']]],
  ['USAGE & MODEL COST', [['convPerCustomer', 'Requests per customer / month'], ['tokensIn', 'Input tokens per request'], ['tokensOut', 'Output tokens per request'], ['priceIn', 'R per million input tokens'], ['priceOut', 'R per million output tokens']]],
  ['OTHER COGS (per month)', [['hosting', 'Hosting, vector DB, tools (R)'], ['otherCogs', 'Human review + support (R)']]],
  ['OPEX (per month)', [['salaries', 'Salaries / R&D (R)'], ['marketing', 'Sales & marketing (R)'], ['admin', 'General & admin (R)']]],
]

function CalcSection() {
  const [v, setV] = useLocalStorage('lucys-learning-calc', CALC_DEFAULTS)
  const n = (k) => Number(v[k]) || 0
  const requests = n('customers') * n('convPerCustomer')
  const costPerReq = (n('tokensIn') / 1e6) * n('priceIn') + (n('tokensOut') / 1e6) * n('priceOut')
  const revenue = n('customers') * n('price')
  const modelCost = requests * costPerReq
  const cogs = modelCost + n('hosting') + n('otherCogs')
  const gross = revenue - cogs
  const opex = n('salaries') + n('marketing') + n('admin')
  const ebitda = gross - opex

  return (
    <>
      <div style={s.intro}>Change any number and the P&L updates. The starting numbers are the made-up HelpBot example from Module 3.</div>
      <div style={s.card}>
        <div style={s.kicker}>YOUR P&L (per month)</div>
        <PLRow label="Revenue" value={rand(revenue)} strong />
        <PLRow label="  Model / API cost" value={'− ' + rand(modelCost)} />
        <PLRow label="  Hosting & tools" value={'− ' + rand(n('hosting'))} />
        <PLRow label="  Human review & support" value={'− ' + rand(n('otherCogs'))} />
        <PLRow label="Total COGS" value={'− ' + rand(cogs)} />
        <PLRow label="Gross profit" value={rand(gross)} note={pct(gross / revenue) + ' gross margin'} strong good={gross >= 0} />
        <PLRow label="Operating expenses" value={'− ' + rand(opex)} />
        <PLRow label="EBITDA" value={rand(ebitda)} note={pct(ebitda / revenue) + ' margin'} strong good={ebitda >= 0} />
      </div>
      <div style={s.card}>
        <div style={s.kicker}>UNIT ECONOMICS</div>
        <PLRow label="Requests per month" value={requests.toLocaleString('en-ZA')} />
        <PLRow label="Model cost per request" value={'R' + costPerReq.toFixed(4)} />
        <PLRow label="Full COGS per request" value={requests ? 'R' + (cogs / requests).toFixed(3) : '—'} />
        <PLRow label="COGS per customer" value={n('customers') ? rand(cogs / n('customers')) : '—'} />
        <PLRow label="Contribution per customer" value={n('customers') ? rand(gross / n('customers')) : '—'} />
      </div>
      {CALC_FIELDS.map(([group, fields]) => (
        <div key={group} style={s.card}>
          <div style={s.kicker}>{group}</div>
          {fields.map(([k, label]) => (
            <label key={k} style={s.calcRow}>
              <span style={{ fontSize: 14 }}>{label}</span>
              <input style={s.calcInput} type="number" inputMode="decimal" value={v[k]} onChange={e => setV(p => ({ ...p, [k]: e.target.value }))} />
            </label>
          ))}
        </div>
      ))}
      <button style={{ ...s.secondaryBtn, width: '100%' }} onClick={() => setV(CALC_DEFAULTS)}>Reset to example numbers</button>
    </>
  )
}

function PLRow({ label, value, note, strong, good }) {
  return (
    <div style={{ ...s.plRow, ...(strong ? s.plStrong : {}) }}>
      <span style={{ whiteSpace: 'pre' }}>{label}</span>
      <span style={{ textAlign: 'right' }}>
        <span style={good === false ? { color: 'var(--danger)' } : {}}>{value}</span>
        {note && <span style={{ display: 'block', ...s.mutedSm }}>{note}</span>}
      </span>
    </div>
  )
}

// ───────────────────────── Courses ─────────────────────────
const STATUS = { not: 'Not started', doing: 'In progress', done: 'Done' }
const NEXT_STATUS = { not: 'doing', doing: 'done', done: 'not' }

function CoursesSection() {
  const [status, setStatus] = useLocalStorage('lucys-learning-courses', {})
  const [filter, setFilter] = useState('all')
  const list = COURSES.filter(c => filter === 'all' || (filter === 'free' ? c.cost === 'free' : filter === 'doing' ? status[c.id] === 'doing' : c.cost === 'paid'))
    .slice().sort((a, b) => Math.min(...a.modules) - Math.min(...b.modules))

  return (
    <>
      <div style={s.intro}>Prices change often, so they are not listed here; check them on each site. Many Coursera courses can be audited for free (no certificate): look for "Audit" when you enrol.</div>
      <div style={s.chipRow}>
        {[['all', 'All'], ['free', 'Free'], ['paid', 'Paid'], ['doing', 'In progress']].map(([id, l]) => (
          <button key={id} onClick={() => setFilter(id)} style={{ ...s.chip, ...(filter === id ? s.chipActive : {}) }}>{l}</button>
        ))}
      </div>
      {list.length === 0 && <div style={s.intro}>Nothing here yet.</div>}
      {list.map(c => {
        const st = status[c.id] || 'not'
        return (
          <div key={c.id} style={s.card}>
            <div style={s.rowBetween}><CostTag cost={c.cost} /><span style={s.mutedSm}>Week{c.modules.length > 1 ? 's' : ''} {c.modules.join(', ')}</span></div>
            <div style={{ ...s.cardTitle, marginTop: 6 }}>{c.title}</div>
            <div style={s.mutedSm}>{c.provider} · {c.platform}</div>
            <div style={{ ...s.muted, marginTop: 6 }}>{c.note}</div>
            <div style={{ ...s.rowBetween, marginTop: 10 }}>
              <a href={c.url} target="_blank" rel="noopener noreferrer" style={s.link}>Open course ↗</a>
              <button style={{ ...s.statusBtn, ...(st === 'doing' ? s.statusDoing : st === 'done' ? s.statusDone : {}) }} onClick={() => setStatus(p => ({ ...p, [c.id]: NEXT_STATUS[st] }))}>{STATUS[st]}</button>
            </div>
          </div>
        )
      })}
    </>
  )
}

function CostTag({ cost }) {
  return <span style={{ ...s.tag, ...(cost === 'free' ? s.tagFree : s.tagPaid) }}>{cost === 'free' ? 'FREE' : 'PAID'}</span>
}

// ───────────────────────── Glossary ─────────────────────────
function GlossarySection() {
  const [q, setQ] = useState('')
  const list = GLOSSARY.filter(([t, d]) => !q || (t + ' ' + d).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <input style={{ ...s.input, width: '100%', marginBottom: 12 }} placeholder="Search terms (e.g. COGS, EBITDA, token)" value={q} onChange={e => setQ(e.target.value)} />
      <div style={s.card}>
        {list.length === 0 && <div style={s.muted}>No match.</div>}
        {list.map(([t, d]) => (
          <div key={t} style={s.glossRow}>
            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{t}</div>
            <div style={{ fontSize: 14, lineHeight: 1.5 }}>{d}</div>
          </div>
        ))}
      </div>
    </>
  )
}

const s = {
  page: { padding: '14px 16px 40px', display: 'flex', flexDirection: 'column', gap: 12 },
  pillRow: { display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 },
  pill: { flexShrink: 0, padding: '8px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: 'var(--text-2)', background: 'white', boxShadow: 'var(--shadow)', whiteSpace: 'nowrap' },
  pillActive: { background: 'var(--primary)', color: 'white' },
  hero: { background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: 'white', borderRadius: 16, padding: 18 },
  heroLabel: { fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 },
  heroBig: { fontSize: 34, fontWeight: 800, fontFamily: "'Playfair Display', serif", marginTop: 4 },
  heroSmall: { fontSize: 16, fontWeight: 500, fontFamily: 'Inter, sans-serif', opacity: 0.85 },
  heroStats: { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 10, opacity: 0.95, gap: 8, flexWrap: 'wrap' },
  barTrack: { height: 10, background: 'rgba(255,255,255,0.3)', borderRadius: 99, marginTop: 10, overflow: 'hidden' },
  barFill: { height: '100%', background: 'white', borderRadius: 99, transition: 'width 0.3s' },
  barTrackSm: { height: 6, background: 'var(--primary-pale)', borderRadius: 99, marginTop: 4, overflow: 'hidden' },
  barFillSm: { height: '100%', background: 'var(--primary)', borderRadius: 99 },
  card: { background: 'white', borderRadius: 'var(--radius)', padding: 14, boxShadow: 'var(--shadow)' },
  kicker: { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: 700 },
  muted: { fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 },
  mutedSm: { fontSize: 12, color: 'var(--text-3)' },
  link: { color: 'var(--primary)', fontWeight: 600, fontSize: 14, marginTop: 8, display: 'inline-block', textDecoration: 'none' },
  rowBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontSize: 14 },
  chipRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 },
  chip: { padding: '7px 12px', borderRadius: 99, fontSize: 13, fontWeight: 600, background: '#F3F4F6', color: 'var(--text-2)' },
  chipActive: { background: 'var(--primary-pale)', color: 'var(--primary)' },
  formRow: { display: 'flex', gap: 8 },
  input: { flex: 1, minWidth: 0, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, background: 'white', color: 'var(--text)' },
  primaryBtn: { width: '100%', marginTop: 10, padding: '12px', borderRadius: 12, background: 'var(--primary)', color: 'white', fontWeight: 700, fontSize: 15 },
  doneBtn: { background: 'var(--success)' },
  secondaryBtn: { marginTop: 10, padding: '10px 14px', borderRadius: 12, background: 'var(--primary-pale)', color: 'var(--primary)', fontWeight: 600, fontSize: 14 },
  textBtn: { color: 'var(--primary)', fontWeight: 600, fontSize: 14, padding: '4px 0', alignSelf: 'flex-start' },
  logRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' },
  xBtn: { fontSize: 20, color: 'var(--text-3)', padding: '0 6px' },
  footNote: { fontSize: 12, color: 'var(--text-3)', textAlign: 'center' },
  intro: { fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 },
  moduleRow: { display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 'var(--radius)', padding: 12, boxShadow: 'var(--shadow)', fontSize: 15, color: 'var(--text)' },
  weekBadge: { width: 34, height: 34, borderRadius: 10, background: 'var(--primary-pale)', color: 'var(--primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  weekBadgeDone: { background: 'var(--success)', color: 'white' },
  list: { paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 },
  li: { fontSize: 14, lineHeight: 1.55 },
  exRow: { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 },
  exVal: { fontWeight: 600, textAlign: 'right', maxWidth: '55%' },
  answer: { marginTop: 10, padding: 12, background: '#ECFDF5', borderRadius: 10, fontSize: 14, lineHeight: 1.55 },
  flash: { width: '100%', minHeight: 110, padding: 16, borderRadius: 12, background: 'var(--primary-pale)', color: 'var(--text)', fontSize: 15, fontWeight: 600, lineHeight: 1.45, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 },
  flashBack: { background: '#FDF2F8', fontWeight: 500 },
  flashHint: { fontSize: 11, color: 'var(--text-3)', fontWeight: 500 },
  courseLink: { display: 'flex', justifyContent: 'space-between', gap: 8, padding: '9px 0', borderBottom: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none', fontSize: 14 },
  tag: { fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 6, marginRight: 4 },
  tagFree: { background: '#D1FAE5', color: '#047857' },
  tagPaid: { background: '#FEF3C7', color: '#B45309' },
  statusBtn: { padding: '7px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: '#F3F4F6', color: 'var(--text-2)' },
  statusDoing: { background: '#FEF3C7', color: '#B45309' },
  statusDone: { background: '#D1FAE5', color: '#047857' },
  plRow: { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 14 },
  plStrong: { fontWeight: 700 },
  calcRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '6px 0' },
  calcInput: { width: 120, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, textAlign: 'right', fontSize: 16 },
  glossRow: { padding: '9px 0', borderBottom: '1px solid var(--border)' },
}
