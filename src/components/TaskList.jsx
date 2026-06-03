import React, { useState } from 'react'

const CATEGORIES = {
  personal: { label: 'Personal', color: '#A78BFA', bg: '#EDE9FE', emoji: '🌸' },
  work: { label: 'Work', color: '#059669', bg: '#D1FAE5', emoji: '💼' },
  health: { label: 'Health', color: '#EF4444', bg: '#FEE2E2', emoji: '💪' },
  finance: { label: 'Finance', color: '#D97706', bg: '#FEF3C7', emoji: '💰' },
  social: { label: 'Social', color: '#2563EB', bg: '#DBEAFE', emoji: '🤝' },
}

const PRIORITIES = {
  high: { label: 'High', color: '#EF4444', bg: '#FEE2E2' },
  medium: { label: 'Medium', color: '#F59E0B', bg: '#FEF3C7' },
  low: { label: 'Low', color: '#10B981', bg: '#D1FAE5' },
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'high', label: '🔥 High Priority' },
  { id: 'today', label: '📅 Due Today' },
]

export default function TaskList({ tasks, onToggle, onEdit, onDelete, onAdd }) {
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')

  const today = new Date().toDateString()

  const filtered = tasks.filter(t => {
    if (filter === 'active' && t.completed) return false
    if (filter === 'completed' && !t.completed) return false
    if (filter === 'high' && (t.priority !== 'high' || t.completed)) return false
    if (filter === 'today' && (!t.dueDate || new Date(t.dueDate).toDateString() !== today)) return false
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.description?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const p = { high: 0, medium: 1, low: 2 }
    return (p[a.priority] ?? 2) - (p[b.priority] ?? 2)
  })

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <div style={styles.pageTitle}>My Tasks</div>
          <div style={styles.pageSubtitle}>{tasks.filter(t => !t.completed).length} tasks remaining</div>
        </div>
        <button style={styles.addBtn} onClick={onAdd}>+ New Task</button>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button style={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Status filters */}
      <div style={styles.filterRow}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            style={{ ...styles.filterBtn, ...(filter === f.id ? styles.filterBtnActive : {}) }}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div style={styles.catFilterRow}>
        <button
          style={{ ...styles.catFilterBtn, ...(categoryFilter === 'all' ? styles.catFilterBtnActive : {}) }}
          onClick={() => setCategoryFilter('all')}
        >All</button>
        {Object.entries(CATEGORIES).map(([id, cat]) => (
          <button
            key={id}
            style={{
              ...styles.catFilterBtn,
              ...(categoryFilter === id ? { background: cat.bg, borderColor: cat.color, color: cat.color } : {}),
            }}
            onClick={() => setCategoryFilter(id)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div style={styles.list}>
        {sorted.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🌸</div>
            <div style={styles.emptyTitle}>No tasks found</div>
            <div style={styles.emptyText}>
              {search ? 'Try a different search term' : 'Add a task to get started!'}
            </div>
          </div>
        ) : (
          sorted.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false)
  const cat = CATEGORIES[task.category]
  const pri = PRIORITIES[task.priority]

  const isOverdue = task.dueDate && !task.completed &&
    new Date(task.dueDate) < new Date() &&
    new Date(task.dueDate).toDateString() !== new Date().toDateString()

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div
      style={{
        ...styles.card,
        ...(task.completed ? styles.cardDone : {}),
        borderLeft: `4px solid ${cat?.color || '#E5E7EB'}`,
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <button
        style={{ ...styles.check, ...(task.completed ? styles.checkDone : {}) }}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && '✓'}
      </button>

      <div style={styles.cardBody}>
        <div style={styles.cardTop}>
          <div style={{ ...styles.cardTitle, ...(task.completed ? styles.cardTitleDone : {}) }}>
            {task.title}
          </div>
          <div style={styles.badges}>
            {pri && (
              <span style={{ ...styles.badge, background: pri.bg, color: pri.color }}>
                {pri.label}
              </span>
            )}
            {cat && (
              <span style={{ ...styles.badge, background: cat.bg, color: cat.color }}>
                {cat.emoji} {cat.label}
              </span>
            )}
          </div>
        </div>

        {task.description && (
          <div style={styles.cardDesc}>{task.description}</div>
        )}

        <div style={styles.cardMeta}>
          {task.dueDate && (
            <span style={{ ...styles.metaItem, ...(isOverdue ? styles.overdue : {}) }}>
              📅 {formatDate(task.dueDate)}{task.dueTime ? ` at ${task.dueTime}` : ''}
              {isOverdue && ' · Overdue'}
            </span>
          )}
          {task.tags?.map(tag => (
            <span key={tag} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>

      {showActions && (
        <div style={styles.actions}>
          <button style={styles.actionBtn} onClick={() => onEdit(task)} title="Edit">✏️</button>
          <button style={{ ...styles.actionBtn, ...styles.deleteBtn }} onClick={() => onDelete(task.id)} title="Delete">🗑️</button>
        </div>
      )}
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
    gap: 16,
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
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
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: 12,
    padding: '0 14px',
    border: '1.5px solid #E5E7EB',
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '12px 0',
    fontSize: 14,
    color: '#1F2937',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    fontSize: 12,
    cursor: 'pointer',
    padding: 4,
  },
  filterRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '7px 14px',
    borderRadius: 99,
    fontSize: 13,
    fontWeight: 500,
    border: '1.5px solid #E5E7EB',
    background: 'white',
    color: '#6B7280',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  filterBtnActive: {
    background: '#EDE9FE',
    borderColor: '#7C3AED',
    color: '#7C3AED',
  },
  catFilterRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  catFilterBtn: {
    padding: '6px 12px',
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 500,
    border: '1.5px solid #E5E7EB',
    background: 'white',
    color: '#6B7280',
    cursor: 'pointer',
  },
  catFilterBtnActive: {
    background: '#EDE9FE',
    borderColor: '#7C3AED',
    color: '#7C3AED',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flex: 1,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 0',
    gap: 8,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: 600, color: '#374151' },
  emptyText: { fontSize: 14, color: '#9CA3AF' },
  card: {
    background: 'white',
    borderRadius: 14,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'box-shadow 0.2s, transform 0.1s',
    position: 'relative',
    cursor: 'default',
  },
  cardDone: { opacity: 0.6 },
  check: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: '2px solid #D1D5DB',
    background: 'white',
    flexShrink: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: 'white',
    marginTop: 2,
    transition: 'all 0.2s',
  },
  checkDone: {
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    borderColor: '#7C3AED',
  },
  cardBody: { flex: 1, minWidth: 0 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: 600, color: '#1F2937' },
  cardTitleDone: { textDecoration: 'line-through', color: '#9CA3AF' },
  badges: { display: 'flex', gap: 6, flexShrink: 0 },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 99,
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 1.5,
  },
  cardMeta: {
    display: 'flex',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaItem: { fontSize: 12, color: '#9CA3AF' },
  overdue: { color: '#EF4444', fontWeight: 500 },
  tag: {
    fontSize: 11,
    color: '#7C3AED',
    background: '#EDE9FE',
    padding: '2px 7px',
    borderRadius: 99,
  },
  actions: {
    display: 'flex',
    gap: 4,
    position: 'absolute',
    right: 16,
    top: 16,
    background: 'white',
    borderRadius: 8,
    padding: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    padding: '4px 6px',
    borderRadius: 6,
    transition: 'background 0.15s',
  },
  deleteBtn: {},
}
