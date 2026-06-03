import React, { useState } from 'react'
import { buildGCalUrl } from '../utils/gcal'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const PRI_COLORS = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }
const CAT_COLORS = {
  home: '#0EA5E9', work: '#059669', personal: '#A78BFA',
  school: '#6366F1', health: '#EF4444', finance: '#D97706',
}

function getWeekStart(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + offset * 7)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function fmt(date) { return date.toISOString().split('T')[0] }
function fmtShort(date) { return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }

export default function WeeklyPlanner({ tasks, onAdd, onToggle }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [expandedDay, setExpandedDay] = useState(null)
  const [quickDay, setQuickDay] = useState(null)
  const [quickTitle, setQuickTitle] = useState('')

  const weekStart = getWeekStart(weekOffset)
  const today = fmt(new Date())

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    const dateStr = fmt(date)
    const dayTasks = tasks.filter(t => t.dueDate === dateStr)
    return { date, dateStr, dayName: DAYS[date.getDay()], tasks: dayTasks }
  })

  const handleQuickAdd = (dateStr) => {
    if (!quickTitle.trim()) return
    onAdd({ title: quickTitle.trim(), dueDate: dateStr, category: 'work', priority: 'medium', description: '', dueTime: '', tags: [] })
    setQuickTitle('')
    setQuickDay(null)
  }

  const weekLabel = () => {
    if (weekOffset === 0) return 'This Week'
    if (weekOffset === -1) return 'Last Week'
    if (weekOffset === 1) return 'Next Week'
    return `${fmtShort(weekStart)} – ${fmtShort(addDays(weekStart, 6))}`
  }

  return (
    <div style={s.page}>
      {/* Navigation */}
      <div style={s.navRow}>
        <button style={s.navBtn} onClick={() => setWeekOffset(w => w - 1)}>← Prev</button>
        <button style={s.thisWeekBtn} onClick={() => setWeekOffset(0)}>{weekLabel()}</button>
        <button style={s.navBtn} onClick={() => setWeekOffset(w => w + 1)}>Next →</button>
      </div>

      {/* Day cards */}
      {days.map(({ date, dateStr, dayName, tasks: dayTasks }) => {
        const isToday = dateStr === today
        const pending = dayTasks.filter(t => !t.completed)
        const done = dayTasks.filter(t => t.completed)
        const isExpanded = expandedDay === dateStr
        const isAddingHere = quickDay === dateStr

        return (
          <div key={dateStr} style={{ ...s.dayCard, ...(isToday ? s.todayCard : {}) }}>
            <div style={s.dayHeader} onClick={() => setExpandedDay(isExpanded ? null : dateStr)}>
              <div>
                <div style={{ ...s.dayName, ...(isToday ? s.todayName : {}) }}>
                  {dayName}{isToday ? ' (Today)' : ''}
                </div>
                <div style={s.dayDate}>{fmtShort(date)}</div>
              </div>
              <div style={s.dayRight}>
                {dayTasks.length > 0 && (
                  <span style={s.countBadge}>{pending.length} task{pending.length !== 1 ? 's' : ''}</span>
                )}
                <span style={s.chevron}>{isExpanded ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Always show tasks if any, or drop zone */}
            <div style={s.dayBody}>
              {dayTasks.length === 0 && !isAddingHere ? (
                <div style={s.dropZone}>Drop tasks here</div>
              ) : (
                <div style={s.taskList}>
                  {pending.map(task => (
                    <DayTask key={task.id} task={task} onToggle={onToggle} />
                  ))}
                  {done.map(task => (
                    <DayTask key={task.id} task={task} onToggle={onToggle} done />
                  ))}
                </div>
              )}

              {/* Quick add row */}
              {isAddingHere ? (
                <div style={s.quickRow}>
                  <input
                    style={s.quickInput}
                    placeholder="Task title..."
                    value={quickTitle}
                    autoFocus
                    onChange={e => setQuickTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleQuickAdd(dateStr)
                      if (e.key === 'Escape') setQuickDay(null)
                    }}
                  />
                  <button style={s.quickSave} onClick={() => handleQuickAdd(dateStr)}>Add</button>
                  <button style={s.quickCancel} onClick={() => setQuickDay(null)}>×</button>
                </div>
              ) : (
                <button style={s.addDayBtn} onClick={() => { setQuickDay(dateStr); setQuickTitle('') }}>
                  + Add task...
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DayTask({ task, onToggle, done }) {
  return (
    <div style={{ ...s.dayTask, ...(done ? s.dayTaskDone : {}) }}>
      <button
        style={{ ...s.check, ...(done ? s.checkDone : {}) }}
        onClick={() => onToggle(task.id)}
      >
        {done && <span style={s.checkMark}>✓</span>}
      </button>
      <span style={{ ...s.taskTitle, ...(done ? { textDecoration: 'line-through', color: 'var(--text-3)' } : {}) }}>
        {task.title}
      </span>
      <div style={{ ...s.priDot, background: PRI_COLORS[task.priority] || '#9CA3AF' }} />
      {task.dueDate && (
        <a
          href={buildGCalUrl(task)}
          target="_blank"
          rel="noopener noreferrer"
          style={s.gcalLink}
          onClick={e => e.stopPropagation()}
        >
          GCal
        </a>
      )}
    </div>
  )
}

const s = {
  page: { padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 32 },
  navRow: { display: 'flex', gap: 8, alignItems: 'center' },
  navBtn: {
    border: '1.5px solid var(--border)', borderRadius: 8,
    padding: '9px 14px', fontSize: 13, fontWeight: 600,
    color: 'var(--text-2)', background: 'white', cursor: 'pointer', flexShrink: 0,
  },
  thisWeekBtn: {
    flex: 1, border: '1.5px solid var(--border)', borderRadius: 8,
    padding: '9px 14px', fontSize: 13, fontWeight: 700,
    color: 'var(--text)', background: 'white', cursor: 'pointer',
  },
  dayCard: {
    background: 'white', borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)', overflow: 'hidden',
    border: '1.5px solid transparent',
  },
  todayCard: { border: '1.5px solid var(--primary)' },
  dayHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 14px', cursor: 'pointer',
  },
  dayName: { fontSize: 15, fontWeight: 700, color: 'var(--text)' },
  todayName: { color: 'var(--primary)' },
  dayDate: { fontSize: 12, color: 'var(--text-3)', marginTop: 1 },
  dayRight: { display: 'flex', alignItems: 'center', gap: 8 },
  countBadge: {
    fontSize: 11, fontWeight: 600, color: 'var(--primary)',
    background: 'var(--primary-pale)', padding: '2px 8px', borderRadius: 99,
  },
  chevron: { fontSize: 10, color: 'var(--text-3)' },
  dayBody: { padding: '0 14px 12px' },
  dropZone: {
    border: '1.5px dashed var(--border)', borderRadius: 8,
    padding: '20px', textAlign: 'center',
    color: 'var(--text-3)', fontSize: 13, marginBottom: 8,
  },
  taskList: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 },
  dayTask: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 10px', background: '#F9FAFB',
    borderRadius: 8,
  },
  dayTaskDone: { opacity: 0.6 },
  check: {
    width: 20, height: 20, borderRadius: '50%',
    border: '2px solid var(--border)', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'white', cursor: 'pointer',
  },
  checkDone: { background: 'var(--primary)', borderColor: 'var(--primary)' },
  checkMark: { color: 'white', fontSize: 10, fontWeight: 700 },
  taskTitle: { flex: 1, fontSize: 13, color: 'var(--text)' },
  priDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  gcalLink: {
    fontSize: 10, fontWeight: 700, color: '#059669',
    textDecoration: 'none', padding: '2px 5px',
    background: '#D1FAE5', borderRadius: 4, flexShrink: 0,
  },
  quickRow: { display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 },
  quickInput: {
    flex: 1, border: '1.5px solid var(--primary)', borderRadius: 8,
    padding: '9px 10px', fontSize: 14, background: 'white',
  },
  quickSave: {
    background: 'var(--primary)', color: 'white',
    border: 'none', borderRadius: 8, padding: '9px 14px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
  },
  quickCancel: {
    color: 'var(--text-3)', fontSize: 20, padding: '4px 8px',
    cursor: 'pointer', border: 'none', background: 'none',
  },
  addDayBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', padding: '9px 12px', marginTop: 4,
    border: '1.5px solid var(--border)', borderRadius: 8,
    fontSize: 13, color: 'var(--text-2)', background: 'white',
    cursor: 'pointer', textAlign: 'left',
  },
}
