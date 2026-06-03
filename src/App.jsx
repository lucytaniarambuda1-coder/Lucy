import React, { useState, useEffect } from 'react'
import TodayView from './components/TodayView'
import TaskList from './components/TaskList'
import WeeklyPlanner from './components/WeeklyPlanner'
import BrainDump from './components/BrainDump'
import HabitsView from './components/HabitsView'
import TaskModal from './components/TaskModal'
import { useLocalStorage } from './hooks/useLocalStorage'

const TASKS_VERSION = 2

const PERSONAL_TASKS = [
  { id: 101, title: "Master's proposal submission", description: '', category: 'personal', priority: 'high', dueDate: '', dueTime: '', tags: ['masters', 'education'], completed: false, createdAt: new Date().toISOString() },
  { id: 102, title: 'Concerns of Six — prayer retreat', description: 'Prayer retreat with the group', category: 'personal', priority: 'high', dueDate: '2026-09-30', dueTime: '', tags: ['prayer', 'retreat'], completed: false, createdAt: new Date().toISOString() },
  { id: 103, title: 'Jensen Hudson — meet up', description: '', category: 'social', priority: 'medium', dueDate: '2026-08-31', dueTime: '', tags: ['social'], completed: false, createdAt: new Date().toISOString() },
  { id: 104, title: 'Significance event', description: '', category: 'personal', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['personal'], completed: false, createdAt: new Date().toISOString() },
  { id: 105, title: 'Graduation', description: 'Graduation — June 10–30', category: 'personal', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['graduation', 'milestone'], completed: false, createdAt: new Date().toISOString() },
  { id: 106, title: 'Relationship — from 11 July', description: '', category: 'personal', priority: 'medium', dueDate: '2026-07-11', dueTime: '', tags: ['personal'], completed: false, createdAt: new Date().toISOString() },
  { id: 107, title: 'Grievance with Developers — 31 Jul–1 Aug', description: '', category: 'work', priority: 'high', dueDate: '2026-07-31', dueTime: '', tags: ['grievance', 'developers'], completed: false, createdAt: new Date().toISOString() },
  { id: 108, title: 'Flow Corner — finish & release website, start getting clients', description: 'Complete the Flow Corner website and launch to attract clients', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['flow-corner', 'website', 'clients'], completed: false, createdAt: new Date().toISOString() },
  { id: 109, title: 'Substack — 1 article a week', description: 'Consistent weekly publishing on Substack', category: 'growth', priority: 'medium', dueDate: '', dueTime: '', tags: ['substack', 'writing'], completed: false, createdAt: new Date().toISOString() },
  { id: 110, title: 'Passion Purpose People — get returns & release the book', description: 'Collect returns and release Passion Purpose People book', category: 'growth', priority: 'high', dueDate: '', dueTime: '', tags: ['book', 'passion-purpose-people'], completed: false, createdAt: new Date().toISOString() },
  { id: 111, title: 'My House — pay rates & taxes (R40,000)', description: 'Pay outstanding rates and taxes', category: 'finance', priority: 'high', dueDate: '', dueTime: '', tags: ['house', 'rates', 'taxes'], completed: false, createdAt: new Date().toISOString() },
  { id: 112, title: 'My House — steps and landscaping', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['house', 'landscaping'], completed: false, createdAt: new Date().toISOString() },
  { id: 113, title: 'My House — wall planner and design', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['house', 'design'], completed: false, createdAt: new Date().toISOString() },
  { id: 114, title: 'My House — build-in kitchen, bedroom & bathroom', description: 'Built-in units renovation', category: 'personal', priority: 'high', dueDate: '', dueTime: '', tags: ['house', 'renovation'], completed: false, createdAt: new Date().toISOString() },
  { id: 115, title: 'My House — study / work space', description: 'Create a dedicated study and work-from-home space', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['house', 'workspace'], completed: false, createdAt: new Date().toISOString() },
]

const WORK_TASKS = [
  { id: 201, title: 'Kenya Bank account — CRS document from Gene', description: 'Obtain CRS document for Kenya Bank account setup', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['kenya', 'banking', 'CRS'], completed: false, createdAt: new Date().toISOString() },
  { id: 202, title: 'SARS — third-party notice', description: 'Action the SARS third-party notice', category: 'finance', priority: 'high', dueDate: '', dueTime: '', tags: ['SARS', 'tax'], completed: false, createdAt: new Date().toISOString() },
  { id: 203, title: 'Office 321 — follow up re: security', description: 'Follow up regarding security matters for Office 321', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['office-321', 'security'], completed: false, createdAt: new Date().toISOString() },
  { id: 204, title: 'Nakama MSA', description: 'Master Services Agreement for Nakama', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['nakama', 'MSA', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 205, title: "O'Neill & Burges — Pluto Rico Labour", description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ["o'neill", 'burges', 'labour'], completed: false, createdAt: new Date().toISOString() },
  { id: 206, title: 'AI — Solaris, NBC, Alex — Office 321 ASN/DNS/TT', description: 'AI project: Solaris branded setup, NBC, Alex — DNS/TT configuration', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['AI', 'solaris', 'NBC', 'DNS'], completed: false, createdAt: new Date().toISOString() },
  { id: 207, title: 'Bar Taco — follow up', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['bar-taco'], completed: false, createdAt: new Date().toISOString() },
  { id: 208, title: 'Dash Digital — move to Needle', description: 'Transition Dash Digital to Needle by 03 September 2026', category: 'work', priority: 'high', dueDate: '2026-09-03', dueTime: '', tags: ['dash-digital', 'needle', 'migration'], completed: false, createdAt: new Date().toISOString() },
  { id: 209, title: 'AI team capability development plan', description: 'Build and document the AI team capability development plan', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['AI', 'team', 'capability'], completed: false, createdAt: new Date().toISOString() },
  { id: 210, title: 'AI cost master list', description: 'Compile master list of all AI-related costs', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['AI', 'cost', 'budget'], completed: false, createdAt: new Date().toISOString() },
  { id: 211, title: 'Dash Digital MSA at TT', description: 'Master Services Agreement for Dash Digital at TT', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['dash-digital', 'MSA', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 212, title: 'Nakama repatriation plan', description: 'Develop and finalise the Nakama repatriation plan', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['nakama', 'repatriation'], completed: false, createdAt: new Date().toISOString() },
  { id: 213, title: '4th Anchor contract', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['anchor', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 214, title: 'Apollo BI — month to month', description: 'Move Apollo BI to a month-to-month arrangement', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['apollo-BI', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 215, title: 'Lombard — follow up', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['lombard'], completed: false, createdAt: new Date().toISOString() },
]

const SPIRITUAL_TASKS = [
  { id: 301, title: 'CFCI — Soweto, Clarion, Jenny — church website', description: 'Coordinate with Soweto, Clarion and Jenny on the CFCI church website', category: 'social', priority: 'medium', dueDate: '', dueTime: '', tags: ['CFCI', 'church', 'website'], completed: false, createdAt: new Date().toISOString() },
  { id: 302, title: 'CFCI — growth track scheduling', description: 'Set up and schedule the Growth Track programme', category: 'social', priority: 'medium', dueDate: '', dueTime: '', tags: ['CFCI', 'growth-track'], completed: false, createdAt: new Date().toISOString() },
  { id: 303, title: 'CFCI — meet with the pastors', description: '', category: 'social', priority: 'medium', dueDate: '', dueTime: '', tags: ['CFCI', 'pastors'], completed: false, createdAt: new Date().toISOString() },
  { id: 304, title: 'CFCI — singles ministry event', description: 'Plan and execute the Singles Ministry event', category: 'social', priority: 'medium', dueDate: '', dueTime: '', tags: ['CFCI', 'singles-ministry', 'event'], completed: false, createdAt: new Date().toISOString() },
]

const LIFE_LIST_TASKS = [...PERSONAL_TASKS, ...WORK_TASKS, ...SPIRITUAL_TASKS]

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'tasks', label: 'Master List' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'braindump', label: 'Brain Dump' },
  { id: 'habits', label: 'Habits' },
]

export default function App() {
  const [tasks, setTasks] = useLocalStorage('lucys-tasks', LIFE_LIST_TASKS)
  const [seededVersion, setSeededVersion] = useLocalStorage('lucys-tasks-version', 0)
  const [activeTab, setActiveTab] = useState('today')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)

  useEffect(() => {
    if (seededVersion < TASKS_VERSION) {
      setTasks(prev => {
        const existing = new Set(prev.map(t => t.id))
        const added = LIFE_LIST_TASKS.filter(t => !existing.has(t.id))
        return added.length > 0 ? [...prev, ...added] : prev
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
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))
  const bulkAdd = (newTasks) => setTasks(prev => [...newTasks, ...prev])

  return (
    <div style={s.app}>
      {/* Header */}
      <header style={s.header}>
        <span style={s.logo}>Lucy's World</span>
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
            {activeTab === tab.id && <div style={s.tabLine} />}
          </button>
        ))}
      </div>

      {/* Content */}
      <main style={s.main}>
        {activeTab === 'today' && (
          <TodayView tasks={tasks} onToggle={toggleTask} onPickTop3={() => setActiveTab('tasks')} />
        )}
        {activeTab === 'tasks' && (
          <TaskList tasks={tasks} onToggle={toggleTask} onEdit={openEdit} onDelete={deleteTask} onAdd={openAdd} />
        )}
        {activeTab === 'weekly' && (
          <WeeklyPlanner tasks={tasks} onAdd={openAdd} onToggle={toggleTask} />
        )}
        {activeTab === 'braindump' && (
          <BrainDump onBulkAdd={bulkAdd} />
        )}
        {activeTab === 'habits' && (
          <HabitsView />
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
  main: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
}
