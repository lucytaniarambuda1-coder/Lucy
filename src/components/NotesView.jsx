import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const NOTE_COLORS = ['#FEF3C7', '#FCE7F3', '#EDE9FE', '#DBEAFE', '#D1FAE5', '#FEE2E2']
const NOTE_ICONS = ['📝', '💡', '🌸', '⭐', '🎯', '💭', '🔑', '🌟']

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
      icon: NOTE_ICONS[notes.length % NOTE_ICONS.length],
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

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sideHeader}>
          <div style={styles.pageTitle}>Notes</div>
          <button style={styles.newBtn} onClick={newNote}>+</button>
        </div>

        <div style={styles.searchWrap}>
          <input
            style={styles.searchInput}
            placeholder="🔍 Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={styles.noteList}>
          {filteredNotes.length === 0 ? (
            <div style={styles.emptyNotes}>
              <div style={{ fontSize: 32 }}>📝</div>
              <div style={{ fontSize: 13, color: '#9CA3AF' }}>No notes yet</div>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                style={{
                  ...styles.noteItem,
                  background: note.color,
                  ...(selected === note.id ? styles.noteItemActive : {}),
                }}
                onClick={() => selectNote(note)}
              >
                <div style={styles.noteItemTop}>
                  <span style={styles.noteItemIcon}>{note.icon}</span>
                  <span style={styles.noteItemTitle}>{note.title}</span>
                  <button
                    style={styles.deleteNoteBtn}
                    onClick={e => { e.stopPropagation(); deleteNote(note.id) }}
                  >✕</button>
                </div>
                <div style={styles.noteItemPreview}>
                  {note.content.slice(0, 60)}{note.content.length > 60 ? '…' : ''}
                </div>
                <div style={styles.noteItemDate}>{formatDate(note.updatedAt)}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.editor}>
        {selectedNote ? (
          <>
            <div style={styles.editorHeader}>
              <input
                style={styles.titleInput}
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onBlur={saveCurrentNote}
                placeholder="Note title..."
              />
              <div style={styles.colorPicker}>
                {NOTE_COLORS.map(c => (
                  <div
                    key={c}
                    style={{
                      ...styles.colorSwatch,
                      background: c,
                      ...(selectedNote.color === c ? styles.colorSwatchActive : {}),
                    }}
                    onClick={() => changeColor(c)}
                  />
                ))}
              </div>
            </div>
            <div style={styles.editorMeta}>
              Last edited {formatDate(selectedNote.updatedAt)}
            </div>
            <textarea
              style={{ ...styles.editorTextarea, background: selectedNote.color + '44' }}
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              onBlur={saveCurrentNote}
              placeholder="Start writing your thoughts..."
            />
          </>
        ) : (
          <div style={styles.noNote}>
            <div style={styles.noNoteIcon}>📓</div>
            <div style={styles.noNoteTitle}>Select or create a note</div>
            <div style={styles.noNoteText}>Your thoughts deserve a beautiful home</div>
            <button style={styles.startBtn} onClick={newNote}>Create New Note</button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  sidebar: {
    width: 280,
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    overflow: 'hidden',
  },
  sideHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '28px 20px 16px',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#1E1B4B',
    fontFamily: "'Playfair Display', serif",
  },
  newBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: { padding: '0 16px 12px' },
  searchInput: {
    width: '100%',
    border: '1.5px solid #E5E7EB',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 13,
    background: '#FAFAFA',
  },
  noteList: { flex: 1, overflowY: 'auto', padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 },
  emptyNotes: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: 8 },
  noteItem: {
    borderRadius: 12,
    padding: '12px 14px',
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.1s',
    border: '2px solid transparent',
  },
  noteItemActive: { border: '2px solid #7C3AED' },
  noteItemTop: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
  noteItemIcon: { fontSize: 14 },
  noteItemTitle: { fontSize: 13, fontWeight: 600, color: '#1F2937', flex: 1 },
  deleteNoteBtn: {
    background: 'none',
    border: 'none',
    color: '#D1D5DB',
    fontSize: 10,
    cursor: 'pointer',
    padding: '2px 4px',
  },
  noteItemPreview: { fontSize: 12, color: '#6B7280', lineHeight: 1.4 },
  noteItemDate: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
  editor: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '32px',
    overflowY: 'auto',
    background: '#F9FAFB',
  },
  editorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 800,
    color: '#1E1B4B',
    border: 'none',
    background: 'transparent',
    fontFamily: "'Playfair Display', serif",
    flex: 1,
  },
  colorPicker: { display: 'flex', gap: 6 },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'transform 0.15s',
  },
  colorSwatchActive: { border: '2px solid #7C3AED', transform: 'scale(1.2)' },
  editorMeta: { fontSize: 12, color: '#9CA3AF', marginBottom: 16 },
  editorTextarea: {
    flex: 1,
    border: 'none',
    borderRadius: 16,
    padding: '20px',
    fontSize: 15,
    lineHeight: 1.8,
    color: '#374151',
    resize: 'none',
    outline: 'none',
    minHeight: 400,
  },
  noNote: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    textAlign: 'center',
  },
  noNoteIcon: { fontSize: 56 },
  noNoteTitle: { fontSize: 20, fontWeight: 700, color: '#1E1B4B' },
  noNoteText: { fontSize: 14, color: '#9CA3AF' },
  startBtn: {
    marginTop: 8,
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
}
