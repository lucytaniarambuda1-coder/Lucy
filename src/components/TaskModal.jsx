import React, { useState, useEffect } from 'react'

const CATEGORIES = [
  { id: 'personal',  label: 'Personal' },
  { id: 'work',      label: 'Work' },
  { id: 'health',    label: 'Health' },
  { id: 'finance',   label: 'Finance' },
  { id: 'social',    label: 'Social' },
  { id: 'growth',    label: 'Personal Growth' },
]

const PRIORITIES = [
  { id: 'high',   label: 'High',   color: '#EF4444' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'low',    label: 'Low',    color: '#10B981' },
]

const empty = { title: '', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: '' }

export default function TaskModal({ isOpen, onClose, onSave, editTask }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        category: editTask.category || 'personal',
        priority: editTask.priority || 'medium',
        dueDate: editTask.dueDate || '',
        dueTime: editTask.dueTime || '',
        tags: (editTask.tags || []).join(', '),
      })
    } else {
      setForm(empty)
    }
  }, [editTask, isOpen])

  if (!isOpen) return null

  const set = (f, v) => setForm(x => ({ ...x, [f]: v }))

  const handleSave = () => {
    if (!form.title.trim()) return
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    onSave({ ...form, tags })
    onClose()
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.sheet}>
        <div style={s.handle} />
        <div style={s.header}>
          <div style={s.headerTitle}>{editTask?.id ? 'Edit Task' : 'New Task'}</div>
          <button style={s.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={s.body}>
          <Field label="Task Title">
            <input
              style={s.input}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </Field>

          <Field label="Description">
            <textarea
              style={{ ...s.input, ...s.textarea }}
              placeholder="Add details or notes..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={2}
            />
          </Field>

          <Field label="Category">
            <select style={s.input} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </Field>

          <Field label="Priority">
            <div style={s.priRow}>
              {PRIORITIES.map(p => (
                <button
                  key={p.id}
                  style={{
                    ...s.priBtn,
                    ...(form.priority === p.id
                      ? { background: p.color, color: 'white', borderColor: p.color }
                      : { borderColor: p.color, color: p.color })
                  }}
                  onClick={() => set('priority', p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>

          <div style={s.row}>
            <Field label="Due Date" flex={1}>
              <input type="date" style={s.input} value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </Field>
            <Field label="Time" flex={1}>
              <input type="time" style={s.input} value={form.dueTime} onChange={e => set('dueTime', e.target.value)} />
            </Field>
          </div>

          <Field label="Tags (comma separated)">
            <input
              style={s.input}
              placeholder="e.g. urgent, project"
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
            />
          </Field>
        </div>

        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...s.saveBtn, ...(form.title.trim() ? {} : s.saveBtnDisabled) }}
            onClick={handleSave}
            disabled={!form.title.trim()}
          >
            {editTask?.id ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, flex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: flex || undefined }}>
      <label style={fs.label}>{label}</label>
      {children}
    </div>
  )
}

const fs = { label: { fontSize: 12, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.04em' } }

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
  },
  sheet: {
    background: 'white', borderRadius: '20px 20px 0 0',
    maxHeight: '92vh', display: 'flex', flexDirection: 'column',
  },
  handle: {
    width: 36, height: 4, borderRadius: 99, background: '#E5E7EB',
    margin: '10px auto 0', flexShrink: 0,
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 20px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0,
  },
  headerTitle: { fontSize: 17, fontWeight: 700, color: 'var(--text)', fontFamily: "'Playfair Display', serif" },
  closeBtn: {
    width: 30, height: 30, borderRadius: 8,
    background: '#F3F4F6', color: 'var(--text-2)',
    fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', border: 'none', lineHeight: 1,
  },
  body: {
    overflowY: 'auto', flex: 1,
    padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14,
  },
  input: {
    border: '1.5px solid var(--border)', borderRadius: 10,
    padding: '11px 12px', fontSize: 15, color: 'var(--text)',
    background: '#FAFAFA', width: '100%',
  },
  textarea: { resize: 'none', lineHeight: 1.6 },
  row: { display: 'flex', gap: 10 },
  priRow: { display: 'flex', gap: 8 },
  priBtn: {
    flex: 1, padding: '9px 0', borderRadius: 8,
    fontSize: 13, fontWeight: 600, border: '1.5px solid',
    background: 'white', cursor: 'pointer',
  },
  footer: {
    display: 'flex', gap: 10, padding: '12px 20px 24px',
    borderTop: '1px solid var(--border)', flexShrink: 0,
  },
  cancelBtn: {
    flex: 1, padding: '13px', borderRadius: 10,
    background: '#F3F4F6', color: 'var(--text-2)',
    fontSize: 15, fontWeight: 600, cursor: 'pointer', border: 'none',
  },
  saveBtn: {
    flex: 2, padding: '13px', borderRadius: 10,
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', border: 'none',
  },
  saveBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
}
