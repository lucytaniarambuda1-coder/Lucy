import React from 'react'

const QUOTES = [
  "She believed she could, so she did.",
  "Your vibe attracts your tribe.",
  "Be the energy you want to attract.",
  "Life is beautiful. Make it count.",
  "Today is a perfect day to thrive.",
  "You are exactly where you need to be.",
  "Small steps, big dreams.",
  "Own your story. Write it boldly.",
]

const CATEGORIES = [
  { id: 'personal', label: 'Personal', color: '#A78BFA', emoji: '🌸' },
  { id: 'work', label: 'Work', color: '#34D399', emoji: '💼' },
  { id: 'health', label: 'Health', color: '#F87171', emoji: '💪' },
  { id: 'finance', label: 'Finance', color: '#FBBF24', emoji: '💰' },
  { id: 'social', label: 'Social', color: '#60A5FA', emoji: '🤝' },
  { id: 'growth', label: 'Personal Growth', color: '#F97316', emoji: '🌱' },
]

function getDayGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function Dashboard({ tasks, onAddTask }) {
  const quote = QUOTES[new Date().getDay() % QUOTES.length]
  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const pending = total - completed
  const today = new Date().toDateString()
  const dueTodayCount = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate).toDateString() === today).length
  const highPriority = tasks.filter(t => !t.completed && t.priority === 'high').length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const recentTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      const pa = { high: 0, medium: 1, low: 2 }
      return (pa[a.priority] ?? 2) - (pa[b.priority] ?? 2)
    })
    .slice(0, 5)

  return (
    <div style={styles.container}>
      {/* Hero greeting */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <div style={styles.heroGreeting}>{getDayGreeting()}, Lucy! ✨</div>
          <div style={styles.heroDate}>{getTodayLabel()}</div>
          <div style={styles.heroQuote}>"{quote}"</div>
        </div>
        <div style={styles.heroFlower}>✿</div>
      </div>

      {/* Stat cards */}
      <div style={styles.statsGrid}>
        <StatCard icon="📋" label="Total Tasks" value={total} color="#7C3AED" bg="#EDE9FE" />
        <StatCard icon="✅" label="Completed" value={completed} color="#059669" bg="#D1FAE5" />
        <StatCard icon="⏳" label="Pending" value={pending} color="#D97706" bg="#FEF3C7" />
        <StatCard icon="🔥" label="Due Today" value={dueTodayCount} color="#DC2626" bg="#FEE2E2" />
        <StatCard icon="⚡" label="High Priority" value={highPriority} color="#7C3AED" bg="#EDE9FE" />
        <StatCard icon="🎯" label="Completion" value={`${completionRate}%`} color="#0891B2" bg="#CFFAFE" />
      </div>

      {/* Progress bar */}
      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <span style={styles.progressTitle}>Overall Progress</span>
          <span style={styles.progressPct}>{completionRate}%</span>
        </div>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${completionRate}%` }} />
        </div>
        <div style={styles.progressSub}>{completed} of {total} tasks completed</div>
      </div>

      <div style={styles.lower}>
        {/* Category breakdown */}
        <div style={styles.catCard}>
          <div style={styles.cardTitle}>By Category</div>
          {CATEGORIES.map(cat => {
            const catTotal = tasks.filter(t => t.category === cat.id).length
            const catDone = tasks.filter(t => t.category === cat.id && t.completed).length
            const pct = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0
            return (
              <div key={cat.id} style={styles.catRow}>
                <span style={styles.catEmoji}>{cat.emoji}</span>
                <div style={styles.catInfo}>
                  <div style={styles.catRowHeader}>
                    <span style={styles.catName}>{cat.label}</span>
                    <span style={styles.catPct}>{catTotal > 0 ? `${catDone}/${catTotal}` : '—'}</span>
                  </div>
                  <div style={styles.miniTrack}>
                    <div style={{ ...styles.miniFill, width: `${pct}%`, background: cat.color }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Upcoming tasks */}
        <div style={styles.upcomingCard}>
          <div style={styles.cardTitleRow}>
            <div style={styles.cardTitle}>Priority Tasks</div>
            <button style={styles.addBtn} onClick={onAddTask}>+ Add Task</button>
          </div>
          {recentTasks.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🌸</div>
              <div style={styles.emptyText}>All caught up! Life is good.</div>
            </div>
          ) : (
            recentTasks.map(task => (
              <MiniTaskRow key={task.id} task={task} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div style={{ ...styles.statCard, background: bg }}>
      <div style={styles.statIcon}>{icon}</div>
      <div style={{ ...styles.statValue, color }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  )
}

const PRIORITY_COLORS = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }
const CATEGORY_MAP = {
  personal: { label: 'Personal', color: '#A78BFA' },
  work: { label: 'Work', color: '#34D399' },
  health: { label: 'Health', color: '#F87171' },
  finance: { label: 'Finance', color: '#FBBF24' },
  social: { label: 'Social', color: '#60A5FA' },
  growth: { label: 'Personal Growth', color: '#F97316' },
}

function MiniTaskRow({ task }) {
  const pColor = PRIORITY_COLORS[task.priority] || '#9CA3AF'
  const cat = CATEGORY_MAP[task.category]
  return (
    <div style={styles.miniRow}>
      <div style={{ ...styles.miniPriDot, background: pColor }} />
      <div style={styles.miniContent}>
        <div style={styles.miniTitle}>{task.title}</div>
        <div style={styles.miniMeta}>
          {cat && <span style={{ ...styles.miniTag, background: cat.color + '22', color: cat.color }}>{cat.label}</span>}
          {task.dueDate && <span style={styles.miniDue}>📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
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
  hero: {
    background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #EC4899 100%)',
    borderRadius: 20,
    padding: '32px 36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
    overflow: 'hidden',
    position: 'relative',
  },
  heroText: {},
  heroGreeting: {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 4,
    fontFamily: "'Playfair Display', serif",
  },
  heroDate: {
    fontSize: 14,
    opacity: 0.75,
    marginBottom: 12,
  },
  heroQuote: {
    fontSize: 13,
    opacity: 0.85,
    fontStyle: 'italic',
    maxWidth: 380,
    lineHeight: 1.6,
  },
  heroFlower: {
    fontSize: 80,
    opacity: 0.15,
    lineHeight: 1,
    userSelect: 'none',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 16,
  },
  statCard: {
    borderRadius: 16,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 800 },
  statLabel: { fontSize: 11, color: '#6B7280', fontWeight: 500, textAlign: 'center' },
  progressCard: {
    background: 'white',
    borderRadius: 16,
    padding: '24px 28px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: { fontSize: 15, fontWeight: 600, color: '#1E1B4B' },
  progressPct: { fontSize: 18, fontWeight: 800, color: '#7C3AED' },
  progressTrack: {
    height: 10,
    background: '#EDE9FE',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
    borderRadius: 99,
    transition: 'width 0.5s ease',
  },
  progressSub: { fontSize: 12, color: '#9CA3AF' },
  lower: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.6fr',
    gap: 20,
    flex: 1,
    minHeight: 0,
  },
  catCard: {
    background: 'white',
    borderRadius: 16,
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#1E1B4B', marginBottom: 4 },
  catRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  catEmoji: { fontSize: 18, width: 24, textAlign: 'center' },
  catInfo: { flex: 1 },
  catRowHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 },
  catName: { fontSize: 13, fontWeight: 500, color: '#374151' },
  catPct: { fontSize: 12, color: '#9CA3AF' },
  miniTrack: { height: 5, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' },
  miniFill: { height: '100%', borderRadius: 99, transition: 'width 0.4s ease' },
  upcomingCard: {
    background: 'white',
    borderRadius: 16,
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    overflow: 'auto',
  },
  cardTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addBtn: {
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 0',
    gap: 8,
  },
  emptyIcon: { fontSize: 36 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
  miniRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    background: '#F9FAFB',
  },
  miniPriDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 5,
  },
  miniContent: { flex: 1 },
  miniTitle: { fontSize: 13, fontWeight: 500, color: '#1F2937', marginBottom: 4 },
  miniMeta: { display: 'flex', gap: 6, alignItems: 'center' },
  miniTag: {
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 7px',
    borderRadius: 99,
  },
  miniDue: { fontSize: 11, color: '#9CA3AF' },
}
