import React, { useState, useEffect } from 'react'

const CATEGORIES = [
  { id: 'personal', label: 'Personal', emoji: '🌸' },
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'health', label: 'Health', emoji: '💪' },
  { id: 'finance', label: 'Finance', emoji: '💰' },
  { id: 'social', label: 'Social', emoji: '🤝' },
]

const PRIORITIES = [
  { id: 'high', label: 'High', color: '#EF4444' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'low', label: 'Low', color: '#10B981' },
]

const empty = {
  title: '',
  description: '',
  category: 'personal',
  priority: 'medium',
  dueDate: '',
  dueTime: '',
  tags: '',
}

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

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleSave = () => {
    if (!form.title.trim()) return
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    onSave({ ...form, tags })
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>{editTask ? 'Edit Task' : 'New Task'}</div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.body}>
          <Field label="Task Title *">
            <input
              style={styles.input}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </Field>

          <Field label="Description">
            <textarea
              style={{ ...styles.input, ...styles.textarea }}
              placeholder="Add details, notes, or context..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
            />
          </Field>

          <div style={styles.row}>
            <Field label="Category">
              <div style={styles.chipGroup}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    style={{
                      ...styles.chip,
                      ...(form.category === cat.id ? styles.chipActive : {}),
                    }}
                    onClick={() => set('category', cat.id)}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Priority">
            <div style={styles.chipGroup}>
              {PRIORITIES.map(p => (
                <button
                  key={p.id}
                  style={{
                    ...styles.priChip,
                    ...(form.priority === p.id ? { background: p.color, color: 'white', borderColor: p.color } : { borderColor: p.color, color: p.color }),
                  }}
                  onClick={() => set('priority', p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>

          <div style={styles.row}>
            <Field label="Due Date">
              <input
                type="date"
                style={styles.input}
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
              />
            </Field>
            <Field label="Due Time">
              <input
                type="time"
                style={styles.input}
                value={form.dueTime}
                onChange={e => set('dueTime', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Tags (comma separated)">
            <input
              style={styles.input}
              placeholder="e.g. urgent, self-care, project"
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
            />
          </Field>
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...styles.saveBtn, opacity: form.title.trim() ? 1 : 0.5 }}
            onClick={handleSave}
            disabled={!form.title.trim()}
          >
            {editTask ? 'Save Changes' : '+ Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={fieldStyles.label}>{label}</label>
      {children}
    </div>
  )
}

const fieldStyles = {
  label: { fontSize: 12, fontWeight: 600, color: '#6B7280', letterSpacing: '0.05em' },
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 520,
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1E1B4B',
    fontFamily: "'Playfair Display', serif",
  },
  closeBtn: {
    background: '#F3F4F6',
    border: 'none',
    borderRadius: 8,
    width: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#6B7280',
    fontSize: 12,
  },
  body: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    overflowY: 'auto',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  input: {
    border: '1.5px solid #E5E7EB',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    color: '#1F2937',
    background: '#FAFAFA',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  textarea: { resize: 'none', lineHeight: 1.6 },
  chipGroup: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    padding: '6px 12px',
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 500,
    border: '1.5px solid #E5E7EB',
    background: 'white',
    color: '#6B7280',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  chipActive: {
    background: '#EDE9FE',
    borderColor: '#7C3AED',
    color: '#7C3AED',
  },
  priChip: {
    padding: '6px 16px',
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 600,
    border: '1.5px solid',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  footer: {
    display: 'flex',
    gap: 10,
    padding: '16px 24px',
    borderTop: '1px solid #F3F4F6',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: 10,
    background: '#F3F4F6',
    color: '#6B7280',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
  },
  saveBtn: {
    padding: '10px 24px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
  },
}
