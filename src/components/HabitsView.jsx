import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const PRESET_HABITS = [
  { id: 'prayer',   color: '#A78BFA', name: 'Daily prayer' },
  { id: 'bible',    color: '#6366F1', name: 'Bible study' },
  { id: 'journal',  color: '#EC4899', name: 'Journaling' },
  { id: 'exercise', color: '#10B981', name: 'Exercise' },
  { id: 'water',    color: '#0EA5E9', name: 'Water intake' },
  { id: 'vitamins', color: '#F59E0B', name: 'Vitamins' },
  { id: 'skincare', color: '#F472B6', name: 'Skincare routine' },
  { id: 'gratitude',color: '#EF4444', name: 'Gratitude' },
]

const todayStr = () => new Date().toDateString()

const getLast7 = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toDateString())
  }
  return days
}

export default function HabitsView() {
  const [habits, setHabits] = useLocalStorage('lucys-habits', PRESET_HABITS)
  const [completions, setCompletions] = useLocalStorage('lucys-habit-completions', {})
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#7C3AED')

  const last7 = getLast7()
  const today = todayStr()

  const isDone = (habitId, date) => !!completions[`${habitId}__${date}`]

  const toggle = (habitId) => {
    const key = `${habitId}__${today}`
    setCompletions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const streak = (habitId) => {
    let s = 0
    for (const d of [...last7].reverse()) {
      if (isDone(habitId, d)) s++
      else break
    }
    return s
  }

  const addHabit = () => {
    if (!newName.trim()) return
    setHabits(prev => [...prev, { id: `h_${Date.now()}`, name: newName.trim(), color: newColor }])
    setNewName('')
    setShowAdd(false)
  }

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
    setCompletions(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(k => { if (k.startsWith(`${id}__`)) delete next[k] })
      return next
    })
  }

  const todayDone = habits.filter(h => isDone(h.id, today)).length
  const pct = habits.length ? Math.round((todayDone / habits.length) * 100) : 0

  return (
    <div style={s.page}>
      <div style={s.topRow}>
        <div>
          <div style={s.title}>Habits</div>
          <div style={s.sub}>{todayDone} of {habits.length} done today</div>
        </div>
        <button style={s.addBtn} onClick={() => setShowAdd(x => !x)}>+ New</button>
      </div>

      {/* Progress */}
      <div style={s.progressCard}>
        <div style={s.progressRow}>
          <span style={s.progressLabel}>Today's progress</span>
          <span style={s.progressPct}>{pct}%</span>
        </div>
        <div style={s.track}>
          <div style={{ ...s.fill, width: `${pct}%` }} />
        </div>
      </div>

      {showAdd && (
        <div style={s.addCard}>
          <input
            style={s.addInput}
            placeholder="Habit name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addHabit()}
            autoFocus
          />
          <div style={s.addRow}>
            <input type="color" style={s.colorPicker} value={newColor} onChange={e => setNewColor(e.target.value)} />
            <button style={s.saveHabit} onClick={addHabit}>Add Habit</button>
          </div>
        </div>
      )}

      {/* Habit list */}
      <div style={s.list}>
        {habits.map(h => {
          const done = isDone(h.id, today)
          const s7 = streak(h.id)
          return (
            <div key={h.id} style={s.habitCard}>
              <button
                style={{ ...s.check, ...(done ? { background: h.color, borderColor: h.color } : { borderColor: h.color }) }}
                onClick={() => toggle(h.id)}
              >
                {done && <span style={s.checkMark}>✓</span>}
              </button>

              <div style={s.habitInfo}>
                <div style={{ ...s.habitName, ...(done ? { textDecoration: 'line-through', color: 'var(--text-3)' } : {}) }}>
                  {h.name}
                </div>
                {s7 > 0 && <div style={{ ...s.streakLabel, color: h.color }}>{s7} day streak</div>}
              </div>

              <div style={s.dots}>
                {last7.map(d => (
                  <div
                    key={d}
                    style={{
                      ...s.dot,
                      background: isDone(h.id, d) ? h.color : (d === today ? h.color + '33' : '#F3F4F6'),
                      border: d === today ? `1.5px solid ${h.color}` : '1.5px solid transparent',
                    }}
                  />
                ))}
              </div>

              <button style={s.deleteBtn} onClick={() => deleteHabit(h.id)} title="Remove habit">×</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const s = {
  page: { padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 32 },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 22, fontWeight: 800, color: 'var(--text)', fontFamily: "'Playfair Display', serif" },
  sub: { fontSize: 13, color: 'var(--text-2)', marginTop: 2 },
  addBtn: {
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white', border: 'none', borderRadius: 8,
    padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  progressCard: {
    background: 'white', borderRadius: 'var(--radius)',
    padding: '14px 16px', boxShadow: 'var(--shadow)',
  },
  progressRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: 'var(--text-2)' },
  progressPct: { fontSize: 16, fontWeight: 800, color: 'var(--primary)' },
  track: { height: 7, background: 'var(--primary-pale)', borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', background: 'linear-gradient(90deg, #7C3AED, #EC4899)', borderRadius: 99, transition: 'width 0.4s' },
  addCard: {
    background: 'white', borderRadius: 'var(--radius)',
    padding: '14px 16px', boxShadow: 'var(--shadow)',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  addInput: {
    border: '1.5px solid var(--border)', borderRadius: 8,
    padding: '11px 12px', fontSize: 15, width: '100%',
  },
  addRow: { display: 'flex', gap: 10, alignItems: 'center' },
  colorPicker: { width: 40, height: 40, border: 'none', cursor: 'pointer', borderRadius: 8, padding: 2 },
  saveHabit: {
    flex: 1, background: 'var(--primary)', color: 'white',
    border: 'none', borderRadius: 8, padding: '11px',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  habitCard: {
    background: 'white', borderRadius: 'var(--radius)',
    padding: '12px 14px', boxShadow: 'var(--shadow)',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  check: {
    width: 24, height: 24, borderRadius: '50%',
    border: '2px solid', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'white', cursor: 'pointer',
  },
  checkMark: { color: 'white', fontSize: 12, fontWeight: 700 },
  habitInfo: { flex: 1, minWidth: 0 },
  habitName: { fontSize: 14, fontWeight: 500, color: 'var(--text)' },
  streakLabel: { fontSize: 11, fontWeight: 600, marginTop: 2 },
  dots: { display: 'flex', gap: 3, flexShrink: 0 },
  dot: { width: 8, height: 8, borderRadius: '50%' },
  deleteBtn: {
    fontSize: 16, color: '#D1D5DB', cursor: 'pointer',
    padding: '2px 4px', border: 'none', background: 'none',
    flexShrink: 0, lineHeight: 1,
  },
}
