import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TaskList from './components/TaskList'
import TaskModal from './components/TaskModal'
import CalendarView from './components/CalendarView'
import HabitsView from './components/HabitsView'
import NotesView from './components/NotesView'
import { useLocalStorage } from './hooks/useLocalStorage'

const TASKS_VERSION = 2

// ── Page 1: Personal ──────────────────────────────────────────────────────────
const PERSONAL_TASKS = [
  {
    id: 101,
    title: "Master's proposal submission",
    description: '',
    category: 'personal',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['masters', 'education'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 102,
    title: 'Concerns of Six — prayer retreat',
    description: 'Prayer retreat with the group',
    category: 'personal',
    priority: 'high',
    dueDate: '2026-09-30',
    dueTime: '',
    tags: ['prayer', 'retreat'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 103,
    title: 'Jensen Hudson — meet up',
    description: '',
    category: 'social',
    priority: 'medium',
    dueDate: '2026-08-31',
    dueTime: '',
    tags: ['social'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 104,
    title: 'Significance event',
    description: '',
    category: 'personal',
    priority: 'medium',
    dueDate: '2026-06-30',
    dueTime: '',
    tags: ['personal'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 105,
    title: 'Graduation',
    description: 'Graduation — June 10–30',
    category: 'personal',
    priority: 'high',
    dueDate: '2026-06-30',
    dueTime: '',
    tags: ['graduation', 'milestone'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 106,
    title: 'Relationship — from 11 July',
    description: '',
    category: 'personal',
    priority: 'medium',
    dueDate: '2026-07-11',
    dueTime: '',
    tags: ['personal'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 107,
    title: 'Grievance with Developers — 31 Jul–1 Aug',
    description: '',
    category: 'work',
    priority: 'high',
    dueDate: '2026-07-31',
    dueTime: '',
    tags: ['grievance', 'developers'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 108,
    title: 'Flow Corner — finish & release website, start getting clients',
    description: 'Complete the Flow Corner website and launch to start attracting clients',
    category: 'work',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['flow-corner', 'website', 'clients'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 109,
    title: 'Substack — 1 article a week',
    description: 'Consistent weekly publishing on Substack',
    category: 'personal',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['substack', 'writing'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 110,
    title: 'Passion Purpose People — get returns & release the book',
    description: 'Collect returns and release Passion Purpose People book to market',
    category: 'personal',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['book', 'passion-purpose-people'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  // My House
  {
    id: 111,
    title: 'My House — pay rates & taxes (40,000)',
    description: 'Pay outstanding rates and taxes — R40,000',
    category: 'finance',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['house', 'rates', 'taxes'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 112,
    title: 'My House — steps and landscaping',
    description: '',
    category: 'personal',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['house', 'landscaping'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 113,
    title: 'My House — wall planner and design',
    description: '',
    category: 'personal',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['house', 'design'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 114,
    title: 'My House — build-in kitchen, bedroom & bathroom',
    description: 'Built-in units for kitchen, bedroom and bathroom renovation',
    category: 'personal',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['house', 'renovation'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 115,
    title: 'My House — study / work space',
    description: 'Create a dedicated study and work-from-home space',
    category: 'personal',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['house', 'workspace'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

// ── Page 2: Work ──────────────────────────────────────────────────────────────
const WORK_TASKS = [
  {
    id: 201,
    title: 'Kenya Bank account — CRS document from Gene',
    description: 'Obtain CRS document from Gene for Kenya Bank account setup',
    category: 'work',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['kenya', 'banking', 'CRS'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 202,
    title: 'SARS — third-party notice',
    description: 'Action the SARS third-party notice',
    category: 'finance',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['SARS', 'tax'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 203,
    title: 'Office 321 — follow up re: security',
    description: 'Follow up with ney regarding security matters for Office 321',
    category: 'work',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['office-321', 'security'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 204,
    title: 'Nakama MSA',
    description: 'Master Services Agreement for Nakama',
    category: 'work',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['nakama', 'MSA', 'contract'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 205,
    title: "O'Neill & Burges — Pluto Rico Labour",
    description: '',
    category: 'work',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ["o'neill", 'burges', 'labour'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 206,
    title: 'AI — Solaris (branded), NBC, Alex — Office 321 ASN/DNS/TT',
    description: 'AI project: Solaris branded setup, NBC, Alex — Office 321 ASN/DNS/TT configuration',
    category: 'work',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['AI', 'solaris', 'NBC', 'Office-321', 'DNS'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 207,
    title: 'Bar Taco — follow up',
    description: '',
    category: 'work',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['bar-taco'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 208,
    title: 'Dash Digital — move to Needle',
    description: 'Transition Dash Digital to Needle by 03 September 2026',
    category: 'work',
    priority: 'high',
    dueDate: '2026-09-03',
    dueTime: '',
    tags: ['dash-digital', 'needle', 'migration'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 209,
    title: 'AI team capability development plan',
    description: 'Build and document the AI team capability development plan',
    category: 'work',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['AI', 'team', 'capability'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 210,
    title: 'AI cost master list',
    description: 'Compile master list of all AI-related costs',
    category: 'work',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['AI', 'cost', 'budget'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 211,
    title: 'Dash Digital MSA at TT',
    description: 'Master Services Agreement for Dash Digital at TT',
    category: 'work',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['dash-digital', 'MSA', 'contract'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 212,
    title: 'Nakama repatriation plan',
    description: 'Develop and finalise the Nakama repatriation plan',
    category: 'work',
    priority: 'high',
    dueDate: '',
    dueTime: '',
    tags: ['nakama', 'repatriation'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 213,
    title: '4th Anchor contract',
    description: '',
    category: 'work',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['anchor', 'contract'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 214,
    title: 'Apollo BI — month to month',
    description: 'Move Apollo BI to a month-to-month arrangement',
    category: 'work',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['apollo-BI', 'contract'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 215,
    title: 'Lombard — follow up',
    description: '',
    category: 'work',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['lombard'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

// ── Page 3: Spiritual / CFCI ──────────────────────────────────────────────────
const SPIRITUAL_TASKS = [
  {
    id: 301,
    title: 'CFCI — Soweto, Clarion, Jenny — church website',
    description: 'Coordinate with Soweto, Clarion and Jenny on the CFCI church website',
    category: 'social',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['CFCI', 'church', 'website'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 302,
    title: 'CFCI — growth track scheduling',
    description: 'Set up and schedule the Growth Track programme',
    category: 'social',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['CFCI', 'growth-track'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 303,
    title: 'CFCI — meet with the pastors',
    description: '',
    category: 'social',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['CFCI', 'pastors'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 304,
    title: 'CFCI — singles ministry event',
    description: 'Plan and execute the Singles Ministry event',
    category: 'social',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    tags: ['CFCI', 'singles-ministry', 'event'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

const LIFE_LIST_TASKS = [...PERSONAL_TASKS, ...WORK_TASKS, ...SPIRITUAL_TASKS]
const LIFE_LIST_IDS = new Set(LIFE_LIST_TASKS.map(t => t.id))

export default function App() {
  const [tasks, setTasks] = useLocalStorage('lucys-tasks', LIFE_LIST_TASKS)
  const [seededVersion, setSeededVersion] = useLocalStorage('lucys-tasks-version', 0)

  // Merge life-list tasks into existing storage on upgrade
  useEffect(() => {
    if (seededVersion < TASKS_VERSION) {
      setTasks(prev => {
        const existingIds = new Set(prev.map(t => t.id))
        const newTasks = LIFE_LIST_TASKS.filter(t => !existingIds.has(t.id))
        return newTasks.length > 0 ? [...prev, ...newTasks] : prev
      })
      setSeededVersion(TASKS_VERSION)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const [activeView, setActiveView] = useState('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)

  const openAdd = () => {
    setEditTask(null)
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditTask(task)
    setModalOpen(true)
  }

  const handleSave = (formData) => {
    if (editTask) {
      setTasks(prev => prev.map(t =>
        t.id === editTask.id ? { ...t, ...formData } : t
      ))
    } else {
      const newTask = {
        ...formData,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString(),
      }
      setTasks(prev => [newTask, ...prev])
    }
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div style={styles.app}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} tasks={tasks} />

      <main style={styles.main}>
        {activeView === 'dashboard' && (
          <Dashboard tasks={tasks} onAddTask={openAdd} />
        )}
        {activeView === 'tasks' && (
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onEdit={openEdit}
            onDelete={deleteTask}
            onAdd={openAdd}
          />
        )}
        {activeView === 'calendar' && (
          <CalendarView tasks={tasks} />
        )}
        {activeView === 'habits' && (
          <HabitsView />
        )}
        {activeView === 'notes' && (
          <NotesView />
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editTask={editTask}
      />
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: '#F5F3FF',
  },
  main: {
    flex: 1,
    overflow: 'hidden',
  },
}
