import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { buildGCalUrl } from '../utils/gcal'

const CATEGORIES = [
  { id: 'home',     label: 'Home' },
  { id: 'work',     label: 'Work' },
  { id: 'personal', label: 'Personal' },
  { id: 'school',   label: 'School' },
  { id: 'health',   label: 'Health' },
  { id: 'finance',  label: 'Finance' },
]

const TYPES = [
  { id: 'task', label: 'Tasks' },
  { id: 'idea', label: 'Ideas' },
  { id: 'note', label: 'Note' },
]

export default function BrainDump({ onBulkAdd }) {
  const [text, setText] = useLocalStorage('lucys-braindump-draft', '')
  const [, setNotes] = useLocalStorage('lucys-notes', [])
  const [type, setType] = useState('task')
  const [category, setCategory] = useState('work')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [addedTasks, setAddedTasks] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const lines = text.split('\n').map(l => l.trim().replace(/^[-*•]\s*/, '')).filter(Boolean)

  const handleAddAll = () => {
    if (!lines.length) return
    const now = new Date().toISOString()

    if (type === 'note') {
      const newNote = {
        id: Date.now(),
        title: lines[0].slice(0, 60) || 'Brain Dump',
        content: lines.join('\n'),
        color: '#FEF3C7',
        createdAt: now,
        updatedAt: now,
      }
      setNotes(prev => [newNote, ...prev])
      setText('')
      setAddedTasks(null)
      setFeedback(`Note saved: "${newNote.title}"`)
      setTimeout(() => setFeedback(null), 3000)
      return
    }

    const newTasks = lines.map((title, i) => ({
      id: Date.now() + i + 1,
      title,
      description: '',
      category: type === 'idea' ? 'personal' : category,
      priority,
      dueDate,
      dueTime: '',
      tags: type === 'idea' ? ['idea'] : [],
      completed: false,
      createdAt: now,
    }))

    onBulkAdd(newTasks)
    setText('')
    setDueDate('')

    if (dueDate) {
      setAddedTasks(newTasks)
      setFeedback(null)
    } else {
      setAddedTasks(null)
      setFeedback(`${newTasks.length} ${type}${newTasks.length > 1 ? 's' : ''} added!`)
      setTimeout(() => setFeedback(null), 3500)
    }
  }

  const dismissGCal = () => {
    const count = addedTasks.length
    setAddedTasks(null)
    setFeedback(`${count} ${type}${count > 1 ? 's' : ''} added!`)
    setTimeout(() => setFeedback(null), 3000)
  }

  const addLabel = () => {
    if (lines.length === 0) return type === 'note' ? 'Save Note' : 'Add All'
    if (type === 'note') return 'Save Note'
    return `Add ${lines.length} ${type}${lines.length > 1 ? 's' : ''}`
  }

  return (
    <div style={s.page}>
      <div style={s.title}>Brain Dump</div>
      <div style={s.subtitle}>
        Capture everything on your mind. One item per line for tasks and ideas.
      </div>

      {/* Type selector */}
      <div style={s.typeRow}>
        {TYPES.map(t => (
          <button
            key={t.id}
            style={{ ...s.typeBtn, ...(type === t.id ? s.typeBtnActive : {}) }}
            onClick={() => setType(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={s.card}>
        <textarea
          style={s.textarea}
          placeholder={
            type === 'note'
              ? 'Write your thoughts here... all lines become one note.'
              : 'Type or paste here, one item per line...\n\nTip: lines starting with - or • are auto-cleaned.'
          }
          value={text}
          onChange={e => setText(e.target.value)}
          rows={10}
        />

        <div style={s.controls}>
          {type !== 'note' && (
            <>
              <select
                style={s.sel}
                value={type === 'idea' ? 'personal' : category}
                onChange={e => setCategory(e.target.value)}
                disabled={type === 'idea'}
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <select style={s.sel} value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <div style={s.dateRow}>
                <label style={s.dateLabel}>Schedule all for</label>
                <input
                  type="date"
                  style={s.dateInput}
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </>
          )}
          <button
            style={{ ...s.addBtn, ...(lines.length === 0 ? s.addBtnDisabled : {}) }}
            onClick={handleAddAll}
            disabled={lines.length === 0}
          >
            {addLabel()}
          </button>
        </div>
      </div>

      {/* Preview — shown when text has content and no GCal pending */}
      {lines.length > 0 && !addedTasks && (
        <div style={s.preview}>
          <div style={s.previewTitle}>
            Preview — {lines.length} {type}{lines.length > 1 ? 's' : ''}
            {dueDate && type !== 'note' && (
              <span style={s.previewDate}> for {new Date(dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            )}
          </div>
          {lines.map((line, i) => (
            <div key={i} style={s.previewRow}>
              <span style={s.previewNum}>{i + 1}</span>
              <span style={s.previewText}>{line}</span>
            </div>
          ))}
        </div>
      )}

      {/* GCal links after adding with a due date */}
      {addedTasks && (
        <div style={s.gcalSection}>
          <div style={s.gcalHeader}>
            {addedTasks.length} {type}{addedTasks.length > 1 ? 's' : ''} added — add to Google Calendar:
          </div>
          <div style={s.gcalLinks}>
            {addedTasks.map(task => (
              <a
                key={task.id}
                href={buildGCalUrl(task)}
                target="_blank"
                rel="noopener noreferrer"
                style={s.gcalLink}
              >
                + {task.title}
              </a>
            ))}
          </div>
          <button style={s.gcalDone} onClick={dismissGCal}>Done</button>
        </div>
      )}

      {feedback && (
        <div style={s.feedback}>{feedback}</div>
      )}
    </div>
  )
}

const s = {
  page: { padding: '20px 16px 32px', display: 'flex', flexDirection: 'column', gap: 16 },
  title: { fontSize: 22, fontWeight: 800, color: 'var(--text)', fontFamily: "'Playfair Display', serif" },
  subtitle: { fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginTop: -8 },
  typeRow: { display: 'flex', gap: 8 },
  typeBtn: {
    flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
    border: '1.5px solid var(--border)', background: 'white',
    color: 'var(--text-2)', cursor: 'pointer',
  },
  typeBtnActive: {
    background: 'var(--primary-pale)', color: 'var(--primary)',
    borderColor: 'var(--primary)',
  },
  card: {
    background: 'white', borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)', overflow: 'hidden',
  },
  textarea: {
    width: '100%', border: 'none', resize: 'none',
    padding: '16px', fontSize: 15, lineHeight: 1.8,
    color: 'var(--text)', background: 'white',
    borderBottom: '1px solid var(--border)',
    minHeight: 220,
  },
  controls: { display: 'flex', flexDirection: 'column', gap: 8, padding: 12 },
  sel: {
    border: '1.5px solid var(--border)', borderRadius: 8,
    padding: '10px 12px', fontSize: 14, background: 'white',
    color: 'var(--text)', WebkitAppearance: 'auto', width: '100%',
  },
  dateRow: { display: 'flex', alignItems: 'center', gap: 10 },
  dateLabel: { fontSize: 13, color: 'var(--text-2)', flexShrink: 0 },
  dateInput: {
    flex: 1, border: '1.5px solid var(--border)', borderRadius: 8,
    padding: '9px 10px', fontSize: 14, background: 'white', color: 'var(--text)',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white', border: 'none', borderRadius: 8,
    padding: '13px', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', width: '100%',
  },
  addBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  preview: {
    background: 'white', borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)', overflow: 'hidden',
  },
  previewTitle: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
    color: 'var(--text-3)', padding: '12px 16px 8px',
    borderBottom: '1px solid var(--border)',
  },
  previewDate: { color: 'var(--primary)', fontWeight: 700 },
  previewRow: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    padding: '10px 16px', borderBottom: '1px solid #F9FAFB',
  },
  previewNum: {
    width: 18, height: 18, borderRadius: '50%',
    background: 'var(--primary-pale)', color: 'var(--primary)',
    fontSize: 10, fontWeight: 700, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  previewText: { fontSize: 13, color: 'var(--text)', lineHeight: 1.5 },
  gcalSection: {
    background: 'white', borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)', overflow: 'hidden',
  },
  gcalHeader: {
    fontSize: 13, fontWeight: 600, color: 'var(--text)',
    padding: '14px 16px 10px', borderBottom: '1px solid var(--border)',
  },
  gcalLinks: { display: 'flex', flexDirection: 'column', gap: 0 },
  gcalLink: {
    display: 'block', padding: '11px 16px',
    fontSize: 13, fontWeight: 600, color: '#059669',
    textDecoration: 'none', borderBottom: '1px solid #F9FAFB',
    background: 'white',
  },
  gcalDone: {
    width: '100%', padding: '13px', fontSize: 14, fontWeight: 700,
    color: 'white', background: 'var(--primary)',
    border: 'none', cursor: 'pointer',
  },
  feedback: {
    background: '#D1FAE5', color: '#065F46',
    borderRadius: 10, padding: '14px 16px',
    fontSize: 14, fontWeight: 600, textAlign: 'center',
  },
}
