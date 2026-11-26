import React, { useState, useEffect } from 'react'
import TodayView from './components/TodayView'
import TaskList from './components/TaskList'
import HabitsView from './components/HabitsView'
import NotesView from './components/NotesView'
import ProjectsView from './components/ProjectsView'
import JourneyView from './components/JourneyView'
import LearningView from './components/LearningView'
import AboutMeView from './components/AboutMeView'
import SyncBadge from './components/SyncBadge'
import TaskModal from './components/TaskModal'
import { useLocalStorage } from './hooks/useLocalStorage'

const TASKS_VERSION = 5

// The old built-in starter tasks were removed in version 5; only tasks Lucy adds herself remain.
const LIFE_LIST_TASKS = []

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'journey', label: '21-Day Journey' },
  { id: 'tasks', label: 'Master List' },
  { id: 'learning', label: 'Learning' },
  { id: 'projects', label: 'Projects' },
  { id: 'habits', label: 'Habits' },
  { id: 'notes', label: 'Notes' },
  { id: 'about', label: 'About Me' },
]

const todayISO = () => new Date().toISOString().split('T')[0]

export default function App() {
  const [tasks, setTasks] = useLocalStorage('lucys-tasks', LIFE_LIST_TASKS)
  const [seededVersion, setSeededVersion] = useLocalStorage('lucys-tasks-version', 0)
  const [top3, setTop3] = useLocalStorage('lucys-top3', {})
  const [activeTab, setActiveTab] = useState('today')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)

  useEffect(() => {
    if (seededVersion < TASKS_VERSION) {
      setTasks(prev => {
        const userCreated = prev.filter(t => t.id >= 10000)
        return [...LIFE_LIST_TASKS, ...userCreated]
      })
      setSeededVersion(TASKS_VERSION)
    }
  }, []) // eslint-disable-line

  const openAdd = (defaults = {}) => {
    setEditTask(defaults.title ? { ...defaults, id: null } : null)
    setModalOpen(true)
  }
  const openEdit = (task) => { setEditTask(task); setModalOpen(true) }

  const handleSave = (formData) => {
    if (editTask?.id) {
      setTasks(prev => prev.map(t => t.id === editTask.id ? { ...t, ...formData } : t))
    } else {
      setTasks(prev => [{ ...formData, id: Date.now(), completed: false, createdAt: new Date().toISOString() }, ...prev])
    }
  }

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    setTop3(prev => {
      const next = {}
      Object.entries(prev).forEach(([day, ids]) => { next[day] = ids.filter(x => x !== id) })
      return next
    })
  }
  const updateTaskDate = (id, date) => setTasks(prev => prev.map(t => t.id === id ? { ...t, dueDate: date } : t))
  const bulkAdd = (newTasks) => setTasks(prev => [...newTasks, ...prev])

  const todayDueCount = tasks.filter(t => !t.completed && t.dueDate === todayISO()).length

  return (
    <div style={s.app}>
      {/* Header */}
      <header style={s.header}>
        <span style={s.logo}>Lucy's World</span>
        <SyncBadge />
      </header>

      {/* Tabs */}
      <div style={s.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            style={{ ...s.tab, ...(activeTab === tab.id ? s.tabActive : {}) }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === 'today' && todayDueCount > 0 && (
              <span style={s.badge}>{todayDueCount > 99 ? '99+' : todayDueCount}</span>
            )}
            {activeTab === tab.id && <div style={s.tabLine} />}
          </button>
        ))}
      </div>

      {/* Content */}
      <main style={s.main}>
        {activeTab === 'today' && (
          <TodayView tasks={tasks} onToggle={toggleTask} top3={top3} setTop3={setTop3} />
        )}
        {activeTab === 'journey' && (
          <JourneyView />
        )}
        {activeTab === 'tasks' && (
          <TaskList tasks={tasks} onToggle={toggleTask} onEdit={openEdit} onDelete={deleteTask} onAdd={openAdd} onBulkAdd={bulkAdd} onUpdateDate={updateTaskDate} />
        )}
        {activeTab === 'habits' && (
          <HabitsView />
        )}
        {activeTab === 'notes' && (
          <NotesView />
        )}
        {activeTab === 'projects' && (
          <ProjectsView tasks={tasks} />
        )}
        {activeTab === 'learning' && (
          <LearningView />
        )}
        {activeTab === 'about' && (
          <AboutMeView />
        )}
      </main>

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editTask={editTask} />
    </div>
  )
}

const s = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'var(--bg)',
  },
  header: {
    height: 'var(--header-h)',
    background: 'white',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: 18,
    fontWeight: 800,
    color: 'var(--primary)',
    fontFamily: "'Playfair Display', serif",
    letterSpacing: '-0.02em',
  },
  tabBar: {
    display: 'flex',
    overflowX: 'auto',
    background: 'white',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
    scrollbarWidth: 'none',
    position: 'sticky',
    top: 'var(--header-h)',
    zIndex: 99,
    WebkitOverflowScrolling: 'touch',
  },
  tab: {
    flexShrink: 0,
    padding: '0 16px',
    height: 'var(--tabs-h)',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-2)',
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    color: 'var(--primary)',
    fontWeight: 700,
  },
  tabLine: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    background: 'var(--primary)',
    borderRadius: '2px 2px 0 0',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#EF4444',
    color: 'white',
    fontSize: 9,
    fontWeight: 700,
    borderRadius: 99,
    minWidth: 16,
    height: 16,
    padding: '0 4px',
    marginLeft: 4,
    verticalAlign: 'middle',
    lineHeight: 1,
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
}
