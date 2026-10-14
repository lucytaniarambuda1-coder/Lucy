import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const step = (id, text, done = false) => ({ id, text, done })

const SEED_PROJECTS = [
  {
    id: 'ppp',
    name: 'Passion, Purpose, Peace',
    kind: 'Book',
    stage: 'Ready to publish',
    color: '#DB2777',
    tag: 'book',
    steps: [
      step(1, 'ISBN and barcodes', true),
      step(2, 'Final proofread'),
      step(3, 'Choose a publishing platform'),
      step(4, 'Upload and publish'),
      step(5, 'Plan the launch'),
    ],
  },
  {
    id: 'mmitm',
    name: 'Meet Me in the Middle',
    kind: 'Book',
    stage: 'Editing',
    color: '#7C3AED',
    tag: 'book',
    steps: [
      step(1, 'Finish the edit'),
      step(2, 'Send to beta readers'),
      step(3, 'Final proofread'),
      step(4, 'Cover design'),
      step(5, 'Publish'),
    ],
  },
  {
    id: 'house',
    name: 'Flow Corner House Project',
    kind: 'Home',
    stage: 'Built-ins next',
    color: '#059669',
    tag: 'renovation',
    steps: [
      step(1, 'Built-in kitchen cupboards'),
      step(2, 'Bedroom built-in cupboards'),
      step(3, 'Garage'),
      step(4, 'Buy the ORA 5'),
    ],
  },
]

const SEED_LINKS = [
  { id: 1, label: 'Flow Corner website', url: 'https://flowcornerr.netlify.app' },
  { id: 2, label: 'Flow Corner Instagram', url: 'https://www.instagram.com/flow_cornerr/' },
  { id: 3, label: 'My Instagram', url: '' },
  { id: 4, label: 'Substack', url: '' },
  { id: 5, label: 'LinkedIn', url: 'https://www.linkedin.com/in/mukhethwa-lucytania-rambuda-836575169/' },
]

export default function ProjectsView({ tasks = [] }) {
  const [projects, setProjects] = useLocalStorage('lucys-projects', SEED_PROJECTS)
  const [links, setLinks] = useLocalStorage('lucys-links', SEED_LINKS)
  const [editingLinks, setEditingLinks] = useState(false)

  const updateProject = (id, fn) => setProjects(prev => prev.map(p => (p.id === id ? fn(p) : p)))

  return (
    <div style={s.page}>
      <h1 style={s.title}>Projects</h1>
      <p style={s.sub}>What I'm building right now.</p>

      <div style={s.section}>
        <div style={s.sectionHead}>
          <p style={s.sectionLabel}>My Links</p>
          <button style={s.textBtn} onClick={() => setEditingLinks(e => !e)}>
            {editingLinks ? 'Done' : 'Edit'}
          </button>
        </div>
        {editingLinks ? (
          <LinkEditor links={links} setLinks={setLinks} />
        ) : (
          <div style={s.linkGrid}>
            {links.map(l => l.url ? (
              <a key={l.id} style={s.linkChip} href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            ) : (
              <button key={l.id} style={{ ...s.linkChip, ...s.linkEmpty }} onClick={() => setEditingLinks(true)}>
                + Add {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>Current Projects</p>
        {projects.map(p => (
          <ProjectCard
            key={p.id}
            project={p}
            relatedCount={tasks.filter(t => !t.completed && t.tags?.includes(p.tag)).length}
            onChange={fn => updateProject(p.id, fn)}
          />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project, relatedCount, onChange }) {
  const [newStep, setNewStep] = useState('')
  const [editingStage, setEditingStage] = useState(false)
  const done = project.steps.filter(x => x.done).length
  const pct = project.steps.length ? Math.round((done / project.steps.length) * 100) : 0
  const next = project.steps.find(x => !x.done)

  const toggle = (sid) => onChange(p => ({ ...p, steps: p.steps.map(x => (x.id === sid ? { ...x, done: !x.done } : x)) }))
  const remove = (sid) => onChange(p => ({ ...p, steps: p.steps.filter(x => x.id !== sid) }))
  const add = () => {
    if (!newStep.trim()) return
    onChange(p => ({ ...p, steps: [...p.steps, step(Date.now(), newStep.trim())] }))
    setNewStep('')
  }

  return (
    <div style={{ ...s.card, borderTopColor: project.color }}>
      <div style={s.cardHead}>
        <div>
          <p style={{ ...s.kind, color: project.color }}>{project.kind}</p>
          <h2 style={s.cardTitle}>{project.name}</h2>
        </div>
        <span style={s.pct}>{pct}%</span>
      </div>

      {editingStage ? (
        <input
          style={s.stageInput}
          value={project.stage}
          onChange={e => onChange(p => ({ ...p, stage: e.target.value }))}
          onBlur={() => setEditingStage(false)}
          onKeyDown={e => e.key === 'Enter' && setEditingStage(false)}
          autoFocus
        />
      ) : (
        <button style={{ ...s.stage, color: project.color }} onClick={() => setEditingStage(true)}>
          {project.stage} ✎
        </button>
      )}

      <div style={s.track}>
        <div style={{ ...s.fill, width: `${pct}%`, background: project.color }} />
      </div>

      {next && <p style={s.next}><strong>Next:</strong> {next.text}</p>}

      <div style={s.steps}>
        {project.steps.map(x => (
          <div key={x.id} style={s.stepRow}>
            <button
              style={{ ...s.check, ...(x.done ? { background: project.color, borderColor: project.color } : {}) }}
              onClick={() => toggle(x.id)}
              aria-label={x.done ? 'Mark not done' : 'Mark done'}
            >
              {x.done ? '✓' : ''}
            </button>
            <span style={{ ...s.stepText, ...(x.done ? s.stepDone : {}) }}>{x.text}</span>
            <button style={s.delBtn} onClick={() => remove(x.id)} aria-label="Remove step">×</button>
          </div>
        ))}
      </div>

      <div style={s.addRow}>
        <input
          style={s.addInput}
          placeholder="Add a step..."
          value={newStep}
          onChange={e => setNewStep(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button style={{ ...s.addBtn, background: project.color }} onClick={add}>Add</button>
      </div>

      {relatedCount > 0 && (
        <p style={s.related}>{relatedCount} related open task{relatedCount === 1 ? '' : 's'} in Master List (#{project.tag})</p>
      )}
    </div>
  )
}

function LinkEditor({ links, setLinks }) {
  const update = (id, field, val) => setLinks(prev => prev.map(l => (l.id === id ? { ...l, [field]: val } : l)))
  return (
    <div style={s.card}>
      {links.map(l => (
        <div key={l.id} style={s.linkEditRow}>
          <input style={s.linkLabelInput} value={l.label} onChange={e => update(l.id, 'label', e.target.value)} />
          <div style={s.linkUrlRow}>
            <input
              style={s.linkUrlInput}
              placeholder="https://..."
              value={l.url}
              inputMode="url"
              onChange={e => update(l.id, 'url', e.target.value.trim())}
            />
            <button style={s.delBtn} onClick={() => setLinks(prev => prev.filter(x => x.id !== l.id))} aria-label="Remove link">×</button>
          </div>
        </div>
      ))}
      <button style={s.textBtn} onClick={() => setLinks(prev => [...prev, { id: Date.now(), label: 'New link', url: '' }])}>
        + Add link
      </button>
    </div>
  )
}

const s = {
  page: { padding: '16px 16px 48px' },
  title: {
    fontSize: 24, fontWeight: 800, color: '#1F2937',
    fontFamily: "'Playfair Display', serif", marginBottom: 4,
  },
  sub: { fontSize: 14, color: '#6B7280', marginBottom: 20 },

  section: { marginBottom: 24 },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
  },
  textBtn: {
    background: 'none', border: 'none', color: '#7C3AED', fontSize: 13,
    fontWeight: 600, cursor: 'pointer', padding: '4px 0',
  },

  linkGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  linkChip: {
    background: 'white', color: '#7C3AED', border: '1.5px solid #DDD6FE', borderRadius: 99,
    padding: '8px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  },
  linkEmpty: { color: '#9CA3AF', borderStyle: 'dashed', borderColor: '#D1D5DB', background: 'transparent' },
  linkEditRow: { marginBottom: 14 },
  linkLabelInput: {
    width: '100%', border: 'none', fontSize: 13, fontWeight: 700, color: '#374151',
    marginBottom: 4, outline: 'none', fontFamily: 'inherit', background: 'transparent',
  },
  linkUrlRow: { display: 'flex', alignItems: 'center', gap: 6 },
  linkUrlInput: {
    flex: 1, minWidth: 0, padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: 10,
    fontSize: 15, outline: 'none', fontFamily: 'inherit', color: '#1F2937',
  },

  card: {
    background: 'white', borderRadius: 16, padding: '18px', marginBottom: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: '4px solid transparent',
  },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  kind: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 },
  cardTitle: {
    fontSize: 19, fontWeight: 800, color: '#1F2937',
    fontFamily: "'Playfair Display', serif", lineHeight: 1.3,
  },
  pct: { fontSize: 18, fontWeight: 800, color: '#374151' },
  stage: {
    background: 'none', border: 'none', padding: 0, margin: '6px 0 10px',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  stageInput: {
    width: '100%', margin: '6px 0 10px', padding: '6px 10px', border: '2px solid #E5E7EB',
    borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit',
  },
  track: { height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden', marginBottom: 12 },
  fill: { height: '100%', borderRadius: 99, transition: 'width 0.4s ease' },
  next: { fontSize: 13, color: '#374151', marginBottom: 12 },

  steps: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 },
  stepRow: { display: 'flex', alignItems: 'center', gap: 10 },
  check: {
    width: 22, height: 22, borderRadius: 6, border: '2px solid #D1D5DB', background: 'white',
    color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
  },
  stepText: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 1.4 },
  stepDone: { textDecoration: 'line-through', color: '#9CA3AF' },
  delBtn: {
    background: 'none', border: 'none', color: '#D1D5DB',
    fontSize: 20, cursor: 'pointer', padding: '0 4px', lineHeight: 1,
  },

  addRow: { display: 'flex', gap: 8 },
  addInput: {
    flex: 1, minWidth: 0, padding: '9px 12px', border: '2px solid #E5E7EB', borderRadius: 10,
    fontSize: 15, outline: 'none', fontFamily: 'inherit', color: '#1F2937',
  },
  addBtn: {
    border: 'none', color: 'white', borderRadius: 10, padding: '0 14px',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  related: { fontSize: 12, color: '#9CA3AF', marginTop: 10 },
}
