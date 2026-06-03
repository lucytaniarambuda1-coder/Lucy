import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const NOTE_COLORS = ['#FEF3C7', '#FCE7F3', '#EDE9FE', '#DBEAFE', '#D1FAE5', '#FEE2E2']

export default function NotesView() {
  const [notes, setNotes] = useLocalStorage('lucys-notes', [])
  const [selected, setSelected] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [search, setSearch] = useState('')

  const newNote = () => {
    const note = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      color: NOTE_COLORS[notes.length % NOTE_COLORS.length],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes(prev => [note, ...prev])
    setSelected(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const selectNote = (note) => {
    if (selected && selected !== note.id) saveCurrentNote()
    setSelected(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const saveCurrentNote = () => {
    if (!selected) return
    setNotes(prev => prev.map(n =>
      n.id === selected
        ? { ...n, title: editTitle || 'Untitled', content: editContent, updatedAt: new Date().toISOString() }
        : n
    ))
  }

  const goBack = () => {
    saveCurrentNote()
    setSelected(null)
  }

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    if (selected === id) {
      setSelected(null)
      setEditTitle('')
      setEditContent('')
    }
  }

  const changeColor = (color) => {
    setNotes(prev => prev.map(n => n.id === selected ? { ...n, color } : n))
  }

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  const selectedNote = notes.find(n => n.id === selected)
  const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  // Mobile: show list OR editor, never both at once
  if (selected !== null && selectedNote) {
    return (
      <div style={s.editorPage}>
        {/* Back bar */}
        <div style={s.editorTopBar}>
          <button style={s.backBtn} onClick={goBack}>
            ← Notes
          </button>
          <div style={s.colorPicker}>
            {NOTE_COLORS.map(c => (
              <div
                key={c}
                style={{ ...s.colorSwatch, background: c, ...(selectedNote.color === c ? s.colorSwatchActive : {}) }}
                onClick={() => changeColor(c)}
              />
            ))}
          </div>
          <button style={s.deleteBtn} onClick={() => deleteNote(selected)}>Delete</button>
        </div>

        {/* Editor */}
        <div style={{ ...s.editorBody, background: selectedNote.color + '55' }}>
          <input
            style={s.titleInput}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={saveCurrentNote}
            placeholder="Note title..."
          />
          <div style={s.editorMeta}>Last edited {fmtDate(selectedNote.updatedAt)}</div>
          <textarea
            style={s.editorTextarea}
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            onBlur={saveCurrentNote}
            placeholder="Start writing your thoughts..."
            autoFocus
          />
        </div>
      </div>
    )
  }

  // List view
  return (
    <div style={s.listPage}>
      <div style={s.listHeader}>
        <div style={s.pageTitle}>Notes</div>
        <button style={s.newBtn} onClick={newNote}>+ New</button>
      </div>

      <div style={s.searchWrap}>
        <input
          style={s.searchInput}
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyTitle}>No notes yet</div>
          <div style={s.emptyText}>Tap "+ New" to capture your thoughts</div>
          <button style={s.emptyBtn} onClick={newNote}>Create your first note</button>
        </div>
      ) : (
        <div style={s.noteGrid}>
          {filteredNotes.map(note => (
            <div
              key={note.id}
              style={{ ...s.noteCard, background: note.color, ...(selected === note.id ? s.noteCardActive : {}) }}
              onClick={() => selectNote(note)}
            >
              <div style={s.noteCardTop}>
                <span style={s.noteCardTitle}>{note.title}</span>
                <button
                  style={s.noteDeleteBtn}
                  onClick={e => { e.stopPropagation(); deleteNote(note.id) }}
                >×</button>
              </div>
              <div style={s.noteCardPreview}>
                {note.content.slice(0, 80)}{note.content.length > 80 ? '…' : ''}
              </div>
              <div style={s.noteCardDate}>{fmtDate(note.updatedAt)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  // List view
  listPage: {
    padding: '20px 16px 32px',
    display: 'flex', flexDirection: 'column', gap: 14,
    minHeight: '100%',
  },
  listHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22, fontWeight: 800, color: 'var(--text)',
    fontFamily: "'Playfair Display', serif",
  },
  newBtn: {
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white', border: 'none', borderRadius: 8,
    padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  searchWrap: {},
  searchInput: {
    width: '100%', border: '1.5px solid var(--border)', borderRadius: 10,
    padding: '10px 14px', fontSize: 15, background: 'white',
  },
  noteGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  noteCard: {
    borderRadius: 14, padding: '14px 16px',
    cursor: 'pointer', border: '2px solid transparent',
    boxShadow: 'var(--shadow)',
  },
  noteCardActive: { border: '2px solid var(--primary)' },
  noteCardTop: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
  noteCardTitle: { fontSize: 15, fontWeight: 700, color: 'var(--text)', flex: 1 },
  noteDeleteBtn: {
    background: 'none', border: 'none', color: '#9CA3AF',
    fontSize: 16, cursor: 'pointer', padding: '0 4px',
    lineHeight: 1, minWidth: 28, textAlign: 'right',
  },
  noteCardPreview: { fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 },
  noteCardDate: { fontSize: 11, color: 'var(--text-3)', marginTop: 8 },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '48px 0', gap: 8, textAlign: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text)' },
  emptyText: { fontSize: 14, color: 'var(--text-3)' },
  emptyBtn: {
    marginTop: 8,
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white', border: 'none', borderRadius: 10,
    padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },

  // Editor view
  editorPage: {
    display: 'flex', flexDirection: 'column',
    minHeight: '100%', background: 'var(--bg)',
  },
  editorTopBar: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 16px', background: 'white',
    borderBottom: '1px solid var(--border)', flexShrink: 0,
  },
  backBtn: {
    fontSize: 14, fontWeight: 600, color: 'var(--primary)',
    background: 'var(--primary-pale)', border: 'none', borderRadius: 8,
    padding: '7px 12px', cursor: 'pointer', flexShrink: 0,
  },
  colorPicker: { display: 'flex', gap: 6, flex: 1, justifyContent: 'center' },
  colorSwatch: {
    width: 22, height: 22, borderRadius: '50%',
    cursor: 'pointer', border: '2px solid transparent',
  },
  colorSwatchActive: { border: '2px solid var(--primary)', transform: 'scale(1.15)' },
  deleteBtn: {
    fontSize: 13, fontWeight: 600, color: '#EF4444',
    background: '#FEE2E2', border: 'none', borderRadius: 8,
    padding: '7px 12px', cursor: 'pointer', flexShrink: 0,
  },
  editorBody: {
    flex: 1, display: 'flex', flexDirection: 'column',
    padding: '20px 16px 32px', gap: 6,
  },
  titleInput: {
    fontSize: 22, fontWeight: 800, color: 'var(--text)',
    border: 'none', background: 'transparent',
    fontFamily: "'Playfair Display', serif", width: '100%',
  },
  editorMeta: { fontSize: 12, color: 'var(--text-3)' },
  editorTextarea: {
    flex: 1, border: 'none', background: 'transparent',
    fontSize: 15, lineHeight: 1.8, color: 'var(--text)',
    resize: 'none', outline: 'none', minHeight: 300,
    width: '100%',
  },
}
