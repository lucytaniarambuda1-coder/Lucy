import React, { useState } from 'react'

const CATEGORIES = [
  { id: 'personal',  label: 'Personal' },
  { id: 'work',      label: 'Work' },
  { id: 'health',    label: 'Health' },
  { id: 'finance',   label: 'Finance' },
  { id: 'social',    label: 'Social' },
  { id: 'growth',    label: 'Personal Growth' },
]

export default function BrainDump({ onBulkAdd }) {
  const [text, setText] = useState('')
  const [category, setCategory] = useState('personal')
  const [priority, setPriority] = useState('medium')
  const [feedback, setFeedback] = useState(null)

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  const handleAddAll = () => {
    if (!lines.length) return
    const now = new Date().toISOString()
    const newTasks = lines.map((title, i) => ({
      id: Date.now() + i,
      title,
      description: '',
      category,
      priority,
      dueDate: '',
      dueTime: '',
      tags: [],
      completed: false,
      createdAt: now,
    }))
    onBulkAdd(newTasks)
    setText('')
    setFeedback(`${newTasks.length} task${newTasks.length > 1 ? 's' : ''} added!`)
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div style={s.page}>
      <div style={s.title}>Brain Dump</div>
      <div style={s.subtitle}>
        Paste or type everything on your mind — one item per line.
        Then categorise and add them all at once.
      </div>

      <div style={s.card}>
        <textarea
          style={s.textarea}
          placeholder="Type or paste your tasks here, one per line..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={10}
        />

        <div style={s.controls}>
          <select style={s.sel} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <select style={s.sel} value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <button
            style={{ ...s.addBtn, ...(lines.length === 0 ? s.addBtnDisabled : {}) }}
            onClick={handleAddAll}
            disabled={lines.length === 0}
          >
            {lines.length > 0 ? `Add ${lines.length} task${lines.length > 1 ? 's' : ''}` : 'Add All'}
          </button>
        </div>
      </div>

      {lines.length > 0 && (
        <div style={s.preview}>
          <div style={s.previewTitle}>Preview ({lines.length} tasks)</div>
          {lines.map((line, i) => (
            <div key={i} style={s.previewRow}>
              <span style={s.previewNum}>{i + 1}</span>
              <span style={s.previewText}>{line}</span>
            </div>
          ))}
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
  title: {
    fontSize: 22, fontWeight: 800, color: 'var(--text)',
    fontFamily: "'Playfair Display', serif",
  },
  subtitle: { fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginTop: -8 },
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
  controls: {
    display: 'flex', flexDirection: 'column', gap: 8, padding: 12,
  },
  sel: {
    border: '1.5px solid var(--border)', borderRadius: 8,
    padding: '10px 12px', fontSize: 14, background: 'white',
    color: 'var(--text)', WebkitAppearance: 'auto', width: '100%',
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
  feedback: {
    background: '#D1FAE5', color: '#065F46',
    borderRadius: 10, padding: '14px 16px',
    fontSize: 14, fontWeight: 600, textAlign: 'center',
  },
}
