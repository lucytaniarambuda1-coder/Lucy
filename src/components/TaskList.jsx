import React, { useState } from 'react'

const CATEGORIES = {
  personal:  { label: 'Personal',       color: '#A78BFA', bg: '#EDE9FE' },
  work:      { label: 'Work',           color: '#059669', bg: '#D1FAE5' },
  health:    { label: 'Health',         color: '#EF4444', bg: '#FEE2E2' },
  finance:   { label: 'Finance',        color: '#D97706', bg: '#FEF3C7' },
  social:    { label: 'Social',         color: '#2563EB', bg: '#DBEAFE' },
  growth:    { label: 'Personal Growth',color: '#F97316', bg: '#FFEDD5' },
}
const PRI_COLORS = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }
const ALL_CATS = Object.keys(CATEGORIES)

export default function TaskList({ tasks, onToggle, onEdit, onDelete, onAdd }) {
  const [quickTitle, setQuickTitle] = useState('')
  const [quickCat, setQuickCat] = useState('work')
  const [quickPri, setQuickPri] = useState('medium')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [search, setSearch] = useState('')

  const handleQuickAdd = () => {
    if (!quickTitle.trim()) return
    onAdd({ title: quickTitle.trim(), category: quickCat, priority: quickPri, description: '', dueDate: '', dueTime: '', tags: [] })
    setQuickTitle('')
  }

  const visible = tasks.filter(t => {
    if (statusFilter === 'pending' && t.completed) return false
    if (statusFilter === 'done' && !t.completed) return false
    if (catFilter !== 'all' && t.category !== catFilter) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // Group by category
  const grouped = ALL_CATS.reduce((acc, cat) => {
    const items = visible.filter(t => t.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})
  const uncategorised = visible.filter(t => !ALL_CATS.includes(t.category))
  if (uncategorised.length) grouped['other'] = uncategorised

  const total = tasks.filter(t => !t.completed).length

  return (
    <div style={s.page}>
      {/* Quick add */}
      <div style={s.quickCard}>
        <input
          style={s.quickInput}
          placeholder="Add a new task..."
          value={quickTitle}
          onChange={e => setQuickTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleQuickAdd()}
        />
        <select style={s.sel} value={quickCat} onChange={e => setQuickCat(e.target.value)}>
          {ALL_CATS.map(c => <option key={c} value={c}>{CATEGORIES[c].label}</option>)}
        </select>
        <select style={s.sel} value={quickPri} onChange={e => setQuickPri(e.target.value)}>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <button style={s.addBtn} onClick={handleQuickAdd}>Add</button>
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <span style={s.searchIcon}>⌕</span>
        <input
          style={s.searchInput}
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button style={s.clearBtn} onClick={() => setSearch('')}>×</button>}
      </div>

      {/* Category filter chips */}
      <div style={s.chipRow}>
        <Chip label="All" active={catFilter === 'all'} onClick={() => setCatFilter('all')} />
        {ALL_CATS.map(c => (
          <Chip key={c} label={CATEGORIES[c].label} active={catFilter === c}
            color={catFilter === c ? CATEGORIES[c].color : undefined}
            bg={catFilter === c ? CATEGORIES[c].bg : undefined}
            onClick={() => setCatFilter(c)} />
        ))}
      </div>

      {/* Status chips */}
      <div style={s.chipRow}>
        <Chip label="Pending" active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} />
        <Chip label="Done" active={statusFilter === 'done'} onClick={() => setStatusFilter('done')} />
        <Chip label="All" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
      </div>

      {/* Task groups */}
      {Object.keys(grouped).length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>✓</div>
          <div style={s.emptyText}>{search ? 'No tasks match' : 'Nothing here!'}</div>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => {
          const catInfo = CATEGORIES[cat] || { label: cat, color: '#9CA3AF', bg: '#F3F4F6' }
          return (
            <div key={cat} style={s.group}>
              <div style={s.groupHeader}>
                <div style={{ ...s.groupDot, background: catInfo.color }} />
                <span style={{ ...s.groupLabel, color: catInfo.color }}>
                  {catInfo.label.toUpperCase()} ({items.length})
                </span>
              </div>
              {items.map(task => (
                <TaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          )
        })
      )}
    </div>
  )
}

function Chip({ label, active, color, bg, onClick }) {
  return (
    <button
      style={{
        ...s.chip,
        ...(active
          ? { background: bg || 'var(--primary-pale)', color: color || 'var(--primary)', borderColor: color || 'var(--primary)' }
          : {})
      }}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const cat = CATEGORIES[task.category]
  const priColor = PRI_COLORS[task.priority] || '#9CA3AF'

  const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date()

  return (
    <div style={s.card}>
      <button
        style={{ ...s.check, ...(task.completed ? s.checkDone : {}) }}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && <span style={s.checkMark}>✓</span>}
      </button>

      <div style={s.cardBody} onClick={() => onEdit(task)}>
        <div style={{ ...s.cardTitle, ...(task.completed ? s.done : {}) }}>
          {task.title}
        </div>
        <div style={s.cardMeta}>
          {cat && (
            <span style={{ ...s.catBadge, background: cat.bg, color: cat.color }}>
              {cat.label}
            </span>
          )}
          {task.dueDate && (
            <span style={{ ...s.dateLabel, ...(isOverdue ? { color: '#EF4444' } : {}) }}>
              {fmtDate(task.dueDate)}{isOverdue ? ' · Overdue' : ''}
            </span>
          )}
        </div>
      </div>

      <div style={s.cardRight}>
        <div style={{ ...s.priDot, background: priColor }} />
        <button style={s.iconBtn} onClick={() => onEdit(task)}>✎</button>
        <button style={s.iconBtnDel} onClick={() => onDelete(task.id)}>⌫</button>
      </div>
    </div>
  )
}

const s = {
  page: { padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 32 },
  quickCard: {
    background: 'white', borderRadius: 'var(--radius)',
    padding: 12, display: 'flex', flexDirection: 'column', gap: 8,
    boxShadow: 'var(--shadow)',
  },
  quickInput: {
    border: '1.5px solid var(--border)', borderRadius: 8,
    padding: '10px 12px', fontSize: 15, width: '100%',
    background: '#FAFAFA',
  },
  sel: {
    border: '1.5px solid var(--border)', borderRadius: 8,
    padding: '9px 10px', fontSize: 14, width: '100%',
    background: 'white', color: 'var(--text)',
    WebkitAppearance: 'auto',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white', borderRadius: 8, padding: '11px',
    fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%',
  },
  searchWrap: {
    display: 'flex', alignItems: 'center',
    background: 'white', borderRadius: 10, padding: '0 12px',
    border: '1.5px solid var(--border)', gap: 6,
  },
  searchIcon: { fontSize: 16, color: 'var(--text-3)' },
  searchInput: {
    flex: 1, border: 'none', background: 'transparent',
    padding: '11px 0', fontSize: 15, color: 'var(--text)',
  },
  clearBtn: { fontSize: 18, color: 'var(--text-3)', cursor: 'pointer', padding: 4 },
  chipRow: {
    display: 'flex', gap: 6, overflowX: 'auto',
    scrollbarWidth: 'none', paddingBottom: 2,
  },
  chip: {
    flexShrink: 0, padding: '6px 12px', borderRadius: 99,
    fontSize: 13, fontWeight: 500, border: '1.5px solid var(--border)',
    background: 'white', color: 'var(--text-2)', cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  empty: { textAlign: 'center', padding: '40px 0' },
  emptyIcon: { fontSize: 36, color: 'var(--text-3)' },
  emptyText: { fontSize: 14, color: 'var(--text-3)', marginTop: 8 },
  group: { display: 'flex', flexDirection: 'column', gap: 0 },
  groupHeader: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '12px 4px 6px',
  },
  groupDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  groupLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' },
  card: {
    background: 'white', borderRadius: 10,
    padding: '12px 12px', marginBottom: 6,
    display: 'flex', alignItems: 'center', gap: 10,
    boxShadow: 'var(--shadow)',
  },
  check: {
    width: 22, height: 22, borderRadius: '50%',
    border: '2px solid var(--border)', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'white', cursor: 'pointer', minWidth: 22,
  },
  checkDone: { background: 'var(--primary)', borderColor: 'var(--primary)' },
  checkMark: { color: 'white', fontSize: 11, fontWeight: 700 },
  cardBody: { flex: 1, minWidth: 0, cursor: 'pointer' },
  cardTitle: { fontSize: 14, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 },
  done: { textDecoration: 'line-through', color: 'var(--text-3)' },
  cardMeta: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  catBadge: { fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99 },
  dateLabel: { fontSize: 11, color: 'var(--text-3)' },
  cardRight: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 },
  priDot: { width: 8, height: 8, borderRadius: '50%' },
  iconBtn: { fontSize: 14, color: 'var(--text-3)', cursor: 'pointer', padding: '4px 3px' },
  iconBtnDel: { fontSize: 14, color: '#FCA5A5', cursor: 'pointer', padding: '4px 3px' },
}
