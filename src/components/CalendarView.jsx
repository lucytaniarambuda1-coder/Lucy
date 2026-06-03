import React, { useState } from 'react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const PRIORITY_COLORS = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }

export default function CalendarView({ tasks }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const tasksByDate = tasks.reduce((acc, t) => {
    if (t.dueDate) {
      const d = new Date(t.dueDate)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!acc[day]) acc[day] = []
        acc[day].push(t)
      }
    }
    return acc
  }, {})

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const selectedTasks = selectedDate ? (tasksByDate[selectedDate] || []) : []
  const todayDay = now.getFullYear() === year && now.getMonth() === month ? now.getDate() : null

  const cells = []
  // prev month padding
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: prevMonthDays - firstDay + 1 + i, type: 'prev' })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current' })
  }
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, type: 'next' })
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <div style={styles.pageTitle}>Calendar</div>
          <div style={styles.pageSubtitle}>View your tasks by date</div>
        </div>
      </div>

      <div style={styles.calWrap}>
        <div style={styles.calCard}>
          <div style={styles.calHeader}>
            <button style={styles.navBtn} onClick={prev}>‹</button>
            <div style={styles.monthTitle}>{MONTHS[month]} {year}</div>
            <button style={styles.navBtn} onClick={next}>›</button>
          </div>

          <div style={styles.dayHeaders}>
            {DAYS.map(d => (
              <div key={d} style={styles.dayHeader}>{d}</div>
            ))}
          </div>

          <div style={styles.grid}>
            {cells.map((cell, idx) => {
              const isToday = cell.type === 'current' && cell.day === todayDay
              const isSelected = cell.type === 'current' && cell.day === selectedDate
              const dayTasks = cell.type === 'current' ? (tasksByDate[cell.day] || []) : []
              return (
                <div
                  key={idx}
                  style={{
                    ...styles.cell,
                    ...(cell.type !== 'current' ? styles.cellOther : {}),
                    ...(isToday ? styles.cellToday : {}),
                    ...(isSelected ? styles.cellSelected : {}),
                  }}
                  onClick={() => cell.type === 'current' && setSelectedDate(cell.day === selectedDate ? null : cell.day)}
                >
                  <span style={styles.cellDay}>{cell.day}</span>
                  {dayTasks.length > 0 && (
                    <div style={styles.dotRow}>
                      {dayTasks.slice(0, 3).map(t => (
                        <div key={t.id} style={{ ...styles.dot, background: PRIORITY_COLORS[t.priority] || '#9CA3AF' }} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div style={styles.detailCard}>
          {selectedDate ? (
            <>
              <div style={styles.detailHeader}>
                {MONTHS[month]} {selectedDate}
              </div>
              {selectedTasks.length === 0 ? (
                <div style={styles.noTasks}>
                  <div style={styles.noTasksIcon}>🌿</div>
                  <div style={styles.noTasksText}>No tasks scheduled</div>
                </div>
              ) : (
                <div style={styles.taskList}>
                  {selectedTasks.map(task => (
                    <div key={task.id} style={styles.taskItem}>
                      <div style={{
                        ...styles.taskPriDot,
                        background: PRIORITY_COLORS[task.priority] || '#9CA3AF'
                      }} />
                      <div style={styles.taskInfo}>
                        <div style={{ ...styles.taskName, ...(task.completed ? styles.taskDone : {}) }}>
                          {task.title}
                        </div>
                        {task.dueTime && (
                          <div style={styles.taskTime}>⏰ {task.dueTime}</div>
                        )}
                        {task.completed && <span style={styles.completedBadge}>Completed</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={styles.noSelection}>
              <div style={styles.noSelIcon}>📅</div>
              <div style={styles.noSelTitle}>Select a date</div>
              <div style={styles.noSelText}>Click on any date to see tasks scheduled for that day</div>
            </div>
          )}

          <div style={styles.legend}>
            <div style={styles.legendTitle}>PRIORITY LEGEND</div>
            {Object.entries(PRIORITY_COLORS).map(([p, c]) => (
              <div key={p} style={styles.legendItem}>
                <div style={{ ...styles.legendDot, background: c }} />
                <span style={styles.legendLabel}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming tasks timeline */}
      <div style={styles.upcoming}>
        <div style={styles.upcomingTitle}>Upcoming This Month</div>
        <div style={styles.upcomingList}>
          {Object.entries(tasksByDate)
            .sort(([a], [b]) => Number(a) - Number(b))
            .flatMap(([day, ts]) => ts.map(t => ({ ...t, day: Number(day) })))
            .filter(t => !t.completed)
            .slice(0, 8)
            .map(task => (
              <div key={task.id + task.day} style={styles.upItem}>
                <div style={styles.upDate}>
                  <div style={styles.upDay}>{task.day}</div>
                  <div style={styles.upMon}>{MONTHS[month].slice(0,3)}</div>
                </div>
                <div style={{ ...styles.upLine, background: PRIORITY_COLORS[task.priority] || '#E5E7EB' }} />
                <div style={styles.upInfo}>
                  <div style={styles.upTitle}>{task.title}</div>
                  {task.dueTime && <div style={styles.upTime}>{task.dueTime}</div>}
                </div>
              </div>
            ))}
          {Object.keys(tasksByDate).length === 0 && (
            <div style={styles.noTasksText}>No tasks scheduled for {MONTHS[month]}</div>
          )}
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
    gap: 24,
  },
  topBar: { marginBottom: 4 },
  pageTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: '#1E1B4B',
    fontFamily: "'Playfair Display', serif",
  },
  pageSubtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 2 },
  calWrap: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 },
  calCard: {
    background: 'white',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  calHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navBtn: {
    background: '#F3F4F6',
    border: 'none',
    borderRadius: 8,
    width: 32,
    height: 32,
    fontSize: 18,
    cursor: 'pointer',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1E1B4B',
    fontFamily: "'Playfair Display', serif",
  },
  dayHeaders: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: 8,
  },
  dayHeader: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 600,
    color: '#9CA3AF',
    padding: '4px 0',
    letterSpacing: '0.05em',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 },
  cell: {
    minHeight: 64,
    borderRadius: 10,
    padding: '8px 6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s',
    gap: 4,
  },
  cellOther: { opacity: 0.3, cursor: 'default' },
  cellToday: {
    background: '#EDE9FE',
  },
  cellSelected: {
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
  },
  cellDay: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  dotRow: { display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: '50%' },
  detailCard: {
    background: 'white',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  detailHeader: {
    fontSize: 17,
    fontWeight: 700,
    color: '#1E1B4B',
    fontFamily: "'Playfair Display', serif",
    paddingBottom: 12,
    borderBottom: '1px solid #F3F4F6',
  },
  noTasks: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 0',
    gap: 8,
  },
  noTasksIcon: { fontSize: 28 },
  noTasksText: { fontSize: 13, color: '#9CA3AF' },
  taskList: { display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
  taskItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '10px 12px',
    background: '#F9FAFB',
    borderRadius: 10,
  },
  taskPriDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5 },
  taskInfo: { flex: 1 },
  taskName: { fontSize: 13, fontWeight: 500, color: '#1F2937' },
  taskDone: { textDecoration: 'line-through', color: '#9CA3AF' },
  taskTime: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  completedBadge: {
    fontSize: 10,
    background: '#D1FAE5',
    color: '#059669',
    padding: '2px 6px',
    borderRadius: 99,
    fontWeight: 600,
    marginTop: 4,
    display: 'inline-block',
  },
  noSelection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 8,
    textAlign: 'center',
    padding: '24px 0',
  },
  noSelIcon: { fontSize: 32 },
  noSelTitle: { fontSize: 15, fontWeight: 600, color: '#374151' },
  noSelText: { fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 },
  legend: { borderTop: '1px solid #F3F4F6', paddingTop: 12 },
  legendTitle: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  legendItem: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  legendDot: { width: 8, height: 8, borderRadius: '50%' },
  legendLabel: { fontSize: 12, color: '#6B7280' },
  upcoming: {
    background: 'white',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  upcomingTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1E1B4B',
    marginBottom: 16,
  },
  upcomingList: { display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 },
  upItem: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, minWidth: 180 },
  upDate: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#EDE9FE',
    borderRadius: 10,
    padding: '8px 10px',
    minWidth: 44,
  },
  upDay: { fontSize: 18, fontWeight: 800, color: '#7C3AED' },
  upMon: { fontSize: 10, color: '#A78BFA', fontWeight: 600 },
  upLine: { width: 3, height: 36, borderRadius: 99 },
  upInfo: { flex: 1 },
  upTitle: { fontSize: 13, fontWeight: 600, color: '#1F2937' },
  upTime: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
}
