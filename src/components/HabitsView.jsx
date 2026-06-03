import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const PRESET_HABITS = [
  { id: 'water', icon: '💧', name: 'Drink 8 glasses of water', color: '#0EA5E9' },
  { id: 'exercise', icon: '🏃', name: 'Exercise 30 minutes', color: '#10B981' },
  { id: 'read', icon: '📖', name: 'Read for 20 minutes', color: '#8B5CF6' },
  { id: 'meditate', icon: '🧘', name: 'Meditate', color: '#EC4899' },
  { id: 'sleep', icon: '😴', name: 'Sleep by 10pm', color: '#6366F1' },
  { id: 'gratitude', icon: '🙏', name: 'Write 3 gratitudes', color: '#F59E0B' },
  { id: 'vitamins', icon: '💊', name: 'Take vitamins', color: '#EF4444' },
  { id: 'skincare', icon: '✨', name: 'Skincare routine', color: '#F472B6' },
]

const today = () => new Date().toDateString()
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
  const [newHabit, setNewHabit] = useState({ name: '', icon: '⭐', color: '#7C3AED' })

  const last7 = getLast7()
  const todayStr = today()

  const toggle = (habitId) => {
    setCompletions(prev => {
      const key = `${habitId}__${todayStr}`
      return { ...prev, [key]: !prev[key] }
    })
  }

  const isCompleted = (habitId, dateStr) => {
    return !!completions[`${habitId}__${dateStr}`]
  }

  const streakCount = (habitId) => {
    let streak = 0
    const days = getLast7().reverse()
    for (const d of days) {
      if (isCompleted(habitId, d)) streak++
      else break
    }
    return streak
  }

  const todayCount = habits.filter(h => isCompleted(h.id, todayStr)).length

  const addHabit = () => {
    if (!newHabit.name.trim()) return
    const id = `habit_${Date.now()}`
    setHabits(prev => [...prev, { ...newHabit, id }])
    setNewHabit({ name: '', icon: '⭐', color: '#7C3AED' })
    setShowAdd(false)
  }

  const removeHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <div style={styles.pageTitle}>Habits</div>
          <div style={styles.pageSubtitle}>{todayCount} of {habits.length} habits completed today</div>
        </div>
        <button style={styles.addBtn} onClick={() => setShowAdd(s => !s)}>+ New Habit</button>
      </div>

      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Today's Progress</span>
          <span style={styles.progressPct}>{habits.length ? Math.round((todayCount / habits.length) * 100) : 0}%</span>
        </div>
        <div style={styles.progressTrack}>
          <div style={{
            ...styles.progressFill,
            width: `${habits.length ? (todayCount / habits.length) * 100 : 0}%`
          }} />
        </div>
      </div>

      {showAdd && (
        <div style={styles.addCard}>
          <div style={styles.addTitle}>Add New Habit</div>
          <div style={styles.addRow}>
            <input
              style={styles.iconInput}
              placeholder="🌟"
              value={newHabit.icon}
              onChange={e => setNewHabit(h => ({ ...h, icon: e.target.value }))}
              maxLength={2}
            />
            <input
              style={{ ...styles.textInput, flex: 1 }}
              placeholder="Habit name..."
              value={newHabit.name}
              onChange={e => setNewHabit(h => ({ ...h, name: e.target.value }))}
            />
            <input
              type="color"
              style={styles.colorInput}
              value={newHabit.color}
              onChange={e => setNewHabit(h => ({ ...h, color: e.target.value }))}
            />
            <button style={styles.saveHabitBtn} onClick={addHabit}>Add</button>
          </div>
        </div>
      )}

      {/* 7-day tracker header */}
      <div style={styles.trackerCard}>
        <div style={styles.trackerHeader}>
          <div style={styles.habitColHeader}>Habit</div>
          <div style={styles.daysRow}>
            {last7.map(d => {
              const date = new Date(d)
              const isToday = d === todayStr
              return (
                <div key={d} style={{ ...styles.dayCol, ...(isToday ? styles.dayCurrent : {}) }}>
                  <div style={styles.dayName}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()]}</div>
                  <div style={styles.dayNum}>{date.getDate()}</div>
                </div>
              )
            })}
          </div>
          <div style={styles.streakCol}>Streak</div>
        </div>

        <div style={styles.habitRows}>
          {habits.map(habit => (
            <div key={habit.id} style={styles.habitRow}>
              <div style={styles.habitName}>
                <span style={styles.habitIcon}>{habit.icon}</span>
                <span style={styles.habitLabel}>{habit.name}</span>
                <button style={styles.removeBtn} onClick={() => removeHabit(habit.id)}>✕</button>
              </div>
              <div style={styles.daysRow}>
                {last7.map(d => {
                  const done = isCompleted(habit.id, d)
                  const isToday = d === todayStr
                  return (
                    <div
                      key={d}
                      style={{
                        ...styles.dayCell,
                        ...(done ? { background: habit.color, borderColor: habit.color } : {}),
                        ...(isToday ? styles.todayCell : {}),
                      }}
                      onClick={() => isToday && toggle(habit.id)}
                      title={isToday ? (done ? 'Mark incomplete' : 'Mark complete') : ''}
                    >
                      {done && <span style={styles.checkMark}>✓</span>}
                    </div>
                  )
                })}
              </div>
              <div style={styles.streakCol}>
                <div style={{ ...styles.streak, color: habit.color }}>
                  {streakCount(habit.id) > 0 ? `🔥 ${streakCount(habit.id)}` : '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '32px',
    overflowY: 'auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: '#1E1B4B',
    fontFamily: "'Playfair Display', serif",
  },
  pageSubtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 2 },
  addBtn: {
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  progressCard: {
    background: 'white',
    borderRadius: 16,
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: { fontSize: 14, fontWeight: 600, color: '#1E1B4B' },
  progressPct: { fontSize: 16, fontWeight: 800, color: '#7C3AED' },
  progressTrack: { height: 8, background: '#EDE9FE', borderRadius: 99, overflow: 'hidden' },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
    borderRadius: 99,
    transition: 'width 0.4s',
  },
  addCard: {
    background: 'white',
    borderRadius: 16,
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  addTitle: { fontSize: 14, fontWeight: 600, color: '#1E1B4B', marginBottom: 12 },
  addRow: { display: 'flex', gap: 10, alignItems: 'center' },
  iconInput: {
    width: 44,
    textAlign: 'center',
    border: '1.5px solid #E5E7EB',
    borderRadius: 8,
    padding: '8px 6px',
    fontSize: 18,
    background: '#FAFAFA',
  },
  textInput: {
    border: '1.5px solid #E5E7EB',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 14,
    background: '#FAFAFA',
  },
  colorInput: {
    width: 36,
    height: 36,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    padding: 2,
  },
  saveHabitBtn: {
    background: '#7C3AED',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  trackerCard: {
    background: 'white',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflowX: 'auto',
  },
  trackerHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottom: '1px solid #F3F4F6',
    marginBottom: 8,
  },
  habitColHeader: {
    flex: 1,
    minWidth: 200,
    fontSize: 11,
    fontWeight: 600,
    color: '#9CA3AF',
    letterSpacing: '0.08em',
  },
  daysRow: {
    display: 'flex',
    gap: 6,
  },
  dayCol: {
    width: 44,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  dayCurrent: {},
  dayName: { fontSize: 10, color: '#9CA3AF', fontWeight: 600 },
  dayNum: { fontSize: 12, fontWeight: 700, color: '#374151' },
  streakCol: {
    width: 80,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: 600,
    color: '#9CA3AF',
    letterSpacing: '0.08em',
  },
  habitRows: { display: 'flex', flexDirection: 'column', gap: 4 },
  habitRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #F9FAFB',
  },
  habitName: {
    flex: 1,
    minWidth: 200,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  habitIcon: { fontSize: 18 },
  habitLabel: { fontSize: 13, color: '#374151', fontWeight: 500 },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#D1D5DB',
    fontSize: 10,
    cursor: 'pointer',
    marginLeft: 4,
    padding: '2px 4px',
    opacity: 0,
  },
  dayCell: {
    width: 28,
    height: 28,
    borderRadius: 8,
    border: '1.5px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
    margin: '0 8px',
    transition: 'all 0.2s',
  },
  todayCell: { cursor: 'pointer', borderColor: '#7C3AED' },
  checkMark: { color: 'white', fontSize: 12, fontWeight: 700 },
  streak: { fontSize: 13, fontWeight: 600 },
}
